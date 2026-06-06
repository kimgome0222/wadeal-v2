-- Seller notices for seller center announcements.

CREATE TABLE IF NOT EXISTS public.seller_notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  is_important BOOLEAN NOT NULL DEFAULT false,
  attachment_urls JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft',
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  CONSTRAINT seller_notices_title_not_empty CHECK (char_length(trim(title)) > 0),
  CONSTRAINT seller_notices_content_not_empty CHECK (char_length(trim(content)) > 0),
  CONSTRAINT seller_notices_category_check CHECK (
    category IN ('general', 'settlement', 'shipping', 'product', 'policy', 'system')
  ),
  CONSTRAINT seller_notices_status_check CHECK (
    status IN ('draft', 'published', 'archived')
  )
);

CREATE INDEX IF NOT EXISTS idx_seller_notices_status_published_at
  ON public.seller_notices(status, published_at DESC NULLS LAST);

CREATE INDEX IF NOT EXISTS idx_seller_notices_category
  ON public.seller_notices(category);

ALTER TABLE public.seller_notices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS seller_notices_select_published ON public.seller_notices;
CREATE POLICY seller_notices_select_published
  ON public.seller_notices FOR SELECT
  USING (
    status = 'published'
    AND EXISTS (
      SELECT 1 FROM public.sellers s
      WHERE s.user_id = auth.uid()
        AND s.status = 'approved'
    )
  );

DROP POLICY IF EXISTS seller_notices_admin_all ON public.seller_notices;
CREATE POLICY seller_notices_admin_all
  ON public.seller_notices FOR ALL
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));
