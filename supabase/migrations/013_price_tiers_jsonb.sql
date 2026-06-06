-- Tiered group-buy pricing on deals + order finalization fields.
-- Run in Supabase SQL Editor after 010_admin_products.sql.

ALTER TABLE group_buy_deals
  ADD COLUMN IF NOT EXISTS price_tiers JSONB NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS final_price INTEGER,
  ADD COLUMN IF NOT EXISTS deal_id UUID REFERENCES group_buy_deals(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_orders_deal_id ON orders(deal_id);

-- Backfill quantity-tier pricing (1+/10+/30+/50+) from catalog prices.
UPDATE group_buy_deals gbd
SET price_tiers = jsonb_build_array(
  jsonb_build_object('minQty', 1, 'price', p.original_price),
  jsonb_build_object(
    'minQty', 10,
    'price', GREATEST(
      gbd.lowest_price,
      ROUND(p.original_price * 0.45 + gbd.group_price * 0.55)
    )
  ),
  jsonb_build_object('minQty', 30, 'price', gbd.group_price),
  jsonb_build_object('minQty', 50, 'price', gbd.lowest_price)
)
FROM products p
WHERE p.id = gbd.product_id
  AND (gbd.price_tiers = '[]'::jsonb OR gbd.price_tiers IS NULL);

-- Sync relational price_tiers table for legacy readers.
DELETE FROM price_tiers;

INSERT INTO price_tiers (deal_id, required_participants, price, tier_order)
SELECT
  gbd.id,
  (tier.value->>'minQty')::int,
  (tier.value->>'price')::int,
  tier.ordinality
FROM group_buy_deals gbd
CROSS JOIN LATERAL jsonb_array_elements(gbd.price_tiers) WITH ORDINALITY AS tier(value, ordinality)
WHERE jsonb_array_length(gbd.price_tiers) > 0;
