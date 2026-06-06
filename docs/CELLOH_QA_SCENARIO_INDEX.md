# CELLOH QA Scenario Index

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Purpose:** 고객/판매자/관리자 시나리오 QA 허브

---

## Documents

| Area | Document |
|------|----------|
| 고객 구매 | [CELLOH_USER_PURCHASE_SCENARIOS.md](./CELLOH_USER_PURCHASE_SCENARIOS.md) |
| 고객 CS | [CELLOH_CUSTOMER_CS_SCENARIOS.md](./CELLOH_CUSTOMER_CS_SCENARIOS.md) |
| 판매자 운영 | [CELLOH_SELLER_OPERATION_SCENARIOS.md](./CELLOH_SELLER_OPERATION_SCENARIOS.md) |
| 관리자 운영 | [CELLOH_ADMIN_OPERATION_SCENARIOS.md](./CELLOH_ADMIN_OPERATION_SCENARIOS.md) |

**Automation:** `npm run smoke:check` · `scripts/qa-routes.sh` · `scripts/smoke-content.sh`

---

## 내일 확인 순서 (recommended)

1. **lint/build** — `rm -rf .next && npm run lint && npm run build`
2. **dev + smoke** — `npm run dev` → `npm run smoke:check`
3. **P0 구매** — Scenario 1·2 (`/`, `/collections/today-special`, `/join-cart`, `/checkout/[id]`)
4. **P0 CS** — 결제 실패·환불 (`/payment/fail`, `/support/refund`, `/admin/refunds`)
5. **P0 판매자** — 입점·주문·배송 mock (`/seller/apply`, `/seller/orders`)
6. **P0 관리자** — sellers·product-requests·refunds
7. **P1** — 쿠폰·판매자 프로필·문의
8. **P2** — referral·live·viral mock

---

## 런칭 전 반드시 통과 (P0)

| ID | Scenario | Key routes |
|----|----------|------------|
| BUY-1 | 홈 특가 → 결제 | `/`, `/collections/today-special`, `/product/*`, `/join-cart`, `/checkout/*` |
| BUY-2 | 카테고리 → 결제 | `/category/*`, `/cart-preview`, `/checkout/*` |
| CS-2 | 주문 취소 | `/mypage/orders`, `/orders/[id]` |
| CS-3 | 환불 요청 | `/support/refund`, `/admin/refunds` |
| CS-7 | 결제 실패 | `/payment/fail`, `/support/payment` |
| SEL-1 | 입점 신청 | `/seller/apply` |
| SEL-4/5 | 주문·배송 | `/seller/orders`, `/seller/orders/[id]` |
| ADM-1 | 판매자 승인 | `/admin/sellers` |
| ADM-2 | 상품 검수 | `/admin/product-requests` |
| ADM-4 | 환불 처리 | `/admin/refunds` |

---

## Route audit (scenario routes)

Status from `app/**/page.tsx` + `scripts/qa-routes.sh`.  
**404 금지** — unknown collection/product/seller → safe fallback (200).

### Customer — ✅ exists

| Route | Notes |
|-------|-------|
| `/` | Home |
| `/collections/today-special` | smoke ✅ |
| `/collections/celloh-coupon` | smoke ✅ |
| `/collections/recommended` | fallback target |
| `/category/food`, `?sub=fruit` | smoke ✅ |
| `/product/[id]` | smoke ✅ |
| `/join-cart` | smoke ✅ |
| `/cart-preview` | 마지막으로 둘러보기 |
| `/checkout/[id]` | smoke ✅ |
| `/payment/fail`, `/payment/success` | payment result |
| `/mypage/coupons` | coupon hub |
| `/invite`, `/mypage/invite` | referral |
| `/sellers/[id]` | smoke ✅ |
| `/support/*` | CS hub |

### Seller — ✅ exists

| Route | Notes |
|-------|-------|
| `/seller/apply` | onboarding |
| `/seller/products/new` | product request |
| `/seller/product-requests` | review status |
| `/seller/orders`, `/seller/orders/[id]` | fulfillment |
| `/seller/inquiries` | Q&A |
| `/seller/reviews` | reviews |
| `/seller/finance/settlements` | settlements |
| `/seller/suspended` | violation state |

### Admin — ✅ exists

| Route | Notes |
|-------|-------|
| `/admin/sellers`, `/admin/sellers/[id]/review` | approval |
| `/admin/product-requests` | catalog review |
| `/admin/review-reports` | reports |
| `/admin/refunds` | refunds |
| `/admin/coupons`, `/admin/coupons/new` | coupons |
| `/admin/promotions` | campaigns |
| `/admin/viral` | referral ops |
| `/admin/seller-notices/new` | notices |
| `/admin/settlements/[id]` | settlement hold |

### 추후 구현 / partial mock

| Item | Status |
|------|--------|
| Real PG payment | mock only |
| Referral reward payout | mock "예정" |
| Live commerce | `/collections/live` — prep banner |
| Business verification API | seller apply placeholder |
| Automated fraud rules | `/admin/viral` dashboard only |
| Email/Kakao/SMS send | templates only |

**No new routes required** for this QA doc task — all scenario paths map to existing pages or documented fallbacks.

---

## Quick smoke

```bash
rm -rf .next && npm run lint && npm run build
npm run dev   # terminal 1
npm run smoke:check   # terminal 2
```

---

## Related

- [CELLOH_QA_AUTOMATION_GUIDE.md](./CELLOH_QA_AUTOMATION_GUIDE.md)
- [CELLOH_SMOKE_TEST_PLAN.md](./CELLOH_SMOKE_TEST_PLAN.md)
- [CELLOH_ROUTE_LINK_AUDIT.md](./CELLOH_ROUTE_LINK_AUDIT.md)
- [README_CELLOH.md](./README_CELLOH.md)
