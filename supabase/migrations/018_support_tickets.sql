-- Customer support tickets and order cancel/refund request fields.

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS cancel_reason TEXT,
  ADD COLUMN IF NOT EXISTS refund_reason TEXT,
  ADD COLUMN IF NOT EXISTS refund_requested_at TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  product_id TEXT,
  deal_id UUID,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  admin_reply TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  CONSTRAINT support_tickets_type_check CHECK (
    type IN (
      'product',
      'order',
      'payment',
      'shipping',
      'refund',
      'exchange',
      'cancel',
      'account',
      'other'
    )
  ),
  CONSTRAINT support_tickets_status_check CHECK (
    status IN ('open', 'in_progress', 'answered', 'resolved', 'closed')
  )
);

CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_order_id ON support_tickets(order_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_type ON support_tickets(type);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created_at ON support_tickets(created_at DESC);

ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS support_tickets_select_own ON support_tickets;
CREATE POLICY support_tickets_select_own
  ON support_tickets FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS support_tickets_insert_own ON support_tickets;
CREATE POLICY support_tickets_insert_own
  ON support_tickets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS support_tickets_update_own ON support_tickets;
CREATE POLICY support_tickets_update_own
  ON support_tickets FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS support_tickets_select_admin ON support_tickets;
CREATE POLICY support_tickets_select_admin
  ON support_tickets FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

DROP POLICY IF EXISTS support_tickets_update_admin ON support_tickets;
CREATE POLICY support_tickets_update_admin
  ON support_tickets FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

DROP POLICY IF EXISTS orders_update_own ON orders;
CREATE POLICY orders_update_own
  ON orders FOR UPDATE
  USING (auth.uid() = user_id);

ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check;

ALTER TABLE notifications ADD CONSTRAINT notifications_type_check CHECK (
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
    AND NOT EXISTS (
      SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
    ) THEN
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
    AND NOT EXISTS (
      SELECT 1 FROM orders o
      WHERE o.deal_id = p_deal_id AND o.user_id = auth.uid()
    )
    AND NOT EXISTS (
      SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
    ) THEN
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
