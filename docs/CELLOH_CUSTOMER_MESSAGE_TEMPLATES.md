# CELLOH Customer Message Templates

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Scope:** Template spec only — **no email/Kakao/SMS send**

**Code:** `lib/notifications/message-templates.ts` → `customerTemplates`  
**In-app:** `/notifications`, `lib/notifications/order-events.ts`

---

## Privacy rules

- ❌ 전화번호, 주소, 카드번호, CVC, PG raw error in message body  
- ❌ access/refresh token, 주민번호  
- ✅ productName, amount, orderId (masked optional), courier name  

결제 실패: **과한 상세 사유 노출 금지** — "결제수단을 확인하고 다시 시도해 주세요" 수준

---

## Template index

| # | Event | Key | Channels | Trigger |
|---|-------|-----|----------|---------|
| 1 | 회원가입 완료 | `signup_complete` | in_app, email | Signup success |
| 2 | 로그인 알림 | `login_alert` | email, kakao | New device login |
| 3 | 주문 완료 | `order_complete` | in_app, kakao, email | `payment_paid` |
| 4 | 결제 실패 | `payment_failed` | in_app, kakao, sms | PG fail |
| 5 | 배송 시작 | `shipping_started` | in_app, kakao, sms | Seller ships |
| 6 | 배송 완료 | `shipping_delivered` | in_app, kakao | Delivered |
| 7 | 구매확정 요청 | `purchase_confirm_request` | in_app, kakao | Post-delivery reminder |
| 8 | 리뷰 작성 요청 | `review_request` | in_app, push | `review_available` |
| 9 | 문의 답변 완료 | `support_reply` | in_app, email | Ticket reply |
| 10 | 환불 접수 | `refund_received` | in_app, email | Refund created |
| 11 | 환불 완료 | `refund_completed` | in_app, kakao, email | Refund completed |
| 12 | 쿠폰 지급 | `coupon_issued` | in_app, push | Campaign/referral |
| 13 | 쿠폰 만료 예정 | `coupon_expiring` | in_app, push | D-3 cron |
| 14 | 친구추천 가입 | `referral_signup` | in_app | Friend signup |
| 15 | 친구추천 보상 | `referral_reward` | in_app, push | Friend 1st purchase |
| 16 | 장바구니 리마인드 | `cart_reminder` | in_app, push, kakao | Cart 24h idle |
| 17 | 마감세일 알림 | `ending_sale_alert` | in_app, push | Daily campaign |

---

## Examples

### 주문 완료
- **title:** 주문이 완료됐어요  
- **message:** `{productName} · {amount}원 결제가 완료됐어요.`  
- **variables:** productName, amount, orderId  
- **link:** `/mypage/orders`  

### 결제 실패
- **title:** 결제에 실패했어요  
- **message:** `{productName} 주문 결제가 완료되지 않았어요. 결제수단을 확인하고 다시 시도해 주세요.`  
- **note:** PG error code only in admin logs  

### 마감세일
- **title:** 마감세일이 곧 끝나요  
- **message:** 오늘 밤 11:59까지 특가 상품을 확인해 보세요. (mock · 운영 일정)  

---

## Related

- `CELLOH_SELLER_MESSAGE_TEMPLATES.md`
- `CELLOH_ADMIN_MESSAGE_TEMPLATES.md`
- `CELLOH_UX_WRITING_GUIDE.md`
- `CELLOH_NOTIFICATION_TEMPLATES.md` (legacy index)
