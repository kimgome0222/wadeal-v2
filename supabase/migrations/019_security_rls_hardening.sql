-- Security hardening: column-level guards, narrow user UPDATE scopes, admin-only payment status.

-- ---------------------------------------------------------------------------
-- Shared helpers
-- ---------------------------------------------------------------------------

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

-- ---------------------------------------------------------------------------
-- users: RLS + prevent self role escalation
-- ---------------------------------------------------------------------------

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

CREATE OR REPLACE FUNCTION public.guard_users_role_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.role IS DISTINCT FROM 'user' AND NOT public.is_admin_user(auth.uid()) THEN
      NEW.role := 'user';
    END IF;
    RETURN NEW;
  END IF;

  IF NEW.role IS DISTINCT FROM OLD.role AND NOT public.is_admin_user(auth.uid()) THEN
    RAISE EXCEPTION 'forbidden_role_change';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS users_role_guard ON public.users;
CREATE TRIGGER users_role_guard
  BEFORE INSERT OR UPDATE OF role ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.guard_users_role_escalation();

-- ---------------------------------------------------------------------------
-- Catalog public read (idempotent; migration 010 added admin-only SELECT)
-- ---------------------------------------------------------------------------

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_buy_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_tiers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read active products" ON public.products;
CREATE POLICY products_select_public_active
  ON public.products FOR SELECT
  USING (is_active = TRUE);

DROP POLICY IF EXISTS "Public read active deals" ON public.group_buy_deals;
CREATE POLICY deals_select_public_active
  ON public.group_buy_deals FOR SELECT
  USING (status = 'active');

DROP POLICY IF EXISTS "Public read tiers for active deals" ON public.price_tiers;
CREATE POLICY price_tiers_select_public_active
  ON public.price_tiers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.group_buy_deals d
      WHERE d.id = price_tiers.deal_id AND d.status = 'active'
    )
  );

-- ---------------------------------------------------------------------------
-- price_alerts + group_buy_participants
-- ---------------------------------------------------------------------------

ALTER TABLE public.price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_buy_participants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS price_alerts_select_own ON public.price_alerts;
CREATE POLICY price_alerts_select_own
  ON public.price_alerts FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS price_alerts_insert_own ON public.price_alerts;
CREATE POLICY price_alerts_insert_own
  ON public.price_alerts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS price_alerts_update_own ON public.price_alerts;
CREATE POLICY price_alerts_update_own
  ON public.price_alerts FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS price_alerts_delete_own ON public.price_alerts;
CREATE POLICY price_alerts_delete_own
  ON public.price_alerts FOR DELETE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS participants_select_own ON public.group_buy_participants;
CREATE POLICY participants_select_own
  ON public.group_buy_participants FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS participants_insert_own ON public.group_buy_participants;
CREATE POLICY participants_insert_own
  ON public.group_buy_participants FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND status = 'active'
    AND EXISTS (
      SELECT 1 FROM public.group_buy_deals d
      WHERE d.id = deal_id AND d.status = 'active'
    )
  );

DROP POLICY IF EXISTS participants_update_own ON public.group_buy_participants;
CREATE POLICY participants_update_own
  ON public.group_buy_participants FOR UPDATE
  USING (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- orders: remove broad user UPDATE; guard sensitive columns
-- ---------------------------------------------------------------------------

ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_quantity_check;
ALTER TABLE public.orders
  ADD CONSTRAINT orders_quantity_check
  CHECK (quantity >= 1 AND quantity <= 99);

ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_joined_price_check;
ALTER TABLE public.orders
  ADD CONSTRAINT orders_joined_price_check
  CHECK (joined_price IS NULL OR joined_price >= 0);

DROP POLICY IF EXISTS orders_update_own ON public.orders;

DROP POLICY IF EXISTS orders_insert_own ON public.orders;
CREATE POLICY orders_insert_own
  ON public.orders FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND final_price IS NULL
    AND COALESCE(order_status, 'joined') = 'joined'
    AND COALESCE(payment_status, 'ready') IN ('ready', 'pending')
    AND COALESCE(shipping_status, 'none') = 'none'
    AND COALESCE(quantity, 1) >= 1
    AND COALESCE(quantity, 1) <= 99
    AND COALESCE(joined_price, 0) >= 0
  );

DROP POLICY IF EXISTS orders_update_own_confirm ON public.orders;
CREATE POLICY orders_update_own_lifecycle
  ON public.orders FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.is_service_role_context()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claim.role', true),
    current_setting('role', true)
  ) = 'service_role';
$$;

CREATE OR REPLACE FUNCTION public.enforce_orders_insert_guard()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.is_service_role_context() THEN
    RETURN NEW;
  END IF;

  IF public.is_admin_user(auth.uid()) THEN
    RETURN NEW;
  END IF;

  IF NEW.user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  NEW.final_price := NULL;
  NEW.order_status := 'joined';
  NEW.payment_status := COALESCE(NULLIF(NEW.payment_status, ''), 'ready');
  IF NEW.payment_status NOT IN ('ready', 'pending') THEN
    NEW.payment_status := 'ready';
  END IF;
  NEW.shipping_status := COALESCE(NULLIF(NEW.shipping_status, ''), 'none');

  IF NEW.quantity IS NULL OR NEW.quantity < 1 OR NEW.quantity > 99 THEN
    RAISE EXCEPTION 'invalid_quantity';
  END IF;

  IF NEW.joined_price IS NULL OR NEW.joined_price < 0 THEN
    RAISE EXCEPTION 'invalid_price';
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.enforce_orders_update_guard()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.is_service_role_context() THEN
    RETURN NEW;
  END IF;

  IF public.is_admin_user(auth.uid()) THEN
    RETURN NEW;
  END IF;

  IF OLD.user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  -- Purchase confirmation (delivered -> confirmed)
  IF OLD.shipping_status = 'delivered'
     AND NEW.shipping_status = 'confirmed'
     AND NEW.confirmed_at IS NOT NULL
     AND NEW.user_id IS NOT DISTINCT FROM OLD.user_id
     AND NEW.final_price IS NOT DISTINCT FROM OLD.final_price
     AND NEW.payment_status IS NOT DISTINCT FROM OLD.payment_status
     AND NEW.order_status IS NOT DISTINCT FROM OLD.order_status
     AND NEW.joined_price IS NOT DISTINCT FROM OLD.joined_price
     AND NEW.quantity IS NOT DISTINCT FROM OLD.quantity
     AND NEW.payment_amount IS NOT DISTINCT FROM OLD.payment_amount
  THEN
    RETURN NEW;
  END IF;

  -- Cancel reason note (status fields unchanged)
  IF NEW.cancel_reason IS DISTINCT FROM OLD.cancel_reason
     AND NEW.refund_reason IS NOT DISTINCT FROM OLD.refund_reason
     AND NEW.refund_requested_at IS NOT DISTINCT FROM OLD.refund_requested_at
     AND NEW.shipping_status IS NOT DISTINCT FROM OLD.shipping_status
     AND NEW.payment_status IS NOT DISTINCT FROM OLD.payment_status
     AND NEW.order_status IS NOT DISTINCT FROM OLD.order_status
     AND NEW.final_price IS NOT DISTINCT FROM OLD.final_price
     AND NEW.joined_price IS NOT DISTINCT FROM OLD.joined_price
     AND NEW.quantity IS NOT DISTINCT FROM OLD.quantity
  THEN
    RETURN NEW;
  END IF;

  -- Refund request note (status fields unchanged)
  IF (NEW.refund_reason IS DISTINCT FROM OLD.refund_reason
      OR NEW.refund_requested_at IS DISTINCT FROM OLD.refund_requested_at)
     AND NEW.cancel_reason IS NOT DISTINCT FROM OLD.cancel_reason
     AND NEW.shipping_status IS NOT DISTINCT FROM OLD.shipping_status
     AND NEW.payment_status IS NOT DISTINCT FROM OLD.payment_status
     AND NEW.order_status IS NOT DISTINCT FROM OLD.order_status
     AND NEW.final_price IS NOT DISTINCT FROM OLD.final_price
     AND NEW.joined_price IS NOT DISTINCT FROM OLD.joined_price
     AND NEW.quantity IS NOT DISTINCT FROM OLD.quantity
  THEN
    RETURN NEW;
  END IF;

  RAISE EXCEPTION 'forbidden_order_update';
END;
$$;

DROP TRIGGER IF EXISTS orders_insert_guard ON public.orders;
CREATE TRIGGER orders_insert_guard
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_orders_insert_guard();

DROP TRIGGER IF EXISTS orders_update_guard ON public.orders;
CREATE TRIGGER orders_update_guard
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_orders_update_guard();

-- final_price may only be set when deal is finalized (server/admin path)
CREATE OR REPLACE FUNCTION public.enforce_orders_final_price_guard()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE'
    AND NEW.final_price IS DISTINCT FROM OLD.final_price
    AND NOT public.is_service_role_context()
    AND NOT public.is_admin_user(auth.uid())
  THEN
    RAISE EXCEPTION 'forbidden_final_price';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS orders_final_price_guard ON public.orders;
CREATE TRIGGER orders_final_price_guard
  BEFORE UPDATE OF final_price ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_orders_final_price_guard();

-- ---------------------------------------------------------------------------
-- reviews: rating constraint + verified-purchase insert guard
-- ---------------------------------------------------------------------------

ALTER TABLE public.reviews DROP CONSTRAINT IF EXISTS reviews_rating_check;
ALTER TABLE public.reviews
  ADD CONSTRAINT reviews_rating_check
  CHECK (rating >= 1 AND rating <= 5);

CREATE OR REPLACE FUNCTION public.enforce_reviews_insert_guard()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order RECORD;
BEGIN
  IF public.is_service_role_context() THEN
    RETURN NEW;
  END IF;

  IF public.is_admin_user(auth.uid()) THEN
    RETURN NEW;
  END IF;

  IF NEW.user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  IF NEW.rating < 1 OR NEW.rating > 5 THEN
    RAISE EXCEPTION 'invalid_rating';
  END IF;

  IF NEW.order_id IS NULL THEN
    RAISE EXCEPTION 'order_required';
  END IF;

  SELECT
    o.id,
    o.user_id,
    o.product_id,
    o.shipping_status,
    o.confirmed_at
  INTO v_order
  FROM public.orders o
  WHERE o.id = NEW.order_id;

  IF NOT FOUND OR v_order.user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'order_not_found';
  END IF;

  IF v_order.product_id IS DISTINCT FROM NEW.product_id THEN
    RAISE EXCEPTION 'product_mismatch';
  END IF;

  IF v_order.shipping_status IS DISTINCT FROM 'confirmed' OR v_order.confirmed_at IS NULL THEN
    RAISE EXCEPTION 'awaiting_confirmation';
  END IF;

  IF v_order.confirmed_at < NOW() - INTERVAL '15 days' THEN
    RAISE EXCEPTION 'review_window_expired';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.reviews r
    WHERE r.order_id = NEW.order_id AND r.status <> 'deleted'
  ) THEN
    RAISE EXCEPTION 'already_reviewed';
  END IF;

  NEW.is_verified_purchase := TRUE;
  NEW.status := COALESCE(NULLIF(NEW.status, ''), 'visible');

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS reviews_insert_guard ON public.reviews;
CREATE TRIGGER reviews_insert_guard
  BEFORE INSERT ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_reviews_insert_guard();

-- Users may not self-moderate review status
CREATE OR REPLACE FUNCTION public.enforce_reviews_update_guard()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.is_service_role_context() THEN
    RETURN NEW;
  END IF;

  IF public.is_admin_user(auth.uid()) THEN
    RETURN NEW;
  END IF;

  IF OLD.user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  IF NEW.status IS DISTINCT FROM OLD.status THEN
    IF NEW.status = 'deleted' AND OLD.status <> 'deleted' THEN
      NULL;
    ELSE
      RAISE EXCEPTION 'forbidden_status_change';
    END IF;
  END IF;

  IF NEW.is_verified_purchase IS DISTINCT FROM OLD.is_verified_purchase THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  IF NEW.order_id IS DISTINCT FROM OLD.order_id THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  IF NEW.rating < 1 OR NEW.rating > 5 THEN
    RAISE EXCEPTION 'invalid_rating';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS reviews_update_guard ON public.reviews;
CREATE TRIGGER reviews_update_guard
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_reviews_update_guard();

-- ---------------------------------------------------------------------------
-- notifications: mark-read only for users (no direct INSERT/UPDATE of content)
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
      'shipping_started',
      'shipping_delivered',
      'review_available',
      'refund_updated',
      'support_reply',
      'support_resolved'
    )
  );

DROP POLICY IF EXISTS notifications_update_own ON public.notifications;

-- ---------------------------------------------------------------------------
-- support_tickets: users create/read only; no self-update
-- ---------------------------------------------------------------------------

ALTER TABLE public.support_tickets DROP CONSTRAINT IF EXISTS support_tickets_type_check;
ALTER TABLE public.support_tickets
  ADD CONSTRAINT support_tickets_type_check
  CHECK (type IN ('shipping', 'cancel', 'refund', 'product', 'other'));

ALTER TABLE public.support_tickets DROP CONSTRAINT IF EXISTS support_tickets_status_check;
ALTER TABLE public.support_tickets
  ADD CONSTRAINT support_tickets_status_check
  CHECK (status IN ('open', 'answered', 'resolved', 'closed'));

DROP POLICY IF EXISTS support_tickets_update_own ON public.support_tickets;

DROP POLICY IF EXISTS support_tickets_insert_own ON public.support_tickets;
CREATE POLICY support_tickets_insert_own
  ON public.support_tickets FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND status = 'open'
    AND admin_reply IS NULL
    AND resolved_at IS NULL
  );

-- ---------------------------------------------------------------------------
-- user_notifications: read own; insert admin/server only
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS user_notifications_insert_service ON public.user_notifications;

CREATE OR REPLACE FUNCTION public.create_user_notification(
  p_user_id UUID,
  p_title TEXT,
  p_body TEXT,
  p_link_href TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  IF p_user_id IS NULL OR TRIM(p_title) = '' OR TRIM(p_body) = '' THEN
    RAISE EXCEPTION 'invalid_input';
  END IF;

  IF auth.uid() IS NOT NULL
    AND auth.uid() <> p_user_id
    AND NOT public.is_admin_user(auth.uid())
  THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  INSERT INTO public.user_notifications (user_id, title, body, link_href)
  VALUES (p_user_id, TRIM(p_title), TRIM(p_body), NULLIF(TRIM(p_link_href), ''))
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

REVOKE ALL ON FUNCTION public.create_user_notification(UUID, TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_user_notification(UUID, TEXT, TEXT, TEXT) TO authenticated;

-- ---------------------------------------------------------------------------
-- wishlist / cart / recent views: valid active product on write
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS saved_deals_insert_own ON public.saved_deals;
CREATE POLICY saved_deals_insert_own
  ON public.saved_deals FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_id AND p.is_active = TRUE
    )
  );

DROP POLICY IF EXISTS recent_views_insert_own ON public.recent_views;
CREATE POLICY recent_views_insert_own
  ON public.recent_views FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_id AND p.is_active = TRUE
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
      WHERE p.id = product_id AND p.is_active = TRUE
    )
  );

DROP POLICY IF EXISTS join_cart_insert_own ON public.join_cart;
CREATE POLICY join_cart_insert_own
  ON public.join_cart FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND quantity >= 1 AND quantity <= 99
    AND estimated_unit_price >= 0
    AND EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_id AND p.is_active = TRUE
    )
  );

DROP POLICY IF EXISTS join_cart_update_own ON public.join_cart;
CREATE POLICY join_cart_update_own
  ON public.join_cart FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND quantity >= 1 AND quantity <= 99
    AND estimated_unit_price >= 0
  );

-- ---------------------------------------------------------------------------
-- payments: status changes admin-only via RPC
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION update_payment_status(
  p_payment_id UUID,
  p_status TEXT,
  p_confirmed_amount INTEGER DEFAULT NULL,
  p_payment_provider TEXT DEFAULT NULL,
  p_payment_key TEXT DEFAULT NULL,
  p_method TEXT DEFAULT NULL,
  p_raw_response JSONB DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_payment RECORD;
  v_now TIMESTAMPTZ := NOW();
BEGIN
  IF p_status NOT IN ('ready', 'authorized', 'paid', 'failed', 'cancelled', 'refunded') THEN
    RAISE EXCEPTION 'invalid_status';
  END IF;

  IF auth.uid() IS NULL OR NOT public.is_admin_user(auth.uid()) THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  SELECT p.id, p.order_id, p.user_id
  INTO v_payment
  FROM payments p
  WHERE p.id = p_payment_id;

  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  UPDATE payments
  SET
    status = p_status,
    confirmed_amount = COALESCE(p_confirmed_amount, confirmed_amount),
    payment_provider = COALESCE(p_payment_provider, payment_provider),
    payment_key = COALESCE(p_payment_key, payment_key),
    method = COALESCE(p_method, method),
    raw_response = COALESCE(p_raw_response, raw_response),
    approved_at = CASE WHEN p_status = 'paid' AND approved_at IS NULL THEN v_now ELSE approved_at END,
    failed_at = CASE WHEN p_status = 'failed' AND failed_at IS NULL THEN v_now ELSE failed_at END,
    cancelled_at = CASE WHEN p_status IN ('cancelled', 'refunded') AND cancelled_at IS NULL THEN v_now ELSE cancelled_at END,
    updated_at = v_now
  WHERE id = p_payment_id;

  PERFORM sync_order_payment_status(v_payment.order_id);

  RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION create_notification(
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
    'shipping_started',
    'shipping_delivered',
    'review_available',
    'refund_updated',
    'support_reply',
    'support_resolved'
  ) THEN
    RAISE EXCEPTION 'invalid_type';
  END IF;

  IF p_channel NOT IN ('in_app', 'kakao', 'email', 'push') THEN
    RAISE EXCEPTION 'invalid_channel';
  END IF;

  IF auth.uid() IS NOT NULL
    AND auth.uid() <> p_user_id
    AND NOT public.is_admin_user(auth.uid())
  THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  INSERT INTO notifications (
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

CREATE OR REPLACE FUNCTION notify_deal_participants(
  p_deal_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_link_url TEXT DEFAULT NULL,
  p_channel TEXT DEFAULT 'in_app'
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INTEGER := 0;
  v_participant RECORD;
BEGIN
  IF p_type NOT IN (
    'deal_deadline_soon',
    'price_tier_reached',
    'next_tier_soon',
    'order_confirmed',
    'payment_ready',
    'payment_paid',
    'shipping_started',
    'shipping_delivered',
    'review_available',
    'refund_updated',
    'support_reply',
    'support_resolved'
  ) THEN
    RAISE EXCEPTION 'invalid_type';
  END IF;

  IF auth.uid() IS NOT NULL
    AND NOT public.is_admin_user(auth.uid())
    AND NOT EXISTS (
      SELECT 1 FROM orders o
      WHERE o.deal_id = p_deal_id AND o.user_id = auth.uid()
    )
  THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  FOR v_participant IN
    SELECT DISTINCT o.user_id
    FROM orders o
    WHERE o.deal_id = p_deal_id
      AND o.order_status NOT IN ('cancelled', 'refunded')
  LOOP
    PERFORM create_notification(
      v_participant.user_id,
      p_type,
      p_title,
      p_message,
      p_link_url,
      p_channel
    );
    v_count := v_count + 1;
  END LOOP;

  RETURN v_count;
END;
$$;
