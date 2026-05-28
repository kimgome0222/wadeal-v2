-- In-app notifications for group-buy lifecycle events.

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link_url TEXT,
  channel TEXT NOT NULL DEFAULT 'in_app',
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT notifications_type_check CHECK (
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
      'refund_updated'
    )
  ),
  CONSTRAINT notifications_channel_check CHECK (
    channel IN ('in_app', 'kakao', 'email', 'push')
  )
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_created_at
  ON notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread
  ON notifications(user_id)
  WHERE read_at IS NULL;

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS notifications_select_own ON notifications;
CREATE POLICY notifications_select_own
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS notifications_update_own ON notifications;
CREATE POLICY notifications_update_own
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Inserts go through SECURITY DEFINER RPCs.

CREATE OR REPLACE FUNCTION _insert_notification(
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
    'refund_updated'
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

  RETURN _insert_notification(
    p_user_id,
    p_type,
    p_title,
    p_message,
    p_link_url,
    p_channel
  );
END;
$$;

CREATE OR REPLACE FUNCTION mark_notification_read(p_notification_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT user_id INTO v_user_id
  FROM notifications
  WHERE id = p_notification_id;

  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  IF auth.uid() IS NULL OR auth.uid() <> v_user_id THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  UPDATE notifications
  SET read_at = COALESCE(read_at, NOW())
  WHERE id = p_notification_id;

  RETURN TRUE;
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
    'refund_updated'
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
    PERFORM _insert_notification(
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

REVOKE ALL ON FUNCTION _insert_notification(UUID, TEXT, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION create_notification(UUID, TEXT, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION mark_notification_read(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION notify_deal_participants(UUID, TEXT, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION create_notification(UUID, TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION mark_notification_read(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION notify_deal_participants(UUID, TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated;
