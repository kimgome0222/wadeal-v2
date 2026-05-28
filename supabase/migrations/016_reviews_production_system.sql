-- Production review system: verified purchase, moderation status, order linkage.

ALTER TABLE reviews
  ADD COLUMN IF NOT EXISTS order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS deal_id UUID REFERENCES products(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS images JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS is_verified_purchase BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'visible',
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_status_check;
ALTER TABLE reviews
  ADD CONSTRAINT reviews_status_check
  CHECK (status IN ('visible', 'hidden', 'reported', 'deleted'));

ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_user_id_product_id_key;

CREATE UNIQUE INDEX IF NOT EXISTS idx_reviews_order_id_unique
  ON reviews(order_id)
  WHERE order_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_deal_id ON reviews(deal_id);
CREATE INDEX IF NOT EXISTS idx_reviews_order_id ON reviews(order_id);

CREATE OR REPLACE FUNCTION set_reviews_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS reviews_updated_at ON reviews;
CREATE TRIGGER reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION set_reviews_updated_at();

-- Backfill verified flag for existing rows tied to orders.
UPDATE reviews r
SET
  is_verified_purchase = true,
  status = COALESCE(NULLIF(r.status, ''), 'visible')
WHERE r.order_id IS NOT NULL;

-- RLS: visible reviews are public; owners and admins see all statuses.
DROP POLICY IF EXISTS reviews_select_public ON reviews;
CREATE POLICY reviews_select_visible_or_own ON reviews
  FOR SELECT
  USING (
    status = 'visible'
    OR auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

DROP POLICY IF EXISTS reviews_update_own ON reviews;
CREATE POLICY reviews_update_own_or_admin ON reviews
  FOR UPDATE
  USING (
    (auth.uid() = user_id AND status <> 'deleted')
    OR EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

DROP POLICY IF EXISTS reviews_delete_own ON reviews;
CREATE POLICY reviews_delete_admin ON reviews
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );
