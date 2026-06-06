-- Kakao alimtalk/biz message delivery status (no sending in app yet).
ALTER TABLE price_alerts
  ADD COLUMN IF NOT EXISTS kakao_notify_status TEXT NOT NULL DEFAULT 'pending'
  CHECK (kakao_notify_status IN ('pending', 'sent', 'failed', 'skipped'));
