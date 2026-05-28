-- Production catalog seed columns: categories metadata + product catalog fields.
-- Safe to run on existing databases (IF NOT EXISTS / idempotent backfills).

ALTER TABLE categories
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS display_order INTEGER,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;

UPDATE categories
SET display_order = sort_order
WHERE display_order IS NULL;

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS short_description TEXT,
  ADD COLUMN IF NOT EXISTS sale_price INTEGER,
  ADD COLUMN IF NOT EXISTS stock_quantity INTEGER,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active';

ALTER TABLE products
  DROP CONSTRAINT IF EXISTS products_sale_price_check;

ALTER TABLE products
  ADD CONSTRAINT products_sale_price_check
  CHECK (sale_price IS NULL OR sale_price >= 0);

ALTER TABLE products
  DROP CONSTRAINT IF EXISTS products_stock_quantity_check;

ALTER TABLE products
  ADD CONSTRAINT products_stock_quantity_check
  CHECK (stock_quantity IS NULL OR stock_quantity >= 0);

ALTER TABLE products
  DROP CONSTRAINT IF EXISTS products_status_check;

ALTER TABLE products
  ADD CONSTRAINT products_status_check
  CHECK (status IN ('draft', 'active', 'ended', 'sold_out'));

-- One active listing row per catalog product simplifies seed upserts.
CREATE UNIQUE INDEX IF NOT EXISTS idx_group_buy_deals_product_id_unique
  ON group_buy_deals (product_id);

-- Keep relational tiers in sync when JSONB tiers are present.
CREATE OR REPLACE FUNCTION sync_price_tiers_from_jsonb(p_deal_id UUID)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM price_tiers WHERE deal_id = p_deal_id;

  INSERT INTO price_tiers (deal_id, required_participants, price, tier_order)
  SELECT
    p_deal_id,
    (tier.value->>'minQty')::INTEGER,
    (tier.value->>'price')::INTEGER,
    tier.ordinality::INTEGER
  FROM group_buy_deals gbd
  CROSS JOIN LATERAL jsonb_array_elements(gbd.price_tiers) WITH ORDINALITY AS tier(value, ordinality)
  WHERE gbd.id = p_deal_id
    AND jsonb_array_length(gbd.price_tiers) > 0;
END;
$$;
