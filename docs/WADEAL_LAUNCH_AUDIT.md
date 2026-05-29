# Wadeal Launch Audit

> Generated: 2026-05-29 (안정화 Phase)  
> Project: `ptbwemzxkmurwxbjaiwu`  
> Scope: Wadeal only — no Celloh/KIBI mixing

---

## Executive Summary

| Item | Status |
|------|--------|
| **Build** | PASS (`npm run build`, Next.js 16.2.6) |
| **public.users (051 v3)** | Applied |
| **오픈 가능 여부** | **조건부 NO** — env + migration 018/033/036/047/048/049/050 미적용 |

---

## DB State (REST probe)

| Migration | Table / Column | Status | Depends on |
|-----------|----------------|--------|------------|
| 051 v3 | `public.users` | Applied | auth.users |
| 018 | `support_tickets` | **Missing** | users |
| 033 | `notification_settings` | **Missing** | users |
| 036 | `settlement_records` | **Missing** | sellers, users |
| 042 | `seller_product_requests` | Applied | sellers, users |
| 047 | `profile_usernames` | **Missing** | auth.users |
| 048 | `featured_search_terms` | **Missing** | users (admin RLS) |
| 049 | `settlement_records.payout_*` | **Missing** | 036 |
| 050 | `admin_banners`, `admin_events`, `admin_category_overrides` | **Missing** | is_admin_user |

---

## Environment

| Variable | Status | Impact |
|----------|--------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Set | Core |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Set (sb_publishable) | Client/SSR auth |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | N/A (publishable alias used) | — |
| `SUPABASE_SERVICE_ROLE_KEY` | **Missing** | admin members, seller orders, Q&A read, settlements |
| `NEXT_PUBLIC_TOSS_CLIENT_KEY` | **Missing** | Production payment widget |
| `TOSS_SECRET_KEY` | **Missing** | Payment confirm/refund API |

---

## Completed Features (Code)

### Buyer
- Login (username, Kakao, Google)
- Product browse / search / PDP
- Join cart, checkout, orders, payment flow (Toss code)
- Order detail, reviews, Q&A UI

### Seller
- Product registration request (`/seller/products/new`)
- **Product edit** (`/seller/products/[id]/edit`) — name, price, stock, image, description
- Orders, inquiries, settlements UI

### Admin
- Members, sellers, products CRUD, orders, coupons
- **Product approval center** (`/admin/product-requests`) — approve/reject seller requests

---

## Incomplete / Blocked

| Area | Blocker |
|------|---------|
| Username signup/login mapping | 047 |
| Q&A, support tickets | 018 |
| Notification settings DB | 033 |
| Seller payout | 036 + 049 |
| CMS persistence | 050 |
| Featured search | 048 |
| Real payments | Toss env |
| Admin/seller data reads | service_role key |
| Phone verification | mock UI on signup |

---

## QA Matrix (Code + DB readiness)

### Buyer

| Feature | Result | Note |
|---------|--------|------|
| 회원가입 | **FAIL** | phone mock; 047 missing |
| 로그인 | **PARTIAL** | OAuth OK; username OK if auth email exists |
| 상품조회 | **PASS** | |
| 주문 | **PASS** | code |
| 결제 | **FAIL** | Toss keys missing |
| 주문조회 | **PASS** | |
| 배송조회 | **PARTIAL** | link-out only |
| 리뷰 | **PASS** | |
| Q&A | **FAIL** | support_tickets missing |

### Seller

| Feature | Result | Note |
|---------|--------|------|
| 상품등록 | **PASS** | request flow |
| 상품수정 | **PASS** | code ready |
| 주문관리 | **PARTIAL** | needs service_role |
| 문의관리 | **PARTIAL** | product Q&A needs 018 |
| 정산 | **FAIL** | 036/049 missing |

### Admin

| Feature | Result | Note |
|---------|--------|------|
| 회원관리 | **PARTIAL** | needs service_role |
| 판매자관리 | **PASS** | |
| 상품관리 | **PASS** | |
| 상품승인센터 | **PASS** | code; 042 applied |
| 주문관리 | **PASS** | |
| 쿠폰관리 | **PASS** | |
| 카테고리/배너/이벤트 | **FAIL** | 050 missing → in-memory |

---

## Open Blockers (P0 / P1 / P2)

### P0
1. `SUPABASE_SERVICE_ROLE_KEY` — admin members, seller orders, Q&A
2. `018_support_tickets.sql` — Q&A, CS
3. `047_profile_usernames.sql` — username auth
4. Toss PG keys — real payments
5. `036` + `049` — seller settlement/payout

### P1
6. `050_admin_cms_tables.sql` — CMS persistence
7. `048_featured_search_terms` — home/admin search
8. `033_notification_settings` — mypage alerts DB
9. Phone verification mock — signup production gate

### P2
10. Live shipping API — link-only today
11. OAuth Naver/Apple/Samsung — disabled in prod UI
12. `request_account_withdrawal` vs account guard trigger

---

## Recommended DB Apply Order (Dashboard SQL Editor)

```
[Done] 051 v3 bootstrap + admin + role guard
1. 018_support_tickets.sql
2. 047_profile_usernames.sql
3. 048 (or APPLY_047_048_049 combined 048 section)
4. 033_mypage_profile_fields.sql (notification_settings only if needed)
5. 036_seller_settlement_records.sql
6. 049_seller_payout_request.sql
7. 050_admin_cms_tables.sql
```

---

## Files Changed (Stabilization Phase)

- `lib/data/seller-products.ts` — edit + stock
- `app/actions/seller-products.ts`
- `components/seller-product-edit-form.tsx`
- `app/seller/products/[id]/edit/page.tsx`
- `lib/data/admin-seller-product-requests.ts`
- `app/actions/admin-seller-product-requests.ts`
- `app/admin/product-requests/page.tsx`
- `app/admin/seller-product-requests/page.tsx`
- `components/admin-seller-product-requests-content.tsx`
- `lib/seller-product-request-labels.ts`
- `components/admin-nav.tsx`, `components/seller-products-content.tsx`

---

## Estimated Remaining Work

| Task | Time |
|------|------|
| Env keys (service_role + Toss) | 30 min |
| DB migrations 018/047/048/033/036/049/050 | 1–2 h (manual + verify) |
| E2E smoke after migrations | 2–3 h |
| Phone verification provider | 1–2 d |
| **Total to soft launch** | **~1 day** (migrations + env + smoke) |

---

## Build Log

| Step | Build |
|------|-------|
| 1 Environment | PASS |
| 2 Migration probe | PASS (no code change) |
| 3–4, 7–9 DB apply | Skipped — manual Dashboard required |
| 5–6 Code | PASS |
| 10–12 QA (static) | PASS (analysis) |
| Final | PASS |
