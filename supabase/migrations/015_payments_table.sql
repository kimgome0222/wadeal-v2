-- Payment preparation records for group-buy orders (PG integration pending).

-- Align orders.payment_status with payment record lifecycle.
UPDATE orders SET payment_status = 'ready'
WHERE payment_status IN ('pending', '결제대기');

ALTER TABLE orders
  ALTER COLUMN payment_status SET DEFAULT 'ready';

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES group_buy_deals(id) ON DELETE SET NULL,
  product_id TEXT NOT NULL,
  payment_provider TEXT,
  payment_key TEXT,
  amount INTEGER NOT NULL DEFAULT 0,
  requested_amount INTEGER NOT NULL,
  confirmed_amount INTEGER,
  status TEXT NOT NULL DEFAULT 'ready',
  method TEXT,
  approved_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  raw_response JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_deal_id ON payments(deal_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS payments_select_own ON payments;
CREATE POLICY payments_select_own
  ON payments FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS payments_select_admin ON payments;
CREATE POLICY payments_select_admin
  ON payments FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

DROP POLICY IF EXISTS payments_update_admin ON payments;
CREATE POLICY payments_update_admin
  ON payments FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

-- Mutations go through SECURITY DEFINER RPCs so clients cannot set amounts/status directly.

CREATE OR REPLACE FUNCTION create_pending_payment_for_order(p_order_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order RECORD;
  v_payment_id UUID;
  v_line_total INTEGER;
BEGIN
  SELECT
    o.id,
    o.user_id,
    o.deal_id,
    o.product_id,
    o.joined_price,
    o.quantity,
    o.payment_status
  INTO v_order
  FROM orders o
  WHERE o.id = p_order_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'order_not_found';
  END IF;

  IF auth.uid() IS NOT NULL AND auth.uid() <> v_order.user_id THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  IF EXISTS (SELECT 1 FROM payments p WHERE p.order_id = p_order_id) THEN
    SELECT id INTO v_payment_id FROM payments WHERE order_id = p_order_id;
    RETURN v_payment_id;
  END IF;

  v_line_total := ROUND(COALESCE(v_order.joined_price, 0) * GREATEST(COALESCE(v_order.quantity, 1), 1));

  INSERT INTO payments (
    order_id,
    user_id,
    deal_id,
    product_id,
    amount,
    requested_amount,
    status
  ) VALUES (
    v_order.id,
    v_order.user_id,
    v_order.deal_id,
    v_order.product_id,
    v_line_total,
    v_line_total,
    'ready'
  )
  RETURNING id INTO v_payment_id;

  UPDATE orders
  SET payment_status = 'ready'
  WHERE id = p_order_id;

  RETURN v_payment_id;
END;
$$;

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

  SELECT p.id, p.order_id, p.user_id
  INTO v_payment
  FROM payments p
  WHERE p.id = p_payment_id;

  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  IF auth.uid() IS NOT NULL
    AND auth.uid() <> v_payment.user_id
    AND NOT EXISTS (
      SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
    ) THEN
    RAISE EXCEPTION 'forbidden';
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

CREATE OR REPLACE FUNCTION prepare_payment_after_finalize(
  p_order_id UUID,
  p_final_amount INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_payment_id UUID;
BEGIN
  IF p_final_amount IS NULL OR p_final_amount < 0 THEN
    RAISE EXCEPTION 'invalid_amount';
  END IF;

  SELECT id INTO v_payment_id FROM payments WHERE order_id = p_order_id;

  IF NOT FOUND THEN
    PERFORM create_pending_payment_for_order(p_order_id);
    SELECT id INTO v_payment_id FROM payments WHERE order_id = p_order_id;
  END IF;

  UPDATE payments
  SET
    requested_amount = p_final_amount,
    amount = p_final_amount,
    status = 'ready',
    updated_at = NOW()
  WHERE id = v_payment_id;

  UPDATE orders
  SET payment_status = 'ready'
  WHERE id = p_order_id;

  RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION sync_order_payment_status(p_order_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_status TEXT;
BEGIN
  SELECT status INTO v_status
  FROM payments
  WHERE order_id = p_order_id
  ORDER BY created_at DESC
  LIMIT 1;

  IF v_status IS NULL THEN
    RETURN NULL;
  END IF;

  UPDATE orders
  SET payment_status = v_status
  WHERE id = p_order_id;

  RETURN v_status;
END;
$$;

REVOKE ALL ON FUNCTION create_pending_payment_for_order(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION update_payment_status(UUID, TEXT, INTEGER, TEXT, TEXT, TEXT, JSONB) FROM PUBLIC;
REVOKE ALL ON FUNCTION prepare_payment_after_finalize(UUID, INTEGER) FROM PUBLIC;
REVOKE ALL ON FUNCTION sync_order_payment_status(UUID) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION create_pending_payment_for_order(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION update_payment_status(UUID, TEXT, INTEGER, TEXT, TEXT, TEXT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION prepare_payment_after_finalize(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION sync_order_payment_status(UUID) TO authenticated;
