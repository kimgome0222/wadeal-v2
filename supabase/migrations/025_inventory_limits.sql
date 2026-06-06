-- Product inventory, purchase limits, and atomic reservation RPCs

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS stock_quantity INTEGER CHECK (stock_quantity IS NULL OR stock_quantity >= 0),
  ADD COLUMN IF NOT EXISTS sold_quantity INTEGER NOT NULL DEFAULT 0 CHECK (sold_quantity >= 0),
  ADD COLUMN IF NOT EXISTS min_order_quantity INTEGER NOT NULL DEFAULT 1 CHECK (min_order_quantity >= 1),
  ADD COLUMN IF NOT EXISTS max_order_quantity INTEGER NOT NULL DEFAULT 99 CHECK (max_order_quantity >= 1),
  ADD COLUMN IF NOT EXISTS per_user_limit INTEGER CHECK (per_user_limit IS NULL OR per_user_limit >= 1),
  ADD COLUMN IF NOT EXISTS is_sold_out BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS sold_out_at TIMESTAMPTZ;

ALTER TABLE group_buy_deals
  ADD COLUMN IF NOT EXISTS target_quantity INTEGER CHECK (target_quantity IS NULL OR target_quantity > 0),
  ADD COLUMN IF NOT EXISTS current_quantity INTEGER NOT NULL DEFAULT 0 CHECK (current_quantity >= 0),
  ADD COLUMN IF NOT EXISTS max_quantity INTEGER CHECK (max_quantity IS NULL OR max_quantity > 0);

-- Ensure max_order_quantity >= min_order_quantity when both set
ALTER TABLE products
  DROP CONSTRAINT IF EXISTS products_order_quantity_range_check;

ALTER TABLE products
  ADD CONSTRAINT products_order_quantity_range_check
  CHECK (max_order_quantity >= min_order_quantity);

CREATE OR REPLACE FUNCTION reserve_stock(
  p_product_slug TEXT,
  p_quantity INTEGER,
  p_user_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_product products%ROWTYPE;
  v_remaining INTEGER;
  v_new_sold INTEGER;
  v_user_qty INTEGER;
BEGIN
  IF p_quantity IS NULL OR p_quantity < 1 THEN
    RETURN jsonb_build_object('success', false, 'error', 'invalid_quantity');
  END IF;

  SELECT * INTO v_product
  FROM products
  WHERE slug = p_product_slug
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'product_not_found');
  END IF;

  IF v_product.is_sold_out THEN
    RETURN jsonb_build_object('success', false, 'error', 'sold_out');
  END IF;

  IF p_quantity < v_product.min_order_quantity OR p_quantity > v_product.max_order_quantity THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'quantity_out_of_range',
      'min', v_product.min_order_quantity,
      'max', v_product.max_order_quantity
    );
  END IF;

  IF v_product.per_user_limit IS NOT NULL AND p_user_id IS NOT NULL THEN
    SELECT COALESCE(SUM(o.quantity), 0) INTO v_user_qty
    FROM orders o
    WHERE o.user_id = p_user_id
      AND o.product_id = p_product_slug
      AND COALESCE(o.order_status, 'joined') NOT IN ('cancelled', 'refunded');

    IF v_user_qty + p_quantity > v_product.per_user_limit THEN
      RETURN jsonb_build_object(
        'success', false,
        'error', 'per_user_limit_exceeded',
        'limit', v_product.per_user_limit,
        'existing', v_user_qty
      );
    END IF;
  END IF;

  IF v_product.stock_quantity IS NOT NULL THEN
    v_remaining := v_product.stock_quantity - v_product.sold_quantity;
    IF v_remaining < p_quantity THEN
      RETURN jsonb_build_object(
        'success', false,
        'error', 'insufficient_stock',
        'remaining', GREATEST(v_remaining, 0)
      );
    END IF;
  END IF;

  v_new_sold := v_product.sold_quantity + p_quantity;

  UPDATE products
  SET
    sold_quantity = v_new_sold,
    is_sold_out = CASE
      WHEN stock_quantity IS NOT NULL AND v_new_sold >= stock_quantity THEN TRUE
      ELSE is_sold_out
    END,
    sold_out_at = CASE
      WHEN stock_quantity IS NOT NULL
        AND v_new_sold >= stock_quantity
        AND sold_out_at IS NULL
      THEN NOW()
      ELSE sold_out_at
    END
  WHERE slug = p_product_slug;

  RETURN jsonb_build_object('success', true, 'sold_quantity', v_new_sold);
END;
$$;

CREATE OR REPLACE FUNCTION release_stock(p_product_slug TEXT, p_quantity INTEGER)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_product products%ROWTYPE;
  v_new_sold INTEGER;
BEGIN
  IF p_quantity IS NULL OR p_quantity < 1 THEN
    RETURN jsonb_build_object('success', false, 'error', 'invalid_quantity');
  END IF;

  SELECT * INTO v_product
  FROM products
  WHERE slug = p_product_slug
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'product_not_found');
  END IF;

  v_new_sold := GREATEST(0, v_product.sold_quantity - p_quantity);

  UPDATE products
  SET
    sold_quantity = v_new_sold,
    is_sold_out = CASE
      WHEN stock_quantity IS NOT NULL AND v_new_sold < stock_quantity THEN FALSE
      ELSE is_sold_out
    END,
    sold_out_at = CASE
      WHEN stock_quantity IS NOT NULL AND v_new_sold < stock_quantity THEN NULL
      ELSE sold_out_at
    END
  WHERE slug = p_product_slug;

  RETURN jsonb_build_object('success', true, 'sold_quantity', v_new_sold);
END;
$$;

CREATE OR REPLACE FUNCTION reserve_groupbuy_quantity(
  p_deal_id UUID,
  p_product_slug TEXT,
  p_quantity INTEGER,
  p_user_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_deal group_buy_deals%ROWTYPE;
  v_product products%ROWTYPE;
  v_cap INTEGER;
  v_remaining INTEGER;
  v_user_qty INTEGER;
  v_new_current INTEGER;
BEGIN
  IF p_quantity IS NULL OR p_quantity < 1 THEN
    RETURN jsonb_build_object('success', false, 'error', 'invalid_quantity');
  END IF;

  SELECT * INTO v_product
  FROM products
  WHERE slug = p_product_slug
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'product_not_found');
  END IF;

  IF v_product.is_sold_out THEN
    RETURN jsonb_build_object('success', false, 'error', 'sold_out');
  END IF;

  IF p_quantity < v_product.min_order_quantity OR p_quantity > v_product.max_order_quantity THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'quantity_out_of_range',
      'min', v_product.min_order_quantity,
      'max', v_product.max_order_quantity
    );
  END IF;

  IF v_product.per_user_limit IS NOT NULL THEN
    SELECT COALESCE(SUM(o.quantity), 0) INTO v_user_qty
    FROM orders o
    WHERE o.user_id = p_user_id
      AND o.product_id = p_product_slug
      AND COALESCE(o.order_status, 'joined') NOT IN ('cancelled', 'refunded');

    IF v_user_qty + p_quantity > v_product.per_user_limit THEN
      RETURN jsonb_build_object(
        'success', false,
        'error', 'per_user_limit_exceeded',
        'limit', v_product.per_user_limit,
        'existing', v_user_qty
      );
    END IF;
  END IF;

  SELECT * INTO v_deal
  FROM group_buy_deals
  WHERE id = p_deal_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'deal_not_found');
  END IF;

  v_cap := COALESCE(v_deal.max_quantity, v_deal.target_quantity);
  IF v_cap IS NOT NULL THEN
    v_remaining := v_cap - v_deal.current_quantity;
    IF v_remaining < p_quantity THEN
      RETURN jsonb_build_object(
        'success', false,
        'error', 'insufficient_capacity',
        'remaining', GREATEST(v_remaining, 0)
      );
    END IF;
  END IF;

  v_new_current := v_deal.current_quantity + p_quantity;

  UPDATE group_buy_deals
  SET current_quantity = v_new_current
  WHERE id = p_deal_id;

  IF v_cap IS NOT NULL AND v_new_current >= v_cap THEN
    UPDATE products
    SET is_sold_out = TRUE, sold_out_at = COALESCE(sold_out_at, NOW())
    WHERE slug = p_product_slug;
  END IF;

  RETURN jsonb_build_object('success', true, 'current_quantity', v_new_current);
END;
$$;

CREATE OR REPLACE FUNCTION release_groupbuy_quantity(
  p_deal_id UUID,
  p_product_slug TEXT,
  p_quantity INTEGER
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_deal group_buy_deals%ROWTYPE;
  v_product products%ROWTYPE;
  v_cap INTEGER;
  v_new_current INTEGER;
BEGIN
  IF p_quantity IS NULL OR p_quantity < 1 THEN
    RETURN jsonb_build_object('success', false, 'error', 'invalid_quantity');
  END IF;

  SELECT * INTO v_deal
  FROM group_buy_deals
  WHERE id = p_deal_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'deal_not_found');
  END IF;

  v_new_current := GREATEST(0, v_deal.current_quantity - p_quantity);

  UPDATE group_buy_deals
  SET current_quantity = v_new_current
  WHERE id = p_deal_id;

  SELECT * INTO v_product
  FROM products
  WHERE slug = p_product_slug
  FOR UPDATE;

  IF FOUND THEN
    v_cap := COALESCE(
      (SELECT COALESCE(max_quantity, target_quantity) FROM group_buy_deals WHERE id = p_deal_id),
      NULL
    );
    IF v_cap IS NOT NULL AND v_new_current < v_cap AND v_product.is_sold_out THEN
      UPDATE products
      SET is_sold_out = FALSE, sold_out_at = NULL
      WHERE slug = p_product_slug;
    END IF;
  END IF;

  RETURN jsonb_build_object('success', true, 'current_quantity', v_new_current);
END;
$$;

GRANT EXECUTE ON FUNCTION reserve_stock(TEXT, INTEGER, UUID) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION release_stock(TEXT, INTEGER) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION reserve_groupbuy_quantity(UUID, TEXT, INTEGER, UUID) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION release_groupbuy_quantity(UUID, TEXT, INTEGER) TO authenticated, service_role;
