-- Wadeal catalog seed
-- Run after supabase/schema.sql
-- Image paths map to public/images/products/* in the Next.js app

WITH seeded_products AS (
  INSERT INTO products (slug, legacy_id, name, category, category_tags, image_url, original_price, description)
  VALUES
    ('wd-citrus-001', 1, '제주 고당도 감귤 3kg', 'food', ARRAY['all', 'food', 'closing-soon'], '/images/products/citrus.jpg', 22900, NULL),
    ('wd-beef-001', 2, '한우 불고기 냉장팩 600g', 'food', ARRAY['all', 'food'], '/images/products/beef.jpg', 39800, NULL),
    ('wd-vacuum-001', 3, '초경량 무선 청소기', 'digital', ARRAY['all', 'digital', 'living'], '/images/products/vacuum.jpg', 129000, NULL),
    ('wd-coldbrew-001', 4, '성수동 콜드브루 12병', 'food', ARRAY['all', 'food', 'closing-soon'], '/images/products/coldbrew.jpg', 36000, NULL),
    ('wd-yogurt-001', 5, '유기농 그릭요거트 8개', 'food', ARRAY['all', 'food', 'closing-soon'], '/images/products/yogurt.jpg', 28800, NULL),
    ('wd-towel-001', 6, '순면 호텔 타월 10장', 'living', ARRAY['all', 'living', 'fashion'], '/images/products/towel.jpg', 45900, NULL),
    ('wd-abalone-001', 7, '완도 활전복 1kg', 'food', ARRAY['all', 'food'], '/images/products/abalone.jpg', 59800, NULL),
    ('wd-grape-001', 8, '국산 샤인머스캣 2송이', 'food', ARRAY['all', 'food', 'closing-soon'], '/images/products/grape.jpg', 32800, NULL),
    ('wd-detergent-001', 9, '주방 세제 리필 4팩', 'living', ARRAY['all', 'living'], '/images/products/detergent.jpg', 23900, NULL),
    ('wd-laundry-001', 10, '프리미엄 세탁 캡슐 60개', 'living', ARRAY['all', 'living'], '/images/products/laundry.jpg', 34900, NULL),
    ('wd-wipes-001', 11, '대용량 물티슈 20팩', 'living', ARRAY['all', 'living', 'pet'], '/images/products/wipes.jpg', 31900, NULL),
    ('wd-earbuds-001', 12, '노이즈캔슬링 무선 이어폰', 'digital', ARRAY['all', 'digital'], '/images/products/earbuds.jpg', 189000, NULL),
    ('wd-hoodie-001', 13, '오버핏 기모 후디', 'fashion', ARRAY['all', 'fashion'], '/images/products/hoodie.jpg', 69000, NULL),
    ('wd-serum-001', 14, '히알루론 수분 세럼 2개', 'beauty', ARRAY['all', 'beauty'], '/images/products/serum.jpg', 52000, NULL),
    ('wd-dogfood-001', 15, '저알러지 강아지 사료 5kg', 'pet', ARRAY['all', 'pet'], '/images/products/dogfood.jpg', 48000, NULL),
    ('wd-lipstick-001', 16, '벨벳 립스틱 3종 세트', 'beauty', ARRAY['all', 'beauty', 'closing-soon'], '/images/products/lipstick.jpg', 42000, NULL)
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
