-- Wadeal production catalog seed
-- Run after migrations (especially 016_search_categories, 021_product_payment_methods, 022_catalog_seed_columns).
-- Uses upsert on slug to avoid conflicts with existing rows.
--
-- Usage (Supabase SQL Editor):
--   Paste and execute this entire file.
--
-- Usage (Supabase CLI):
--   supabase db execute --file supabase/seed.sql

-- ---------------------------------------------------------------------------
-- 1. Categories (Coupang-style, 8 top-level)
-- ---------------------------------------------------------------------------
INSERT INTO categories (slug, name, description, display_order, sort_order, is_active)
VALUES
  (
    'food',
    '식품',
    '신선식품, 가공식품, 음료, 간편식 등 일상 식품 카테고리',
    1,
    1,
    TRUE
  ),
  (
    'living',
    '생활용품',
    '세제, 욕실·주방용품, 수납, 생활잡화',
    2,
    2,
    TRUE
  ),
  (
    'beauty',
    '뷰티',
    '스킨케어, 메이크업, 헤어·바디케어',
    3,
    3,
    TRUE
  ),
  (
    'fashion',
    '패션잡화',
    '가방, 지갑, 액세서리, 패션 소품',
    4,
    4,
    TRUE
  ),
  (
    'pet',
    '반려동물',
    '강아지·고양이 사료, 간식, 위생용품',
    5,
    5,
    TRUE
  ),
  (
    'baby',
    '육아',
    '유아식, 기저귀, 육아용품, 출산 준비물',
    6,
    6,
    TRUE
  ),
  (
    'digital',
    '디지털/가전',
    '스마트기기, 가전, PC·모바일 액세서리',
    7,
    7,
    TRUE
  ),
  (
    'local',
    '지역특산물',
    '전국 지역 대표 특산품, 농·수·축산물',
    8,
    8,
    TRUE
  )
ON CONFLICT (slug) DO UPDATE
SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  display_order = EXCLUDED.display_order,
  sort_order = EXCLUDED.sort_order,
  is_active = EXCLUDED.is_active;

-- Retire legacy mock catalog slugs from early prototypes.
UPDATE products
SET
  is_active = FALSE,
  status = 'ended'
WHERE slug LIKE 'wd-%'
  AND slug NOT IN (
    'wd-olive-oil-500',
    'wd-earbuds-case',
    'wd-jeju-citrus-5kg',
    'wd-premium-skincare',
    'wd-dogfood-10kg',
    'wd-baby-food-12',
    'wd-wando-seaweed',
    'wd-hotel-towel-6'
  );

-- ---------------------------------------------------------------------------
-- 2. Products + group-buy listings
-- ---------------------------------------------------------------------------

-- Helper: upsert a product row and return id
WITH category_map AS (
  SELECT slug, id FROM categories
),
upserted_products AS (
  INSERT INTO products (
    slug,
    legacy_id,
    name,
    category,
    category_id,
    category_tags,
    product_type,
    image_url,
    detail_image_urls,
    original_price,
    sale_price,
    description,
    short_description,
    brand_name,
    keywords,
    stock_quantity,
    status,
    is_active
  )
  SELECT
    v.slug,
    v.legacy_id,
    v.name,
    v.category,
    c.id,
    v.category_tags,
    v.product_type,
    v.image_url,
    v.detail_image_urls,
    v.original_price,
    v.sale_price,
    v.description,
    v.short_description,
    v.brand_name,
    v.keywords,
    v.stock_quantity,
    v.status,
    v.is_active
  FROM (
    VALUES
      (
        'wd-olive-oil-500',
        101,
        '프리미엄 올리브오일 500ml',
        'food',
        ARRAY['all', 'food']::TEXT[],
        'normal',
        'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
        ARRAY[
          'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1200&q=80'
        ]::TEXT[],
        28900,
        23900,
        '스페인산 엑스트라 버진 올리브오일. 샐러드, 파스타, 드레싱에 활용하기 좋은 500ml 대용량.',
        '엑스트라 버진 · 500ml · 즉시 결제',
        '올리브하우스',
        ARRAY['올리브오일', 'EVOO', '식품', '프리미엄']::TEXT[],
        120,
        'active',
        TRUE
      ),
      (
        'wd-earbuds-case',
        102,
        '무선 이어폰 하드 케이스',
        'digital',
        ARRAY['all', 'digital']::TEXT[],
        'normal',
        'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=800&q=80',
        ARRAY[
          'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=1200&q=80'
        ]::TEXT[],
        15900,
        12900,
        '충격 흡수 하드 케이스. AirPods·갤럭시버즈 등 대부분의 무선 이어폰과 호환.',
        '하드케이스 · 충격방지 · 즉시 결제',
        'TechPouch',
        ARRAY['이어폰케이스', '액세서리', '디지털']::TEXT[],
        200,
        'active',
        TRUE
      ),
      (
        'wd-jeju-citrus-5kg',
        103,
        '제주 감귤 5kg',
        'local',
        ARRAY['all', 'local', 'food']::TEXT[],
        'groupbuy',
        'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=800&q=80',
        ARRAY[
          'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=1200&q=80'
        ]::TEXT[],
        39900,
        29900,
        '제주 서귀포 산지직송 고당도 감귤 5kg. 당도 선별 후 포장 발송.',
        '산지직송 · 5kg · 공동구매',
        '제주Farm',
        ARRAY['감귤', '제주', '지역특산', '과일']::TEXT[],
        NULL,
        'active',
        TRUE
      ),
      (
        'wd-premium-skincare',
        104,
        '프리미엄 화장품 5종 세트',
        'beauty',
        ARRAY['all', 'beauty']::TEXT[],
        'groupbuy',
        'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80',
        ARRAY[
          'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=1200&q=80'
        ]::TEXT[],
        89000,
        59900,
        '토너·에센스·크림·아이크림·마스크팩 5종 구성. 민감성 피부도 사용 가능한 저자극 포뮬러.',
        '5종 풀세트 · 공동구매',
        'GlowLab',
        ARRAY['스킨케어', '화장품', '뷰티', '세트']::TEXT[],
        NULL,
        'active',
        TRUE
      ),
      (
        'wd-dogfood-10kg',
        105,
        '반려견 사료 10kg',
        'pet',
        ARRAY['all', 'pet']::TEXT[],
        'groupbuy',
        'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80',
        ARRAY[
          'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1200&q=80'
        ]::TEXT[],
        89000,
        64900,
        '단백질 28% 함유 프리미엄 건사료. 알러지 유발 성분 배제, 전연령견 대응.',
        '10kg · 저알러지 · 공동구매',
        'PetNature',
        ARRAY['강아지사료', '반려동물', '펫푸드']::TEXT[],
        NULL,
        'active',
        TRUE
      ),
      (
        'wd-baby-food-12',
        106,
        '유기농 아기 이유식 12팩',
        'baby',
        ARRAY['all', 'baby', 'food']::TEXT[],
        'groupbuy',
        'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80',
        ARRAY[
          'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80'
        ]::TEXT[],
        42000,
        29900,
        'HACCP 인증 유기농 재료로 만든 이유식 12팩. 6~12개월 단계별 구성.',
        '유기농 · 12팩 · 공동구매',
        'BabyFresh',
        ARRAY['이유식', '육아', '유기농', '아기']::TEXT[],
        NULL,
        'active',
        TRUE
      ),
      (
        'wd-wando-seaweed',
        107,
        '완도 미역 500g 5봉',
        'local',
        ARRAY['all', 'local', 'food']::TEXT[],
        'groupbuy',
        'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=800&q=80',
        ARRAY[
          'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=1200&q=80'
        ]::TEXT[],
        35000,
        24900,
        '완도 산지직송 자연산 미역. 미역국·무침용으로 두께와 향이 우수한 프리미엄 미역.',
        '완도산 · 500g×5 · 공동구매',
        '완도바다',
        ARRAY['미역', '완도', '지역특산', '해조류']::TEXT[],
        NULL,
        'active',
        TRUE
      ),
      (
        'wd-hotel-towel-6',
        108,
        '호텔 순면 수건 6장',
        'living',
        ARRAY['all', 'living']::TEXT[],
        'groupbuy',
        'https://images.unsplash.com/photo-1600369671236-e74521d4b6ad?auto=format&fit=crop&w=800&q=80',
        ARRAY[
          'https://images.unsplash.com/photo-1600369671236-e74521d4b6ad?auto=format&fit=crop&w=1200&q=80'
        ]::TEXT[],
        45900,
        29900,
        '40수 순면 호텔 타월 6장 세트. 흡수력과 내구성이 뛰어난 데일리 수건.',
        '40수 순면 · 6장 · 공동구매',
        'HomeLinens',
        ARRAY['수건', '생활용품', '순면', '타월']::TEXT[],
        NULL,
        'active',
        TRUE
      )
  ) AS v(
    slug,
    legacy_id,
    name,
    category,
    category_tags,
    product_type,
    image_url,
    detail_image_urls,
    original_price,
    sale_price,
    description,
    short_description,
    brand_name,
    keywords,
    stock_quantity,
    status,
    is_active
  )
  JOIN category_map c ON c.slug = v.category
  ON CONFLICT (slug) DO UPDATE
  SET
    legacy_id = EXCLUDED.legacy_id,
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    category_id = EXCLUDED.category_id,
    category_tags = EXCLUDED.category_tags,
    product_type = EXCLUDED.product_type,
    image_url = EXCLUDED.image_url,
    detail_image_urls = EXCLUDED.detail_image_urls,
    original_price = EXCLUDED.original_price,
    sale_price = EXCLUDED.sale_price,
    description = EXCLUDED.description,
    short_description = EXCLUDED.short_description,
    brand_name = EXCLUDED.brand_name,
    keywords = EXCLUDED.keywords,
    stock_quantity = EXCLUDED.stock_quantity,
    status = EXCLUDED.status,
    is_active = EXCLUDED.is_active
  RETURNING id, slug, product_type, original_price, sale_price, name
),
deal_specs AS (
  SELECT *
  FROM (
    VALUES
      (
        'wd-olive-oil-500',
        'main',
        0,
        9999,
        23900,
        23900,
        '[]'::JSONB,
        '인기',
        INTERVAL '30 days',
        'active'
      ),
      (
        'wd-earbuds-case',
        'rising',
        0,
        9999,
        12900,
        12900,
        '[]'::JSONB,
        '신규',
        INTERVAL '30 days',
        'active'
      ),
      (
        'wd-jeju-citrus-5kg',
        'main',
        118,
        150,
        24900,
        18900,
        '[
          {"minQty": 1, "price": 39900},
          {"minQty": 10, "price": 29900},
          {"minQty": 30, "price": 24900},
          {"minQty": 50, "price": 18900}
        ]'::JSONB,
        '마감임박',
        INTERVAL '2 days',
        'active'
      ),
      (
        'wd-premium-skincare',
        'rising',
        62,
        100,
        54900,
        44900,
        '[
          {"minQty": 1, "price": 89000},
          {"minQty": 10, "price": 64900},
          {"minQty": 30, "price": 54900},
          {"minQty": 50, "price": 44900}
        ]'::JSONB,
        '인기',
        INTERVAL '5 days',
        'active'
      ),
      (
        'wd-dogfood-10kg',
        'daily',
        95,
        120,
        59900,
        49900,
        '[
          {"minQty": 1, "price": 89000},
          {"minQty": 10, "price": 69900},
          {"minQty": 30, "price": 59900},
          {"minQty": 50, "price": 49900}
        ]'::JSONB,
        '인기',
        INTERVAL '7 days',
        'active'
      ),
      (
        'wd-baby-food-12',
        'food',
        44,
        80,
        26900,
        21900,
        '[
          {"minQty": 1, "price": 42000},
          {"minQty": 10, "price": 32900},
          {"minQty": 30, "price": 26900},
          {"minQty": 50, "price": 21900}
        ]'::JSONB,
        '급상승',
        INTERVAL '4 days',
        'active'
      ),
      (
        'wd-wando-seaweed',
        'food',
        71,
        90,
        21900,
        17900,
        '[
          {"minQty": 1, "price": 35000},
          {"minQty": 10, "price": 27900},
          {"minQty": 30, "price": 21900},
          {"minQty": 50, "price": 17900}
        ]'::JSONB,
        '인기',
        INTERVAL '6 days',
        'active'
      ),
      (
        'wd-hotel-towel-6',
        'closing',
        147,
        160,
        26900,
        21900,
        '[
          {"minQty": 1, "price": 45900},
          {"minQty": 10, "price": 34900},
          {"minQty": 30, "price": 26900},
          {"minQty": 50, "price": 21900}
        ]'::JSONB,
        '마감임박',
        INTERVAL '1 day',
        'active'
      )
  ) AS d(
    product_slug,
    section,
    current_participants,
    target_participants,
    group_price,
    lowest_price,
    price_tiers,
    badge,
    ends_in,
    status
  )
),
upserted_deals AS (
  INSERT INTO group_buy_deals (
    product_id,
    title,
    section,
    current_participants,
    target_participants,
    group_price,
    lowest_price,
    price_tiers,
    badge,
    starts_at,
    ends_at,
    status
  )
  SELECT
    p.id,
    p.name,
    d.section,
    d.current_participants,
    d.target_participants,
    d.group_price,
    d.lowest_price,
    d.price_tiers,
    d.badge,
    NOW(),
    NOW() + d.ends_in,
    d.status
  FROM deal_specs d
  JOIN upserted_products p ON p.slug = d.product_slug
  ON CONFLICT (product_id) DO UPDATE
  SET
    title = EXCLUDED.title,
    section = EXCLUDED.section,
    current_participants = EXCLUDED.current_participants,
    target_participants = EXCLUDED.target_participants,
    group_price = EXCLUDED.group_price,
    lowest_price = EXCLUDED.lowest_price,
    price_tiers = EXCLUDED.price_tiers,
    badge = EXCLUDED.badge,
    starts_at = EXCLUDED.starts_at,
    ends_at = EXCLUDED.ends_at,
    status = EXCLUDED.status
  RETURNING id, product_id
)
SELECT sync_price_tiers_from_jsonb(ud.id)
FROM upserted_deals ud;

-- Normal products: single-tier relational rows for legacy readers.
INSERT INTO price_tiers (deal_id, required_participants, price, tier_order)
SELECT
  gbd.id,
  1,
  p.sale_price,
  1
FROM group_buy_deals gbd
JOIN products p ON p.id = gbd.product_id
WHERE p.product_type = 'normal'
ON CONFLICT (deal_id, tier_order) DO UPDATE
SET
  required_participants = EXCLUDED.required_participants,
  price = EXCLUDED.price;
