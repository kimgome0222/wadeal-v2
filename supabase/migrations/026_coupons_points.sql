-- Coupons, points, and order discount amount columns

-- ---------------------------------------------------------------------------
-- coupons
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL,
  discount_value INTEGER NOT NULL DEFAULT 0,
  min_order_amount INTEGER NOT NULL DEFAULT 0,
  max_discount_amount INTEGER,
  starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ends_at TIMESTAMPTZ,
  usage_limit INTEGER,
  per_user_limit INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT coupons_code_unique UNIQUE (code),
  CONSTRAINT coupons_discount_type_check
    CHECK (discount_type IN ('fixed_amount', 'percentage', 'free_shipping')),
  CONSTRAINT coupons_discount_value_nonneg CHECK (discount_value >= 0),
  CONSTRAINT coupons_min_order_amount_nonneg CHECK (min_order_amount >= 0)
);

CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON coupons(is_active) WHERE is_active = true;

-- ---------------------------------------------------------------------------
-- coupon_usages
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS coupon_usages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE RESTRICT,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  discount_amount INTEGER NOT NULL DEFAULT 0,
  used_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT coupon_usages_order_unique UNIQUE (order_id)
);

CREATE INDEX IF NOT EXISTS idx_coupon_usages_coupon_id ON coupon_usages(coupon_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usages_user_id ON coupon_usages(user_id);

-- ---------------------------------------------------------------------------
-- user_points
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS user_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  balance INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT user_points_user_unique UNIQUE (user_id),
  CONSTRAINT user_points_balance_nonneg CHECK (balance >= 0)
);

CREATE INDEX IF NOT EXISTS idx_user_points_user_id ON user_points(user_id);

-- ---------------------------------------------------------------------------
-- point_transactions
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS point_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  amount INTEGER NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT point_transactions_type_check
    CHECK (type IN ('earn', 'use', 'refund', 'expire', 'adjust'))
);

CREATE INDEX IF NOT EXISTS idx_point_transactions_user_id ON point_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_point_transactions_order_id ON point_transactions(order_id);

-- ---------------------------------------------------------------------------
-- orders / payments discount columns
-- ---------------------------------------------------------------------------

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS coupon_id UUID REFERENCES coupons(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS coupon_code TEXT,
  ADD COLUMN IF NOT EXISTS subtotal_amount INTEGER,
  ADD COLUMN IF NOT EXISTS coupon_discount_amount INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS point_discount_amount INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS point_amount_reserved INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS shipping_fee INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS final_payment_amount INTEGER,
  ADD COLUMN IF NOT EXISTS discount_status TEXT NOT NULL DEFAULT 'none';

ALTER TABLE orders
  DROP CONSTRAINT IF EXISTS orders_discount_status_check;

ALTER TABLE orders
  ADD CONSTRAINT orders_discount_status_check
  CHECK (discount_status IN ('none', 'reserved', 'committed', 'rolled_back'));

ALTER TABLE payments
  ADD COLUMN IF NOT EXISTS subtotal_amount INTEGER,
  ADD COLUMN IF NOT EXISTS coupon_discount_amount INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS point_discount_amount INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS shipping_fee INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS final_payment_amount INTEGER;

-- Backfill subtotal / final_payment from existing rows
UPDATE orders
SET
  subtotal_amount = COALESCE(
    subtotal_amount,
    ROUND(COALESCE(joined_price, 0) * GREATEST(COALESCE(quantity, 1), 1))
  ),
  final_payment_amount = COALESCE(
    final_payment_amount,
    payment_amount,
    ROUND(COALESCE(joined_price, 0) * GREATEST(COALESCE(quantity, 1), 1))
  )
WHERE subtotal_amount IS NULL OR final_payment_amount IS NULL;

UPDATE payments p
SET
  subtotal_amount = COALESCE(p.subtotal_amount, o.subtotal_amount),
  coupon_discount_amount = COALESCE(p.coupon_discount_amount, o.coupon_discount_amount),
  point_discount_amount = COALESCE(p.point_discount_amount, o.point_discount_amount),
  shipping_fee = COALESCE(p.shipping_fee, o.shipping_fee),
  final_payment_amount = COALESCE(p.final_payment_amount, o.final_payment_amount, p.requested_amount)
FROM orders o
WHERE p.order_id = o.id
  AND p.final_payment_amount IS NULL;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_usages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_transactions ENABLE ROW LEVEL SECURITY;

-- Coupons: admin manages; users cannot read coupon table directly (server-only apply)
DROP POLICY IF EXISTS coupons_admin_all ON coupons;
CREATE POLICY coupons_admin_all
  ON coupons FOR ALL
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS coupon_usages_select_own ON coupon_usages;
CREATE POLICY coupon_usages_select_own
  ON coupon_usages FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS user_points_select_own ON user_points;
CREATE POLICY user_points_select_own
  ON user_points FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS point_transactions_select_own ON point_transactions;
CREATE POLICY point_transactions_select_own
  ON point_transactions FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin_user(auth.uid()));

-- Mutations via SECURITY DEFINER RPCs only
REVOKE INSERT, UPDATE, DELETE ON coupons FROM authenticated;
REVOKE INSERT, UPDATE, DELETE ON coupon_usages FROM authenticated;
REVOKE INSERT, UPDATE, DELETE ON user_points FROM authenticated;
REVOKE INSERT, UPDATE, DELETE ON point_transactions FROM authenticated;

-- ---------------------------------------------------------------------------
-- Helper: compute coupon discount amount
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION compute_coupon_discount(
  p_discount_type TEXT,
  p_discount_value INTEGER,
  p_max_discount_amount INTEGER,
  p_subtotal INTEGER,
  p_shipping_fee INTEGER DEFAULT 0
)
RETURNS INTEGER
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  v_discount INTEGER := 0;
BEGIN
  IF p_subtotal < 0 THEN
    RETURN 0;
  END IF;

  CASE p_discount_type
    WHEN 'fixed_amount' THEN
      v_discount := LEAST(p_discount_value, p_subtotal);
    WHEN 'percentage' THEN
      v_discount := ROUND(p_subtotal * p_discount_value / 100.0);
      IF p_max_discount_amount IS NOT NULL THEN
        v_discount := LEAST(v_discount, p_max_discount_amount);
      END IF;
      v_discount := LEAST(v_discount, p_subtotal);
    WHEN 'free_shipping' THEN
      v_discount := 0;
    ELSE
      v_discount := 0;
  END CASE;

  RETURN GREATEST(v_discount, 0);
END;
$$;

-- ---------------------------------------------------------------------------
-- RPC: apply_coupon (validate only, no usage insert)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION apply_coupon(
  p_user_id UUID,
  p_coupon_code TEXT,
  p_subtotal_amount INTEGER,
  p_order_id UUID DEFAULT NULL
)
RETURNS TABLE (
  coupon_id UUID,
  coupon_code TEXT,
  coupon_name TEXT,
  discount_type TEXT,
  discount_amount INTEGER,
  shipping_fee INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_coupon RECORD;
  v_usage_count INTEGER;
  v_user_usage_count INTEGER;
  v_discount INTEGER;
  v_shipping INTEGER := 0;
BEGIN
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'user_required';
  END IF;

  IF p_coupon_code IS NULL OR TRIM(p_coupon_code) = '' THEN
    RAISE EXCEPTION 'coupon_code_required';
  END IF;

  IF p_subtotal_amount IS NULL OR p_subtotal_amount < 0 THEN
    RAISE EXCEPTION 'invalid_subtotal';
  END IF;

  SELECT * INTO v_coupon
  FROM coupons c
  WHERE UPPER(c.code) = UPPER(TRIM(p_coupon_code))
  LIMIT 1;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'coupon_not_found';
  END IF;

  IF NOT v_coupon.is_active THEN
    RAISE EXCEPTION 'coupon_inactive';
  END IF;

  IF v_coupon.starts_at > NOW() THEN
    RAISE EXCEPTION 'coupon_not_started';
  END IF;

  IF v_coupon.ends_at IS NOT NULL AND v_coupon.ends_at < NOW() THEN
    RAISE EXCEPTION 'coupon_expired';
  END IF;

  IF p_subtotal_amount < v_coupon.min_order_amount THEN
    RAISE EXCEPTION 'min_order_not_met';
  END IF;

  SELECT COUNT(*) INTO v_usage_count
  FROM coupon_usages cu
  WHERE cu.coupon_id = v_coupon.id;

  IF v_coupon.usage_limit IS NOT NULL AND v_usage_count >= v_coupon.usage_limit THEN
    RAISE EXCEPTION 'usage_limit_exceeded';
  END IF;

  SELECT COUNT(*) INTO v_user_usage_count
  FROM coupon_usages cu
  WHERE cu.coupon_id = v_coupon.id AND cu.user_id = p_user_id;

  IF v_coupon.per_user_limit IS NOT NULL AND v_user_usage_count >= v_coupon.per_user_limit THEN
    RAISE EXCEPTION 'per_user_limit_exceeded';
  END IF;

  -- Reserved on another pending order?
  IF p_order_id IS NOT NULL THEN
    IF EXISTS (
      SELECT 1 FROM orders o
      WHERE o.coupon_id = v_coupon.id
        AND o.user_id = p_user_id
        AND o.id <> p_order_id
        AND o.discount_status = 'reserved'
        AND o.order_status NOT IN ('cancelled', 'refunded')
    ) THEN
      RAISE EXCEPTION 'coupon_already_reserved';
    END IF;
  END IF;

  v_discount := compute_coupon_discount(
    v_coupon.discount_type,
    v_coupon.discount_value,
    v_coupon.max_discount_amount,
    p_subtotal_amount,
    0
  );

  IF v_coupon.discount_type = 'free_shipping' THEN
    v_shipping := 0;
  END IF;

  RETURN QUERY SELECT
    v_coupon.id,
    v_coupon.code,
    v_coupon.name,
    v_coupon.discount_type,
    v_discount,
    v_shipping;
END;
$$;

-- ---------------------------------------------------------------------------
-- RPC: reserve_points
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION reserve_points(
  p_user_id UUID,
  p_amount INTEGER,
  p_order_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_balance INTEGER;
BEGIN
  IF p_user_id IS NULL OR p_order_id IS NULL THEN
    RAISE EXCEPTION 'invalid_input';
  END IF;

  IF p_amount IS NULL OR p_amount <= 0 THEN
    RETURN TRUE;
  END IF;

  INSERT INTO user_points (user_id, balance)
  VALUES (p_user_id, 0)
  ON CONFLICT (user_id) DO NOTHING;

  SELECT balance INTO v_balance
  FROM user_points
  WHERE user_id = p_user_id
  FOR UPDATE;

  IF v_balance < p_amount THEN
    RAISE EXCEPTION 'insufficient_points';
  END IF;

  UPDATE user_points
  SET balance = balance - p_amount, updated_at = NOW()
  WHERE user_id = p_user_id;

  INSERT INTO point_transactions (user_id, order_id, type, amount, reason)
  VALUES (p_user_id, p_order_id, 'use', p_amount, 'order_reserve');

  RETURN TRUE;
END;
$$;

-- ---------------------------------------------------------------------------
-- RPC: commit_discounts
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION commit_discounts(p_order_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order RECORD;
BEGIN
  SELECT
    o.id,
    o.user_id,
    o.coupon_id,
    o.coupon_discount_amount,
    o.point_discount_amount,
    o.discount_status
  INTO v_order
  FROM orders o
  WHERE o.id = p_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'order_not_found';
  END IF;

  IF v_order.discount_status = 'committed' THEN
    RETURN TRUE;
  END IF;

  IF v_order.coupon_id IS NOT NULL AND v_order.coupon_discount_amount > 0 THEN
    IF NOT EXISTS (SELECT 1 FROM coupon_usages WHERE order_id = p_order_id) THEN
      INSERT INTO coupon_usages (coupon_id, user_id, order_id, discount_amount)
      VALUES (
        v_order.coupon_id,
        v_order.user_id,
        p_order_id,
        v_order.coupon_discount_amount
      );
    END IF;
  END IF;

  UPDATE orders
  SET discount_status = 'committed'
  WHERE id = p_order_id;

  RETURN TRUE;
END;
$$;

-- ---------------------------------------------------------------------------
-- RPC: rollback_discounts
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION rollback_discounts(p_order_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order RECORD;
  v_refund_amount INTEGER;
BEGIN
  SELECT
    o.id,
    o.user_id,
    o.point_amount_reserved,
    o.discount_status
  INTO v_order
  FROM orders o
  WHERE o.id = p_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'order_not_found';
  END IF;

  IF v_order.discount_status IN ('rolled_back', 'none') THEN
    RETURN TRUE;
  END IF;

  IF v_order.discount_status = 'committed' THEN
    -- Refund points if committed
    SELECT COALESCE(SUM(amount), 0) INTO v_refund_amount
    FROM point_transactions
    WHERE order_id = p_order_id AND type = 'use';

    IF v_refund_amount > 0 THEN
      INSERT INTO user_points (user_id, balance)
      VALUES (v_order.user_id, 0)
      ON CONFLICT (user_id) DO NOTHING;

      UPDATE user_points
      SET balance = balance + v_refund_amount, updated_at = NOW()
      WHERE user_id = v_order.user_id;

      INSERT INTO point_transactions (user_id, order_id, type, amount, reason)
      VALUES (v_order.user_id, p_order_id, 'refund', v_refund_amount, 'order_rollback');
    END IF;

    DELETE FROM coupon_usages WHERE order_id = p_order_id;
  ELSIF v_order.discount_status = 'reserved' THEN
    v_refund_amount := v_order.point_amount_reserved;

    IF v_refund_amount > 0 THEN
      INSERT INTO user_points (user_id, balance)
      VALUES (v_order.user_id, 0)
      ON CONFLICT (user_id) DO NOTHING;

      UPDATE user_points
      SET balance = balance + v_refund_amount, updated_at = NOW()
      WHERE user_id = v_order.user_id;

      INSERT INTO point_transactions (user_id, order_id, type, amount, reason)
      VALUES (v_order.user_id, p_order_id, 'refund', v_refund_amount, 'order_rollback');
    END IF;
  END IF;

  UPDATE orders
  SET
    coupon_id = NULL,
    coupon_code = NULL,
    coupon_discount_amount = 0,
    point_discount_amount = 0,
    point_amount_reserved = 0,
    discount_status = 'rolled_back'
  WHERE id = p_order_id;

  RETURN TRUE;
END;
$$;

-- ---------------------------------------------------------------------------
-- RPC: admin upsert coupon
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION admin_upsert_coupon(
  p_id UUID,
  p_code TEXT,
  p_name TEXT,
  p_description TEXT,
  p_discount_type TEXT,
  p_discount_value INTEGER,
  p_min_order_amount INTEGER,
  p_max_discount_amount INTEGER,
  p_starts_at TIMESTAMPTZ,
  p_ends_at TIMESTAMPTZ,
  p_usage_limit INTEGER,
  p_per_user_limit INTEGER,
  p_is_active BOOLEAN
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  IF NOT public.is_admin_user(auth.uid()) THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  IF p_id IS NULL THEN
    INSERT INTO coupons (
      code, name, description, discount_type, discount_value,
      min_order_amount, max_discount_amount, starts_at, ends_at,
      usage_limit, per_user_limit, is_active
    ) VALUES (
      UPPER(TRIM(p_code)), p_name, p_description, p_discount_type, p_discount_value,
      COALESCE(p_min_order_amount, 0), p_max_discount_amount, p_starts_at, p_ends_at,
      p_usage_limit, COALESCE(p_per_user_limit, 1), COALESCE(p_is_active, true)
    )
    RETURNING id INTO v_id;
  ELSE
    UPDATE coupons SET
      code = UPPER(TRIM(p_code)),
      name = p_name,
      description = p_description,
      discount_type = p_discount_type,
      discount_value = p_discount_value,
      min_order_amount = COALESCE(p_min_order_amount, 0),
      max_discount_amount = p_max_discount_amount,
      starts_at = p_starts_at,
      ends_at = p_ends_at,
      usage_limit = p_usage_limit,
      per_user_limit = COALESCE(p_per_user_limit, 1),
      is_active = COALESCE(p_is_active, true),
      updated_at = NOW()
    WHERE id = p_id
    RETURNING id INTO v_id;
  END IF;

  RETURN v_id;
END;
$$;

-- ---------------------------------------------------------------------------
-- Update payment RPCs to use final_payment_amount
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
    o.coupon_discount_amount,
    o.point_discount_amount,
    o.shipping_fee,
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

  v_line_total := COALESCE(
    v_order.final_payment_amount,
    GREATEST(
      COALESCE(v_order.subtotal_amount, ROUND(COALESCE(v_order.joined_price, 0) * GREATEST(COALESCE(v_order.quantity, 1), 1)))
        - COALESCE(v_order.coupon_discount_amount, 0)
        - COALESCE(v_order.point_discount_amount, 0)
        + COALESCE(v_order.shipping_fee, 0),
      0
    )
  );

  IF EXISTS (SELECT 1 FROM payments p WHERE p.order_id = p_order_id) THEN
    SELECT id INTO v_payment_id FROM payments WHERE order_id = p_order_id;
    UPDATE payments
    SET
      method = COALESCE(p_method, v_order.payment_method, method),
      payment_flow = COALESCE(v_order.payment_flow, payment_flow),
      subtotal_amount = v_order.subtotal_amount,
      coupon_discount_amount = COALESCE(v_order.coupon_discount_amount, 0),
      point_discount_amount = COALESCE(v_order.point_discount_amount, 0),
      shipping_fee = COALESCE(v_order.shipping_fee, 0),
      final_payment_amount = v_line_total,
      amount = v_line_total,
      requested_amount = v_line_total,
      updated_at = NOW()
    WHERE id = v_payment_id;
    RETURN v_payment_id;
  END IF;

  INSERT INTO payments (
    order_id,
    user_id,
    deal_id,
    product_id,
    amount,
    requested_amount,
    status,
    method,
    payment_flow,
    subtotal_amount,
    coupon_discount_amount,
    point_discount_amount,
    shipping_fee,
    final_payment_amount
  ) VALUES (
    v_order.id,
    v_order.user_id,
    v_order.deal_id,
    v_order.product_id,
    v_line_total,
    v_line_total,
    'ready',
    COALESCE(p_method, v_order.payment_method),
    v_order.payment_flow,
    v_order.subtotal_amount,
    COALESCE(v_order.coupon_discount_amount, 0),
    COALESCE(v_order.point_discount_amount, 0),
    COALESCE(v_order.shipping_fee, 0),
    v_line_total
  )
  RETURNING id INTO v_payment_id;

  UPDATE orders
  SET payment_status = 'ready', payment_amount = v_line_total
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
  v_flow TEXT;
  v_order RECORD;
  v_final INTEGER;
BEGIN
  SELECT
    o.payment_flow,
    o.coupon_discount_amount,
    o.point_discount_amount,
    o.shipping_fee,
    o.subtotal_amount
  INTO v_order
  FROM orders o
  WHERE o.id = p_order_id;

  IF p_final_amount IS NULL OR p_final_amount < 0 THEN
    RAISE EXCEPTION 'invalid_amount';
  END IF;

  v_flow := v_order.payment_flow;

  v_final := GREATEST(
    p_final_amount
      - COALESCE(v_order.coupon_discount_amount, 0)
      - COALESCE(v_order.point_discount_amount, 0)
      + COALESCE(v_order.shipping_fee, 0),
    0
  );

  SELECT id INTO v_payment_id FROM payments WHERE order_id = p_order_id;

  IF NOT FOUND THEN
    PERFORM create_pending_payment_for_order(p_order_id);
    SELECT id INTO v_payment_id FROM payments WHERE order_id = p_order_id;
  END IF;

  UPDATE payments
  SET
    subtotal_amount = p_final_amount,
    requested_amount = v_final,
    amount = v_final,
    final_payment_amount = v_final,
    status = 'ready',
    payment_flow = COALESCE(v_flow, payment_flow),
    updated_at = NOW()
  WHERE id = v_payment_id;

  UPDATE orders
  SET
    subtotal_amount = p_final_amount,
    final_payment_amount = v_final,
    payment_amount = v_final,
    payment_status = 'ready'
  WHERE id = p_order_id;

  RETURN TRUE;
END;
$$;

-- Grants
REVOKE ALL ON FUNCTION apply_coupon(UUID, TEXT, INTEGER, UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION reserve_points(UUID, INTEGER, UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION commit_discounts(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION rollback_discounts(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION admin_upsert_coupon(UUID, TEXT, TEXT, TEXT, TEXT, INTEGER, INTEGER, INTEGER, TIMESTAMPTZ, TIMESTAMPTZ, INTEGER, INTEGER, BOOLEAN) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION apply_coupon(UUID, TEXT, INTEGER, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION reserve_points(UUID, INTEGER, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION commit_discounts(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION rollback_discounts(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION admin_upsert_coupon(UUID, TEXT, TEXT, TEXT, TEXT, INTEGER, INTEGER, INTEGER, TIMESTAMPTZ, TIMESTAMPTZ, INTEGER, INTEGER, BOOLEAN) TO authenticated;
