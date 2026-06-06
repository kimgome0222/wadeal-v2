# CELLOH Delivery / Refund Operations

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Code:** `lib/shipping/calculate-shipping-fee.ts`, `lib/orders/order-claims.ts`, `lib/policies/content.ts`

---

## Shipping fees

| Rule | Value (current mock/code) |
|------|---------------------------|
| Base fee | 3,000원 when subtotal < 30,000 (`join-cart`, checkout) |
| Free shipping | Subtotal ≥ 30,000원 |
| Remote area | Postal code surcharge via `calculate-shipping-fee.ts` |
| Seller types | `free`, `conditional_free`, `paid` |

**Product detail mock:** `buildShippingSummaryLines()` — "무무료배송" if price ≥30k

---

## Bundle / split shipment

| Scenario | Policy (placeholder) |
|----------|---------------------|
| 묶음배송 | Same seller + same day cut-off |
| 분리배송 | Cold chain / oversized — extra fee notice |
| Partial ship | Order split → multiple tracking numbers |

⏳ Split shipment UI — 추후 구현

---

## Address change

| Timing | Allowed? |
|--------|----------|
| Before `preparing` | ✅ |
| After `shipped` | ❌ CS ticket only |
| After delivery | ❌ |

**UI:** `/mypage/addresses`, checkout address picker

---

## Cancel / return / refund

### Cancel (출고 전)

- **Rule:** `canShowOrderCancelButton` — paid + (`none`|`preparing`)
- **Customer:** Order detail cancel → support ticket
- **Refund:** Full amount + shipping if charged

### Return (출고 후)

- **Rule:** `canShowExchangeReturnButton` — `delivered` only
- **Return shipping:** Customer fault vs seller fault — see `/policies/refund`

### Product restrictions (placeholder)

| Category | Return |
|----------|--------|
| 식품/신선 | Delivery day only |
| 개봉/사용 | Non-returnable unless defect |
| 하자/오배송 | Seller pays return shipping |

---

## Refund stages

| Stage | Customer copy | Admin |
|-------|---------------|-------|
| 환불 접수 | 취소/환불 요청 | `/admin/refunds` queue |
| 검토 | 처리 중 | Approve/reject |
| 환불대기 | PG refund pending | Toss webhook |
| 환불완료 | 환불 완료 | `refunded` status |

**Code:** `lib/orders/refund-status.ts` — `none`, `requested`, `approved`, `rejected`, `refunded`

---

## Coupon / point on refund

| Case | Coupon | Points |
|------|--------|--------|
| Full cancel before ship | Restore placeholder | Rollback via RPC |
| Partial refund | Proportional | Proportional |
| Return complete | Per policy | Per policy |

See `CELLOH_COUPON_POINT_POLICY.md`

---

## UI audit

| Screen | Status |
|--------|--------|
| PDP shipping summary | ✅ mock lines + `/support/refund` link |
| Checkout address | ✅ |
| Join-cart shipping line | ✅ 3,000 / free |
| Order detail claims | ✅ cancel/return buttons |
| `/policies/shipping` | ✅ |
| `/policies/refund` | ✅ |
| `/support/shipping`, `/support/refund` | ✅ FAQ |

---

## Related

- `docs/CELLOH_ORDER_STATE_MACHINE.md`
- `docs/CELLOH_NOTIFICATION_TEMPLATES.md`
