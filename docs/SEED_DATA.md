# Seed data guide

Production catalog seed for Wadeal v2. Categories, products, and group-buy price tiers live in Supabase; the app reads them via `@/lib/data` and `@/lib/services/deals`.

## Overview

| Layer | Table | Purpose |
|-------|-------|---------|
| Categories | `categories` | Top-level Coupang-style navigation |
| Products | `products` | Catalog metadata, images, pricing base |
| Listings | `group_buy_deals` | Active deal row, participants, deadlines, JSON tiers |
| Tier rows | `price_tiers` | Relational mirror of `group_buy_deals.price_tiers` |

**Product types**

- `normal` — instant checkout (`sale_price` / `group_price`)
- `groupbuy` — tiered pricing via `price_tiers` JSONB

**Status mapping**

| `products.status` | Visible in catalog | Notes |
|-------------------|-------------------|-------|
| `draft` | No | Set `is_active = false` |
| `active` | Yes | Default for seeded rows |
| `ended` | No | Past campaign; deal `status = closed` |
| `sold_out` | No | Set `is_active = false`, `stock_quantity = 0` |

Deal-level status uses `group_buy_deals.status`: `draft`, `active`, `closed`, `cancelled`. Admin UI maps `closed` → `ended`.

## Run the seed

### Prerequisites

Apply migrations through `022_catalog_seed_columns.sql` (adds category/product columns and deal upsert index).

### Supabase SQL Editor

1. Open your project → **SQL Editor**
2. Paste the full contents of [`supabase/seed.sql`](../supabase/seed.sql)
3. Run once — all inserts use `ON CONFLICT` upserts on `slug` / `product_id`

### Supabase CLI

```bash
supabase db execute --file supabase/seed.sql
```

### Verify

After seeding with Supabase env vars configured:

- **Home** (`/`) — sections show 제주 감귤, 올리브오일, etc.
- **Category** (`/category/food`, `/category/local`) — filtered products
- **Search** (`/search?q=감귤`) — text match on name/keywords

Without Supabase, dev fallback uses `lib/deals.ts` (same 8 products) when `shouldUseMockData()` is true.

## Add a category

Insert or upsert into `categories`:

```sql
INSERT INTO categories (slug, name, description, display_order, sort_order, is_active)
VALUES (
  'health',
  '헬스/건강',
  '건강기능식품, 영양제, 운동용품',
  9,
  9,
  TRUE
)
ON CONFLICT (slug) DO UPDATE
SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  display_order = EXCLUDED.display_order,
  sort_order = EXCLUDED.sort_order,
  is_active = EXCLUDED.is_active;
```

Required fields:

| Column | Description |
|--------|-------------|
| `name` | Display name (Korean) |
| `slug` | URL key, e.g. `food`, `local` |
| `description` | Optional admin/catalog copy |
| `display_order` | Sort order (lower = first) |
| `is_active` | `false` hides from category queries |

Also add the slug to `lib/categories.ts` (`CategorySlug`) if category pages should resolve it.

## Add a product

### 1. Product row (`products`)

```sql
INSERT INTO products (
  slug, legacy_id, name, category, category_id, category_tags,
  product_type, image_url, detail_image_urls,
  original_price, sale_price, description, short_description,
  brand_name, keywords, stock_quantity, status, is_active
)
SELECT
  'wd-example-001',
  200,
  '상품명',
  'food',
  c.id,
  ARRAY['all', 'food'],
  'groupbuy',  -- or 'normal'
  'https://images.unsplash.com/photo-...',
  ARRAY['https://images.unsplash.com/photo-...'],
  29900,
  24900,
  '상세 설명',
  '짧은 한줄 소개',
  '브랜드명',
  ARRAY['키워드1', '키워드2'],
  NULL,
  'active',
  TRUE
FROM categories c
WHERE c.slug = 'food'
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
```

Field reference:

| Seed / doc field | DB column | Notes |
|------------------|-----------|-------|
| `main_image_url` | `image_url` | Card/thumbnail |
| `detail_image_urls` | `detail_image_urls` | TEXT[] |
| `base_price` | `original_price` | Reference / 1+ tier |
| `sale_price` | `sale_price` | Normal product checkout price |
| `category_id` | `category_id` | FK → `categories.id` |
| `stock_quantity` | `stock_quantity` | Normal products only |
| `status` | `status` | `draft` / `active` / `ended` / `sold_out` |

Set `products.category` to the category slug — search filters use this column.

### 2. Listing row (`group_buy_deals`)

Every catalog product needs a deal row (including `normal` products):

```sql
INSERT INTO group_buy_deals (
  product_id, title, section,
  current_participants, target_participants,
  group_price, lowest_price, price_tiers,
  badge, starts_at, ends_at, status
)
SELECT
  p.id,
  p.name,
  'main',
  0,
  100,
  24900,
  18900,
  '[
    {"minQty": 1, "price": 29900},
    {"minQty": 10, "price": 24900},
    {"minQty": 30, "price": 21900},
    {"minQty": 50, "price": 18900}
  ]'::jsonb,
  '인기',
  NOW(),
  NOW() + INTERVAL '7 days',
  'active'
FROM products p
WHERE p.slug = 'wd-example-001'
ON CONFLICT (product_id) DO UPDATE
SET price_tiers = EXCLUDED.price_tiers,
    ends_at = EXCLUDED.ends_at;
```

| Seed field | DB column |
|------------|-----------|
| `current_quantity` | `current_participants` |
| `target_quantity` | `target_participants` |
| `start_at` | `starts_at` |
| `end_at` | `ends_at` |
| `price_tiers` | `price_tiers` (JSONB on deal) |

After upserting tiers, sync relational rows:

```sql
SELECT sync_price_tiers_from_jsonb(
  (SELECT id FROM group_buy_deals gbd
   JOIN products p ON p.id = gbd.product_id
   WHERE p.slug = 'wd-example-001')
);
```

## Enter group-buy price tiers

JSONB format on `group_buy_deals.price_tiers`:

```json
[
  { "minQty": 1, "price": 29900 },
  { "minQty": 10, "price": 24900 },
  { "minQty": 30, "price": 21900 },
  { "minQty": 50, "price": 18900 }
]
```

- `minQty` — minimum joined quantity for that tier (maps to `price_tiers.required_participants`)
- `price` — unit price in KRW at that tier
- Tiers must be ascending by `minQty`
- Set `group_price` ≈ mid-tier price, `lowest_price` = cheapest tier
- `original_price` on `products` = tier 1 price

Normal (`product_type = 'normal'`) products use a single tier or empty JSON; checkout uses `sale_price` / `group_price`.

## Mock data (dev only)

Mock fallbacks are **never used in production** (`shouldUseMockData()` in `lib/env/runtime.ts` returns `false` when `NODE_ENV=production`).

| Location | Role |
|----------|------|
| `lib/deals.ts` | Dev catalog when Supabase is unconfigured |
| `lib/data/categories.ts` | `mockCategories` array |
| `lib/pricing/mock-tiers.ts` | Tier fallback for mock deals |
| `lib/services/deals.ts` | Calls mock via `shouldUseMockData()` |
| `lib/search/query.ts` | `searchMockDeals()` |
| `lib/data/admin-stats.ts` | Admin dashboard mock aggregates |

Enable explicit mock mode in development:

```env
NEXT_PUBLIC_ALLOW_MOCK_DATA=true
```

Production requires `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`; no mock catalog is served.

## Seeded catalog (default)

**8 categories:** 식품, 생활용품, 뷰티, 패션잡화, 반려동물, 육아, 디지털/가전, 지역특산물

**8 products:**

| Slug | Type | Category |
|------|------|----------|
| `wd-olive-oil-500` | normal | food |
| `wd-earbuds-case` | normal | digital |
| `wd-jeju-citrus-5kg` | groupbuy | local |
| `wd-premium-skincare` | groupbuy | beauty |
| `wd-dogfood-10kg` | groupbuy | pet |
| `wd-baby-food-12` | groupbuy | baby |
| `wd-wando-seaweed` | groupbuy | local |
| `wd-hotel-towel-6` | groupbuy | living |

Legacy prototype slugs (`wd-citrus-001`, etc.) are deactivated by the seed script.
