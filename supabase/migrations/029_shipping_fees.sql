-- Product shipping rules, order amount breakdown, payment RPC alignment

-- ---------------------------------------------------------------------------
-- products: shipping configuration
-- ---------------------------------------------------------------------------

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS shipping_fee INTEGER NOT NULL DEFAULT 3000 CHECK (shipping_fee >= 0),
  ADD COLUMN IF NOT EXISTS free_shipping_threshold INTEGER CHECK (
    free_shipping_threshold IS NULL OR free_shipping_threshold >= 0
  ),
  ADD COLUMN IF NOT EXISTS shipping_type TEXT NOT NULL DEFAULT 'paid',
  ADD COLUMN IF NOT EXISTS is_free_shipping BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS remote_area_extra_fee INTEGER NOT NULL DEFAULT 3000 CHECK (
    remote_area_extra_fee >= 0
  );

ALTER TABLE products DROP CONSTRAINT IF EXISTS products_shipping_type_check;
ALTER TABLE products
  ADD CONSTRAINT products_shipping_type_check
  CHECK (shipping_type IN ('paid', 'free', 'conditional_free'));

UPDATE products
SET
  shipping_type = 'free',
  is_free_shipping = TRUE,
  shipping_fee = 0
WHERE is_free_shipping = TRUE AND shipping_type = 'paid';

-- ---------------------------------------------------------------------------
-- orders: amount breakdown (shipping_fee exists from 028)
-- ---------------------------------------------------------------------------

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS remote_area_extra_fee INTEGER NOT NULL DEFAULT 0 CHECK (
    remote_area_extra_fee >= 0
  ),
  ADD COLUMN IF NOT EXISTS subtotal_amount INTEGER CHECK (
    subtotal_amount IS NULL OR subtotal_amount >= 0
  ),
  ADD COLUMN IF NOT EXISTS final_payment_amount INTEGER CHECK (
    final_payment_amount IS NULL OR final_payment_amount >= 0
  );

-- Backfill subtotal from joined_price × quantity
UPDATE orders o
SET subtotal_amount = ROUND(
  COALESCE(o.joined_price, 0) * GREATEST(COALESCE(o.quantity, 1), 1)
)
WHERE o.subtotal_amount IS NULL;

UPDATE orders o
SET final_payment_amount = COALESCE(
  o.payment_amount,
  ROUND(COALESCE(o.joined_price, 0) * GREATEST(COALESCE(o.quantity, 1), 1))
    + COALESCE(o.shipping_fee, 0)
    + COALESCE(o.remote_area_extra_fee, 0)
)
WHERE o.final_payment_amount IS NULL;

-- ---------------------------------------------------------------------------
-- Payment RPCs: use final_payment_amount when present
-- ---------------------------------------------------------------------------

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
  v_subtotal INTEGER;
BEGIN
  SELECT
    o.id,
    o.user_id,
    o.deal_id,
    o.product_id,
    o.joined_price,
    o.quantity,
    o.payment_status,
    o.payment_method,
    o.payment_flow,
    o.subtotal_amount,
    o.shipping_fee,
    o.remote_area_extra_fee,
    o.final_payment_amount
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
          payment_flow = COALESCE(v_order.payment_flow, payment_flow),
          updated_at = NOW()
      WHERE id = v_payment_id;
    END IF;
    RETURN v_payment_id;
  END IF;

  v_subtotal := ROUND(
    COALESCE(
      v_order.subtotal_amount,
      COALESCE(v_order.joined_price, 0) * GREATEST(COALESCE(v_order.quantity, 1), 1)
    )
  );

  v_line_total := COALESCE(
    v_order.final_payment_amount,
    v_subtotal
      + COALESCE(v_order.shipping_fee, 0)
      + COALESCE(v_order.remote_area_extra_fee, 0)
  );

  INSERT INTO payments (
    order_id,
    user_id,
    deal_id,
    product_id,
    amount,
    requested_amount,
    status,
    method,
    payment_flow
  ) VALUES (
    v_order.id,
    v_order.user_id,
    v_order.deal_id,
    v_order.product_id,
    v_line_total,
    v_line_total,
    'ready',
    COALESCE(p_method, v_order.payment_method),
    v_order.payment_flow
  )
  RETURNING id INTO v_payment_id;

  UPDATE orders
  SET payment_status = 'ready',
      payment_amount = v_line_total,
      final_payment_amount = COALESCE(final_payment_amount, v_line_total)
  WHERE id = p_order_id;

  RETURN v_payment_id;
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
  v_amount INTEGER;
BEGIN
  IF p_final_amount IS NULL OR p_final_amount < 0 THEN
    RAISE EXCEPTION 'invalid_amount';
  END IF;

  v_amount := ROUND(p_final_amount);

  SELECT id INTO v_payment_id FROM payments WHERE order_id = p_order_id;

  IF NOT FOUND THEN
    PERFORM create_pending_payment_for_order(p_order_id);
    SELECT id INTO v_payment_id FROM payments WHERE order_id = p_order_id;
  END IF;

  UPDATE payments
  SET
    requested_amount = v_amount,
    amount = v_amount,
    status = 'ready',
    updated_at = NOW()
  WHERE id = v_payment_id;

  UPDATE orders
  SET payment_status = 'ready',
      payment_amount = v_amount,
      final_payment_amount = v_amount
  WHERE id = p_order_id;

  RETURN TRUE;
END;
$$;

REVOKE ALL ON FUNCTION create_pending_payment_for_order(UUID, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION prepare_payment_after_finalize(UUID, INTEGER) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION create_pending_payment_for_order(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION prepare_payment_after_finalize(UUID, INTEGER) TO authenticated;
