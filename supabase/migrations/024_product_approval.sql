-- Product registration review / approval workflow

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS approval_status TEXT NOT NULL DEFAULT 'draft'
    CHECK (approval_status IN ('draft', 'pending_review', 'approved', 'rejected')),
  ADD COLUMN IF NOT EXISTS rejected_reason TEXT,
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_products_approval_status ON public.products(approval_status);
CREATE INDEX IF NOT EXISTS idx_products_created_by ON public.products(created_by);

-- Existing catalog rows were live before this workflow; mark them approved.
UPDATE public.products
SET
  approval_status = 'approved',
  approved_at = COALESCE(approved_at, created_at)
WHERE is_active = TRUE
  AND approval_status = 'draft';

-- ---------------------------------------------------------------------------
-- Public catalog read: active deal + approved product only
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS products_select_public_active ON public.products;
CREATE POLICY products_select_public_active
  ON public.products FOR SELECT
  USING (
    is_active = TRUE
    AND approval_status = 'approved'
  );

DROP POLICY IF EXISTS deals_select_public_active ON public.group_buy_deals;
CREATE POLICY deals_select_public_active
  ON public.group_buy_deals FOR SELECT
  USING (
    status = 'active'
    AND EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_id
        AND p.is_active = TRUE
        AND p.approval_status = 'approved'
    )
  );

DROP POLICY IF EXISTS price_tiers_select_public_active ON public.price_tiers;
CREATE POLICY price_tiers_select_public_active
  ON public.price_tiers FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.group_buy_deals d
      JOIN public.products p ON p.id = d.product_id
      WHERE d.id = price_tiers.deal_id
        AND d.status = 'active'
        AND p.is_active = TRUE
        AND p.approval_status = 'approved'
    )
  );

-- ---------------------------------------------------------------------------
-- Seller / creator access to own products (full lifecycle visibility)
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS products_select_own_creator ON public.products;
CREATE POLICY products_select_own_creator
  ON public.products FOR SELECT
  USING (auth.uid() = created_by);

DROP POLICY IF EXISTS products_insert_own_creator ON public.products;
CREATE POLICY products_insert_own_creator
  ON public.products FOR INSERT
  WITH CHECK (
    auth.uid() = created_by
    AND approval_status IN ('draft', 'pending_review')
  );

DROP POLICY IF EXISTS products_update_own_creator ON public.products;
CREATE POLICY products_update_own_creator
  ON public.products FOR UPDATE
  USING (
    auth.uid() = created_by
    AND approval_status IN ('draft', 'pending_review', 'rejected')
  )
  WITH CHECK (
    auth.uid() = created_by
    AND approval_status IN ('draft', 'pending_review', 'rejected')
  );

DROP POLICY IF EXISTS deals_select_own_creator ON public.group_buy_deals;
CREATE POLICY deals_select_own_creator
  ON public.group_buy_deals FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_id AND p.created_by = auth.uid()
    )
  );

DROP POLICY IF EXISTS deals_insert_own_creator ON public.group_buy_deals;
CREATE POLICY deals_insert_own_creator
  ON public.group_buy_deals FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_id AND p.created_by = auth.uid()
    )
  );

DROP POLICY IF EXISTS deals_update_own_creator ON public.group_buy_deals;
CREATE POLICY deals_update_own_creator
  ON public.group_buy_deals FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_id
        AND p.created_by = auth.uid()
        AND p.approval_status IN ('draft', 'pending_review', 'rejected')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_id
        AND p.created_by = auth.uid()
        AND p.approval_status IN ('draft', 'pending_review', 'rejected')
    )
  );

-- ---------------------------------------------------------------------------
-- Wishlist / cart / recent views: approved active products only
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS saved_deals_insert_own ON public.saved_deals;
CREATE POLICY saved_deals_insert_own
  ON public.saved_deals FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_id
        AND p.is_active = TRUE
        AND p.approval_status = 'approved'
    )
  );

DROP POLICY IF EXISTS recent_views_insert_own ON public.recent_views;
CREATE POLICY recent_views_insert_own
  ON public.recent_views FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_id
        AND p.is_active = TRUE
        AND p.approval_status = 'approved'
    )
  );

DROP POLICY IF EXISTS recent_views_update_own ON public.recent_views;
CREATE POLICY recent_views_update_own
  ON public.recent_views FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_id
        AND p.is_active = TRUE
        AND p.approval_status = 'approved'
    )
  );

DROP POLICY IF EXISTS join_cart_insert_own ON public.join_cart;
CREATE POLICY join_cart_insert_own
  ON public.join_cart FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_id
        AND p.is_active = TRUE
        AND p.approval_status = 'approved'
    )
  );

DROP POLICY IF EXISTS participants_insert_own ON public.group_buy_participants;
CREATE POLICY participants_insert_own
  ON public.group_buy_participants FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND status = 'active'
    AND EXISTS (
      SELECT 1
      FROM public.group_buy_deals d
      JOIN public.products p ON p.id = d.product_id
      WHERE d.id = deal_id
        AND d.status = 'active'
        AND p.is_active = TRUE
        AND p.approval_status = 'approved'
    )
  );

-- ---------------------------------------------------------------------------
-- Notification types for product approval workflow
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
      'product_rejected'
    )
  );
