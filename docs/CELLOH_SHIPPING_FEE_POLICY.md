# CELLOH Shipping Fee Policy

**Date:** 2026-05-31  
**Branch:** `mobile-ui`  
**Status:** Policy draft — aligns with mock code, **no fee logic changes in this task**

**Related:** [CELLOH_LOGISTICS_OPERATIONS_PLAN.md](./CELLOH_LOGISTICS_OPERATIONS_PLAN.md), [CELLOH_DELIVERY_REFUND_OPERATIONS.md](./CELLOH_DELIVERY_REFUND_OPERATIONS.md), [CELLOH_COUPON_POINT_POLICY.md](./CELLOH_COUPON_POINT_POLICY.md)

**Code:** `lib/shipping/calculate-shipping-fee.ts`, `lib/shipping/types.ts`, `lib/shipping/remote-area.ts`, `lib/coupon/commerce-goals.ts`

**Policy pages:** `/policies/shipping`, `/support/shipping`

---

## Shipping types (product profile)

| `shippingType` | Meaning | Base fee |
|----------------|---------|----------|
| `free` | Always free | 0원 |
| `conditional_free` | Free above threshold | `shippingFee` until threshold met |
| `paid` | Always charged | `shippingFee` |

**Fields:** `shippingFee`, `freeShippingThreshold`, `isFreeShipping`, `remoteAreaExtraFee` — see `ProductShippingProfile`

---

## 1. 기본 배송비

### Platform default (mock / join-cart aggregate)

| Rule | Value |
|------|-------|
| Base fee | **3,000원** when subtotal < 30,000원 |
| Applies when | `conditional_free` or cart-level rule |
| Per-product | Seller sets `shippingFee` on listing |

### Display

- PDP: `buildShippingSummaryLines()` — "3,000원 (30,000원 이상 무료)" or "조건 충족 시 무료배송"
- Checkout: `CheckoutShippingSummary` — "기본 배송비" line

---

## 2. 무료배송 기준

| Level | Condition |
|-------|-----------|
| **상품** | `isFreeShipping` or `shippingType=free` |
| **조건부** | Subtotal ≥ `freeShippingThreshold` (often 30,000원) |
| **장바구니** | Cart subtotal ≥ 30,000원 (mock via `getCommerceGoalState`) |

### Customer copy

- "30,000원 이상 주문 시 무료 (상품별 상이)"
- "조건 충족 시 무료배송이 적용됐어요" (`CELLOH_CART_COPY.freeShippingApplied`)
- Progress: "무료배송까지 {n}원 남았어요"

---

## 3. 판매자별 배송비

- Each seller/product defines own fee profile at registration.
- Multi-seller cart (future): **fee per seller group**, not merged.
- Seller must match capability declared at onboarding ([CELLOH_SELLER_REVIEW_CHECKLIST.md](./CELLOH_SELLER_REVIEW_CHECKLIST.md)).

---

## 4. 플랫폼 쿠폰 무료배송

| Source | Type | Stacking |
|--------|------|----------|
| Admin coupon | `free_shipping` | Overrides base fee to 0 |
| Membership | 무료배송 쿠폰 (준비 중) | `/membership` mock |
| Tier mock | Cart goal banner | Visual only until real coupon apply |

**Rules:**

- Free-shipping coupon applies to **base fee only** unless policy says otherwise
- Remote surcharge may still apply (placeholder: coupon excludes Jeju — TBD legal)

See [CELLOH_COUPON_POINT_POLICY.md](./CELLOH_COUPON_POINT_POLICY.md)

---

## 5. 묶음배송 가능 조건

| Condition | Single fee? |
|-----------|-------------|
| Same seller, same order | ✅ One base fee for group |
| Same seller, split ship (cold/oversize) | ❌ May charge per parcel |
| Different sellers | ❌ Fee per seller |

**Customer notice:** Cart/checkout — "판매자별 배송비가 부과될 수 있어요" (future multi-seller)

---

## 6. 분리배송 시 배송비

| Scenario | Fee policy |
|----------|------------|
| Platform-initiated split (inventory) | First ship: standard; 2nd+: **50% base** (placeholder) |
| Customer-requested split | Full fee each (placeholder) |
| Partial stock ship | Free re-ship for remainder if seller fault |

⏳ Split UI not live — policy for CS reference.

---

## 7. 반품 배송비

| Reason | Who pays |
|--------|----------|
| 단순 변심 | Customer (round-trip or one-way per category) |
| 상품 불량 / 오배송 | Seller or platform |
| 배송 지연 / 미배송 | Seller |

**Policy page:** `/policies/refund`, `/support/refund`

---

## 8. 교환 배송비

| Reason | Who pays |
|--------|----------|
| Size/color change (customer) | Customer pays outbound; return per refund policy |
| Defect exchange | Seller pays both ways |
| Same-SKU swap | One-way only |

---

## 9. 제주 / 도서산간 (placeholder)

| Item | Detail |
|------|--------|
| Detection | Postal code via `isRemoteAreaPostalCode()` |
| Surcharge | `remoteAreaExtraFee` on product (typical **3,000원** placeholder) |
| When waived | Never on true `free` ship; TBD for free-shipping coupons |
| Checkout line | "제주·도서산간 추가 {n}원" |

### Placeholder notice (PDP / checkout)

> 제주 및 도서산간 지역은 추가 배송비가 발생할 수 있습니다. 정확한 금액은 결제 단계에서 확인해 주세요.

**Legal:** Final surcharge table pending ops + legal sign-off.

---

## Calculation example (mock code)

```
subtotal = 25,000
threshold = 30,000
baseFee = 3,000
→ baseShippingFee = 3,000, amountUntilFreeShipping = 5,000

subtotal = 35,000
→ baseShippingFee = 0, isFreeShipping = true

address = Jeju, remoteAreaExtraFee = 3,000, not free
→ totalShippingFee = 3,000 + 3,000 = 6,000
```

Function: `calculateShippingFee()` in `lib/shipping/calculate-shipping-fee.ts`

---

## Related UI

| Surface | Component |
|---------|-----------|
| PDP | `ProductDetailShippingSummary`, `ProductShippingInfoBlock` |
| Cart | `JoinCartCouponNotice`, `join-cart-summary-card` |
| Checkout | `CheckoutShippingSummary`, address picker |
| Support | `/support/shipping`, `/policies/shipping` |

---

## Hold items

- Real coupon application at checkout (fee override)
- Multi-seller cart fee aggregation
- Legal-final remote area fee table
- Return label prepaid integration

**No shipping fee calculation code changed in this task.**
