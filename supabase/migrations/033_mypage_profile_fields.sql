-- Mypage profile fields, account status, notification settings, withdrawal flow.

-- ---------------------------------------------------------------------------
-- account_status enum + user columns
-- ---------------------------------------------------------------------------

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'account_status') THEN
    CREATE TYPE public.account_status AS ENUM (
      'active',
      'withdrawal_requested',
      'withdrawn',
      'suspended'
    );
  END IF;
END $$;

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS gender TEXT,
  ADD COLUMN IF NOT EXISTS marketing_agreed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS withdrawal_requested_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS account_status public.account_status NOT NULL DEFAULT 'active';

ALTER TABLE public.users
  DROP CONSTRAINT IF EXISTS users_gender_check;

ALTER TABLE public.users
  ADD CONSTRAINT users_gender_check
  CHECK (gender IS NULL OR gender IN ('male', 'female', 'other'));

CREATE INDEX IF NOT EXISTS idx_users_account_status ON public.users(account_status);

COMMENT ON COLUMN public.users.gender IS 'Optional: male | female | other';
COMMENT ON COLUMN public.users.marketing_agreed_at IS 'Marketing consent timestamp (mirrors user_consents when set via profile).';
COMMENT ON COLUMN public.users.withdrawal_requested_at IS 'Account withdrawal request timestamp; soft-delete flow.';
COMMENT ON COLUMN public.users.account_status IS 'active | withdrawal_requested | withdrawn | suspended';

-- ---------------------------------------------------------------------------
-- notification_settings
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  groupbuy_deadline BOOLEAN NOT NULL DEFAULT true,
  tier_achievement BOOLEAN NOT NULL DEFAULT true,
  order_shipping BOOLEAN NOT NULL DEFAULT true,
  marketing BOOLEAN NOT NULL DEFAULT false,
  channels JSONB NOT NULL DEFAULT '{"kakao": true, "email": true, "push": true}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_notification_settings_user_id ON public.notification_settings(user_id);

ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS notification_settings_select_own ON public.notification_settings;
CREATE POLICY notification_settings_select_own
  ON public.notification_settings FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS notification_settings_insert_own ON public.notification_settings;
CREATE POLICY notification_settings_insert_own
  ON public.notification_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS notification_settings_update_own ON public.notification_settings;
CREATE POLICY notification_settings_update_own
  ON public.notification_settings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.set_notification_settings_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS notification_settings_updated_at ON public.notification_settings;
CREATE TRIGGER notification_settings_updated_at
  BEFORE UPDATE ON public.notification_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.set_notification_settings_updated_at();

-- ---------------------------------------------------------------------------
-- Guard sensitive account fields (non-admin cannot self-modify status / withdrawal)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.guard_users_account_sensitive_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin_user(auth.uid()) THEN
    IF TG_OP = 'UPDATE' THEN
      IF NEW.account_status IS DISTINCT FROM OLD.account_status THEN
        NEW.account_status := OLD.account_status;
      END IF;

      IF NEW.withdrawal_requested_at IS DISTINCT FROM OLD.withdrawal_requested_at THEN
        NEW.withdrawal_requested_at := OLD.withdrawal_requested_at;
      END IF;
    ELSE
      NEW.account_status := COALESCE(NEW.account_status, 'active');
      NEW.withdrawal_requested_at := NULL;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS users_account_sensitive_guard ON public.users;
CREATE TRIGGER users_account_sensitive_guard
  BEFORE INSERT OR UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.guard_users_account_sensitive_update();

-- ---------------------------------------------------------------------------
-- RPC: request account withdrawal (soft delete)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.request_account_withdrawal()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;

  UPDATE public.users
  SET
    account_status = 'withdrawal_requested',
    withdrawal_requested_at = NOW()
  WHERE id = auth.uid()
    AND account_status = 'active';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'withdrawal_not_allowed';
  END IF;

  RETURN TRUE;
END;
$$;

REVOKE ALL ON FUNCTION public.request_account_withdrawal() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.request_account_withdrawal() TO authenticated;

-- ---------------------------------------------------------------------------
-- RPC: user coupon usage history (safe fields only)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.get_user_coupon_usages(p_user_id UUID DEFAULT NULL)
RETURNS TABLE (
  id UUID,
  coupon_code TEXT,
  coupon_name TEXT,
  discount_amount INTEGER,
  used_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := COALESCE(p_user_id, auth.uid());
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;

  IF auth.uid() IS NOT NULL AND auth.uid() <> v_user_id AND NOT public.is_admin_user(auth.uid()) THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  RETURN QUERY
  SELECT
    cu.id,
    c.code AS coupon_code,
    c.name AS coupon_name,
    cu.discount_amount,
    cu.used_at
  FROM public.coupon_usages cu
  JOIN public.coupons c ON c.id = cu.coupon_id
  WHERE cu.user_id = v_user_id
  ORDER BY cu.used_at DESC;
END;
$$;

REVOKE ALL ON FUNCTION public.get_user_coupon_usages(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_user_coupon_usages(UUID) TO authenticated;
