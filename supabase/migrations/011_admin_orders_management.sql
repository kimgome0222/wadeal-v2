-- Admin order management fields and policies.

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS order_number TEXT,
  ADD COLUMN IF NOT EXISTS quantity INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS payment_amount INTEGER,
  ADD COLUMN IF NOT EXISTS order_status TEXT NOT NULL DEFAULT '참여완료',
  ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT '결제대기',
  ADD COLUMN IF NOT EXISTS shipping_status TEXT NOT NULL DEFAULT '배송전',
  ADD COLUMN IF NOT EXISTS courier_company TEXT,
  ADD COLUMN IF NOT EXISTS tracking_number TEXT,
  ADD COLUMN IF NOT EXISTS admin_memo TEXT;

UPDATE orders
SET payment_amount = joined_price
WHERE payment_amount IS NULL;

UPDATE orders
SET order_status = CASE
  WHEN status = '공동구매 성공' THEN '결제대기'
  ELSE '참여완료'
END
WHERE order_status = '참여완료';

UPDATE orders
SET order_number = 'WD-' || UPPER(SUBSTRING(REPLACE(id::text, '-', ''), 1, 8))
WHERE order_number IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_order_status ON orders(order_status);

DROP POLICY IF EXISTS orders_select_admin ON orders;
CREATE POLICY orders_select_admin
  ON orders FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

DROP POLICY IF EXISTS orders_update_admin ON orders;
CREATE POLICY orders_update_admin
  ON orders FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

DROP POLICY IF EXISTS users_select_admin ON users;
CREATE POLICY users_select_admin
  ON users FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
  ));
