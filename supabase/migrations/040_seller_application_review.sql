-- Seller application documents and admin review checklist.

CREATE TABLE IF NOT EXISTS public.seller_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  CONSTRAINT seller_documents_type_check CHECK (
    document_type IN (
      'business_registration',
      'bankbook_copy',
      'mail_order_license',
      'etc'
    )
  ),
  CONSTRAINT seller_documents_status_check CHECK (
    status IN ('pending', 'approved', 'rejected')
  ),
  CONSTRAINT seller_documents_file_url_not_empty CHECK (char_length(trim(file_url)) > 0)
);

CREATE INDEX IF NOT EXISTS idx_seller_documents_seller_id
  ON public.seller_documents(seller_id);

ALTER TABLE public.seller_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS seller_documents_admin_all ON public.seller_documents;
CREATE POLICY seller_documents_admin_all
  ON public.seller_documents FOR ALL
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS seller_documents_select_own_seller ON public.seller_documents;
CREATE POLICY seller_documents_select_own_seller
  ON public.seller_documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.sellers s
      WHERE s.id = seller_id AND s.user_id = auth.uid()
    )
  );

CREATE TABLE IF NOT EXISTS public.seller_review_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
  check_key TEXT NOT NULL,
  checked BOOLEAN NOT NULL DEFAULT false,
  checked_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  checked_at TIMESTAMPTZ,
  CONSTRAINT seller_review_checks_key_check CHECK (
    check_key IN (
      'business_number_provided',
      'representative_name_provided',
      'settlement_account_provided',
      'business_registration_document',
      'category_confirmed',
      'prohibited_products_cleared',
      'shipping_capability_confirmed',
      'cs_capability_confirmed',
      'settlement_info_verified',
      'policy_agreement_confirmed'
    )
  ),
  CONSTRAINT seller_review_checks_seller_key_unique UNIQUE (seller_id, check_key)
);

CREATE INDEX IF NOT EXISTS idx_seller_review_checks_seller_id
  ON public.seller_review_checks(seller_id);

ALTER TABLE public.seller_review_checks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS seller_review_checks_admin_all ON public.seller_review_checks;
CREATE POLICY seller_review_checks_admin_all
  ON public.seller_review_checks FOR ALL
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));
