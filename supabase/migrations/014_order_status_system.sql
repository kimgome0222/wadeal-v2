-- Operational order / payment / shipping status model.

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS refunded_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS tracking_company TEXT;

UPDATE orders
SET tracking_company = courier_company
WHERE tracking_company IS NULL AND courier_company IS NOT NULL;

-- order_status
UPDATE orders SET order_status = 'joined'
WHERE order_status IN ('참여완료', '결제대기', 'pending');

UPDATE orders SET order_status = 'confirmed'
WHERE order_status IN ('결제완료', '배송준비', '배송중', '배송완료', 'confirmed');

UPDATE orders SET order_status = 'cancelled'
WHERE order_status IN ('취소/환불', 'cancelled');

UPDATE orders SET order_status = 'refunded'
WHERE order_status = 'refunded';

-- payment_status
UPDATE orders SET payment_status = 'pending'
WHERE payment_status IN ('결제대기', 'pending');

UPDATE orders SET payment_status = 'paid'
WHERE payment_status IN ('결제완료', 'paid');

UPDATE orders SET payment_status = 'failed'
WHERE payment_status IN ('결제실패', 'failed');

UPDATE orders SET payment_status = 'refunded'
WHERE payment_status IN ('환불완료', 'refunded');

UPDATE orders SET payment_status = 'authorized'
WHERE payment_status = 'authorized';

-- shipping_status
UPDATE orders SET shipping_status = 'none'
WHERE shipping_status IN ('배송전', 'none');

UPDATE orders SET shipping_status = 'preparing'
WHERE shipping_status IN ('배송준비', 'preparing');

UPDATE orders SET shipping_status = 'shipped'
WHERE shipping_status IN ('배송중', 'shipped');

UPDATE orders SET shipping_status = 'delivered'
WHERE shipping_status IN ('배송완료', 'delivered');

UPDATE orders SET shipping_status = 'returned'
WHERE shipping_status = 'returned';

ALTER TABLE orders
  ALTER COLUMN order_status SET DEFAULT 'joined',
  ALTER COLUMN payment_status SET DEFAULT 'pending',
  ALTER COLUMN shipping_status SET DEFAULT 'none';

CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_shipping_status ON orders(shipping_status);
