# CELLOH Admin Message Templates

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Scope:** Ops alert templates — **no send**

**Code:** `lib/notifications/message-templates.ts` → `adminTemplates`  
**In-app:** `/admin/notifications`, `/admin/error-logs`

---

## Template index

| # | Event | Key | Trigger | Route |
|---|-------|-----|---------|-------|
| 1 | 신규 판매자 입점 | `new_seller_application` | Seller apply | `/admin/sellers` |
| 2 | 상품 검수 대기 | `product_review_pending` | Queue threshold | `/admin/product-requests` |
| 3 | 신고 접수 | `report_received` | User report | `/admin/review-reports` |
| 4 | 환불 요청 증가 | `refund_spike` | 24h threshold | `/admin/refunds` |
| 5 | 결제 실패 증가 | `payment_failure_spike` | Webhook/fail spike | `/admin/payments` |
| 6 | 배송 지연 | `shipping_delay` | SLA breach | `/admin/orders` |
| 7 | 문의 답변 지연 | `support_sla_breach` | Escalated ticket | `/admin/support` |
| 8 | 쿠폰 예산 초과 | `coupon_budget_exceeded` | Finance alert | `/admin/coupons` |
| 9 | 친구추천 부정 의심 | `referral_fraud_suspect` | Fraud rules | `/admin/promotions` |
| 10 | 정산 보류 | `settlement_hold` | Manual hold | `/admin/settlements` |
| 11 | 시스템 오류 | `system_error` | `critical_error` | `/admin/error-logs` |

---

## Privacy / ops notes

- 시스템 오류: stack trace·token은 **error-logs only**, 알림 본문은 messageSummary  
- 부정 추천: count/패턴만 — device ID raw 금지  
- 긴급도: `critical_error`, `payment_webhook_failed` → 즉시 확인  

---

## Example: 시스템 오류

```
title: 시스템 오류
message: {source} · {messageSummary} · error-logs를 확인해 주세요.
channels: in_app, email
variables: source, messageSummary
link: /admin/error-logs
```

---

## Related

- `CELLOH_OPERATIONS_RUNBOOK.md`
- `CELLOH_ERROR_LOGGING_PLAN.md`
- `lib/notifications/admin-events.ts`
