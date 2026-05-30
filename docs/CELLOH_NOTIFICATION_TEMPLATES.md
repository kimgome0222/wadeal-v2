# CELLOH Notification Templates (Draft)

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Scope:** Template spec only — **no new send implementation**

**Code refs:** `lib/notifications/order-events.ts`, `lib/notifications/support-events.ts`, `lib/notifications/types.ts`

Channels: `in_app` (primary), `email`, `kakao`, `sms`, `push` — placeholders

---

## User notifications

### 주문 완료
| Field | Value |
|-------|-------|
| type | `order_confirmed` |
| title | 구매 확정 |
| message | `{productName} · {amount}원` |
| target | user |
| channel | in_app |
| trigger | Deal finalize / group confirm |
| link | `/mypage/orders` |

### 결제 실패
| Field | Value |
|-------|-------|
| type | `payment_failed` |
| title | 자동결제 실패 |
| message | `{productName} · {amount}원 · 직접 결제가 필요해요` |
| target | user |
| channel | in_app (+ kakao placeholder) |
| trigger | Billing charge fail |
| link | `/mypage/orders` |

### 배송 시작
| Field | Value |
|-------|-------|
| type | `shipping_started` |
| title | 배송 시작 |
| message | `{productName} · {courier} 배송 중` |
| target | user |
| trigger | Seller marks shipped |
| link | `/mypage/orders` |

### 배송 완료
| Field | Value |
|-------|-------|
| type | `shipping_delivered` |
| title | 배송 완료 |
| message | `{productName} · 수령 후 구매 확정해 주세요` |
| target | user |
| trigger | Courier delivered |
| link | `/mypage/orders` |

### 환불 접수 / 완료
| Field | Value |
|-------|-------|
| type | `refund_updated` |
| title | 환불 처리 |
| message | `{productName} · 환불 상태가 업데이트됐어요` |
| target | user |
| trigger | Refund status change |
| link | `/mypage/orders` |

### 문의 답변 완료
| Field | Value |
|-------|-------|
| type | `support_reply` / `support_resolved` |
| title | 문의 답변 / 문의 완료 |
| message | `{ticketTitle}` summary |
| target | user |
| trigger | Admin/seller reply |
| link | `/mypage/support` |

### 리뷰 작성 요청
| Field | Value |
|-------|-------|
| type | `review_available` |
| title | 리뷰 작성 가능 |
| message | `{productName} · 구매 확정 완료` |
| target | user |
| trigger | `shipping_status=confirmed` |
| link | `/product/{id}` |

### 쿠폰 지급
| Field | Value |
|-------|-------|
| type | *(future: `coupon_issued`)* |
| title | 쿠폰이 도착했어요 |
| message | `{couponName} · {discount} 할인` |
| target | user |
| channel | in_app + push placeholder |
| trigger | Referral reward / event |
| link | `/mypage/benefits` |

### 친구추천 보상
| Field | Value |
|-------|-------|
| type | *(future: `referral_reward`)* |
| title | 친구추천 보상 |
| message | `{amount}원 쿠폰이 지급됐어요` |
| target | user |
| trigger | Friend first purchase confirmed |
| link | `/mypage/invite` |

---

## Seller notifications

### 상품 승인 / 반려
| type | `product_request_approved` / `product_request_rejected` |
| title | 상품 승인 / 상품 반려 |
| target | seller |
| trigger | Admin review |
| link | `/seller/products` |

### 신규 주문 / 송장
| type | `new_order_received`, `shipping_required` |
| target | seller |
| link | `/seller/orders` |

### 신규 리뷰
| type | `new_review` |
| target | seller |
| link | `/seller/reviews` |

### 정산
| type | `settlement_confirmed`, `settlement_ready`, `settlement_paid` |
| title | 정산 확정 / 정산 내역 / 정산 지급 |
| target | seller |
| link | `/seller/finance/settlements` |

---

## Admin notifications

| type | title | trigger |
|------|-------|---------|
| `refund_request` | 환불 요청 | User refund ticket |
| `new_seller_application` | 신규 입점 | Seller apply |
| `new_product_request` | 상품 검수 | Seller submit |
| `escalated_support_ticket` | 긴급 문의 | Escalated ticket |
| `payment_webhook_failed` | 웹훅 실패 | PG webhook error |
| `settlement_pending` | 정산 대기 | Period close |

---

## Implementation status

| Item | Status |
|------|--------|
| In-app create | ✅ `lib/notifications/create.ts` |
| Email/Kakao/SMS send | ⏳ 추후 구현 |
| Template HTML files | ❌ inline strings only |
| User prefs | `/mypage/notification-settings` ✅ |

---

## Related

- `lib/notifications/types.ts` — full type enum
- `docs/CELLOH_ORDER_STATE_MACHINE.md`
