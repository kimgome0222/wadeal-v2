# CELLOH Event Tracking Plan

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Status:** Design only — **no tracking SDK, no DB writes in this task**

**Related:** `CELLOH_ANALYTICS_KPI_PLAN.md`, `lib/analytics/mock-events.ts`

---

## Principles

- **No PII** in payloads (email, phone, address, card, name)
- Use opaque IDs: `product_id`, `seller_id`, `order_id`, `session_id`
- Guest events: `user_id = null`, stable `session_id`
- Legal/consent banner before marketing analytics (future)

---

## Event catalog

### page_view

| | |
|---|---|
| **Purpose** | Funnel & traffic |
| **Payload** | `{ path, referrer?, section? }` |
| **Forbidden** | query tokens with PII |
| **KPI** | PV, bounce proxy |
| **Where** | layout / route change |

### product_view

| | |
|---|---|
| **Purpose** | SKU interest |
| **Payload** | `{ product_id, seller_id?, source? }` |
| **KPI** | views, view→cart rate |
| **Where** | `/product/[id]` |

### seller_view

| | |
|---|---|
| **Purpose** | Seller discovery |
| **Payload** | `{ seller_id, source? }` |
| **KPI** | seller profile CTR |
| **Where** | `/sellers/[id]` |

### category_click

| | |
|---|---|
| **Purpose** | Nav usage |
| **Payload** | `{ category_slug }` |
| **Where** | home chips, category bar |

### subcategory_click

| | |
|---|---|
| **Purpose** | Filter depth |
| **Payload** | `{ category_slug, sub_slug }` |
| **Where** | `/category/[slug]?sub=` |

### quick_menu_click

| | |
|---|---|
| **Purpose** | Home menu effectiveness |
| **Payload** | `{ menu_id, href }` |
| **Where** | `HomeQuickMenu` |

### search_submit

| | |
|---|---|
| **Purpose** | Search demand |
| **Payload** | `{ query_length, result_count }` — **not raw query** (or hashed) |
| **Forbidden** | full search string if PII risk |
| **Where** | `/search` |

### filter_apply / sort_apply

| | |
|---|---|
| **Purpose** | Listing refinement |
| **Payload** | `{ category_slug, filter_keys[], sort_key }` |
| **Where** | category/search lists |

### add_to_cart

| | |
|---|---|
| **Purpose** | Intent |
| **Payload** | `{ product_id, quantity, source? }` |
| **KPI** | add rate |
| **Where** | product card, detail, rails |

### remove_from_cart

| | |
|---|---|
| **Payload** | `{ product_id, quantity }` |
| **Where** | cart sheet, `/join-cart` |

### cart_quantity_change

| | |
|---|---|
| **Payload** | `{ product_id, from_qty, to_qty }` |
| **Where** | stepper controls |

### checkout_start

| | |
|---|---|
| **Purpose** | Purchase funnel |
| **Payload** | `{ cart_item_count, cart_amount_bucket }` |
| **Where** | `/checkout/[id]` |

### payment_success / payment_fail

| | |
|---|---|
| **Payload** | `{ order_id, amount_bucket, fail_reason_code? }` |
| **Forbidden** | PG raw error, card data |
| **Where** | `/payment/success`, `/payment/fail` |

### coupon_view / coupon_apply

| | |
|---|---|
| **Payload** | `{ coupon_id, applied: boolean }` |
| **Where** | `/mypage/coupons`, checkout |

### referral_share

| | |
|---|---|
| **Payload** | `{ channel: copy|kakao|link }` |
| **Where** | `/invite` |

### support_submit

| | |
|---|---|
| **Payload** | `{ category, ticket_id }` |
| **Forbidden** | free-text body |
| **Where** | `/support/contact` |

### review_submit

| | |
|---|---|
| **Payload** | `{ product_id, order_id, rating }` |
| **Forbidden** | review body text in analytics |
| **Where** | review form |

---

## Storage options (future)

| Option | Pros | Cons |
|--------|------|------|
| `events` table in Supabase | Simple | volume, cost |
| Webhook → warehouse | Scalable | infra |
| Client-only mock | Current | no prod insight |

**Current:** `lib/analytics/mock-events.ts` — local counters only

---

## Admin / seller metrics mapping

| Event | Admin KPI | Seller KPI |
|-------|-----------|------------|
| product_view | top SKUs | own SKU views |
| add_to_cart | funnel | conversion |
| payment_success | GMV | sales |
| search_submit | demand gaps | — |

See `CELLOH_ANALYTICS_KPI_PLAN.md`

---

## Forbidden fields (all events)

- email, phone, name, address
- card number, billing key
- access/refresh tokens
- government IDs
- free-text CS/review content

---

## Related

- `CELLOH_DATA_MODEL_PLAN.md` → events entity
- `CELLOH_DATA_RETENTION_PLAN.md` → log retention
