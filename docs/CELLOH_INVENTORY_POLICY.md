# CELLOH Inventory Policy

**Date:** 2026-05-31  
**Branch:** `mobile-ui`  
**Status:** Planning draft — **no stock deduction logic changes in this task**

**Related:** [CELLOH_LOGISTICS_OPERATIONS_PLAN.md](./CELLOH_LOGISTICS_OPERATIONS_PLAN.md), [CELLOH_STATUS_VALUES.md](./CELLOH_STATUS_VALUES.md), [CELLOH_PRODUCT_DATA_POLICY.md](./CELLOH_PRODUCT_DATA_POLICY.md)

**Code (mock):** `lib/data/product-shipping.ts`, product `Deal` mocks, seller product forms

---

## Overview

Inventory on celloh is tracked at **SKU level** with two ownership models:

| Model | Who updates qty | Display |
|-------|-----------------|---------|
| **판매자 재고 입력** | Seller on `/seller/products` | PDP stock badge |
| **플랫폼 관리 재고** | Admin / 3PL sync (future) | "celloh 배송" + qty |

**Today:** Mock quantities in data layer; **no real-time reservation or payment-time decrement**.

---

## Inventory status values

Canonical `inventory_status` for docs, filters, and future DB:

| Code | 한글 | Customer visible | Buy button | PDP badge |
|------|------|------------------|------------|-----------|
| `in_stock` | 판매 중 | ✅ | ✅ Add to cart | — |
| `low_stock` | 임박 품절 | ✅ | ✅ (warn) | "품절 임박" |
| `sold_out` | 품절 | ✅ | ❌ | "품절" |
| `restocking` | 재입고 예정 | ✅ | ❌ (notify) | "재입고 알림" |
| `discontinued` | 판매 종료 | ⚠️ listing may hide | ❌ | "판매 종료" |
| `hidden` | 비노출 | ❌ | ❌ | — |

### Mapping to product lifecycle

See [CELLOH_STATUS_VALUES.md § Product lifecycle](./CELLOH_STATUS_VALUES.md#product-lifecycle):

| Product lifecycle | Typical inventory_status |
|-------------------|-------------------------|
| `published` | `in_stock`, `low_stock` |
| `sold_out` | `sold_out`, `restocking` |
| `hidden` | `hidden`, `discontinued` |

---

## 1. 판매자 재고 입력

### Rules

- Seller sets **available quantity** on product create/edit.
- Optional: `low_stock_threshold` (default 5) → auto `low_stock` badge.
- Seller responsible for accuracy; false stock → [CELLOH_SELLER_ENFORCEMENT_POLICY.md](./CELLOH_SELLER_ENFORCEMENT_POLICY.md).

### Validation (future)

- Non-negative integer
- Max cap per category (e.g. limited drops)
- Cannot publish with qty 0 unless `restocking` mode

---

## 2. 플랫폼 관리 재고

### Scope (future)

- SKUs in celloh hub ([CELLOH_LOGISTICS_OPERATIONS_PLAN.md](./CELLOH_LOGISTICS_OPERATIONS_PLAN.md) §인기상품 재고)
- Admin adjusts via `/admin/products` or WMS feed
- Seller read-only on hub qty; replenishment via inbound shipment

### Deduction (future — not live)

1. **Soft reserve** on add-to-cart (optional TTL 15 min)
2. **Hard reserve** on payment `paid`
3. **Deduct** on `shipped`
4. **Restore** on cancel before ship / return accepted

**Hold:** No reservation or decrement in current codebase.

---

## 3. 품절 처리

### Triggers

| Event | Action |
|-------|--------|
| Qty → 0 | Auto `sold_out` |
| Seller manual | Set `sold_out` |
| Admin enforce | Hide or mark sold out |

### Customer UX

- PDP: disable +/purchase; show "품절"
- PLP: grey badge; optional sort deprioritize
- Cart: line item flagged "품절" on next load

### Seller UX

- `/seller/products`: restock action → `in_stock` when qty > 0

---

## 4. 임박 품절 표시

### Rules

- `qty <= low_stock_threshold` → `low_stock`
- PDP copy: "남은 수량 {n}개" (if policy allows exact count) or "품절 임박"
- No false urgency — align [CELLOH_PROMOTION_DISPLAY_RULES.md](./CELLOH_PROMOTION_DISPLAY_RULES.md)

---

## 5. 재입고 알림

### Flow (mock / future)

1. Customer taps "재입고 알림 받기" on `sold_out` / `restocking` PDP
2. Store wish + user id (localStorage mock today)
3. On seller restock → push/email "재입고됐어요"

### Status

⏳ Notification send not wired — template in [CELLOH_CUSTOMER_MESSAGE_TEMPLATES.md](./CELLOH_CUSTOMER_MESSAGE_TEMPLATES.md)

---

## 6. 장바구니 담기 후 품절

| Scenario | Behavior |
|----------|----------|
| Another buyer clears stock | On cart refresh: mark line **품절**, disable checkout for that line |
| Guest cart | Same on page load / cart sheet open |
| Mixed cart | Checkout allowed for in-stock lines only (split or remove OOS) |

### Customer copy

- "담아두신 상품이 품절됐어요. 장바구니에서 삭제해 주세요."
- CTA: Remove item / Find similar

---

## 7. 결제 직전 품절

| Checkpoint | Action |
|------------|--------|
| Checkout load | Re-validate all line qty |
| Payment click | Final stock check (server, future) |
| Fail | Block payment; show 품절 modal; no charge |

### Mock today

- No server re-check; document expected production behavior.

---

## 8. 주문 후 품절 (오versell)

| Situation | Resolution |
|-----------|------------|
| Paid, not shipped, no stock | Full cancel + refund; apology coupon (ops) |
| Partial stock | Partial ship or full cancel (customer choice) |
| Seller fault | SLA penalty; CS template |

### CS template

Topic: `stock_out` — [CELLOH_INTERNAL_CS_NOTES.md](./CELLOH_INTERNAL_CS_NOTES.md), [CELLOH_CS_REPLY_TEMPLATES.md](./CELLOH_CS_REPLY_TEMPLATES.md)

---

## 9. 품절 반복 판매자 관리

### Thresholds (placeholder)

| Metric | Action |
|--------|--------|
| 3+ oversells / 30 days | Warning + listing review |
| 5+ oversells / 30 days | Temporary listing freeze |
| Chronic `sold_out` with active ads | Delist + trust score down |

### Admin

- `/admin/sellers` — inventory reliability flag (future)
- Link to [CELLOH_SELLER_ENFORCEMENT_POLICY.md](./CELLOH_SELLER_ENFORCEMENT_POLICY.md)

---

## Summary table

| Stage | System action | Customer message |
|-------|---------------|------------------|
| Browse | Show badge by status | in_stock / low_stock / sold_out |
| Add to cart | Soft check (future) | — |
| Checkout | Hard check (future) | 품절 시 결제 불가 |
| After pay | Seller must fulfill or cancel | 오versell → refund 안내 |
| Restock | Notify waitlist (future) | 재입고 알림 |

**No inventory DB or deduction logic changed in this task.**
