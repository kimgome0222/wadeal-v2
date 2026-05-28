-- Courier code and tracking poll timestamp for shipping integration.

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS courier_code TEXT,
  ADD COLUMN IF NOT EXISTS tracking_last_checked_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_orders_shipping_tracking_poll
  ON public.orders (shipping_status, tracking_last_checked_at)
  WHERE tracking_number IS NOT NULL;
