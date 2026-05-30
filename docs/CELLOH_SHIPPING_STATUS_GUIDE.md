# CELLOH Shipping Status Guide

**Date:** 2026-05-31  
**Branch:** `mobile-ui`  
**Status:** Ops reference — **no status transition code changes in this task**

**Related:** [CELLOH_ORDER_STATE_MACHINE.md](./CELLOH_ORDER_STATE_MACHINE.md), [CELLOH_STATUS_VALUES.md](./CELLOH_STATUS_VALUES.md), [CELLOH_LOGISTICS_OPERATIONS_PLAN.md](./CELLOH_LOGISTICS_OPERATIONS_PLAN.md)

**Code:** `lib/orders/shipping-status.ts`, `lib/orders/order-status.ts`, `getUserOrderDisplayLabel`

---

## Status map (business ↔ code)

Business labels below extend customer-facing copy. Map to DB `shipping_status` + payment state via order state machine.

| Business status | Code (typical) | Notes |
|-----------------|----------------|-------|
| 결제완료 | `paid` + `none` | Payment captured; not yet picking |
| 상품준비중 | `paid` + `preparing` | Seller picking/packing |
| 배송준비중 | `preparing` | Invoice pending or label printed |
| 배송중 | `shipped` | Tracking active |
| 배송완료 | `delivered` | Courier delivered |
| 배송지연 | `preparing` or `shipped` + delay flag | Overlay; not separate enum yet |
| 반송중 | `return_requested` + return ship | Customer → seller |
| 반송완료 | `returned` | Seller received return |

**Code labels today:** `none` → 배송 전, `preparing` → 배송 준비, `shipped` → 배송 중, `delivered` → 배송 완료, `returned` → 반품

---

## 1. 결제완료

| Field | Detail |
|-------|--------|
| **고객 노출 문구** | "결제가 완료됐어요" / "주문 확인 중" |
| **판매자 액션** | 주문 확인 → 출고 준비 시작 |
| **관리자 확인** | Fraud / payment mismatch watch |
| **알림** | ✅ `payment_paid` (email/push template) |
| **취소/환불** | ✅ 출고 전 전액 취소 가능 |

**Routes:** `/mypage/orders?status=paid`, `/seller/orders`

---

## 2. 상품준비중

| Field | Detail |
|-------|--------|
| **고객 노출 문구** | "판매자가 상품을 준비하고 있어요" |
| **판매자 액션** | Pick, pack, prepare invoice |
| **관리자 확인** | SLA timer starts |
| **알림** | Optional status update |
| **취소/환불** | ⚠️ 판매자 확인 후 취소 (미출고 시 전액) |

---

## 3. 배송준비중

| Field | Detail |
|-------|--------|
| **고객 노출 문구** | "곧 배송이 시작돼요" / "배송 준비 중" |
| **판매자 액션** | 송장 등록 필수 (courier + tracking) |
| **관리자 확인** | Missing invoice > 48h → flag |
| **알림** | — |
| **취소/환불** | ⚠️ 포장 완료 시 취소 어려울 수 있음 |

*Note:* UI may merge 상품준비중 + 배송준비중 as "배송 준비" (`preparing`).

---

## 4. 배송중

| Field | Detail |
|-------|--------|
| **고객 노출 문구** | "배송 중이에요" + 택배사/송장 |
| **판매자 액션** | Track; respond to delay inquiries |
| **관리자 확인** | — |
| **알림** | ✅ `shipping_started` + tracking link (`buildTrackingUrl`) |
| **취소/환불** | ❌ 취소 불가 → 수령 후 반품 |

---

## 5. 배송완료

| Field | Detail |
|-------|--------|
| **고객 노출 문구** | "배송이 완료됐어요" |
| **판매자 액션** | — |
| **관리자 확인** | Auto-confirm policy TBD |
| **알림** | ✅ `shipping_delivered` |
| **취소/환불** | ❌ 취소 → ✅ 반품/교환 (policy) |

**Next:** 구매 확정 (`confirmed`) → review window 15 days (`REVIEW_WINDOW_DAYS`)

---

## 6. 배송지연

| Field | Detail |
|-------|--------|
| **고객 노출 문구** | "배송이 다소 지연되고 있어요. 확인 중입니다." |
| **판매자 액션** | Update ETA; expedite or cancel offer |
| **관리자 확인** | +2d no tracking, +3d customer outreach |
| **알림** | ✅ Delay apology template |
| **취소/환불** | ⚠️ 고객 요청 시 미배송 확인 후 전액 취소 가능 |

**Implementation:** Overlay on `preparing`/`shipped` — `delay_reason`, `expected_ship_date` (future fields)

See [CELLOH_LOGISTICS_OPERATIONS_PLAN.md](./CELLOH_LOGISTICS_OPERATIONS_PLAN.md) §배송 지연

---

## 7. 반송중

| Field | Detail |
|-------|--------|
| **고객 노출 문구** | "반품 상품이 판매자에게 이동 중이에요" |
| **판매자 액션** | Provide return address; confirm pickup |
| **관리자 확인** | Dispute / lost return |
| **알림** | Optional return tracking |
| **취소/환불** | Refund after seller inspects (not yet) |

**Trigger:** Return approved after `delivered`

---

## 8. 반송완료

| Field | Detail |
|-------|--------|
| **고객 노출 문구** | "반품이 접수됐어요. 환불을 진행할게요." |
| **판매자 액션** | Inspect goods; approve/reject refund |
| **관리자 확인** | `/admin/refunds` queue |
| **알림** | ✅ Refund progress |
| **취소/환불** | ✅ 환불 처리 → `refunded` |

**Code:** `shipping_status=returned`, refund axis in `lib/orders/refund-status.ts`

---

## Notification matrix

| Status | Customer | Seller | Admin |
|--------|----------|--------|-------|
| 결제완료 | ✅ | ✅ new order | — |
| 상품준비중 | — | — | SLA watch |
| 배송준비중 | — | reminder invoice | flag |
| 배송중 | ✅ + tracking | — | — |
| 배송완료 | ✅ | — | — |
| 배송지연 | ✅ | ✅ | ✅ escalate |
| 반송중 | optional | ✅ | — |
| 반송완료 | ✅ refund | ✅ | reconcile |

Templates: [CELLOH_NOTIFICATION_TEMPLATES.md](./CELLOH_NOTIFICATION_TEMPLATES.md), [CELLOH_CS_REPLY_TEMPLATES.md](./CELLOH_CS_REPLY_TEMPLATES.md)

---

## Cancel / refund quick reference

| Status | Cancel order | Return | Exchange |
|--------|--------------|--------|----------|
| 결제완료 | ✅ | ❌ | ❌ |
| 상품준비중 | ⚠️ | ❌ | ❌ |
| 배송준비중 | ⚠️ | ❌ | ❌ |
| 배송중 | ❌ | ❌ | ❌ |
| 배송완료 | ❌ | ✅ | ✅ |
| 배송지연 | ⚠️ | ❌ | ❌ |
| 반송중 | — | in progress | — |
| 반송완료 | — | done | — |

**Code helpers:** `canShowOrderCancelButton`, `canShowExchangeReturnButton`, `canConfirmPurchase`, `canWriteReview`

---

## UI surfaces

| Role | Route |
|------|-------|
| Customer | `/mypage/orders`, `/orders/[id]` |
| Seller | `/seller/orders`, `/seller/orders/[id]` |
| Admin | `/admin/orders`, `/admin/refunds` |
| Support FAQ | `/support/shipping` |

**No shipping API or status machine code changed in this task.**
