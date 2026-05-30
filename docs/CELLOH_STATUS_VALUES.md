# CELLOH Status Values

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Status:** Standardization draft — align with `lib/orders/*` where noted

**Related:** `CELLOH_ORDER_STATE_MACHINE.md`, `CELLOH_DATA_MODEL_PLAN.md`

---

## Order lifecycle (customer-facing)

Canonical codes for **new** docs/UI filters. Legacy DB may use combined axes (`order_status`, `payment_status`, `shipping_status`) — map via order state machine.

| Code | 한글 표시 | 고객 노출 | 판매자 액션 | 관리자 액션 | 다음 상태 |
|------|-----------|-----------|-------------|-------------|-----------|
| `pending_payment` | 결제 대기 | ✅ | — | cancel | `paid`, `canceled` |
| `paid` | 결제 완료 | ✅ | prepare ship | view | `preparing` |
| `preparing` | 배송 준비 | ✅ | pack / invoice | SLA watch | `shipped` |
| `shipped` | 배송 중 | ✅ | track | — | `delivered` |
| `delivered` | 배송 완료 | ✅ | — | — | `confirmed` |
| `confirmed` | 구매 확정 | ✅ | — | — | (terminal) |
| `cancel_requested` | 취소 요청 | ✅ | approve/deny | mediate | `canceled`, `paid` |
| `canceled` | 취소됨 | ✅ | — | audit | (terminal) |
| `return_requested` | 반품 요청 | ✅ | receive/inspect | mediate | `returned`, `delivered` |
| `returned` | 반품 완료 | ✅ | — | — | `refunded` |
| `refunded` | 환불 완료 | ✅ | — | reconcile | (terminal) |

**Code today:** `lib/orders/order-status.ts`, `lib/orders/refund-status.ts`

---

## Product lifecycle

| Code | 한글 표시 | 고객 노출 | 판매자 | 관리자 | 다음 |
|------|-----------|-----------|--------|--------|------|
| `draft` | 작성 중 | ❌ | edit | — | `review_requested` |
| `review_requested` | 검수 요청 | ❌ | wait | queue | `approved`, `rejected` |
| `approved` | 승인됨 | ❌* | publish | approve | `published` |
| `rejected` | 반려 | ❌ | fix & resubmit | reject reason | `review_requested` |
| `published` | 판매 중 | ✅ | edit limited | hide | `hidden`, `sold_out` |
| `hidden` | 숨김 | ❌ | republish request | enforce | `published` |
| `sold_out` | 품절 | ✅ (badge) | restock | — | `published` |

\* approved but unpublished until seller publishes (policy TBD)

**Mock UI:** `/seller/product-requests` badge labels

---

## Seller lifecycle

| Code | 한글 표시 | 고객 노출 | 판매자 | 관리자 | 다음 |
|------|-----------|-----------|--------|--------|------|
| `applied` | 입점 신청 | ❌ | view pending | review | `reviewing` |
| `reviewing` | 검토 중 | ❌ | submit docs | approve/reject | `approved`, `rejected` |
| `approved` | 승인 | ✅ (profile) | operate | monitor | `suspended` |
| `rejected` | 반려 | ❌ | reapply | — | `applied` |
| `suspended` | 이용 제한 | ❌ / partial | appeal | enforce | `approved`, `rejected` |

**Code today:** `SellerStatus` in `lib/sellers/types.ts` (`pending_review`, `approved`, …) — **map on migration**

---

## Settlement lifecycle

| Code | 한글 표시 | 고객 | 판매자 | 관리자 | 다음 |
|------|-----------|------|--------|--------|------|
| `pending` | 정산 예정 | ❌ | view estimate | — | `confirmed` |
| `confirmed` | 정산 확정 | ❌ | confirm/dispute | confirm | `paid`, `held` |
| `paid` | 지급 완료 | ❌ | view receipt | mark paid | (terminal) |
| `held` | 보류 | ❌ | contact CS | release/deny | `confirmed`, `paid` |

---

## Support ticket lifecycle

| Code | 한글 표시 | 고객 | 판매자 | 관리자 | 다음 |
|------|-----------|------|--------|--------|------|
| `open` | 접수 | ✅ | — | assign | `waiting_seller`, `answered` |
| `waiting_seller` | 판매자 확인 대기 | ✅ | respond | escalate | `answered` |
| `answered` | 답변 완료 | ✅ | — | close | `closed` |
| `closed` | 종료 | ✅ | — | archive | (terminal) |

---

## Report lifecycle

| Code | 한글 표시 | 고객 | 판매자 | 관리자 | Next |
|------|-----------|------|--------|--------|------|
| `received` | 접수 | ✅ | notified (future) | triage | `reviewing` |
| `reviewing` | 검토 중 | ✅ | — | investigate | `action_taken`, `dismissed` |
| `action_taken` | 조치 완료 | ✅ | warn/hide | log | (terminal) |
| `dismissed` | 기각 | ✅ | — | — | (terminal) |

---

## Mapping legacy → canonical (orders)

| Legacy axis | Example | Canonical hint |
|-------------|---------|----------------|
| `payment_status=paid` + `shipping_status=none` | paid, not shipped | `paid` / `preparing` |
| `shipping_status=shipped` | in transit | `shipped` |
| `order_status=cancelled` | canceled | `canceled` |
| refund row `requested` | refund pending | `return_requested` / `cancel_requested` |

Full matrix: `CELLOH_ORDER_STATE_MACHINE.md`

---

## UI display rules

- Never show internal codes to customers — use 한글 labels
- Mock disclaimer where stats are seed-based (`재구매율 mock`)
- Terminal states: disable primary CTA except “문의하기” / “재구매”
