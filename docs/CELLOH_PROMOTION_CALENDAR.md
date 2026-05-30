# CELLOH Promotion Calendar (Draft)

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Scope:** Ops scheduling reference — mock timings in UI copy

---

## Weekly rhythm

| Day | Focus | Collection / section |
|-----|-------|----------------------|
| **월** | 주간 특가 시작 | `/collections/today-special` refresh |
| **화** | 신규상품 노출 | `/collections/new`, new sellers |
| **수** | 카테고리 랭킹 | `/collections/ranking` update |
| **목** | 쿠폰세일 | `/collections/coupon-sale`, tier push |
| **금** | 주말특가 공개 | `/collections/weekend-special` |
| **토** | 마감세일 | `/collections/ending-sale` (“오늘 밤 11:59”) |
| **일** | 재구매 추천 | `/collections/repurchase` |

Admin mock: `/admin/promotions`

---

## Monthly anchors (examples)

| Week | Theme |
|------|-------|
| W1 | New seller spotlight |
| W2 | Category deep-dive (food/living/beauty rotation) |
| W3 | Coupon + membership teaser |
| W4 | Clearance / ending sale push |

---

## Seasonal calendar

| Period | Theme | Notes |
|--------|-------|-------|
| **1월** | 신년 / 겨울 | Warm food, gift sets |
| **3월** | 봄맞이 | Fresh, living, outdoor |
| **5월** | 가정의달 | Gift, beauty, food bundles |
| **6–8월** | 여름 / 장마 / 휴가 | Cold chain, travel, pet |
| **9월** | 추석 | Premium food, gift |
| **11월** | 블랙프라이데이 | Platform-wide coupon (draft) |
| **12월** | 연말 / 선물 | Only Celloh bundles |

Seasonal mock: `/collections/seasonal` (AI disclaimer)

---

## Campaign coordination

1. Ops sets dates in `/admin/promotions` (mock)  
2. Merch selects SKUs → collections  
3. Legal review for “최저가/마감” copy  
4. Smoke: `npm run smoke:content`  
5. Morning handoff: `CELLOH_MORNING_HANDOFF.md`

---

## Related

- `docs/CELLOH_PROMOTION_OPERATIONS_PLAN.md`
- `docs/CELLOH_PROMOTION_DISPLAY_RULES.md`
- `docs/CELLOH_GROWTH_MARKETING_PLAN.md`
