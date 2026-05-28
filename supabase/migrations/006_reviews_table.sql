-- Product reviews (linked to orders by user_id + product_id slug).

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);

-- TODO(supabase): RLS를 켤 경우 아래 정책을 함께 적용하세요.
-- ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY reviews_select_all ON reviews FOR SELECT USING (true);
-- CREATE POLICY reviews_insert_own ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
