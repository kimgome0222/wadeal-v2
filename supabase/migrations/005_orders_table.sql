-- Group buy participation orders (no payment capture yet).
-- Matches Supabase table definition used by Wadeal checkout flow.

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  product_id TEXT,
  product_name TEXT,
  joined_price INTEGER,
  current_members INTEGER,
  target_members INTEGER,
  status TEXT DEFAULT '모집중',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- TODO(supabase): RLS를 켤 경우 아래 정책을 함께 적용하세요.
-- ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY orders_select_own ON orders FOR SELECT USING (auth.uid() = user_id);
-- CREATE POLICY orders_insert_own ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
