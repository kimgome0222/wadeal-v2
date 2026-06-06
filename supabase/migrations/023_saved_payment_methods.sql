-- Saved billing keys for group-buy auto-pay + payment_flow on orders/payments

-- ---------------------------------------------------------------------------
-- saved_payment_methods
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS saved_payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL DEFAULT 'toss',
  method TEXT NOT NULL DEFAULT 'card',
  billing_key TEXT NOT NULL,
  card_company TEXT,
  card_last4 TEXT NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT saved_payment_methods_status_check
    CHECK (status IN ('active', 'inactive', 'expired', 'revoked')),
  CONSTRAINT saved_payment_methods_method_check
    CHECK (method IN ('card'))
);

CREATE INDEX IF NOT EXISTS idx_saved_payment_methods_user_id
  ON saved_payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_payment_methods_user_default
  ON saved_payment_methods(user_id, is_default)
  WHERE is_default = true AND status = 'active';

-- Client-safe view (no billing_key)
CREATE OR REPLACE VIEW saved_payment_methods_client AS
SELECT
  id,
  user_id,
  provider,
  method,
  card_company,
  card_last4,
  is_default,
  status,
  created_at,
  updated_at
FROM saved_payment_methods;

ALTER TABLE saved_payment_methods ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS saved_payment_methods_select_own ON saved_payment_methods;
CREATE POLICY saved_payment_methods_select_own
  ON saved_payment_methods FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS saved_payment_methods_select_admin ON saved_payment_methods;
CREATE POLICY saved_payment_methods_select_admin
  ON saved_payment_methods FOR SELECT
  USING (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS saved_payment_methods_update_own ON saved_payment_methods;
CREATE POLICY saved_payment_methods_update_own
  ON saved_payment_methods FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Inserts go through SECURITY DEFINER RPC only
REVOKE INSERT ON saved_payment_methods FROM authenticated;

-- ---------------------------------------------------------------------------
-- payment_flow columns
-- ---------------------------------------------------------------------------

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS payment_flow TEXT NOT NULL DEFAULT 'post_deadline_manual',
  ADD COLUMN IF NOT EXISTS saved_payment_method_id UUID
    REFERENCES saved_payment_methods(id) ON DELETE SET NULL;

ALTER TABLE orders
  DROP CONSTRAINT IF EXISTS orders_payment_flow_check;

ALTER TABLE orders
  ADD CONSTRAINT orders_payment_flow_check
  CHECK (payment_flow IN ('instant', 'post_deadline_manual', 'post_deadline_auto'));

ALTER TABLE payments
  ADD COLUMN IF NOT EXISTS payment_flow TEXT,
  ADD COLUMN IF NOT EXISTS auto_charge_attempted_at TIMESTAMPTZ;

ALTER TABLE payments
  DROP CONSTRAINT IF EXISTS payments_payment_flow_check;

ALTER TABLE payments
  ADD CONSTRAINT payments_payment_flow_check
  CHECK (
    payment_flow IS NULL
    OR payment_flow IN ('instant', 'post_deadline_manual', 'post_deadline_auto')
  );

UPDATE orders
SET payment_flow = 'post_deadline_manual'
WHERE payment_flow IS NULL;

UPDATE payments p
SET payment_flow = o.payment_flow
FROM orders o
WHERE p.order_id = o.id
  AND p.payment_flow IS NULL;

-- ---------------------------------------------------------------------------
-- RPC: register saved payment method (server-side billing key storage)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION register_saved_payment_method(
  p_billing_key TEXT,
  p_card_company TEXT,
  p_card_last4 TEXT,
  p_provider TEXT DEFAULT 'toss',
  p_method TEXT DEFAULT 'card',
  p_set_default BOOLEAN DEFAULT true
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_method_id UUID;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'login_required';
  END IF;

  IF p_billing_key IS NULL OR length(trim(p_billing_key)) = 0 THEN
    RAISE EXCEPTION 'invalid_billing_key';
  END IF;

  IF p_card_last4 IS NULL OR length(trim(p_card_last4)) < 4 THEN
    RAISE EXCEPTION 'invalid_card_last4';
  END IF;

  IF p_set_default THEN
    UPDATE saved_payment_methods
    SET is_default = false, updated_at = NOW()
    WHERE user_id = v_user_id AND is_default = true;
  END IF;

  INSERT INTO saved_payment_methods (
    user_id,
    provider,
    method,
    billing_key,
    card_company,
    card_last4,
    is_default,
    status
  ) VALUES (
    v_user_id,
    COALESCE(NULLIF(trim(p_provider), ''), 'toss'),
    COALESCE(NULLIF(trim(p_method), ''), 'card'),
    trim(p_billing_key),
    NULLIF(trim(p_card_company), ''),
    right(regexp_replace(p_card_last4, '\D', '', 'g'), 4),
    COALESCE(p_set_default, true),
    'active'
  )
  RETURNING id INTO v_method_id;

  RETURN v_method_id;
END;
$$;

-- ---------------------------------------------------------------------------
-- RPC: get billing key for auto-charge (never exposed to client UI)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION get_saved_payment_billing_key(p_method_id UUID)
RETURNS TABLE (
  billing_key TEXT,
  provider TEXT,
  method TEXT,
  user_id UUID
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL
    AND NOT public.is_service_role_context()
    AND NOT public.is_admin_user(auth.uid()) THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  RETURN QUERY
  SELECT
    spm.billing_key,
    spm.provider,
    spm.method,
    spm.user_id
  FROM saved_payment_methods spm
  WHERE spm.id = p_method_id
    AND spm.status = 'active'
    AND (
      spm.user_id = auth.uid()
      OR public.is_service_role_context()
      OR public.is_admin_user(auth.uid())
    );
END;
$$;

-- ---------------------------------------------------------------------------
-- RPC: deactivate / set default
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION deactivate_saved_payment_method(p_method_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'login_required';
  END IF;

  UPDATE saved_payment_methods
  SET status = 'inactive', is_default = false, updated_at = NOW()
  WHERE id = p_method_id AND user_id = v_user_id AND status = 'active';

  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION set_default_saved_payment_method(p_method_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'login_required';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM saved_payment_methods
    WHERE id = p_method_id AND user_id = v_user_id AND status = 'active'
  ) THEN
    RETURN FALSE;
  END IF;

  UPDATE saved_payment_methods
  SET is_default = false, updated_at = NOW()
  WHERE user_id = v_user_id AND is_default = true;

  UPDATE saved_payment_methods
  SET is_default = true, updated_at = NOW()
  WHERE id = p_method_id AND user_id = v_user_id;

  RETURN TRUE;
END;
$$;

-- ---------------------------------------------------------------------------
-- Extend create_pending_payment_for_order with payment_flow
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
    o.payment_flow
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

  v_line_total := ROUND(COALESCE(v_order.joined_price, 0) * GREATEST(COALESCE(v_order.quantity, 1), 1));

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
  SET payment_status = 'ready'
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
BEGIN
  IF p_final_amount IS NULL OR p_final_amount < 0 THEN
    RAISE EXCEPTION 'invalid_amount';
  END IF;

  SELECT payment_flow INTO v_flow FROM orders WHERE id = p_order_id;

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
    payment_flow = COALESCE(v_flow, payment_flow),
    updated_at = NOW()
  WHERE id = v_payment_id;

  UPDATE orders
  SET payment_status = 'ready'
  WHERE id = p_order_id;

  RETURN TRUE;
END;
$$;

REVOKE ALL ON FUNCTION register_saved_payment_method(TEXT, TEXT, TEXT, TEXT, TEXT, BOOLEAN) FROM PUBLIC;
REVOKE ALL ON FUNCTION get_saved_payment_billing_key(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION deactivate_saved_payment_method(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION set_default_saved_payment_method(UUID) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION register_saved_payment_method(TEXT, TEXT, TEXT, TEXT, TEXT, BOOLEAN) TO authenticated;
GRANT EXECUTE ON FUNCTION get_saved_payment_billing_key(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION deactivate_saved_payment_method(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION set_default_saved_payment_method(UUID) TO authenticated;
