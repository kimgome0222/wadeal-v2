-- For projects that already applied 001 with alert_type / is_active
ALTER TABLE price_alerts
  ADD COLUMN IF NOT EXISTS notify_at_lowest_price BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS notify_before_deadline BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE price_alerts DROP COLUMN IF EXISTS alert_type;
ALTER TABLE price_alerts DROP COLUMN IF EXISTS is_active;
