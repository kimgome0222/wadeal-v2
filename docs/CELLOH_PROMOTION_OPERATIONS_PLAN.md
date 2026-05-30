# CELLOH Promotion Operations Plan

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Scope:** Mock UI + ops docs — **no coupon issuance, no payment discount changes, no DB**

**Code:** `lib/promotions/*`, `lib/home/collection-data.ts`, `/admin/promotions`

---

## Promotion catalog

| Promotion | Purpose | Exposure | Selection | Discount | Coupon | Cycle | Admin review | End condition |
|-----------|---------|----------|-----------|----------|--------|-------|--------------|---------------|
| 오늘의특가 | Daily urgency | Home rail, Quick Menu, `/collections/today-special` | Special price deals from catalog mock | Tier/listed price | Optional | Daily reset | ⏳ | Day end |
| 마감세일 | Close-out urgency | Home, Quick Menu, collection | `endingSoonDeals` | Listed price | Optional ending coupon mock | Daily 23:59 copy | ✅ copy review | Timer / sold out |
| 주말특가 | Weekend spike | Home, Quick Menu | `weekendDeals` | Listed price | Weekend coupon mock | Fri–Sun | ✅ | Weekend end |
| 쿠폰세일 | Coupon-driven basket | Home, Quick Menu, join-cart tier rail | `couponDeals` + mock coupon badge | Mock coupon price display | ✅ tier + product | Ongoing | ✅ | Campaign end |
| 셀로단독특가 | Exclusive assortment | Home Only Celloh rail | `onlyCellohDeals` | Bundle/exclusive mock | Rare | Rolling | ✅ seller SKU | Stock / campaign |
| 오늘의 최저가 | Price discovery | Home, `/collections/lowest` | 7-day mock lowest | Display only | No | Daily refresh mock | ✅ **no price guarantee** | Daily |
| 재구매율 높은 상품 | Social proof | Home, collection | Repurchase mock algo | None | Repurchase coupon optional | Weekly | ⏳ | Algorithm refresh |
| 카테고리 랭킹 | Category discovery | Home ranking, `/collections/ranking` | Popularity mock | None | No | Hourly mock | ⏳ | — |
| 셀로쿠폰 | Branded coupon event | Quick Menu, collection | Same as coupon deals | Mock coupon price | ✅ | Campaign | ✅ | Budget / date |
| 셀로 멤버십 | Subscription perks | `/membership`, Quick Menu | N/A (benefits page) | Membership coupons mock | ✅ planned | Monthly | ✅ legal/PG | Launch gate |
| 지인초대 혜택 | Acquisition | `/invite`, Quick Menu | Referral code | Signup + first purchase coupons mock | ✅ mock only | Always-on | ✅ fraud rules | Policy change |
| 신규 입점 판매자 | Seller launch | Home showcase, `/collections/new-sellers` | `NEW_SELLER_SHOWCASE` | None | Optional welcome | 30-day window | ✅ seller onboarding | Period end |
| 라이브커커스 | Future channel | `/collections/live` | Placeholder + recommended | TBD | TBD | Event-based | ✅ | Pre-launch hidden |

---

## Admin operations

| Route | Status |
|-------|--------|
| `/admin/promotions` | ✅ Mock list (예정/진행중/종료/숨김) |
| `/admin/coupons` | ✅ DB or mock fallback |
| `/admin/events` | ✅ Existing 기획전 (Supabase when configured) |

Mock promotion fields: name, period, product count, coupon flag, placements, preview link.

---

## Coupon types (mock catalog)

See `lib/promotions/mock-coupon-catalog.ts`:

- 장바구니 금액 (tier TIER30K)
- 상품 (FOOD10)
- 친구추천 (INVITE3K)
- 멤버십 (MEMSHIP-FREE — scheduled)
- 첫구매 (FIRST5K)
- 재구매 (REBUY2K)
- 주말 (WEEKEND7)
- 마감세일 (LASTCALL5)

Attributes documented in admin mock list: discount, min order, max discount, validity, categories, products, stackable, issuance/usage counts, status.

---

## Buyer touchpoints

| Surface | Link |
|---------|------|
| Join cart tier auto-apply | `/join-cart` + `JoinCartCouponNotice` |
| Mypage coupon wallet mock | `/mypage/benefits` |
| Policy | `docs/CELLOH_COUPON_POINT_POLICY.md`, `/policies/payment` |

---

## Constraints (this task)

- ❌ Real coupon DB issuance
- ❌ Payment discount logic changes
- ❌ Point accrual
- ✅ Mock UI, docs, admin preview

---

## Related

- `docs/CELLOH_PROMOTION_DISPLAY_RULES.md`
- `docs/CELLOH_REFERRAL_REWARD_POLICY.md`
- `docs/CELLOH_COUPON_POINT_POLICY.md`
