# CELLOH Data Model Plan

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Status:** Planning doc only — **no SQL, no migration, no schema change**

**Related:** `docs/CELLOH_STATUS_VALUES.md`, `docs/CELLOH_ORDER_STATE_MACHINE.md`, `supabase/migrations/*` (reference only)

---

## Legend

| Impl | Meaning |
|------|---------|
| ✅ partial | Tables/migrations exist; app uses mix of DB + mock |
| 🔶 mock | UI/local/mock data only |
| ⏳ planned | Documented; not wired end-to-end |
| P0/P1/P2 | Build priority |

**RLS:** direction only — see `CELLOH_RLS_PERMISSION_PLAN.md`

---

## Entity overview

```
users ──┬── profiles
        ├── addresses
        ├── carts / cart_items
        ├── orders ──┬── order_items
        │            ├── payments
        │            ├── shipments
        │            └── refunds
        ├── coupon_issues ── coupons
        ├── points_ledger
        ├── referrals
        ├── notifications
        └── support_tickets

sellers ──┬── seller_profiles (public)
          ├── products ──┬── product_images
          │              ├── product_categories
          │              └── product_reviews / product_questions
          └── settlements

reports ── admin_logs
events (analytics) ── separate store / warehouse
```

---

## users / profiles

| | |
|---|---|
| **Purpose** | Auth identity + buyer profile |
| **Key fields** | `id`, `email`, `role`, `name`, `phone`, `avatar_url`, `username`, marketing consent |
| **Relations** | 1:1 `profiles`, 1:N orders, tickets, notifications |
| **Status** | active, withdrawn (see retention plan) |
| **RLS** | User read/update own row; admin read |
| **Impl** | ✅ partial (`users`, profile migrations) |
| **Priority** | P0 |

---

## sellers

| | |
|---|---|
| **Purpose** | Legal seller entity + onboarding |
| **Key fields** | `id`, `user_id`, `company_name`, `business_number`, `status`, bank account (encrypted), rejection_reason |
| **Relations** | 1:N products, orders (via product), settlements |
| **Status** | `CELLOH_STATUS_VALUES.md` → seller |
| **RLS** | Seller read own; admin read/write status |
| **Impl** | ✅ partial + 🔶 mock apply form |
| **Priority** | P0 |

---

## seller_profiles (public)

| | |
|---|---|
| **Purpose** | Buyer-facing seller page |
| **Key fields** | `seller_id`, `display_name`, `tagline`, `story`, `logo_url`, `cover_url`, `region`, stats snapshots |
| **Relations** | 1:1 sellers |
| **RLS** | Public read; seller update own |
| **Impl** | 🔶 mock (`showcase-seller-profiles`, brand_name) |
| **Priority** | P1 |

---

## products

| | |
|---|---|
| **Purpose** | Sellable SKU / deal |
| **Key fields** | `id`, `seller_id`, `slug`, `title`, `price`, `original_price`, `stock`, `status`, category_ids, shipping_fee |
| **Relations** | N:1 seller; 1:N images, reviews, order_items |
| **Status** | product lifecycle in STATUS doc |
| **RLS** | Public read published; seller CRUD own; admin approve |
| **Impl** | ✅ partial catalog + 🔶 product-requests mock |
| **Priority** | P0 |

---

## product_images

| | |
|---|---|
| **Purpose** | Gallery + detail images |
| **Key fields** | `product_id`, `url`, `sort_order`, `alt`, `kind` (main/detail) |
| **RLS** | Follow product ownership |
| **Impl** | ✅ partial (storage migrations) |
| **Priority** | P1 |

---

## product_categories

| | |
|---|---|
| **Purpose** | Navigation + filtering |
| **Key fields** | `slug`, `name`, `parent_id`, `sort_order` |
| **Relations** | M:N products ↔ categories |
| **RLS** | Public read; admin write |
| **Impl** | ✅ partial |
| **Priority** | P1 |

---

## product_reviews

| | |
|---|---|
| **Purpose** | Post-purchase reviews |
| **Key fields** | `id`, `product_id`, `user_id`, `order_id`, `rating`, `body`, `images`, `status` |
| **Relations** | N:1 product, user |
| **RLS** | Public read approved; user create own; seller read on own products |
| **Impl** | ✅ partial |
| **Priority** | P0 |

---

## product_questions

| | |
|---|---|
| **Purpose** | Pre-purchase Q&A |
| **Key fields** | `id`, `product_id`, `user_id`, `question`, `answer`, `answered_at`, `status` |
| **RLS** | Public read; user ask; seller/admin answer |
| **Impl** | ✅ partial + mock panels |
| **Priority** | P1 |

---

## carts

| | |
|---|---|
| **Purpose** | Pre-checkout basket |
| **Key fields** | `user_id` or session, `updated_at` |
| **Relations** | 1:N `cart_items` (product_id, qty, selected_options) |
| **RLS** | Owner only |
| **Impl** | 🔶 guest localStorage + logged-in partial |
| **Priority** | P0 |

---

## orders / order_items

| | |
|---|---|
| **Purpose** | Purchase contract |
| **Key fields** | `id`, `user_id`, `order_status`, `payment_status`, `shipping_status`, totals, address snapshot |
| **order_items** | `order_id`, `product_id`, `seller_id`, `qty`, `unit_price`, `title_snapshot` |
| **Relations** | N:1 user; 1:N items, payments, shipments |
| **Status** | See STATUS doc + `lib/orders/order-status.ts` |
| **RLS** | User own orders; seller orders for their SKUs; admin all |
| **Impl** | ✅ partial |
| **Priority** | P0 |

---

## payments

| | |
|---|---|
| **Purpose** | PG transaction record |
| **Key fields** | `order_id`, `provider`, `payment_key`, `amount`, `status`, `paid_at`, webhook_log |
| **RLS** | User read own; admin ops; no seller direct PG access |
| **Impl** | ✅ partial (Toss routes mock/live toggle) |
| **Priority** | P0 |

---

## refunds

| | |
|---|---|
| **Purpose** | Cancel/return money flow |
| **Key fields** | `order_id`, `order_item_id`, `reason`, `amount`, `status`, `processed_at` |
| **RLS** | User request; seller view related; admin approve |
| **Impl** | ✅ partial + admin UI |
| **Priority** | P0 |

---

## shipments

| | |
|---|---|
| **Purpose** | Fulfillment tracking |
| **Key fields** | `order_id`, `carrier`, `tracking_number`, `shipped_at`, `delivered_at` |
| **RLS** | User read own; seller update own orders |
| **Impl** | ✅ partial |
| **Priority** | P0 |

---

## coupons / coupon_issues

| | |
|---|---|
| **Purpose** | Platform/seller discounts |
| **coupons** | rules, budget, validity, type (fixed/percent) |
| **coupon_issues** | `coupon_id`, `user_id`, `issued_at`, `used_at`, `order_id` |
| **RLS** | User read own issues; admin CRUD campaigns |
| **Impl** | 🔶 mock wallet `/mypage/coupons` |
| **Priority** | P1 |

---

## points

| | |
|---|---|
| **Purpose** | Point ledger |
| **Key fields** | `user_id`, `delta`, `balance_after`, `reason`, `ref_type`, `ref_id` |
| **RLS** | User read own; system write via RPC |
| **Impl** | ⏳ planned |
| **Priority** | P2 |

---

## referrals

| | |
|---|---|
| **Purpose** | Invite + reward tracking |
| **Key fields** | `referrer_id`, `referee_id`, `code`, `status`, `reward_issued_at`, fraud_flags |
| **RLS** | User read own; admin fraud review |
| **Impl** | 🔶 mock `/invite`, `/mypage/invite` |
| **Priority** | P2 |

---

## notifications

| | |
|---|---|
| **Purpose** | In-app alerts by role |
| **Key fields** | `user_id`, `role_target`, `type`, `title`, `body`, `read_at`, `link` |
| **RLS** | Recipient read/update read; system insert |
| **Impl** | ✅ partial + template docs |
| **Priority** | P1 |

---

## support_tickets

| | |
|---|---|
| **Purpose** | CS 1:1 |
| **Key fields** | `user_id`, `category`, `subject`, `body`, `status`, `assigned_admin_id` |
| **Relations** | 1:N `support_replies` |
| **RLS** | User own; admin all; seller only product-linked subset (future) |
| **Impl** | ✅ partial + mock contact |
| **Priority** | P1 |

---

## reports

| | |
|---|---|
| **Purpose** | User reports (review/product/seller) |
| **Key fields** | `reporter_id`, `target_type`, `target_id`, `reason`, `status`, `admin_note` |
| **RLS** | Reporter read own; admin process |
| **Impl** | 🔶 mock `/reports` |
| **Priority** | P1 |

---

## settlements

| | |
|---|---|
| **Purpose** | Seller payout periods |
| **Key fields** | `seller_id`, `period_start`, `period_end`, `gross`, `fees`, `net`, `status`, `paid_at` |
| **RLS** | Seller read own; admin confirm/hold/pay |
| **Impl** | 🔶 mock panels |
| **Priority** | P1 |

---

## admin_logs

| | |
|---|---|
| **Purpose** | Audit trail |
| **Key fields** | `admin_id`, `action`, `target_type`, `target_id`, `metadata`, `created_at` |
| **RLS** | Admin read only |
| **Impl** | ✅ partial (`admin_activity_logs`) |
| **Priority** | P1 |

---

## events / analytics

| | |
|---|---|
| **Purpose** | Product analytics (non-PII) |
| **Key fields** | `event_name`, `user_id` (nullable), `session_id`, `payload` json, `occurred_at` |
| **Store** | Supabase table and/or warehouse — TBD |
| **Impl** | 🔶 `lib/analytics/mock-events.ts` |
| **Priority** | P2 |

See `CELLOH_EVENT_TRACKING_PLAN.md`.

---

## Cross-doc index

| Topic | Doc |
|-------|-----|
| Status enums | `CELLOH_STATUS_VALUES.md` |
| Order mapping | `CELLOH_ORDER_STATE_MACHINE.md` |
| RLS | `CELLOH_RLS_PERMISSION_PLAN.md` |
| Retention | `CELLOH_DATA_RETENTION_PLAN.md` |
| Events | `CELLOH_EVENT_TRACKING_PLAN.md` |

---

## Implementation notes

- Existing migrations in `supabase/migrations/` are **reference only** — this task did not apply or add any.
- Mock layers: `lib/data/*`, `lib/sellers/mock-*`, `lib/analytics/mock-*`
- Unify customer-facing status labels via `CELLOH_STATUS_VALUES.md` before next schema pass
