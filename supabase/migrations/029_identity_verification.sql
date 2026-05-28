-- Identity verification columns on users + orderer snapshot on orders.

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS phone_verified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS real_name TEXT,
  ADD COLUMN IF NOT EXISTS birth_date DATE,
  ADD COLUMN IF NOT EXISTS ci_hash TEXT,
  ADD COLUMN IF NOT EXISTS di_hash TEXT;

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS orderer_name TEXT,
  ADD COLUMN IF NOT EXISTS orderer_phone TEXT,
  ADD COLUMN IF NOT EXISTS orderer_verification_status TEXT;

CREATE INDEX IF NOT EXISTS idx_users_phone ON public.users(phone)
  WHERE phone IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_orders_orderer_phone ON public.orders(orderer_phone)
  WHERE orderer_phone IS NOT NULL;

-- Never expose CI/DI hashes to authenticated clients.
REVOKE SELECT (ci_hash, di_hash) ON public.users FROM authenticated;

-- Prevent self-service updates to verification timestamps and identity hashes.
CREATE OR REPLACE FUNCTION public.guard_users_identity_sensitive_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin_user(auth.uid()) THEN
    IF TG_OP = 'UPDATE' THEN
      IF NEW.phone_verified_at IS DISTINCT FROM OLD.phone_verified_at THEN
        NEW.phone_verified_at := OLD.phone_verified_at;
      END IF;

      IF NEW.ci_hash IS DISTINCT FROM OLD.ci_hash THEN
        NEW.ci_hash := OLD.ci_hash;
      END IF;

      IF NEW.di_hash IS DISTINCT FROM OLD.di_hash THEN
        NEW.di_hash := OLD.di_hash;
      END IF;
    ELSE
      NEW.phone_verified_at := NULL;
      NEW.ci_hash := NULL;
      NEW.di_hash := NULL;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS users_identity_sensitive_guard ON public.users;
CREATE TRIGGER users_identity_sensitive_guard
  BEFORE INSERT OR UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.guard_users_identity_sensitive_update();

-- Dev / future provider hook: mark own phone verified when phone is present.
CREATE OR REPLACE FUNCTION public.mark_phone_verified_for_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;

  UPDATE public.users
  SET phone_verified_at = NOW()
  WHERE id = auth.uid()
    AND phone IS NOT NULL
    AND phone_verified_at IS NULL;
END;
$$;

REVOKE ALL ON FUNCTION public.mark_phone_verified_for_user() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.mark_phone_verified_for_user() TO authenticated;

-- Admin read policy for order support (idempotent with migration 011).
DROP POLICY IF EXISTS users_select_admin ON public.users;
CREATE POLICY users_select_admin
  ON public.users FOR SELECT
  USING (public.is_admin_user(auth.uid()));

COMMENT ON COLUMN public.users.phone IS 'Normalized digits-only Korean mobile (010xxxxxxxx).';
COMMENT ON COLUMN public.users.ci_hash IS 'Connecting Information hash — server/admin only, never client.';
COMMENT ON COLUMN public.users.di_hash IS 'Duplication Information hash — server/admin only, never client.';
COMMENT ON COLUMN public.orders.orderer_verification_status IS 'Snapshot: unverified | phone_verified | identity_verified';
