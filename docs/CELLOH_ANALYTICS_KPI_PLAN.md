# CELLOH Analytics & KPI Plan

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Scope:** KPI definitions + event schema — **no DB aggregation, no external analytics**

**UI:** `/admin/dashboard`, `/seller/dashboard`, `lib/analytics/mock-events.ts`

---

## Revenue KPIs

| Metric | Definition | Admin | Seller |
|--------|------------|-------|--------|
| 오늘 매출 | Paid order GMV (day) | ✅ mock | — |
| 이번 달 매출 | Month-to-date revenue | — | ✅ mock |
| 확정 매출 | Confirmed/settled amount | ✅ stats | ✅ stats |
| 환불 금액 | Refunded total | ✅ stats | ✅ stats |
| 정산 예정 | Pending settlement | — | ✅ mock |

---

## Order KPIs

| Metric | Admin | Seller |
|--------|-------|--------|
| 오늘 주문 | ✅ | ✅ |
| 결제 완료 | ✅ | ✅ |
| 배송 준비/대기 | — | ✅ |
| 취소/환불 요청 | ✅ | ✅ |

---

## Product KPIs (mock per SKU)

| Metric | Source |
|--------|--------|
| 조회수 | `getMockProductMetrics` |
| 장바구니 담기 | seed from productKey |
| 구매 수 | seed |
| 리뷰 수 / 평균 별점 | seed |
| 재구매율 | mock % |
| 할인율 | product price |
| 전환율 | purchases / views |

**Display:** `ProductMetricsMockRow` on admin/seller product lists.

---

## Seller KPIs

| Metric | Route |
|--------|-------|
| 답변 대기 문의 | `/seller/inquiries` |
| 새 리뷰 | `/seller/reviews` |
| 검수/반려 상품 | `/seller/product-requests` |
| 재구매율 mock | dashboard card |

---

## Customer behavior KPIs (future)

| Metric | Events |
|--------|--------|
| DAU/MAU | session_start (future) |
| Conversion | product_view → purchase_complete |
| Search usage | search_submit count |
| Quick Menu CTR | quick_menu_click |
| Referral funnel | referral_share → signup |

---

## Coupon / referral KPIs

| Metric | Admin mock |
|--------|------------|
| 쿠폰 사용 건수 | `/admin/coupons` |
| Referral signups | future |
| Referral first purchase | future |
| Coupon cost / ROI | `CELLOH_COUPON_COST_CONTROL.md` |

---

## Review / CS KPIs

| Metric | Admin |
|--------|-------|
| 답변 대기 문의 | `/admin/support` |
| 신고 접수 | `/admin/review-reports` |
| Avg response time | future |

---

## Member / seller growth

| Metric | Admin mock |
|--------|------------|
| 신규 회원 | `/admin/members` |
| 신규 판매자 신청 | `/admin/sellers` |
| 검수 대기 상품 | `/admin/product-requests` |

---

## Client events (typed, no-op send)

Defined in `lib/analytics/mock-events.ts`:

| Event | Trigger (future) |
|-------|------------------|
| `product_view` | PDP mount |
| `add_to_cart` | + / cart sheet |
| `remove_from_cart` | quantity 0 |
| `checkout_start` | checkout page |
| `purchase_complete` | payment success |
| `coupon_apply` | tier/code applied |
| `search_submit` | search form |
| `category_click` | category nav |
| `quick_menu_click` | home quick menu |
| `seller_view` | seller profile |
| `referral_share` | invite copy/share |

**Usage:** `trackCellohEvent("product_view", { product_slug: "..." })`

---

## Privacy rules

**Never track in payload:**

- email, phone, full address, name
- access/refresh tokens, payment keys
- raw order PII

**Allowed:** slug, category, anonymous session id (future hash), counts.

---

## Future DB / integrations (placeholder)

| Layer | Candidate |
|-------|-----------|
| Events table | Supabase `analytics_events` |
| Daily rollup | Materialized view / cron |
| Admin charts | `/admin/dashboard` charts |
| External | GA4, Amplitude, Mixpanel — post legal review |

**This task:** no migrations, no RLS changes.

---

## Related docs

| Doc | Topic |
|-----|-------|
| `CELLOH_REVENUE_MODEL.md` | Monetization |
| `CELLOH_OPERATIONS_RUNBOOK.md` | Daily ops |
| `CELLOH_ERROR_LOGGING_PLAN.md` | Error vs analytics |
| `README_CELLOH.md` | Doc hub |

**`CELLOH_ADMIN_OPERATIONS_CHECKLIST.md`:** 추후 생성

---

## Dashboard implementation status

| Surface | Status |
|---------|--------|
| Admin KPI cards | ✅ `AdminKpiSummarySection` |
| Seller KPI cards | ✅ `SellerDashboardMockSummary` |
| Product metrics row | ✅ mock |
| Real aggregation | ⏳ future |
