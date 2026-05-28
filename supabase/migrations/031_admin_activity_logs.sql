-- Admin activity / audit trail (immutable, admin read-only).

CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  before_data JSONB,
  after_data JSONB,
  ip_hash TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_admin_user_id
  ON admin_activity_logs(admin_user_id);

CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_action
  ON admin_activity_logs(action);

CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_target_type
  ON admin_activity_logs(target_type);

CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_created_at
  ON admin_activity_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_target
  ON admin_activity_logs(target_type, target_id);

ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS admin_activity_logs_select_admin ON admin_activity_logs;
CREATE POLICY admin_activity_logs_select_admin
  ON admin_activity_logs FOR SELECT
  USING (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS admin_activity_logs_insert_admin ON admin_activity_logs;
CREATE POLICY admin_activity_logs_insert_admin
  ON admin_activity_logs FOR INSERT
  WITH CHECK (public.is_admin_user(auth.uid()));

-- Immutable: block UPDATE and DELETE at the database level.
CREATE OR REPLACE FUNCTION public.deny_admin_activity_logs_mutation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RAISE EXCEPTION 'admin_activity_logs are immutable';
END;
$$;

DROP TRIGGER IF EXISTS admin_activity_logs_deny_update ON admin_activity_logs;
CREATE TRIGGER admin_activity_logs_deny_update
  BEFORE UPDATE ON admin_activity_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.deny_admin_activity_logs_mutation();

DROP TRIGGER IF EXISTS admin_activity_logs_deny_delete ON admin_activity_logs;
CREATE TRIGGER admin_activity_logs_deny_delete
  BEFORE DELETE ON admin_activity_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.deny_admin_activity_logs_mutation();
