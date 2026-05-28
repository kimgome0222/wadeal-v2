-- Toss Payments webhook audit log + notification types for webhook events.

CREATE TABLE IF NOT EXISTS webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL DEFAULT 'toss',
  event_type TEXT NOT NULL,
  event_id TEXT,
  payment_key TEXT,
  order_id TEXT,
  raw_payload JSONB NOT NULL,
  processed_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT webhook_logs_status_check CHECK (
    status IN ('pending', 'processed', 'skipped', 'failed')
  )
);

CREATE INDEX IF NOT EXISTS idx_webhook_logs_created_at
  ON webhook_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_webhook_logs_provider_status
  ON webhook_logs(provider, status);

CREATE UNIQUE INDEX IF NOT EXISTS idx_webhook_logs_provider_event_id_processed
  ON webhook_logs(provider, event_id)
  WHERE event_id IS NOT NULL AND status = 'processed';

CREATE UNIQUE INDEX IF NOT EXISTS idx_webhook_logs_provider_payment_event_processed
  ON webhook_logs(provider, payment_key, event_type)
  WHERE payment_key IS NOT NULL AND status = 'processed';

ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS webhook_logs_select_admin ON webhook_logs;
CREATE POLICY webhook_logs_select_admin
  ON webhook_logs FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

-- Extend notification types for webhook-driven alerts.
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE notifications ADD CONSTRAINT notifications_type_check CHECK (
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
    'refund_updated'
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
