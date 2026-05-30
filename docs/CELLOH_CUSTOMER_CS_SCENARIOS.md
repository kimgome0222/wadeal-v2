# CELLOH Customer CS Scenarios

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Scope:** 고객 CS QA — mock 티켓·알림 템플릿 참조

**Related:** `docs/CELLOH_CUSTOMER_SUPPORT_PLAN.md`, `docs/CELLOH_CUSTOMER_MESSAGE_TEMPLATES.md`

---

## Scenario matrix

| # | Scenario | Customer UI | Support UI | Admin | Seller | Notification | Policy |
|---|----------|-------------|------------|-------|--------|--------------|--------|
| 1 | 배송지 변경 | `/mypage/addresses` | `/support/shipping` | optional | — | — | `/policies/shipping` |
| 2 | 주문 취소 | `/mypage/orders`, `/orders/[id]` | `/support/refund` | `/admin/orders` | `/seller/orders` | `order_*` | `/policies/refund` |
| 3 | 환불 요청 | `/mypage/orders` | `/support/refund`, `/support/new` | `/admin/refunds` | `/seller/orders/[id]` | `refund_*` | `/policies/refund` |
| 4 | 상품 문의 | `/product/[id]#product-qna` | `/support/contact` | `/admin/support` | `/seller/inquiries` | `support_reply` | `/policies/seller` |
| 5 | 리뷰 신고 | `/reports` | `/support/report` → `/reports` | `/admin/review-reports` | — | `report_received` | review policy |
| 6 | 쿠폰 미적용 | `/mypage/coupons` | `/support/coupons` | `/admin/coupons` | — | `coupon_*` | coupon policy |
| 7 | 결제 실패 | `/payment/fail` | `/support/payment` | `/admin/payments` | — | `payment_failed` | `/policies/payment` |
| 8 | 친구추천 보상 | `/mypage/invite` | `/support/referral` | `/admin/viral` | — | `referral_*` | `/policies/referral` |

---

## 1. 배송지 변경

**Customer:** `/mypage/addresses` → 추가/수정  
**Support:** `/support/shipping` FAQ  
**Admin:** 불필요 (self-serve)  
**Seller:** 불필요  
**Notification:** —  
**Policy:** `/policies/shipping`

**Checkpoints:** 주문 **결제 후** 변경은 CS 안내 copy  
**Priority:** P1

---

## 2. 주문 취소

**Customer:** `/mypage/orders` → 주문 상세 `/orders/[id]`  
**Support:** `/support/refund`  
**Admin:** `/admin/orders` — 상태 확인  
**Seller:** `/seller/orders` — 취소 요청 알림  
**Notification:** `cancel_request` (seller), customer in-app  
**Policy:** `/policies/refund`

**Mock:** cancel local state / ticket mock  
**Priority:** P0

---

## 3. 환불 요청

**Customer:** `/mypage/orders`, `/support/new` (login)  
**Support:** `/support/refund`  
**Admin:** `/admin/refunds` — 승인/거절  
**Seller:** 처리 협조  
**Notification:** `refund_received`, `refund_completed`  
**Policy:** `/policies/refund`, `CELLOH_DELIVERY_REFUND_OPERATIONS.md`

**Priority:** P0

---

## 4. 상품 문의

**Customer:** product Q&A section  
**Support:** `/support/contact` mock  
**Admin:** `/admin/support` escalated  
**Seller:** `/seller/inquiries` — 48h SLA  
**Notification:** `support_reply`, `new_inquiry` (seller)  
**Policy:** `/policies/seller`

**Priority:** P1

---

## 5. 리뷰 신고

**Customer:** `/reports`  
**Support:** redirect from `/support/report`  
**Admin:** `/admin/review-reports`  
**Seller:** —  
**Notification:** `report_received`  
**Policy:** `CELLOH_REVIEW_QNA_REPORT_POLICY.md`

**Mock:** 접수번호 only, no DB  
**Priority:** P1

---

## 6. 쿠폰 미적용 문의

**Customer:** `/mypage/coupons`  
**Support:** `/support/coupons`  
**Admin:** `/admin/coupons`  
**Notification:** `coupon_issued`, `coupon_expiring`  
**Policy:** `CELLOH_COUPON_POINT_POLICY.md`

**Priority:** P1 (mock coupon)

---

## 7. 결제 실패 문의

**Customer:** `/payment/fail`, retry from orders  
**Support:** `/support/payment`  
**Admin:** `/admin/payments`, `/admin/error-logs`  
**Notification:** `payment_failed` — **PG 상세 미노출**  
**Policy:** `/policies/payment`

**Priority:** P0

---

## 8. 친구추천 보상 문의

**Customer:** `/mypage/invite`, `/mypage/referrals`  
**Support:** `/support/referral`  
**Admin:** `/admin/viral` — 부정 이용 검토  
**Notification:** `referral_signup`, `referral_reward`  
**Policy:** `/policies/referral`

**Priority:** P2 (mock reward)

---

## CS hub routes (all ✅)

```
/support  /support/faq  /support/contact  /support/tickets
/support/payment  /support/shipping  /support/refund
/support/coupons  /support/referral
/mypage/support
```

---

## Related

- [CELLOH_QA_SCENARIO_INDEX.md](./CELLOH_QA_SCENARIO_INDEX.md)
- [CELLOH_USER_PURCHASE_SCENARIOS.md](./CELLOH_USER_PURCHASE_SCENARIOS.md)
