-- Product type + checkout payment method selection

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS product_type TEXT NOT NULL DEFAULT 'groupbuy';

ALTER TABLE products
  DROP CONSTRAINT IF EXISTS products_product_type_check;

ALTER TABLE products
  ADD CONSTRAINT products_product_type_check
  CHECK (product_type IN ('normal', 'groupbuy'));

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS payment_method TEXT,
  ADD COLUMN IF NOT EXISTS product_type TEXT;

ALTER TABLE orders
  DROP CONSTRAINT IF EXISTS orders_payment_method_check;

ALTER TABLE orders
  ADD CONSTRAINT orders_payment_method_check
  CHECK (
    payment_method IS NULL
    OR payment_method IN ('card', 'kakaopay', 'tosspay', 'naverpay', 'phone', 'virtual_account')
  );

ALTER TABLE orders
  DROP CONSTRAINT IF EXISTS orders_product_type_check;

ALTER TABLE orders
  ADD CONSTRAINT orders_product_type_check
  CHECK (product_type IS NULL OR product_type IN ('normal', 'groupbuy'));

ALTER TABLE payments
  DROP CONSTRAINT IF EXISTS payments_method_check;

ALTER TABLE payments
  ADD CONSTRAINT payments_method_check
  CHECK (
    method IS NULL
    OR method IN ('card', 'kakaopay', 'tosspay', 'naverpay', 'phone', 'virtual_account')
  );

-- Extend payment status lifecycle (orders + payments RPC)
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
  IF p_status NOT IN ('ready', 'waiting_deposit', 'authorized', 'paid', 'failed', 'cancelled', 'refunded') THEN
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

CREATE OR REPLACE FUNCTION create_pending_payment_for_order(
  p_order_id UUID,
  p_method TEXT DEFAULT NULL
)
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
    o.payment_status,
    o.payment_method
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
    IF p_method IS NOT NULL OR v_order.payment_method IS NOT NULL THEN
      UPDATE payments
      SET method = COALESCE(p_method, v_order.payment_method, method),
          updated_at = NOW()
      WHERE id = v_payment_id;
    END IF;
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
    status,
    method
  ) VALUES (
    v_order.id,
    v_order.user_id,
    v_order.deal_id,
    v_order.product_id,
    v_line_total,
    v_line_total,
    'ready',
    COALESCE(p_method, v_order.payment_method)
  )
  RETURNING id INTO v_payment_id;

  UPDATE orders
  SET payment_status = 'ready'
  WHERE id = p_order_id;

  RETURN v_payment_id;
END;
$$;

REVOKE ALL ON FUNCTION create_pending_payment_for_order(UUID, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION create_pending_payment_for_order(UUID, TEXT) TO authenticated;
