-- Shipping timestamps, purchase confirmation status, and user confirm RLS.

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMPTZ;

-- shipping_status: add purchase-confirmed state
UPDATE orders SET shipping_status = 'confirmed'
WHERE shipping_status IN ('구매확정', 'confirmed_purchase');

ALTER TABLE orders
  ALTER COLUMN shipping_status SET DEFAULT 'none';

CREATE INDEX IF NOT EXISTS idx_orders_confirmed_at ON orders(confirmed_at);

-- Users may confirm purchase on their own delivered orders only.
DROP POLICY IF EXISTS orders_update_own_confirm ON orders;
CREATE POLICY orders_update_own_confirm
  ON orders FOR UPDATE
  USING (
    auth.uid() = user_id
    AND shipping_status = 'delivered'
  )
  WITH CHECK (
    auth.uid() = user_id
    AND shipping_status = 'confirmed'
    AND confirmed_at IS NOT NULL
  );
