# CELLOH AOV Strategy

**Date:** 2026-05-31  
**Branch:** `mobile-ui`  
**Status:** Growth planning — **mock UI exists; no pricing engine changes**

**Related:** [CELLOH_UNIT_ECONOMICS.md](./CELLOH_UNIT_ECONOMICS.md), [CELLOH_COUPON_POINT_POLICY.md](./CELLOH_COUPON_POINT_POLICY.md), [CELLOH_SHIPPING_FEE_POLICY.md](./CELLOH_SHIPPING_FEE_POLICY.md)

**Code:** `lib/coupon/tier-coupon.ts`, `lib/coupon/commerce-goals.ts`, `lib/recommendations/cart-recommendations.ts`, `components/coupon/commerce-goal-banner.tsx`, `components/join-cart/join-cart-coupon-notice.tsx`

---

## Goal

Increase **average order value (AOV)** to unlock tier discounts and free shipping while improving unit economics. Tier thresholds (mock):

| AOV target | Tier unlock | Free shipping | Effective discount |
|------------|-------------|---------------|-------------------|
| **30,000원** | 3,000원 off | ✅ (≥30k) | ~10% + ship save |
| **50,000원** | 5,000원 off | ✅ | ~10% |
| **70,000원** | 8,000원 off | ✅ | ~11.4% |
| **100,000원** | 12,000원 off | ✅ | ~12% |

---

## Tactics (cross-cutting)

| Tactic | Implementation today | Owner |
|--------|---------------------|-------|
| 무료배송 기준 맞추기 | Progress bar in cart (`getCommerceGoalState`) | Product |
| 쿠폰 금액 맞추기 | Tier hint + `TierCouponFillRail` | Product |
| 함께 구매 추천 | `cart-recommendations.ts`, `CartGrowthRecommendations` | Product |
| 최근 본 상품 | `recent-products.ts`, home rails | Product |
| 재구매 상품 | Collection / repurchase mock scoring | Growth |
| 만원 이하 상품 | Category chips, fill items to threshold | Merch |
| 장바구니 하단 고정 구매 | Checkout bar on `/join-cart` | UX |
| B마트식 계속 담기 | `commerce-goal-banner`, stepper on cards | UX |
| 카테고리별 추천 | Category PLP rails, `/category/[slug]` | Merch |

---

## Strategy by AOV band

### Target: 30,000원 (entry)

**Why:** Minimum meaningful tier + free shipping (`MOCK_FREE_SHIPPING_THRESHOLD = 30_000`).

| Action | Detail |
|--------|--------|
| Messaging | "무료배송까지 {n}원" / "3만원 이상 3천원 할인" |
| Product mix | Bundle snacks + daily goods under 15k each |
| UX | Cart progress bar; suggest 1 add-on ≤ remaining gap |
| Risk | Customer adds cheapest filler — monitor margin |

**UI:** `JoinCartCouponNotice`, `CommerceGoalBanner`

---

### Target: 50,000원

**Why:** Next tier **5,000원** discount; better coupon ROI vs 30k tier.

| Action | Detail |
|--------|--------|
| Messaging | "5천원 더 받으려면 {n}원" |
| Product mix | Pair hero SKU (28k) + companion (22k) |
| UX | "같이 담으면 좋아요" rail at 35–45k subtotal |
| Cross-sell | Same seller bundle (묶음배송) |

**UI:** `getTierCouponState` next tier hint

---

### Target: 70,000원

**Why:** **8,000원** tier — strong incentive for gift / premium baskets.

| Action | Detail |
|--------|--------|
| Messaging | Seasonal gift copy; "8천원 혜택" |
| Product mix | Gift sets, premium seller story items |
| UX | Collection pages → cart with pre-selected pairs |
| Seller | Co-marketing coupon 50/50 for curated sets |

---

### Target: 100,000원

**Why:** Max tier **12,000원**; highest LTV segment.

| Action | Detail |
|--------|--------|
| Messaging | "10만원 이상 1.2만원" — VIP tone, not pushy |
| Product mix | Only Celloh bundles, multi-SKU boxes |
| UX | Membership upsell + tier stack preview |
| Ops | Manual review high-discount orders (abuse) |

---

## Funnel metrics (placeholder)

| Stage | Metric | Target |
|-------|--------|--------|
| PDP → cart | Add rate | Baseline +5% |
| Cart → checkout | Conversion | Baseline +3% |
| Subtotal distribution | % orders ≥30/50/70/100k | Track weekly |
| Filler SKU rate | % orders within ₩500 of tier | <20% (quality) |

---

## Category placement (draft)

| Category | AOV lever | Rail placement |
|----------|-----------|----------------|
| Food | Multi-pack, same seller | Cart fill + category sub-filter |
| Living | Cross-sell accessories | PDP "함께 구매" |
| Gift | Pre-built sets | Home collection |
| Under ₩10k | Threshold filler | Dedicated chip (`만원 이하`) |

**Code:** `CategoryBenefitChips`, home section copy in `lib/copy/home-section-copy.ts`

---

## What not to do

- Fake "최저가" urgency to force AOV
- Hidden fees after tier discount
- Tier thresholds that erode seller margin without co-fund agreement

See [CELLOH_PROMOTION_DISPLAY_RULES.md](./CELLOH_PROMOTION_DISPLAY_RULES.md)

---

## Hold

- Real A/B tests on tier thresholds
- Personalized fill recommendations (ML)
- Dynamic tier by category

**No cart/pricing logic changed in this task.**
