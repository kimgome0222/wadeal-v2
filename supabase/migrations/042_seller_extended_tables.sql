-- Seller extended tables: multi-user access, product requests, payout accounts.
-- Also extend sellers.status to include under_review.

ALTER TABLE public.sellers DROP CONSTRAINT IF EXISTS sellers_status_check;
ALTER TABLE public.sellers
  ADD CONSTRAINT sellers_status_check
  CHECK (status IN ('pending_review', 'under_review', 'approved', 'rejected', 'suspended'));

CREATE TABLE IF NOT EXISTS public.seller_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'owner'
    CHECK (role IN ('owner', 'manager', 'staff')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (seller_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_seller_users_seller_id ON public.seller_users(seller_id);
CREATE INDEX IF NOT EXISTS idx_seller_users_user_id ON public.seller_users(user_id);

CREATE TABLE IF NOT EXISTS public.seller_product_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
  requested_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  description TEXT,
  image_urls TEXT[] NOT NULL DEFAULT '{}',
  original_price INTEGER,
  group_price INTEGER,
  target_participants INTEGER,
  ends_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'under_review', 'approved', 'rejected', 'changes_requested')),
  rejected_reason TEXT,
  approved_product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  approved_deal_id UUID REFERENCES public.group_buy_deals(id) ON DELETE SET NULL,
  reviewed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_seller_product_requests_seller_id
  ON public.seller_product_requests(seller_id);
CREATE INDEX IF NOT EXISTS idx_seller_product_requests_status
  ON public.seller_product_requests(status);

CREATE TABLE IF NOT EXISTS public.seller_payout_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
  bank_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  account_holder TEXT NOT NULL,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_seller_payout_accounts_seller_id
  ON public.seller_payout_accounts(seller_id);

-- View alias for settlement_records (seller_settlements naming in docs).
CREATE OR REPLACE VIEW public.seller_settlements AS
SELECT
  id,
  seller_id,
  period_start,
  period_end,
  gross_sales_amount,
  platform_fee_amount,
  ad_deduction_amount,
  other_deduction_amount,
  net_payout_amount,
  status,
  seller_confirmed_at,
  confirmed_at,
  paid_at,
  deposit_confirmed_at,
  receipt_reference,
  created_at,
  updated_at
FROM public.settlement_records;

ALTER TABLE public.seller_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_product_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_payout_accounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS seller_users_select_own ON public.seller_users;
CREATE POLICY seller_users_select_own
  ON public.seller_users FOR SELECT
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.sellers s
      WHERE s.id = seller_id AND s.user_id = auth.uid()
    )
    OR public.is_admin_user(auth.uid())
  );

DROP POLICY IF EXISTS seller_users_admin_all ON public.seller_users;
CREATE POLICY seller_users_admin_all
  ON public.seller_users FOR ALL
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS seller_product_requests_select_own ON public.seller_product_requests;
CREATE POLICY seller_product_requests_select_own
  ON public.seller_product_requests FOR SELECT
  USING (
    requested_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.sellers s
      WHERE s.id = seller_id AND s.user_id = auth.uid()
    )
    OR public.is_admin_user(auth.uid())
  );

DROP POLICY IF EXISTS seller_product_requests_insert_own ON public.seller_product_requests;
CREATE POLICY seller_product_requests_insert_own
  ON public.seller_product_requests FOR INSERT
  WITH CHECK (
    requested_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.sellers s
      WHERE s.id = seller_id AND s.user_id = auth.uid() AND s.status = 'approved'
    )
  );

DROP POLICY IF EXISTS seller_product_requests_admin_all ON public.seller_product_requests;
CREATE POLICY seller_product_requests_admin_all
  ON public.seller_product_requests FOR ALL
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS seller_payout_accounts_select_own ON public.seller_payout_accounts;
CREATE POLICY seller_payout_accounts_select_own
  ON public.seller_payout_accounts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.sellers s
      WHERE s.id = seller_id AND s.user_id = auth.uid()
    )
    OR public.is_admin_user(auth.uid())
  );

DROP POLICY IF EXISTS seller_payout_accounts_manage_own ON public.seller_payout_accounts;
CREATE POLICY seller_payout_accounts_manage_own
  ON public.seller_payout_accounts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.sellers s
      WHERE s.id = seller_id AND s.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.sellers s
      WHERE s.id = seller_id AND s.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS seller_payout_accounts_admin_all ON public.seller_payout_accounts;
CREATE POLICY seller_payout_accounts_admin_all
  ON public.seller_payout_accounts FOR ALL
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

CREATE OR REPLACE FUNCTION public.set_seller_product_requests_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS seller_product_requests_updated_at ON public.seller_product_requests;
CREATE TRIGGER seller_product_requests_updated_at
  BEFORE UPDATE ON public.seller_product_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.set_seller_product_requests_updated_at();

CREATE OR REPLACE FUNCTION public.set_seller_payout_accounts_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS seller_payout_accounts_updated_at ON public.seller_payout_accounts;
CREATE TRIGGER seller_payout_accounts_updated_at
  BEFORE UPDATE ON public.seller_payout_accounts
  FOR EACH ROW
  EXECUTE FUNCTION public.set_seller_payout_accounts_updated_at();
