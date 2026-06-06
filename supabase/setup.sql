-- Wadeal Supabase one-shot setup (fresh project)
-- Run this entire file once in the Supabase SQL Editor.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kakao_id TEXT UNIQUE,
  email TEXT,
  nickname TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

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

CREATE TABLE group_buy_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES group_buy_deals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'completed')),
  UNIQUE (deal_id, user_id)
);

CREATE TABLE price_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES group_buy_deals(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  target_price INTEGER CHECK (target_price IS NULL OR target_price >= 0),
  notify_at_lowest_price BOOLEAN NOT NULL DEFAULT FALSE,
  notify_before_deadline BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE saved_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_group_buy_deals_product_id ON group_buy_deals(product_id);
CREATE INDEX idx_group_buy_deals_section ON group_buy_deals(section);
CREATE INDEX idx_group_buy_deals_status ON group_buy_deals(status);
CREATE INDEX idx_price_tiers_deal_id ON price_tiers(deal_id);
CREATE INDEX idx_group_buy_participants_deal_id ON group_buy_participants(deal_id);
CREATE INDEX idx_group_buy_participants_user_id ON group_buy_participants(user_id);
CREATE INDEX idx_price_alerts_deal_id ON price_alerts(deal_id);
CREATE INDEX idx_saved_deals_user_id ON saved_deals(user_id);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_buy_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_buy_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active products"
  ON products FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Public read active deals"
  ON group_buy_deals FOR SELECT USING (status = 'active');

CREATE POLICY "Public read price tiers for active deals"
  ON price_tiers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM group_buy_deals
      WHERE group_buy_deals.id = price_tiers.deal_id
        AND group_buy_deals.status = 'active'
    )
  );

CREATE POLICY "Public read active participants (prototype)"
  ON group_buy_participants FOR SELECT USING (status = 'active');

CREATE POLICY "Public insert participants (prototype)"
  ON group_buy_participants FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read price alerts (prototype)"
  ON price_alerts FOR SELECT USING (true);

CREATE POLICY "Public insert price alerts (prototype)"
  ON price_alerts FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read saved deals (prototype)"
  ON saved_deals FOR SELECT USING (true);

CREATE OR REPLACE FUNCTION increment_deal_participants()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'active' THEN
    UPDATE group_buy_deals
    SET current_participants = current_participants + 1
    WHERE id = NEW.deal_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_increment_deal_participants
  AFTER INSERT ON group_buy_participants
  FOR EACH ROW
  EXECUTE FUNCTION increment_deal_participants();

INSERT INTO users (id, nickname, email)
VALUES ('00000000-0000-4000-8000-000000000001', '김가나', 'prototype@wadeal.local')
ON CONFLICT (id) DO NOTHING;

WITH seeded_products AS (
  INSERT INTO products (slug, legacy_id, name, category, category_tags, image_url, original_price, description)
  VALUES
    ('wd-citrus-001', 1, '제주 고당도 감귤 3kg', 'food', ARRAY['all', 'food', 'closing-soon'], 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=600&q=80', 22900, NULL),
    ('wd-beef-001', 2, '한우 불고기 냉장팩 600g', 'food', ARRAY['all', 'food'], 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&w=600&q=80', 39800, NULL),
    ('wd-vacuum-001', 3, '초경량 무선 청소기', 'digital', ARRAY['all', 'digital', 'living'], 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=600&q=80', 129000, NULL),
    ('wd-coldbrew-001', 4, '성수동 콜드브루 12병', 'food', ARRAY['all', 'food', 'closing-soon'], 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80', 36000, NULL),
    ('wd-yogurt-001', 5, '유기농 그릭요거트 8개', 'food', ARRAY['all', 'food', 'closing-soon'], 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80', 28800, NULL),
    ('wd-towel-001', 6, '순면 호텔 타월 10장', 'living', ARRAY['all', 'living', 'fashion'], 'https://images.unsplash.com/photo-1600369671236-e74521d4b6ad?auto=format&fit=crop&w=600&q=80', 45900, NULL),
    ('wd-abalone-001', 7, '완도 활전복 1kg', 'food', ARRAY['all', 'food'], 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=600&q=80', 59800, NULL),
    ('wd-grape-001', 8, '국산 샤인머스캣 2송이', 'food', ARRAY['all', 'food', 'closing-soon'], 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=600&q=80', 32800, NULL),
    ('wd-detergent-001', 9, '주방 세제 리필 4팩', 'living', ARRAY['all', 'living'], 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80', 23900, NULL),
    ('wd-laundry-001', 10, '프리미엄 세탁 캡슐 60개', 'living', ARRAY['all', 'living'], 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?auto=format&fit=crop&w=600&q=80', 34900, NULL),
    ('wd-wipes-001', 11, '대용량 물티슈 20팩', 'living', ARRAY['all', 'living', 'pet'], 'https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?auto=format&fit=crop&w=600&q=80', 31900, NULL),
    ('wd-earbuds-001', 12, '노이즈캔슬링 무선 이어폰', 'digital', ARRAY['all', 'digital'], 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80', 189000, NULL),
    ('wd-hoodie-001', 13, '오버핏 기모 후디', 'fashion', ARRAY['all', 'fashion'], 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80', 69000, NULL),
    ('wd-serum-001', 14, '히알루론 수분 세럼 2개', 'beauty', ARRAY['all', 'beauty'], 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=600&q=80', 52000, NULL),
    ('wd-dogfood-001', 15, '저알러지 강아지 사료 5kg', 'pet', ARRAY['all', 'pet'], 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=600&q=80', 48000, NULL),
    ('wd-lipstick-001', 16, '벨벳 립스틱 3종 세트', 'beauty', ARRAY['all', 'beauty', 'closing-soon'], 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80', 42000, NULL)
  RETURNING id, slug
),
seeded_deals AS (
  INSERT INTO group_buy_deals (product_id, title, section, current_participants, target_participants, group_price, lowest_price, badge, ends_at)
  SELECT
    p.id,
    CASE p.slug
      WHEN 'wd-citrus-001' THEN '제주 고당도 감귤 3kg'
      WHEN 'wd-beef-001' THEN '한우 불고기 냉장팩 600g'
      WHEN 'wd-vacuum-001' THEN '초경량 무선 청소기'
      WHEN 'wd-coldbrew-001' THEN '성수동 콜드브루 12병'
      WHEN 'wd-yogurt-001' THEN '유기농 그릭요거트 8개'
      WHEN 'wd-towel-001' THEN '순면 호텔 타월 10장'
      WHEN 'wd-abalone-001' THEN '완도 활전복 1kg'
      WHEN 'wd-grape-001' THEN '국산 샤인머스캣 2송이'
      WHEN 'wd-detergent-001' THEN '주방 세제 리필 4팩'
      WHEN 'wd-laundry-001' THEN '프리미엄 세탁 캡슐 60개'
      WHEN 'wd-wipes-001' THEN '대용량 물티슈 20팩'
      WHEN 'wd-earbuds-001' THEN '노이즈캔슬링 무선 이어폰'
      WHEN 'wd-hoodie-001' THEN '오버핏 기모 후디'
      WHEN 'wd-serum-001' THEN '히알루론 수분 세럼 2개'
      WHEN 'wd-dogfood-001' THEN '저알러지 강아지 사료 5kg'
      WHEN 'wd-lipstick-001' THEN '벨벳 립스틱 3종 세트'
    END,
    CASE p.slug
      WHEN 'wd-citrus-001' THEN 'main'
      WHEN 'wd-beef-001' THEN 'main'
      WHEN 'wd-vacuum-001' THEN 'main'
      WHEN 'wd-coldbrew-001' THEN 'closing'
      WHEN 'wd-yogurt-001' THEN 'closing'
      WHEN 'wd-towel-001' THEN 'rising'
      WHEN 'wd-abalone-001' THEN 'food'
      WHEN 'wd-grape-001' THEN 'food'
      WHEN 'wd-detergent-001' THEN 'daily'
      WHEN 'wd-laundry-001' THEN 'daily'
      WHEN 'wd-wipes-001' THEN 'main'
      WHEN 'wd-earbuds-001' THEN 'rising'
      WHEN 'wd-hoodie-001' THEN 'rising'
      WHEN 'wd-serum-001' THEN 'rising'
      WHEN 'wd-dogfood-001' THEN 'daily'
      WHEN 'wd-lipstick-001' THEN 'closing'
    END,
    CASE p.slug
      WHEN 'wd-citrus-001' THEN 118
      WHEN 'wd-beef-001' THEN 78
      WHEN 'wd-vacuum-001' THEN 93
      WHEN 'wd-coldbrew-001' THEN 68
      WHEN 'wd-yogurt-001' THEN 54
      WHEN 'wd-towel-001' THEN 147
      WHEN 'wd-abalone-001' THEN 71
      WHEN 'wd-grape-001' THEN 43
      WHEN 'wd-detergent-001' THEN 82
      WHEN 'wd-laundry-001' THEN 128
      WHEN 'wd-wipes-001' THEN 198
      WHEN 'wd-earbuds-001' THEN 201
      WHEN 'wd-hoodie-001' THEN 88
      WHEN 'wd-serum-001' THEN 62
      WHEN 'wd-dogfood-001' THEN 95
      WHEN 'wd-lipstick-001' THEN 37
    END,
    CASE p.slug
      WHEN 'wd-citrus-001' THEN 120
      WHEN 'wd-beef-001' THEN 80
      WHEN 'wd-vacuum-001' THEN 95
      WHEN 'wd-coldbrew-001' THEN 100
      WHEN 'wd-yogurt-001' THEN 60
      WHEN 'wd-towel-001' THEN 160
      WHEN 'wd-abalone-001' THEN 90
      WHEN 'wd-grape-001' THEN 55
      WHEN 'wd-detergent-001' THEN 100
      WHEN 'wd-laundry-001' THEN 150
      WHEN 'wd-wipes-001' THEN 200
      WHEN 'wd-earbuds-001' THEN 220
      WHEN 'wd-hoodie-001' THEN 100
      WHEN 'wd-serum-001' THEN 80
      WHEN 'wd-dogfood-001' THEN 110
      WHEN 'wd-lipstick-001' THEN 50
    END,
    CASE p.slug
      WHEN 'wd-citrus-001' THEN 12900
      WHEN 'wd-beef-001' THEN 24900
      WHEN 'wd-vacuum-001' THEN 79900
      WHEN 'wd-coldbrew-001' THEN 21900
      WHEN 'wd-yogurt-001' THEN 16900
      WHEN 'wd-towel-001' THEN 26900
      WHEN 'wd-abalone-001' THEN 39900
      WHEN 'wd-grape-001' THEN 21900
      WHEN 'wd-detergent-001' THEN 13900
      WHEN 'wd-laundry-001' THEN 21900
      WHEN 'wd-wipes-001' THEN 17900
      WHEN 'wd-earbuds-001' THEN 119000
      WHEN 'wd-hoodie-001' THEN 39900
      WHEN 'wd-serum-001' THEN 32900
      WHEN 'wd-dogfood-001' THEN 31900
      WHEN 'wd-lipstick-001' THEN 25900
    END,
    CASE p.slug
      WHEN 'wd-citrus-001' THEN 10900
      WHEN 'wd-beef-001' THEN 21900
      WHEN 'wd-vacuum-001' THEN 74900
      WHEN 'wd-coldbrew-001' THEN 19900
      WHEN 'wd-yogurt-001' THEN 15900
      WHEN 'wd-towel-001' THEN 24900
      WHEN 'wd-abalone-001' THEN 36900
      WHEN 'wd-grape-001' THEN 19900
      WHEN 'wd-detergent-001' THEN 12900
      WHEN 'wd-laundry-001' THEN 19900
      WHEN 'wd-wipes-001' THEN 15900
      WHEN 'wd-earbuds-001' THEN 109000
      WHEN 'wd-hoodie-001' THEN 35900
      WHEN 'wd-serum-001' THEN 29900
      WHEN 'wd-dogfood-001' THEN 28900
      WHEN 'wd-lipstick-001' THEN 23900
    END,
    CASE p.slug
      WHEN 'wd-citrus-001' THEN '마감임박'
      WHEN 'wd-beef-001' THEN '인기'
      WHEN 'wd-vacuum-001' THEN '인기'
      WHEN 'wd-coldbrew-001' THEN '마감임박'
      WHEN 'wd-yogurt-001' THEN '마감임박'
      WHEN 'wd-towel-001' THEN '급상승'
      WHEN 'wd-abalone-001' THEN '인기'
      WHEN 'wd-grape-001' THEN '마감임박'
      WHEN 'wd-detergent-001' THEN '인기'
      WHEN 'wd-laundry-001' THEN '인기'
      WHEN 'wd-wipes-001' THEN '급상승'
      WHEN 'wd-earbuds-001' THEN '인기'
      WHEN 'wd-hoodie-001' THEN '급상승'
      WHEN 'wd-serum-001' THEN '인기'
      WHEN 'wd-dogfood-001' THEN '인기'
      WHEN 'wd-lipstick-001' THEN '마감임박'
    END,
    NOW() + (
      CASE p.slug
        WHEN 'wd-citrus-001' THEN INTERVAL '138 minutes'
        WHEN 'wd-beef-001' THEN INTERVAL '292 minutes'
        WHEN 'wd-vacuum-001' THEN INTERVAL '504 minutes'
        WHEN 'wd-coldbrew-001' THEN INTERVAL '101 minutes'
        WHEN 'wd-yogurt-001' THEN INTERVAL '95 minutes'
        WHEN 'wd-towel-001' THEN INTERVAL '309 minutes'
        WHEN 'wd-abalone-001' THEN INTERVAL '798 minutes'
        WHEN 'wd-grape-001' THEN INTERVAL '404 minutes'
        WHEN 'wd-detergent-001' THEN INTERVAL '567 minutes'
        WHEN 'wd-laundry-001' THEN INTERVAL '723 minutes'
        WHEN 'wd-wipes-001' THEN INTERVAL '425 minutes'
        WHEN 'wd-earbuds-001' THEN INTERVAL '612 minutes'
        WHEN 'wd-hoodie-001' THEN INTERVAL '860 minutes'
        WHEN 'wd-serum-001' THEN INTERVAL '228 minutes'
        WHEN 'wd-dogfood-001' THEN INTERVAL '965 minutes'
        WHEN 'wd-lipstick-001' THEN INTERVAL '52 minutes'
      END
    )
  FROM seeded_products p
  RETURNING id, product_id
)
INSERT INTO price_tiers (deal_id, required_participants, price, tier_order)
SELECT
  gbd.id,
  tier.required_participants,
  tier.price,
  tier.tier_order
FROM group_buy_deals gbd
JOIN products p ON p.id = gbd.product_id
JOIN LATERAL (
  VALUES
    (1, p.original_price, 1),
    (gbd.target_participants - 1, gbd.group_price, 2),
    (gbd.target_participants, gbd.lowest_price, 3)
) AS tier(required_participants, price, tier_order) ON TRUE;

-- Prototype participation rows (trigger disabled so counts stay aligned with seed)
ALTER TABLE group_buy_participants DISABLE TRIGGER trg_increment_deal_participants;

INSERT INTO group_buy_participants (deal_id, user_id)
SELECT gbd.id, '00000000-0000-4000-8000-000000000001'::uuid
FROM group_buy_deals gbd
JOIN products p ON p.id = gbd.product_id
WHERE p.slug IN ('wd-vacuum-001', 'wd-beef-001')
ON CONFLICT (deal_id, user_id) DO NOTHING;

ALTER TABLE group_buy_participants ENABLE TRIGGER trg_increment_deal_participants;

INSERT INTO saved_deals (user_id, product_id)
SELECT '00000000-0000-4000-8000-000000000001'::uuid, p.id
FROM products p
WHERE p.slug IN (
  'wd-citrus-001',
  'wd-beef-001',
  'wd-vacuum-001',
  'wd-towel-001',
  'wd-earbuds-001',
  'wd-serum-001'
)
ON CONFLICT (user_id, product_id) DO NOTHING;
