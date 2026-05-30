# CELLOH Settlement Examples

**Date:** 2026-05-31  
**Branch:** `mobile-ui`  
**Status:** Worked examples — **placeholder math; not production settlement**

⚠️ **PG/세무 검토 필요.** Commission base and fee rates are illustrative.

**Related:** [CELLOH_UNIT_ECONOMICS.md](./CELLOH_UNIT_ECONOMICS.md), [CELLOH_COUPON_COST_CONTROL.md](./CELLOH_COUPON_COST_CONTROL.md), [CELLOH_SHIPPING_FEE_POLICY.md](./CELLOH_SHIPPING_FEE_POLICY.md)

**Assumptions (unless noted):**

- 판매 수수료 **10%** (기본 tier)
- PG **2.9%** on customer paid amount — **seller pass-through**
- Commission base = **pre-discount product subtotal** (placeholder)
- Shipping collected from customer; remitted to seller (seller fulfills)
- All amounts **KRW**, VAT excluded

---

## Example 1 — 일반 주문

| Line | Amount |
|------|--------|
| 상품금액 | 40,000 |
| 쿠폰 | 0 |
| 배송비 | 3,000 |
| **고객 결제 (GMV)** | **43,000** |
| PG 수수료 (2.9% × 43,000) | −1,247 |
| 판매 수수료 (10% × 40,000) | −4,000 |
| **판매자 정산 예정** | **37,753** |
| **플랫폼 수익** | **4,000** |

---

## Example 2 — 쿠폰 적용 (tier 3만↑ 3천, platform 100%)

| Line | Amount |
|------|--------|
| 상품금액 | 35,000 |
| Tier 쿠폰 | −3,000 |
| 배송비 | 0 (free ≥30k) |
| **고객 결제** | **32,000** |
| PG (2.9% × 32,000) | −928 |
| 판매 수수료 (10% × 35,000) | −3,500 |
| **판매자 정산** | **27,572** |
| 플랫폼 수수료 수입 | 3,500 |
| 플랫폼 쿠폰 비용 | −3,000 |
| **플랫폼 수익** | **500** |

---

## Example 3 — 부분 환불

**Original:** 60,000 product + 3,000 ship, tier 5천 applied, paid 58,000.

**Refund:** One line 20,000 returned (1 of 3 items).

| Line | Amount |
|------|--------|
| Refund to customer | −20,000 (proportional ship TBD) |
| Commission reversal (10% × 20,000) | +2,000 to seller / −2,000 platform |
| Coupon clawback (5,000 × 20/60) | −1,667 platform cost recovery (placeholder) |
| PG refund fee | Issuer-dependent — **TBD** |
| **Net platform impact** | −2,000 commission + 1,667 coupon ≈ **−333** + PG |

⚠️ Partial refund split rules — legal + PG contract.

---

## Example 4 — 전체 환불 (출고 전)

| Line | Amount |
|------|--------|
| Original paid | 47,000 (50k − 3k tier) |
| Full refund | −47,000 |
| Commission | 0 (reversed) |
| Tier coupon | Restored to customer |
| Referral reward | Revoked if applicable |
| **Platform 수익** | **0** |
| **Seller 정산** | **0** |

---

## Example 5 — 배송비 포함 (미만 30k, paid ship)

| Line | Amount |
|------|--------|
| 상품금액 | 22,000 |
| 배송비 | 3,000 |
| **고객 결제** | **25,000** |
| PG (2.9% × 25,000) | −725 |
| 수수료 (10% × 22,000) | −2,200 |
| **판매자 정산** | **22,075** (22,000 + 3,000 ship − fees) |
| **플랫폼 수익** | **2,200** |

---

## Example 6 — 판매자 부담 쿠폰 (5,000 seller code)

| Line | Amount |
|------|--------|
| 상품금액 | 45,000 |
| Seller coupon | −5,000 |
| 배송비 | 0 |
| **고객 결제** | **40,000** |
| PG (2.9% × 40,000) | −1,160 |
| 수수료 (10% × 45,000) | −4,500 |
| Seller coupon cost | −5,000 (already in lower payout) |
| **판매자 정산** | **29,340** (= 45,000 − 5,000 − 4,500 − 1,160 − 5,000 coupon) |
| **플랫폼 수익** | **4,500** |

*Note:* Seller coupon reduces customer pay but commission on gross 45k in this example.

---

## Example 7 — 플랫폼 부담 쿠폰 (첫구매 3,000)

| Line | Amount |
|------|--------|
| 상품금액 | 28,000 |
| 배송비 | 3,000 |
| First-buy coupon | −3,000 |
| **고객 결제** | **28,000** |
| PG (2.9% × 28,000) | −812 |
| 수수료 (10% × 28,000) | −2,800 |
| **판매자 정산** | **28,388** (28,000 + 3,000 − 812 − 2,800) |
| 플랫폼 coupon cost | −3,000 |
| **플랫폼 수익** | 2,800 − 3,000 = **−200** |

---

## Example 8 — 친구추천 쿠폰 + tier

| Line | Amount |
|------|--------|
| 상품금액 | 32,000 |
| Referral coupon (platform) | −3,000 |
| Tier 30k (platform) | −3,000 |
| **Stacking rule** | **Higher benefit only** OR **one cart + one referral — TBD** |
| Example: tier only applied | Paid 29,000 + ship 0 |
| PG (2.9% × 29,000) | −841 |
| 수수료 (10% × 32,000) | −3,200 |
| **판매자 정산** | **24,959** |
| Platform coupon (tier) | −3,000 |
| Referral accrual (inviter, separate) | −3,000 on first purchase event |
| **플랫폼 수익 (order)** | 3,200 − 3,000 = **200** |
| **Referral CAC** | Additional **3,000** when inviter paid |

⚠️ Coupon stacking — see [CELLOH_COUPON_POINT_POLICY.md](./CELLOH_COUPON_POINT_POLICY.md) (운영 확정 필요).

---

## Summary table

| # | Scenario | Customer pays | Seller settlement | Platform profit |
|---|----------|---------------|-------------------|-----------------|
| 1 | 일반 | 43,000 | 37,753 | 4,000 |
| 2 | Tier 3천 | 32,000 | 27,572 | 500 |
| 3 | Partial refund | −20,000 | Adjusted | ~−333 |
| 4 | Full refund | 0 | 0 | 0 |
| 5 | +배송비 | 25,000 | 22,075 | 2,200 |
| 6 | Seller coupon | 40,000 | 29,340 | 4,500 |
| 7 | Platform first-buy | 28,000 | 28,388 | −200 |
| 8 | Referral + tier | 29,000 | 24,959 | 200 (+3k CAC) |

---

## UI reference (mock only)

| Surface | Route |
|---------|-------|
| Seller settlement view | `/seller/finance/settlements` |
| Admin settlement | `/admin/settlements` |
| Cart tier preview | `/join-cart` |

**No settlement calculation code changed in this task.**
