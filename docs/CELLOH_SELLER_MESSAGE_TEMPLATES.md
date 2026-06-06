# CELLOH Seller Message Templates

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Scope:** Template spec — **no send implementation**

**Code:** `lib/notifications/message-templates.ts` → `sellerTemplates`  
**In-app:** `/seller/notifications`

---

## Template index

| # | Event | Key | Trigger | Action link |
|---|-------|-----|---------|-------------|
| 1 | 입점 신청 접수 | `application_received` | Apply submit | `/seller/pending` |
| 2 | 입점 승인 | `application_approved` | Admin approve | `/seller/dashboard` |
| 3 | 입점 반려 | `application_rejected` | Admin reject | `/seller/rejected` |
| 4 | 상품 검수 접수 | `product_request_received` | SKU submit | `/seller/product-requests` |
| 5 | 상품 승인 | `product_approved` | Admin approve | `/seller/products` |
| 6 | 상품 반려 | `product_rejected` | Admin reject | `/seller/product-requests` |
| 7 | 새 주문 | `new_order` | `new_order_received` | `/seller/orders` |
| 8 | 취소 요청 | `cancel_request` | Cancel request | `/seller/orders/{id}` |
| 9 | 반품 요청 | `return_request` | Return request | `/seller/orders/{id}` |
| 10 | 새 리뷰 | `new_review` | Review posted | `/seller/reviews` |
| 11 | 새 문의 | `new_inquiry` | Product Q&A | `/seller/inquiries` |
| 12 | 문의 답변 지연 | `inquiry_sla_warning` | SLA > 48h | `/seller/inquiries` |
| 13 | 정산 확정 | `settlement_confirmed` | Period close | `/seller/finance/settlements` |
| 14 | 정산 지급 | `settlement_paid` | Payout done | `/seller/finance/settlements` |
| 15 | 정책 변경 | `policy_update` | Seller notice | `/seller/notices` |

---

## 유의사항

- 반려 사유: 요약만 — 민감·개인정보 포함 금지  
- 주문 알림: 고객 연락처는 판매자 메시지에 **직접 포함 금지** (플랫폼 CS 경유)  
- 정산: 금액은 정산서 기준 — 세무·법무 확정 전 "확정" 표현 주의  

---

## Example: 새 주문

```
title: 새 주문이 들어왔어요
message: {productName} · {amount}원 · 송장 입력을 부탁드려요.
channels: in_app, kakao, sms
variables: productName, amount, orderId
```

---

## Related

- `CELLOH_CUSTOMER_MESSAGE_TEMPLATES.md`
- `CELLOH_SELLER_CENTER_CHECKLIST.md`
- `lib/notifications/seller-events.ts`
