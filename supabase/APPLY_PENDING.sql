-- Paste into Supabase SQL Editor (Dashboard → SQL → New query) if 008/009 not applied yet.

-- === 008: admin roles, review reports status, review likes ===

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user'
  CHECK (role IN ('user', 'admin'));

UPDATE users
SET role = 'admin'
WHERE id = '00000000-0000-4000-8000-000000000001';

ALTER TABLE review_reports
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending'
  CHECK (status IN ('pending', 'resolved'));

ALTER TABLE review_reports
  ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS review_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (review_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_review_likes_review_id ON review_likes(review_id);
CREATE INDEX IF NOT EXISTS idx_review_likes_user_id ON review_likes(user_id);

-- === 009: saved_deals + RLS ===

CREATE TABLE IF NOT EXISTS saved_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_deals_user_id ON saved_deals(user_id);

ALTER TABLE saved_deals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS saved_deals_select_own ON saved_deals;
CREATE POLICY saved_deals_select_own
  ON saved_deals FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS saved_deals_insert_own ON saved_deals;
CREATE POLICY saved_deals_insert_own
  ON saved_deals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS saved_deals_delete_own ON saved_deals;
CREATE POLICY saved_deals_delete_own
  ON saved_deals FOR DELETE
  USING (auth.uid() = user_id);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS orders_select_own ON orders;
CREATE POLICY orders_select_own
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS orders_insert_own ON orders;
CREATE POLICY orders_insert_own
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS reviews_select_public ON reviews;
CREATE POLICY reviews_select_public
  ON reviews FOR SELECT
  USING (true);

DROP POLICY IF EXISTS reviews_insert_own ON reviews;
CREATE POLICY reviews_insert_own
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS reviews_update_own ON reviews;
CREATE POLICY reviews_update_own
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS reviews_delete_own ON reviews;
CREATE POLICY reviews_delete_own
  ON reviews FOR DELETE
  USING (auth.uid() = user_id);

ALTER TABLE review_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS review_reports_select_own ON review_reports;
CREATE POLICY review_reports_select_own
  ON review_reports FOR SELECT
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

DROP POLICY IF EXISTS review_reports_insert_own ON review_reports;
CREATE POLICY review_reports_insert_own
  ON review_reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS review_reports_update_admin ON review_reports;
CREATE POLICY review_reports_update_admin
  ON review_reports FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

ALTER TABLE review_likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS review_likes_select_public ON review_likes;
CREATE POLICY review_likes_select_public
  ON review_likes FOR SELECT
  USING (true);

DROP POLICY IF EXISTS review_likes_insert_own ON review_likes;
CREATE POLICY review_likes_insert_own
  ON review_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS review_likes_delete_own ON review_likes;
CREATE POLICY review_likes_delete_own
  ON review_likes FOR DELETE
  USING (auth.uid() = user_id);

ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS addresses_select_own ON addresses;
CREATE POLICY addresses_select_own
  ON addresses FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS addresses_insert_own ON addresses;
CREATE POLICY addresses_insert_own
  ON addresses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS addresses_update_own ON addresses;
CREATE POLICY addresses_update_own
  ON addresses FOR UPDATE
  USING (auth.uid() = user_id);

ALTER TABLE payment_methods_mock ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS payment_methods_select_own ON payment_methods_mock;
CREATE POLICY payment_methods_select_own
  ON payment_methods_mock FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS payment_methods_insert_own ON payment_methods_mock;
CREATE POLICY payment_methods_insert_own
  ON payment_methods_mock FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS payment_methods_update_own ON payment_methods_mock;
CREATE POLICY payment_methods_update_own
  ON payment_methods_mock FOR UPDATE
  USING (auth.uid() = user_id);
