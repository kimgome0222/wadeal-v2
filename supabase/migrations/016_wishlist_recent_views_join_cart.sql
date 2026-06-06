-- Wishlist (saved_deals), recent_views, and join_cart for participation review flow.

-- Ensure saved_deals unique constraint (idempotent).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'saved_deals_user_id_product_id_key'
  ) THEN
    ALTER TABLE saved_deals
      ADD CONSTRAINT saved_deals_user_id_product_id_key UNIQUE (user_id, product_id);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS recent_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_recent_views_user_viewed
  ON recent_views(user_id, viewed_at DESC);

CREATE TABLE IF NOT EXISTS join_cart (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity >= 1 AND quantity <= 99),
  estimated_unit_price INTEGER NOT NULL DEFAULT 0 CHECK (estimated_unit_price >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_join_cart_user_id ON join_cart(user_id);

CREATE OR REPLACE FUNCTION set_join_cart_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS join_cart_updated_at ON join_cart;
CREATE TRIGGER join_cart_updated_at
  BEFORE UPDATE ON join_cart
  FOR EACH ROW
  EXECUTE FUNCTION set_join_cart_updated_at();

ALTER TABLE recent_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE join_cart ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS recent_views_select_own ON recent_views;
CREATE POLICY recent_views_select_own
  ON recent_views FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS recent_views_insert_own ON recent_views;
CREATE POLICY recent_views_insert_own
  ON recent_views FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS recent_views_update_own ON recent_views;
CREATE POLICY recent_views_update_own
  ON recent_views FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS recent_views_delete_own ON recent_views;
CREATE POLICY recent_views_delete_own
  ON recent_views FOR DELETE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS join_cart_select_own ON join_cart;
CREATE POLICY join_cart_select_own
  ON join_cart FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS join_cart_insert_own ON join_cart;
CREATE POLICY join_cart_insert_own
  ON join_cart FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS join_cart_update_own ON join_cart;
CREATE POLICY join_cart_update_own
  ON join_cart FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS join_cart_delete_own ON join_cart;
CREATE POLICY join_cart_delete_own
  ON join_cart FOR DELETE
  USING (auth.uid() = user_id);
