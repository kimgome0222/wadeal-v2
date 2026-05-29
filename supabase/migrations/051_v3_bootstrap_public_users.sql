-- 051 v3 — public.users bootstrap (schema + backfill + RLS + RPC)
-- NO admin assignment. NO users_role_guard (apply 051_v3_users_role_guard.sql after admin).
-- Run as Step 1. Supabase SQL Editor = single transaction; keep role guard out of this file.

-- =============================================================================
-- §0 Drop stale role guard if re-running on partial state
-- =============================================================================

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'users'
  ) THEN
    DROP TRIGGER IF EXISTS users_role_guard ON public.users;
  END IF;
END $$;

-- =============================================================================
-- §1 account_status enum (033)
-- =============================================================================

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

-- =============================================================================
-- §2 public.users table
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY,
  kakao_id TEXT UNIQUE,
  email TEXT,
  nickname TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  referral_code TEXT,
  phone TEXT,
  phone_verified_at TIMESTAMPTZ,
  real_name TEXT,
  birth_date DATE,
  gender TEXT,
  marketing_agreed_at TIMESTAMPTZ,
  withdrawal_requested_at TIMESTAMPTZ,
  account_status public.account_status NOT NULL DEFAULT 'active',
  ci_hash TEXT,
  di_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT users_role_check CHECK (role IN ('user', 'seller', 'admin')),
  CONSTRAINT users_gender_check CHECK (gender IS NULL OR gender IN ('male', 'female', 'other'))
);

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS kakao_id TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS nickname TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS referral_code TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone_verified_at TIMESTAMPTZ;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS real_name TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS birth_date DATE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS marketing_agreed_at TIMESTAMPTZ;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS withdrawal_requested_at TIMESTAMPTZ;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS account_status public.account_status NOT NULL DEFAULT 'active';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS ci_hash TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS di_hash TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_referral_code
  ON public.users (referral_code)
  WHERE referral_code IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_kakao_id
  ON public.users (kakao_id)
  WHERE kakao_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_users_phone
  ON public.users (phone)
  WHERE phone IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_users_account_status
  ON public.users (account_status);

COMMENT ON TABLE public.users IS 'Wadeal app profile; id must match auth.users.id';

-- =============================================================================
-- §3 Helper functions
-- =============================================================================

CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  chars CONSTANT TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT;
  i INT;
BEGIN
  LOOP
    result := '';
    FOR i IN 1..8 LOOP
      result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;
    IF NOT EXISTS (SELECT 1 FROM public.users WHERE referral_code = result) THEN
      RETURN result;
    END IF;
  END LOOP;
END;
$$;

CREATE OR REPLACE FUNCTION public.is_admin_user(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users u
    WHERE u.id = p_user_id AND u.role = 'admin'
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin_user(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin_user(UUID) TO authenticated;

-- =============================================================================
-- §4 Backfill (no users_role_guard on this table yet)
-- =============================================================================

INSERT INTO public.users (id, email, nickname, role, created_at)
SELECT
  au.id,
  au.email,
  NULLIF(
    TRIM(
      COALESCE(
        au.raw_user_meta_data ->> 'nickname',
        au.raw_user_meta_data ->> 'name',
        au.raw_user_meta_data ->> 'full_name',
        split_part(COALESCE(au.email, ''), '@', 1)
      )
    ),
    ''
  ),
  'user',
  COALESCE(au.created_at, NOW())
FROM auth.users AS au
ON CONFLICT (id) DO UPDATE SET
  email = COALESCE(EXCLUDED.email, public.users.email),
  nickname = COALESCE(public.users.nickname, EXCLUDED.nickname);

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'profiles'
  ) THEN
    INSERT INTO public.users (id, email, role, created_at)
    SELECT
      p.id,
      p.email,
      CASE
        WHEN p.role IN ('user', 'seller', 'admin') THEN p.role
        ELSE 'user'
      END,
      COALESCE(p.created_at, NOW())
    FROM public.profiles AS p
    ON CONFLICT (id) DO UPDATE SET
      email = COALESCE(public.users.email, EXCLUDED.email),
      role = CASE
        WHEN public.users.role = 'user' AND EXCLUDED.role IN ('seller', 'admin')
          THEN EXCLUDED.role
        ELSE public.users.role
      END;
  END IF;
END $$;

INSERT INTO public.users (id, role, created_at)
SELECT DISTINCT o.user_id, 'user', NOW()
FROM public.orders AS o
WHERE o.user_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM public.users u WHERE u.id = o.user_id)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.users (id, role, created_at)
SELECT DISTINCT s.user_id, 'user', NOW()
FROM public.sellers AS s
WHERE s.user_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM public.users u WHERE u.id = s.user_id)
ON CONFLICT (id) DO NOTHING;

UPDATE public.users AS u
SET role = 'seller'
FROM public.sellers AS s
WHERE s.user_id = u.id
  AND s.status = 'approved'
  AND u.role = 'user';

-- =============================================================================
-- §5 RLS
-- =============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS users_select_own ON public.users;
CREATE POLICY users_select_own
  ON public.users FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS users_insert_own ON public.users;
CREATE POLICY users_insert_own
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id AND role = 'user');

DROP POLICY IF EXISTS users_update_own ON public.users;
CREATE POLICY users_update_own
  ON public.users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = 'user');

DROP POLICY IF EXISTS users_select_admin ON public.users;
CREATE POLICY users_select_admin
  ON public.users FOR SELECT
  USING (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS users_update_admin ON public.users;
CREATE POLICY users_update_admin
  ON public.users FOR UPDATE
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

GRANT SELECT, INSERT, UPDATE ON TABLE public.users TO authenticated;
GRANT ALL ON TABLE public.users TO service_role;

REVOKE SELECT (ci_hash, di_hash) ON public.users FROM authenticated;

-- =============================================================================
-- §6 Triggers (identity + account only — NOT role guard)
-- =============================================================================

CREATE OR REPLACE FUNCTION public.guard_users_identity_sensitive_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL AND session_user IN ('postgres', 'supabase_admin') THEN
    RETURN NEW;
  END IF;

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

CREATE OR REPLACE FUNCTION public.guard_users_account_sensitive_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL AND session_user IN ('postgres', 'supabase_admin') THEN
    RETURN NEW;
  END IF;

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

-- =============================================================================
-- §7 RPC
-- =============================================================================

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
