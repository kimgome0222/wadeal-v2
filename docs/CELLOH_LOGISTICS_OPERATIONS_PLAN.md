# CELLOH Logistics Operations Plan

**Date:** 2026-05-31  
**Branch:** `mobile-ui`  
**Status:** Planning draft — **no shipping API / DB changes in this task**

**Related:** [CELLOH_SHIPPING_FEE_POLICY.md](./CELLOH_SHIPPING_FEE_POLICY.md), [CELLOH_SHIPPING_STATUS_GUIDE.md](./CELLOH_SHIPPING_STATUS_GUIDE.md), [CELLOH_INVENTORY_POLICY.md](./CELLOH_INVENTORY_POLICY.md), [CELLOH_DELIVERY_REFUND_OPERATIONS.md](./CELLOH_DELIVERY_REFUND_OPERATIONS.md)

**Code (mock):** `lib/shipping/calculate-shipping-fee.ts`, `lib/shipping/couriers.ts`, `lib/orders/shipping-status.ts`, `lib/data/product-shipping.ts`

**UI:** `/seller/orders`, `/admin/orders`, `/mypage/orders`, `/support/shipping`

---

## Overview

celloh supports **multiple fulfillment models** during early commercialization:

| Model | Who ships | Inventory owner | Typical use |
|-------|-----------|-----------------|-------------|
| **판매자 직접배송** | Seller | Seller | Default for marketplace sellers |
| **플랫폼 위탁배송** | Platform 3PL (future) | Platform or consignment | High-volume SKUs |
| **일부 인기상품 재고 보관** | Platform warehouse (future) | Platform | Fast-ship hero products |

**Today:** Seller direct ship is the **only live path** in mock UI. Platform fulfillment is documented for launch planning.

---

## 1. 판매자 직접배송

### Policy

- Seller packs and ships from own warehouse/studio.
- Seller registers courier + tracking on `/seller/orders` within SLA.
- celloh displays tracking to customer; platform does not hold inventory.

### Seller obligations

| Item | Standard |
|------|----------|
| 출고 SLA | 영업일 **1–2일** 내 `preparing` → `shipped` (category TBD) |
| 송장 등록 | Tracking number + courier required before `shipped` |
| 배송 지연 | Proactive CS note if SLA exceeded |
| 품절 | Mark `sold_out` before accepting orders (see inventory policy) |

### Platform role

- Display seller shipping profile on PDP (`buildShippingSummaryLines`, `ProductShippingProfile`)
- Route CS disputes; enforce seller SLA via [CELLOH_SELLER_ENFORCEMENT_POLICY.md](./CELLOH_SELLER_ENFORCEMENT_POLICY.md)

---

## 2. 플랫폼 위탁배송

### Policy (future)

- Selected sellers ship goods **to celloh hub**; platform picks/packs/labels.
- Seller remains merchant of record; platform is logistics agent.
- Settlement: deduct fulfillment fee per [CELLOH_REVENUE_MODEL.md](./CELLOH_REVENUE_MODEL.md) (draft).

### Eligibility (placeholder)

- Monthly GMV / defect rate thresholds
- SKU size/weight within hub limits
- Seller contract addendum signed

### Status

⏳ **Not implemented** — document only. UI flag: `fulfillment_type: seller_direct | platform_3pl` (future).

---

## 3. 일부 인기상품 재고 보관

### Policy (future)

- celloh holds **fast-mover SKUs** at hub for same-day / next-day ship.
- Seller replenishes hub on schedule; platform owns hub stock count.
- PDP badge: "celloh 빠른배송" (placeholder — not live).

### Ops rules

| Rule | Detail |
|------|--------|
| Replenishment | Seller ships bulk to hub; GRN updates `platform_managed` qty |
| Cycle count | Weekly reconcile; shrinkage → seller debit |
| Return to seller | Discontinued SKU pull-back within 14 days |

---

## 4. 예약배송

### Policy

- Customer selects **future delivery date** (fresh food, gifts, pre-order).
- Order stays `paid` / `preparing` until ship window opens.
- Cut-off: seller-defined (e.g. D-2 14:00).

### Customer copy

- PDP: "예약배송 · {date} 발송 예정"
- No charge until payment; cancel free before cut-off

### Status

⏳ Date picker UI — 추후 구현. CS handles manual requests via ticket.

---

## 5. 분리배송

### Policy

| Trigger | Action |
|---------|--------|
| Cold chain + ambient in one cart | Split into 2 shipments |
| Oversized + standard | Split; extra fee notice |
| Partial stock | Ship available lines first |

### Customer experience

- One order → multiple tracking numbers
- Each sub-shipment has own shipping status
- Notification per shipment (`shipping_started` × N)

### Fee

- First shipment: normal fee rules
- Additional splits: see [CELLOH_SHIPPING_FEE_POLICY.md](./CELLOH_SHIPPING_FEE_POLICY.md) §분리배송

**Code today:** Partial ship noted in [CELLOH_DELIVERY_REFUND_OPERATIONS.md](./CELLOH_DELIVERY_REFUND_OPERATIONS.md) — UI ⏳

---

## 6. 묶음배송

### Policy

| Condition | Bundle? |
|-----------|---------|
| Same seller | ✅ Same checkout group |
| Same cut-off day | ✅ One pick/pack when possible |
| Different sellers | ❌ Separate shipments & fees |
| Mixed fulfillment (seller + platform) | ❌ Split by fulfillment owner |

### Customer copy

- Cart: "같은 판매자 상품은 묶음배송될 수 있어요"
- Checkout: single `ShippingFeeResult` per seller group (future multi-seller cart)

**Mock today:** Join-cart assumes single-seller or aggregated fee via `calculateShippingFee`.

---

## 7. 도서산간 추가배송비

### Policy

- **제주·도서산간** postal codes → surcharge on top of base fee.
- Shown at checkout when address selected (`remoteExtraFee` in `calculateShippingFee`).
- Seller may set `remoteAreaExtraFee` on product profile.

### Placeholder values (mock code)

| Area | Surcharge |
|------|-----------|
| 제주 | Product-level `remoteAreaExtraFee` (typical 3,000원 placeholder) |
| 도서산간 | Same field; postal code list in `lib/shipping/remote-area.ts` |

### Customer copy

- Checkout: "제주·도서산간 추가 {amount}원"
- PDP: "제주·도서산간 추가 배송비 발생 가능"

---

## 8. 배송지 변경 가능 시점

| Order shipping status | Customer self-serve | CS / seller |
|----------------------|---------------------|-------------|
| `pending_payment` | ✅ Checkout edit | — |
| `paid` / `none` | ✅ `/mypage/addresses` or checkout | Seller notified |
| `preparing` | ⚠️ CS ticket — seller may allow | Seller confirms |
| `shipped` | ❌ | Redirect / re-ship fee (exception) |
| `delivered` | ❌ | Return flow only |

**Align with:** [CELLOH_CS_REPLY_TEMPLATES.md](./CELLOH_CS_REPLY_TEMPLATES.md) §배송지 변경

---

## 9. 출고 후 취소 제한

| Status | Cancel order? | Refund path |
|--------|---------------|-------------|
| Before `preparing` | ✅ Full cancel | Auto / PG refund |
| `preparing` | ⚠️ Seller approval | Full if not packed |
| `shipped` | ❌ Cancel | Return after delivery |
| `delivered` | ❌ Cancel | Return/exchange |

**Code:** `canShowOrderCancelButton` — paid + (`none`|`preparing`) only.

---

## 10. 송장 등록 기준

### Required fields

| Field | Rule |
|-------|------|
| Courier | From allowed list (`lib/shipping/couriers.ts`) |
| Tracking number | Non-empty, format validated (basic) |
| Ship date | Defaults to registration time |

### SLA

| Milestone | Target |
|-----------|--------|
| Payment → first scan | 영업일 1–2일 |
| Missing tracking 48h after `preparing` | Admin alert + seller warning |

### Customer display

- Tracking URL via `buildTrackingUrl()` — external courier site (no API integration)
- Mypage order detail: courier name + number + link

---

## 11. 배송 지연 대응 기준

### Tiers

| Delay | Action |
|-------|--------|
| +1 영업일 vs promise | Auto SMS/email "배송 준비 중" (template) |
| +2 영업일, no tracking | CS proactive contact seller |
| +3 영업일 | Customer apology + ETA or cancel offer |
| +5 영업일 | Admin escalation; seller score penalty |

### Customer-facing status

- Use `배송지연` overlay on `shipped` or `preparing` — see [CELLOH_SHIPPING_STATUS_GUIDE.md](./CELLOH_SHIPPING_STATUS_GUIDE.md)

### CS template

[CELLOH_CS_REPLY_TEMPLATES.md](./CELLOH_CS_REPLY_TEMPLATES.md) §배송 지연

---

## Role matrix (summary)

| Topic | Customer | Seller | Admin | Platform 3PL |
|-------|----------|--------|-------|--------------|
| Direct ship | Track | Pack + invoice | Monitor SLA | — |
| Platform fulfill | Track | Replenish hub | Configure SKU | Pick/pack |
| Split ship | Multi tracking | Initiate split | Mediate | Execute |
| Remote fee | Pay at checkout | Set surcharge | Audit abuse | — |
| Delay | Notify + compensate policy | Explain + ship | Escalate | Ops report |

---

## Open items (hold)

- Real courier API / webhook tracking
- Platform warehouse WMS
- Multi-seller cart bundle logic in production
- Automated delay detection (cron / events)

**No shipping API connected. No DB migration in this task.**
