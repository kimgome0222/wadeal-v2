# CELLOH Unit Economics

**Date:** 2026-05-31  
**Branch:** `mobile-ui`  
**Status:** Planning draft — **all figures are placeholders; not contractual rates**

⚠️ **PG/세무/법무 검토 필요.** 실제 정산·결제 로직 변경 없음.

**Related:** [CELLOH_SETTLEMENT_EXAMPLES.md](./CELLOH_SETTLEMENT_EXAMPLES.md), [CELLOH_AOV_STRATEGY.md](./CELLOH_AOV_STRATEGY.md), [CELLOH_REVENUE_MODEL.md](./CELLOH_REVENUE_MODEL.md), [CELLOH_COUPON_COST_CONTROL.md](./CELLOH_COUPON_COST_CONTROL.md)

**Code (mock):** `lib/coupon/tier-coupon.ts`, `lib/coupon/commerce-goals.ts`, `/admin/settlements`, `/seller/finance/settlements`

---

## Disclaimer

| Item | Note |
|------|------|
| All % and ₩ amounts | **Placeholder** for scenario modeling |
| PG fee | Toss contract TBD — examples use **2.9%** mock |
| VAT / withholding | Not calculated — tax review required |
| Settlement code | **Not implemented** — docs only |

---

## P&L waterfall (per order)

```
GMV (고객 결제 총액)
  − 쿠폰/포인트 할인 (customer benefit)
  = 순매출 (net revenue collected)
  − PG 수수료
  − 판매 수수료 (seller → platform)
  − 쿠폰 비용 (platform share)
  − 포인트 비용 (platform share)
  − 친구추천 비용 (platform)
  − 배송비 보조 (platform subsidy, if any)
  − CS/운영 allocated cost
  − 환불/반품 손실 (net of recovery)
  = 판매자 정산액 (seller payout)
  = 플랫폼 마진 (platform contribution margin)
```

---

## Line-item definitions

| Term | Definition | Placeholder basis |
|------|------------|-------------------|
| **GMV** | Gross merchandise value — 상품금액 + 배송비 (고객 청구 기준) | Order total before discounts |
| **순매출** | GMV − customer-facing discounts (coupons, points) | Cash-in from PG |
| **판매 수수료** | Platform take rate × **과세 매출 기준** (policy TBD) | 5–20% scenarios below |
| **PG 수수료** | Card/transfer fee to Toss | ~**2.9%** of paid amount (mock) |
| **쿠폰 비용** | Discount funded by platform and/or seller | Tier table in §Coupon |
| **포인트 비용** | Redeemed points liability | **1P = 1원** placeholder |
| **친구추천 비용** | Referral coupon issuance | **3,000원**/event placeholder |
| **배송비 보조** | Platform covers shipping when promo free-ship | Up to **3,000원**/order mock |
| **CS 비용** | Allocated support per order | **₩200–500**/order placeholder |
| **환불/반품 비용** | Refunded GMV + non-recoverable coupon + return ship | Case-by-case |
| **판매자 정산액** | Amount remitted to seller after fees & seller coupon share | See settlement examples |
| **플랫폼 마진** | Commission + subsidies recovered − platform costs | See formula below |

### Platform margin (simplified placeholder)

```
플랫폼 마진 = 판매 수수료
           + (배송비 − 배송비 보조)  [usually 0 if seller ships]
           − 플랫폼 부담 쿠폰
           − 플랫폼 부담 포인트
           − 친구추천 비용 (해당 시)
           − PG 수수료 (플랫폼 부담 시; pass-through면 0)
           − CS allocated
           − 환불 net loss
```

**PG pass-through (default draft):** PG fee deducted from **seller settlement**, not platform margin.

---

## Seller commission scenarios

**Assumptions (example row):** 상품 판매가 **50,000원**, tier 쿠폰 **0원**, PG **2.9% pass-through to seller**, 플랫폼 쿠폰 부담 **0원**

| Scenario | Rate | 수수료 (₩) | PG (₩)* | 쿠폰 (판매자) | **정산금액 (₩)** | **플랫폼 예상 마진 (₩)** |
|----------|------|-----------|---------|---------------|-----------------|------------------------|
| 0% 초기 입점 혜택 | 0% | 0 | 1,450 | 0 | **48,550** | **0** |
| 5% 저수수료 | 5% | 2,500 | 1,450 | 0 | **46,050** | **2,500** |
| 10% 기본 | 10% | 5,000 | 1,450 | 0 | **43,550** | **5,000** |
| 15% 기획전/노출 | 15% | 7,500 | 1,450 | 0 | **41,050** | **7,500** |
| 20% 프리미엄/단독 | 20% | 10,000 | 1,450 | 0 | **38,550** | **10,000** |

\* PG = 50,000 × 2.9% = **1,450원** (placeholder). **정산금액** = 50,000 − 수수료 − PG − 판매자 쿠폰.

### With tier coupon (10% commission, 50,000 subtotal → 3,000 tier)

| Item | ₩ |
|------|---|
| GMV (상품) | 50,000 |
| Tier coupon (platform 100%) | −3,000 |
| Customer pays | 47,000 |
| Commission 10% on **50,000** (TBD: net vs gross) | −5,000 |
| PG 2.9% on **47,000** | −1,363 |
| Platform coupon cost | −3,000 |
| **Seller settlement** | **40,637** (if commission on gross 50k) |
| **Platform margin** | 5,000 − 3,000 = **2,000** (before CS) |

⚠️ Commission base (할인 전/후) — **세무·계약 확정 필요**. Examples use **할인 전 상품금액** unless noted.

---

## Coupon cost scenarios

Aligns with `TIER_COUPON_TIERS` in `lib/coupon/tier-coupon.ts`.

| Coupon | Trigger | Discount | Platform | Seller | Split | Cancel (full) | Partial refund | Abuse risk |
|--------|---------|----------|----------|--------|-------|---------------|----------------|------------|
| **3만↑ 3천** | subtotal ≥ 30,000 | 3,000 | 100% | 0% | — | Restore tier eligibility | Proportional clawback | Threshold gaming |
| **5만↑ 5천** | ≥ 50,000 | 5,000 | 100% | 0% | — | Same | Same | Split cart to hit tier |
| **7만↑ 8천** | ≥ 70,000 | 8,000 | 100% | 0% | — | Same | Same | Low — high AOV |
| **10만↑ 1.2만** | ≥ 100,000 | 12,000 | 100% | 0% | — | Same | Same | Low |
| **첫구매 3천** | first order flag | 3,000 | 100% | 0% | — | Revoke on cancel | Partial: prorate | Multi-account |
| **친구추천 3천** | signup / 1st buy | 3,000 | 100% | 0% | — | Revoke both sides | N/A per order | Self-referral, device dup |
| **멤버십 무료배송** | membership active | ~3,000 ship | 100% | 0% | — | Restore coupon slot | Ship fee recalc | Membership churn abuse |

### Co-fund example (기획전 공동)

| Party | Share | On 5,000 coupon |
|-------|-------|-----------------|
| Platform | 50% | 2,500 |
| Seller | 50% | 2,500 |

Deducted in settlement report (future). See [CELLOH_COUPON_COST_CONTROL.md](./CELLOH_COUPON_COST_CONTROL.md).

---

## Cost buckets (monthly planning — placeholder)

| Bucket | Example cap | Owner |
|--------|-------------|-------|
| Tier cart discounts | ≤ 3% of GMV | Growth |
| First purchase | ₩5M/mo | Growth |
| Referral | ₩3M/mo | Growth |
| Membership free-ship | ₩2M/mo | Membership |
| Points liability | Accrual reserve | Finance |

---

## KPI links

| Metric | Target direction | Doc |
|--------|------------------|-----|
| AOV | ↑ via tier thresholds | [CELLOH_AOV_STRATEGY.md](./CELLOH_AOV_STRATEGY.md) |
| Take rate | 8–12% blended (draft) | [CELLOH_REVENUE_MODEL.md](./CELLOH_REVENUE_MODEL.md) |
| Coupon ROI | Incremental GMV / coupon cost | [CELLOH_ANALYTICS_KPI_PLAN.md](./CELLOH_ANALYTICS_KPI_PLAN.md) |
| Refund rate | ↓ | Order state machine |

---

## Hold items

- Actual commission rates in seller contract
- PG fee final quote from Toss
- VAT on commission invoice treatment
- Settlement engine implementation
- Real coupon ledger / clawback automation

**No settlement or payment logic changed in this task.**
