# CELLOH Admin Operation Scenarios

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Scope:** 관리자 QA — mock/read-heavy, DB write는 future

**Related:** `docs/CELLOH_OPERATIONS_RUNBOOK.md`, `docs/CELLOH_ADMIN_MESSAGE_TEMPLATES.md`

---

## Scenario summary

| # | Scenario | Route | Mock today | DB write (future) |
|---|----------|-------|------------|-------------------|
| 1 | 판매자 승인 | `/admin/sellers`, `/admin/sellers/[id]/review` | partial UI | sellers status |
| 2 | 상품 검수 | `/admin/product-requests` | list UI | approve/reject |
| 3 | 신고 처리 | `/admin/review-reports` | mock queue | reports |
| 4 | 환불 요청 | `/admin/refunds` | UI | refund workflow |
| 5 | 쿠폰 캠페인 | `/admin/coupons`, `/admin/coupons/new` | forms | coupons |
| 6 | 친구추천 부정 | `/admin/viral` | dashboard mock | fraud rules |
| 7 | 공지 등록 | `/admin/seller-notices/new` | form | notices |
| 8 | 정산 보류 | `/admin/settlements`, `/admin/settlements/[id]` | mock | hold flag |
| 9 | 정책 업데이트 | `/policies/[slug]`, `/admin/settings/business` | static content | CMS |

---

## 1. 판매자 승인

| Item | Detail |
|------|--------|
| **Route** | `/admin/sellers` → `/admin/sellers/[id]/review` |
| **Data** | application, business docs (future) |
| **Actions** | approve / reject |
| **Mock** | UI exists; full workflow TBD |
| **Notification** | `new_seller_application`, seller `application_*` |

**Priority:** P0 (launch gate)

---

## 2. 상품 검수

| Item | Detail |
|------|--------|
| **Route** | `/admin/product-requests`, `/admin/seller-product-requests` |
| **Data** | SKU, images, price |
| **Actions** | approve / reject + reason |
| **Mock** | queue display |
| **Notification** | `product_review_pending`, seller `product_*` |

**Priority:** P0

---

## 3. 신고 처리

| Item | Detail |
|------|--------|
| **Route** | `/admin/review-reports` |
| **Data** | report type, target |
| **Actions** | hide review, warn seller |
| **Mock** | from `/reports` — no persistence |
| **Notification** | `report_received` |

**Priority:** P1

---

## 4. 환불 요청 확인

| Item | Detail |
|------|--------|
| **Route** | `/admin/refunds` |
| **Data** | order, amount, reason |
| **Actions** | approve refund → PG |
| **Mock** | status UI |
| **Notification** | `refund_spike`, customer `refund_*` |

**Priority:** P0

---

## 5. 쿠폰 캠페인 생성

| Item | Detail |
|------|--------|
| **Route** | `/admin/coupons`, `/admin/coupons/new`, `/admin/promotions` |
| **Data** | budget, rules, dates |
| **Actions** | create / pause |
| **Mock** | admin forms |
| **Notification** | `coupon_budget_exceeded` |

**Priority:** P1

---

## 6. 친구추천 부정 이용 검토

| Item | Detail |
|------|--------|
| **Route** | `/admin/viral` |
| **Data** | referral patterns (future) |
| **Actions** | block reward, flag user |
| **Mock** | KPI cards |
| **Notification** | `referral_fraud_suspect` |

**Priority:** P2

---

## 7. 공지 등록

| Item | Detail |
|------|--------|
| **Route** | `/admin/seller-notices`, `/admin/seller-notices/new` |
| **Data** | title, body, audience |
| **Actions** | publish |
| **Mock** | CRUD UI |
| **Notification** | seller `policy_update` |

**Priority:** P1

---

## 8. 정산 보류

| Item | Detail |
|------|--------|
| **Route** | `/admin/settlements`, `/admin/settlements/[id]` |
| **Data** | seller, period, amount |
| **Actions** | hold / release |
| **Mock** | settlement list |
| **Notification** | `settlement_hold` |

**Priority:** P1

---

## 9. 정책 업데이트

| Item | Detail |
|------|--------|
| **Route** | `/policies/seller`, `/admin/settings/business` |
| **Data** | policy markdown |
| **Actions** | content update + seller notice |
| **Mock** | static `lib/policies/content.ts` |
| **DB** | optional CMS later |

**Priority:** P1 (legal review)

---

## Admin auth

- `/admin/login` — role gate
- Unauthorized → `/unauthorized`

---

## Related

- [CELLOH_QA_SCENARIO_INDEX.md](./CELLOH_QA_SCENARIO_INDEX.md)
- [CELLOH_AUTH_ROLE_CHECKLIST.md](./CELLOH_AUTH_ROLE_CHECKLIST.md)
