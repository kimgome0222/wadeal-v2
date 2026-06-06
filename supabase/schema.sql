-- Wadeal catalog schema (products, deals, price tiers)
-- Paste into the Supabase SQL editor, then run supabase/seed.sql

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  legacy_id INTEGER,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  category_tags TEXT[] NOT NULL DEFAULT '{}',
  image_url TEXT,
  original_price INTEGER NOT NULL CHECK (original_price >= 0),
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE group_buy_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  section TEXT NOT NULL CHECK (section IN ('main', 'closing', 'rising', 'food', 'daily')),
  current_participants INTEGER NOT NULL DEFAULT 0 CHECK (current_participants >= 0),
  target_participants INTEGER NOT NULL CHECK (target_participants > 0),
  group_price INTEGER NOT NULL CHECK (group_price >= 0),
  lowest_price INTEGER NOT NULL CHECK (lowest_price >= 0),
  badge TEXT,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'closed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE price_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES group_buy_deals(id) ON DELETE CASCADE,
  required_participants INTEGER NOT NULL CHECK (required_participants > 0),
  price INTEGER NOT NULL CHECK (price >= 0),
  tier_order INTEGER NOT NULL CHECK (tier_order > 0),
  UNIQUE (deal_id, tier_order)
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_group_buy_deals_product_id ON group_buy_deals(product_id);
CREATE INDEX idx_group_buy_deals_section ON group_buy_deals(section);
CREATE INDEX idx_group_buy_deals_status ON group_buy_deals(status);
CREATE INDEX idx_price_tiers_deal_id ON price_tiers(deal_id);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_buy_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_tiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active products"
  ON products
  FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Public read active deals"
  ON group_buy_deals
  FOR SELECT
  USING (status = 'active');

CREATE POLICY "Public read price tiers for active deals"
  ON price_tiers
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM group_buy_deals
      WHERE group_buy_deals.id = price_tiers.deal_id
        AND group_buy_deals.status = 'active'
    )
  );
