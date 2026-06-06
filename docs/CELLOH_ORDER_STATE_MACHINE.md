# CELLOH Order State Machine

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Code refs:** `lib/orders/order-status.ts`, `lib/orders/refund-status.ts`, `lib/orders/order-flow.ts`

---

## Overview

CELLOH orders combine three axes in the database:

| Axis | Enum (code) | Purpose |
|------|-------------|---------|
| Order | `pending`, `joined`, `confirmed`, `cancelled`, `refunded` | Deal/join lifecycle |
| Payment | `ready`, `waiting_deposit`, `authorized`, `paid`, `failed`, `cancelled`, `refunded` | PG / deposit |
| Shipping | `none`, `preparing`, `shipped`, `delivered`, `confirmed`, `returned` | Fulfillment |

**Customer display label** (`getUserOrderDisplayLabel`): `구매완료`, `가격확정`, `결제완료`, `배송준비`, `배송중`, `배송완료`, `취소/환불`

---

## Operational state map (business → code)

| Business state | Customer copy | DB mapping (typical) | Route |
|----------------|---------------|----------------------|-------|
| 장바구니 | — | guest cart / join-cart | `/join-cart` ✅ |
| 주문서 작성 | 결제 준비 | `pending` / `ready` / `none` | `/checkout/[id]` ✅ |
| 결제대기 | 입금 대기 | `confirmed` / `waiting_deposit` | `/checkout/[id]`, `/payment/request/[id]` ✅ |
| 결제완료 | 결제 완료 | `confirmed` / `paid` / `none` or `preparing` | `/mypage/orders?status=paid` ✅ |
| 상품준비중 | 배송 준비 | `confirmed` / `paid` / `preparing` | `/mypage/orders?status=preparing` ✅ |
| 배송준비중 | 배송 준비 | same | `/seller/orders` ✅ |
| 배송중 | 배송 중 | `paid` / `shipped` | `/mypage/orders?status=shipping` ✅ |
| 배송완료 | 배송 완료 | `delivered` | `/mypage/orders?status=delivered` ✅ |
| 구매확정 | 구매 확정 | `shipping_status=confirmed` | `/mypage/reviews` ✅ |
| 취소요청 | 취소 접수 | cancel ticket / refund `requested` | `/orders/[id]` ✅ |
| 취소완료 | 취소/환불 | `cancelled` / `refunded` | `/mypage/orders` ✅ |
| 반품요청 | 반품 접수 | ticket `exchange`/`refund` | `/support/new` ✅ |
| 반품진행 | 반품 처리 중 | refund `pending` | `/admin/refunds` ✅ |
| 반품완료 | 반품 완료 | `returned` | `/mypage/orders` ✅ |
| 환불대기 | 환불 처리 중 | refund `pending`/`approved` | `/admin/refunds` ✅ |
| 환불완료 | 환불 완료 | `refunded` | `/mypage/orders` ✅ |

---

## Per-state detail

### 장바구니
- **Customer:** 장바구니에 담긴 상품
- **Seller:** —
- **Admin:** —
- **Notify:** —
- **Coupon/point:** tier mock preview only (`lib/coupon/tier-coupon.ts`)
- **Review:** ❌

### 주문서 작성 / 결제대기
- **Customer:** 로그인 후 배송지·결제수단 선택
- **Seller:** —
- **Admin:** —
- **Notify:** `payment_ready` (optional)
- **Coupon/point:** tier mock + server coupon/points preview at checkout
- **Review:** ❌

### 결제완료 → 배송준비 → 배송중 → 배송완료
- **Customer:** 마이페이지 주문 상태 바
- **Seller:** `/seller/orders` — 송장 입력, 출고 처리
- **Admin:** `/admin/orders` — 상태 변경, CS
- **Notify:** `payment_paid`, `shipping_started`, `shipping_delivered`
- **Coupon/point:** 사용 확정 (server RPC `commit_discounts` when configured)
- **Review:** ❌ until confirmed

### 구매확정
- **Customer:** 수령 확인 / auto-confirm policy TBD
- **Seller:** 정산 대상 확정 (placeholder)
- **Admin:** —
- **Notify:** `review_available`
- **Review:** ✅ 15일 이내 (`REVIEW_WINDOW_DAYS`)

### 취소/반품/환불
- **Customer:** 출고 전 취소 (`canShowOrderCancelButton`), 배송 후 반품 (`canShowExchangeReturnButton`)
- **Seller:** 반품 수거 협조
- **Admin:** `/admin/refunds` 승인/반려
- **Notify:** `refund_updated`
- **Coupon/point:** 복원 placeholder — see `CELLOH_COUPON_POINT_POLICY.md`
- **Review:** ❌ if refunded

---

## UI routes audit

| Route | Status |
|-------|--------|
| `/mypage/orders` | ✅ + status filter (`?status=paid|preparing|shipping|delivered`) |
| `/mypage/groupbuys` | ✅ group-buy orders |
| `/orders/[id]` | ✅ detail + claim buttons |
| `/seller/orders` | ✅ + mock panel when empty |
| `/admin/orders` | ✅ filter by display status |
| `/admin/refunds` | ✅ refund queue |
| Dedicated cancel/return wizard | ⏳ 추후 구현 (ticket flow used) |

---

## Implementation notes

- PG success: `lib/payments/toss/apply-confirm-result.ts` → `confirmed` + `preparing`
- Claims: `lib/orders/order-claims.ts`, `lib/support/ticket-rules.ts`
- No DB schema changes in this audit
