# CELLOH Coupon Cost Control (Draft)

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Scope:** Cost structure + abuse prevention — **no payout implementation**

---

## Coupon cost by type

| Type | Typical funder | Cost driver | Code ref |
|------|------------------|-------------|----------|
| 장바구니 tier | Platform (mock) | Subtotal threshold | `lib/coupon/tier-coupon.ts` |
| 상품 쿠폰 | Seller or platform | SKU/category | Server coupon |
| 친구추천 | Platform (launch) | Signup + first purchase | `mock-referral-status` |
| 첫구매 | Platform | CAC | Campaign budget |
| 재구매 | Platform/seller mix | Retention | Campaign |
| 멤버십 | Platform | Subscription value | `/membership` |
| 판매자 부담 | Seller | Seller-created codes | Seller campaign |
| 플랫폼 부담 | Platform | Growth campaigns | `/admin/promotions` |

---

## Split rules (placeholder)

| Scenario | Platform | Seller |
|----------|----------|--------|
| Tier auto-discount | 100% | 0% |
| Co-marketing coupon | 50% | 50% (negotiated) |
| Seller-only coupon | 0% | 100% |
| Referral reward | 100% | 0% |

Settlement: net coupon share deducted in settlement report (future).

---

## Monthly budget (draft)

| Bucket | Example cap (placeholder) |
|--------|---------------------------|
| Referral | ₩X / month |
| First purchase | ₩X / month |
| Tier cart discount | % of GMV ceiling |
| Membership | Per active member |

Track in admin finance (future KPI dashboard).

---

## ROI checklist per campaign

- [ ] Incremental orders vs control  
- [ ] AOV change  
- [ ] New vs returning mix  
- [ ] Refund rate post-coupon  
- [ ] CAC (referral / first buy)  
- [ ] Seller margin impact  

---

## Refund & coupon recovery

| Event | Rule (placeholder) |
|-------|-------------------|
| Full cancel before ship | Restore coupon / tier |
| Partial refund | Proportional discount clawback |
| Referral reward revoked | Friend order cancelled/refunded |

See `docs/CELLOH_COUPON_POINT_POLICY.md`.

---

## Abuse prevention

| Signal | Action |
|--------|--------|
| Same device + multiple referrals | Block reward |
| Same payment method | Flag review |
| Same address | Flag review |
| Velocity (N coupons/day) | Auto-hold |
| Self-referral | Reject |
| Refund farming | Revoke + ban |

Admin queue: `/admin/promotions`, referral `reward_pending`.

---

## Related

| Doc | Topic |
|-----|-------|
| `CELLOH_REFERRAL_REWARD_POLICY.md` | Referral rules |
| `CELLOH_PROMOTION_OPERATIONS_PLAN.md` | Campaign catalog |
| `CELLOH_ANALYTICS_KPI_PLAN.md` | Coupon usage KPI |
| `CELLOH_LAUNCH_CHECKLIST.md` | Launch gate |
| `/admin/coupons` | Admin mock list |
