-- User price alerts (denormalized snapshot for mypage list).
-- TODO(supabase): Run in Supabase SQL Editor if the `alerts` table does not exist yet.

CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  current_price INTEGER NOT NULL CHECK (current_price >= 0),
  target_price INTEGER NOT NULL CHECK (target_price >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_product_id ON alerts(product_id);

ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY alerts_select_own ON alerts
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY alerts_insert_own ON alerts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY alerts_update_own ON alerts
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY alerts_delete_own ON alerts
  FOR DELETE
  USING (auth.uid() = user_id);
