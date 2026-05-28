-- Seller center: marketplace sellers table, role extension, RLS.

ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE public.users
  ADD CONSTRAINT users_role_check
  CHECK (role IN ('user', 'seller', 'admin'));

CREATE TABLE IF NOT EXISTS public.sellers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  business_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_review'
    CHECK (status IN ('pending_review', 'approved', 'rejected', 'suspended')),
  bank_name TEXT,
  account_number TEXT,
  account_holder TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sellers_user_id ON public.sellers(user_id);
CREATE INDEX IF NOT EXISTS idx_sellers_status ON public.sellers(status);

ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS sellers_select_own ON public.sellers;
CREATE POLICY sellers_select_own
  ON public.sellers FOR SELECT
  USING (
    auth.uid() = user_id
    OR public.is_admin_user(auth.uid())
  );

DROP POLICY IF EXISTS sellers_insert_own ON public.sellers;
CREATE POLICY sellers_insert_own
  ON public.sellers FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND status = 'pending_review'
  );

DROP POLICY IF EXISTS sellers_update_own ON public.sellers;
CREATE POLICY sellers_update_own
  ON public.sellers FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS sellers_update_admin ON public.sellers;
CREATE POLICY sellers_update_admin
  ON public.sellers FOR UPDATE
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

CREATE OR REPLACE FUNCTION public.guard_seller_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status
     AND NOT public.is_admin_user(auth.uid()) THEN
    RAISE EXCEPTION 'forbidden_seller_status_change';
  END IF;

  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS sellers_status_guard ON public.sellers;
CREATE TRIGGER sellers_status_guard
  BEFORE UPDATE OF status ON public.sellers
  FOR EACH ROW
  EXECUTE FUNCTION public.guard_seller_status_change();

CREATE OR REPLACE FUNCTION public.set_sellers_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS sellers_updated_at ON public.sellers;
CREATE TRIGGER sellers_updated_at
  BEFORE UPDATE ON public.sellers
  FOR EACH ROW
  EXECUTE FUNCTION public.set_sellers_updated_at();

-- Allow admins to update user roles (e.g. seller approval).
DROP POLICY IF EXISTS users_update_admin ON public.users;
CREATE POLICY users_update_admin
  ON public.users FOR UPDATE
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));
