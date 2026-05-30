# CELLOH Coupon & Point Policy

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Scope:** Policy + mock UI — no actual issuance/accrual in this task

---

## Two coupon systems (current code)

| System | Location | Persisted? |
|--------|----------|------------|
| **Tier auto-discount (mock)** | `lib/coupon/tier-coupon.ts` | ❌ UI-only |
| **Server coupon codes** | `lib/discounts/coupon.ts`, checkout RPC | ✅ when Supabase configured |

---

## Tier coupon (장바구니 mock)

Auto-applied by subtotal — **not combinable with other tier tiers** (highest tier only):

| Min subtotal | Discount |
|--------------|----------|
| 30,000원 | 3,000원 |
| 50,000원 | 5,000원 |
| 70,000원 | 8,000원 |
| 100,000원 | 12,000원 |

**UI:** `/join-cart`, checkout shell, `TierCouponFillRail`  
**Free shipping mock:** 30,000원 (`FREE_SHIPPING_THRESHOLD` in `lib/growth/cart-growth-mock.ts`)

### Policy placeholders

| Rule | Placeholder |
|------|-------------|
| 중복 사용 | Tier 1장 + 서버 쿠폰 1장 — **운영 확정 필요** |
| 상품 vs 장바구니 | Tier = 장바구니 mock; server = both types |
| 최소 결제금액 | Tier threshold = min order |
| 유효기간 | Tier: 주문 시점 / Server: coupon record |
| 취소/환불 복원 | **전액 취소 시 복원, 부분환불 비례 회수 — placeholder** |
| 부분환불 | 할인액 비례 차감 원칙 — placeholder |

---

## Server coupon types

From `lib/discounts/types.ts`:

- `fixed_amount` — 정액
- `percentage` — 정률
- `free_shipping` — 배송비

Validation errors: `coupon_not_found`, `coupon_inactive`, `coupon_expired`, `min_order_not_met`, etc.

**Checkout:** `CheckoutDiscountSection` + `validateAndPreviewDiscountsAction`  
**History:** `/mypage/benefits` — usage list; empty → FAQ links

---

## Coupon categories (business)

| Type | Example | Status |
|------|---------|--------|
| 상품 쿠폰 | SKU-specific | Server when configured |
| 장바구니 쿠폰 | WELCOME10 mock | `lib/data/benefits.ts` mock |
| 친구추천 쿠폰 | 3,000원 signup | Mock copy only — see referral policy |
| 셀로쿠폰 컬렉션 | `/collections/celloh-coupon` | Display mock |

---

## Points policy (placeholder)

**Code:** `lib/discounts/points.ts`  
**Types:** `earn`, `use`, `refund`, `expire`, `adjust`  
**Mock balance:** 5,000P when mock data enabled

| Event | Accrual (placeholder) |
|-------|----------------------|
| 리뷰 작성 | TBD P — not auto-granted |
| 구매 확정 | TBD % — not implemented |
| 이벤트 | Admin manual `adjust` |
| 사용 최소 단위 | 100P placeholder |
| 환불 시 회수 | Proportional to refund amount |
| 소멸 | 12 months inactive — placeholder copy |

**Routes:**
- `/mypage/points` ✅
- `/mypage/benefits` ✅ combined view
- Empty state: "포인트 내역이 없어요" + policy links

---

## UI audit

| Screen | Coupon | Points |
|--------|--------|--------|
| `/join-cart` | Tier banner + notice | — |
| `/checkout/[id]` | Tier + server section | Checkout discount |
| `/mypage/benefits` | Usage history / empty | Balance + tx |
| `/support/coupons` | FAQ | FAQ |

---

## Related docs

- `docs/CELLOH_REFERRAL_REWARD_POLICY.md`
- `docs/CELLOH_DELIVERY_REFUND_OPERATIONS.md`
- `/policies/payment`, `/policies/refund`
