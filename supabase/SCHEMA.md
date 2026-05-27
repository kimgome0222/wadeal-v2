# Wadeal Supabase schema

Apply migrations in order via the Supabase SQL editor or CLI:

```bash
supabase db push
```

## Tables

### `users`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| kakao_id | TEXT | Unique, optional |
| email | TEXT | |
| nickname | TEXT | |
| created_at | TIMESTAMPTZ | |

### `products`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| slug | TEXT | Unique URL id (e.g. `wd-vacuum-001`) |
| legacy_id | INTEGER | Matches mock numeric ids |
| name | TEXT | |
| category | TEXT | Primary category |
| category_tags | TEXT[] | Filter tags (`food`, `digital`, …) |
| image_url | TEXT | |
| original_price | INTEGER | KRW |
| description | TEXT | |
| is_active | BOOLEAN | |
| created_at | TIMESTAMPTZ | |

### `group_buy_deals`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| product_id | UUID | FK → products |
| title | TEXT | Display title |
| section | TEXT | `main`, `closing`, `rising`, `food`, `daily` |
| current_participants | INTEGER | |
| target_participants | INTEGER | |
| group_price | INTEGER | Current tier price |
| lowest_price | INTEGER | Final tier price |
| badge | TEXT | UI badge |
| starts_at | TIMESTAMPTZ | Optional |
| ends_at | TIMESTAMPTZ | Drives countdown UI |
| status | TEXT | `draft`, `active`, `closed`, `cancelled` |
| created_at | TIMESTAMPTZ | |

### `price_tiers`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| deal_id | UUID | FK → group_buy_deals |
| required_participants | INTEGER | |
| price | INTEGER | KRW at this tier |
| tier_order | INTEGER | 1 = highest price |

### `group_buy_participants`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| deal_id | UUID | FK |
| user_id | UUID | FK → users |
| joined_at | TIMESTAMPTZ | |
| status | TEXT | `active`, `cancelled`, `completed` |

### `price_alerts`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| user_id | UUID | FK, nullable until auth |
| deal_id | UUID | FK |
| target_price | INTEGER | Optional threshold |
| notify_at_lowest_price | BOOLEAN | |
| notify_before_deadline | BOOLEAN | |
| created_at | TIMESTAMPTZ | |

### `addresses`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| user_id | UUID | FK |
| label | TEXT | |
| recipient_name | TEXT | |
| phone | TEXT | |
| address_line | TEXT | |
| postal_code | TEXT | |
| is_default | BOOLEAN | |
| created_at | TIMESTAMPTZ | |

### `payment_methods_mock`
Prototype only — no real card storage.

### `orders_mock`
Prototype only — no real payment execution.

## App data layer

Server components call `@/lib/data`:

- `getFeaturedDeals()` — homepage main grid
- `getDealsBySection(section)` — homepage sections
- `getProductsByCategory(slug)` — category pages
- `getProductDetailById(id)` — product / checkout / join flows
- `getPriceTiersByDeal(id)` — tier pricing UI
- `createPriceAlert(input)` — alert form (mock ok without DB)
- `createParticipation(input)` — checkout confirm (mock ok without DB)

Without `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`, all reads fall back to `lib/deals.ts` mock data.
