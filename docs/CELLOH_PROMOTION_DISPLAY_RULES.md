# CELLOH Promotion Display Rules

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Scope:** Display & ops policy — mock phase

---

## Home section priority (top → bottom)

1. Hero carousel  
2. Quick Menu  
3. 오늘의특가  
4. 추천상품 (+ recommendation hint)  
5. 마감세일  
6. 인기 판매자  
7. 실시간 인기상품  
8. 주말특가  
9. 카테고리 랭킹  
10. 오늘의 최저가  
11. 셀로단독특가  
12. 쿠폰세일  
13. 많이담은상품  
14. 계절/AI mock  
15. 신규상품 · 재구매 · 라이브 등

Empty sections **hidden** (`deals.length === 0` → no rail).

---

## Quick Menu priority

From `lib/home/quick-menu-items.ts`:

1. 마감세일  
2. 주말특가  
3. 쿠폰세일  
4. 셀로쿠폰  
5. … (membership, invite, ranking, etc.)

---

## Hide sold-out / ended products

| Rule | Implementation |
|------|----------------|
| 품절 overlay | `ProductCardImage` sold-out badge |
| Empty promotion rail | Section not rendered |
| Collection empty | `EmptyState` → fallback collection |
| Ended promotion (admin) | Status `ended` / `hidden` — manual mock |

⏳ Auto-hide from admin promotion status — future cron

---

## Discount / coupon display

| Element | Rule |
|---------|------|
| Tier coupon | Auto-applied mock on join-cart subtotal only |
| Coupon sale badge | `getMockCouponBadge` — not a legal discount guarantee |
| Coupon price on card | `showCouponPrice` — illustrative |
| Discount rate | Must match actual applicable discount when live |

---

## Seller-requested placements

| Step | Owner |
|------|-------|
| Seller applies via product request | Seller center |
| Admin reviews SKU, margin, copy | `/admin/product-requests` |
| Promotion slot assignment | `/admin/promotions` (future) |
| Legal/commerce review | Ops checklist |

---

## Anti-exaggeration copy

**Allowed (mock phase):**

- "오늘 밤 11:59까지" — with ops-configured end time
- "이번 주말 한정"
- "쿠폰 적용가로 더 저렴하게"
- "celloh에서만 만나는 구성"
- "최근 7일 기준 최저가 **mock**"

**Avoid until legal review:**

- "전국 최저가", "무조건 최저", "100% 환불 보장"
- Specific % off without cap disclosure
- Time-limited claims without real timer backend

Copy source: `lib/promotions/promotion-copy.ts`

---

## 마감세일 / 최저가 cautions

| Type | Required disclaimer |
|------|---------------------|
| 마감세일 | End time is ops-configured; mock uses calendar copy |
| 최저가 | "mock · 실제 최저가 보장 아님" on home + collection |
| 쿠폰가 | "mock 쿠폰가 표시" in collection description |

---

## Related

- `docs/CELLOH_PROMOTION_OPERATIONS_PLAN.md`
- `docs/CELLOH_LAUNCH_CHECKLIST.md`
- `components/collections/collection-page-content.tsx`
