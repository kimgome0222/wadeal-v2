-- Seller onboarding fields, review replies, seller CS answers, notification types.

ALTER TABLE public.sellers
  ADD COLUMN IF NOT EXISTS representative_name TEXT,
  ADD COLUMN IF NOT EXISTS business_registration_url TEXT,
  ADD COLUMN IF NOT EXISTS rejected_reason TEXT;

-- ---------------------------------------------------------------------------
-- Review replies (seller responses to product reviews)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.review_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT review_replies_body_not_empty CHECK (char_length(trim(body)) > 0)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_review_replies_review_id
  ON public.review_replies(review_id);

CREATE INDEX IF NOT EXISTS idx_review_replies_seller_id
  ON public.review_replies(seller_id);

ALTER TABLE public.review_replies ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_seller_owner_of_review(p_review_id UUID, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.reviews r
    JOIN public.products p ON p.slug = r.product_id
    WHERE r.id = p_review_id
      AND p.created_by = p_user_id
  );
$$;

DROP POLICY IF EXISTS review_replies_select_own_seller ON public.review_replies;
CREATE POLICY review_replies_select_own_seller
  ON public.review_replies FOR SELECT
  USING (
    auth.uid() = user_id
    OR public.is_seller_owner_of_review(review_id, auth.uid())
    OR public.is_admin_user(auth.uid())
  );

DROP POLICY IF EXISTS review_replies_insert_own_seller ON public.review_replies;
CREATE POLICY review_replies_insert_own_seller
  ON public.review_replies FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.sellers s
      WHERE s.id = seller_id
        AND s.user_id = auth.uid()
        AND s.status = 'approved'
    )
    AND public.is_seller_owner_of_review(review_id, auth.uid())
  );

DROP POLICY IF EXISTS review_replies_update_own_seller ON public.review_replies;
CREATE POLICY review_replies_update_own_seller
  ON public.review_replies FOR UPDATE
  USING (
    auth.uid() = user_id
    AND public.is_seller_owner_of_review(review_id, auth.uid())
  )
  WITH CHECK (
    auth.uid() = user_id
    AND public.is_seller_owner_of_review(review_id, auth.uid())
  );

-- ---------------------------------------------------------------------------
-- Support tickets: seller answers on product inquiries
-- ---------------------------------------------------------------------------

ALTER TABLE public.support_tickets
  ADD COLUMN IF NOT EXISTS seller_answer TEXT,
  ADD COLUMN IF NOT EXISTS seller_answered_at TIMESTAMPTZ;

CREATE OR REPLACE FUNCTION public.is_seller_owner_of_product_slug(p_product_slug TEXT, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.products p
    WHERE p.slug = p_product_slug
      AND p.created_by = p_user_id
  );
$$;

DROP POLICY IF EXISTS support_tickets_select_seller_product ON public.support_tickets;
CREATE POLICY support_tickets_select_seller_product
  ON public.support_tickets FOR SELECT
  USING (
    product_id IS NOT NULL
    AND public.is_seller_owner_of_product_slug(product_id, auth.uid())
    AND EXISTS (
      SELECT 1 FROM public.sellers s
      WHERE s.user_id = auth.uid() AND s.status = 'approved'
    )
  );

DROP POLICY IF EXISTS support_tickets_update_seller_answer ON public.support_tickets;
CREATE POLICY support_tickets_update_seller_answer
  ON public.support_tickets FOR UPDATE
  USING (
    product_id IS NOT NULL
    AND public.is_seller_owner_of_product_slug(product_id, auth.uid())
    AND EXISTS (
      SELECT 1 FROM public.sellers s
      WHERE s.user_id = auth.uid() AND s.status = 'approved'
    )
  )
  WITH CHECK (
    product_id IS NOT NULL
    AND public.is_seller_owner_of_product_slug(product_id, auth.uid())
  );

-- Sellers can read reviews on their own products
DROP POLICY IF EXISTS reviews_select_seller_own_product ON public.reviews;
CREATE POLICY reviews_select_seller_own_product
  ON public.reviews FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.slug = reviews.product_id
        AND p.created_by = auth.uid()
    )
    AND EXISTS (
      SELECT 1 FROM public.sellers s
      WHERE s.user_id = auth.uid() AND s.status = 'approved'
    )
  );

-- ---------------------------------------------------------------------------
-- Notification types: seller approval workflow
-- ---------------------------------------------------------------------------

ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE public.notifications
  ADD CONSTRAINT notifications_type_check
  CHECK (
    type IN (
      'deal_deadline_soon',
      'price_tier_reached',
      'next_tier_soon',
      'order_confirmed',
      'payment_ready',
      'payment_paid',
      'payment_deposit_completed',
      'payment_failed',
      'shipping_started',
      'shipping_delivered',
      'review_available',
      'refund_updated',
      'support_reply',
      'support_resolved',
      'product_approved',
      'product_rejected',
      'seller_approved',
      'seller_rejected'
    )
  );

CREATE OR REPLACE FUNCTION public.create_notification(
  p_user_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_link_url TEXT DEFAULT NULL,
  p_channel TEXT DEFAULT 'in_app'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_notification_id UUID;
BEGIN
  IF p_type NOT IN (
    'deal_deadline_soon',
    'price_tier_reached',
    'next_tier_soon',
    'order_confirmed',
    'payment_ready',
    'payment_paid',
    'payment_deposit_completed',
    'payment_failed',
    'shipping_started',
    'shipping_delivered',
    'review_available',
    'refund_updated',
    'support_reply',
    'support_resolved',
    'product_approved',
    'product_rejected',
    'seller_approved',
    'seller_rejected'
  ) THEN
    RAISE EXCEPTION 'invalid_type';
  END IF;

  IF p_channel NOT IN ('in_app', 'kakao', 'email', 'push') THEN
    RAISE EXCEPTION 'invalid_channel';
  END IF;

  IF auth.uid() IS NOT NULL
    AND auth.uid() <> p_user_id
    AND NOT EXISTS (
      SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'
    ) THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  INSERT INTO public.notifications (
    user_id,
    type,
    title,
    message,
    link_url,
    channel
  ) VALUES (
    p_user_id,
    p_type,
    p_title,
    p_message,
    NULLIF(TRIM(p_link_url), ''),
    COALESCE(NULLIF(TRIM(p_channel), ''), 'in_app')
  )
  RETURNING id INTO v_notification_id;

  RETURN v_notification_id;
END;
$$;
