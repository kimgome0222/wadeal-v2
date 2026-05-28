-- Service error logs for operations monitoring (admin read, server insert).

CREATE TABLE IF NOT EXISTS error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level TEXT NOT NULL,
  source TEXT NOT NULL,
  message TEXT NOT NULL,
  stack TEXT,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  order_id UUID,
  payment_id UUID,
  deal_id UUID,
  product_id TEXT,
  metadata JSONB,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT error_logs_level_check CHECK (
    level IN ('info', 'warning', 'error', 'critical')
  )
);

CREATE INDEX IF NOT EXISTS idx_error_logs_level ON error_logs(level);
CREATE INDEX IF NOT EXISTS idx_error_logs_source ON error_logs(source);
CREATE INDEX IF NOT EXISTS idx_error_logs_created_at ON error_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_error_logs_resolved_at ON error_logs(resolved_at);
CREATE INDEX IF NOT EXISTS idx_error_logs_unresolved_critical
  ON error_logs(created_at DESC)
  WHERE resolved_at IS NULL AND level = 'critical';

ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS error_logs_select_admin ON error_logs;
CREATE POLICY error_logs_select_admin
  ON error_logs FOR SELECT
  USING (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS error_logs_update_admin ON error_logs;
CREATE POLICY error_logs_update_admin
  ON error_logs FOR UPDATE
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

-- INSERT: service role only (no authenticated INSERT policy).

DROP POLICY IF EXISTS error_logs_deny_delete ON error_logs;
CREATE POLICY error_logs_deny_delete
  ON error_logs FOR DELETE
  USING (false);
