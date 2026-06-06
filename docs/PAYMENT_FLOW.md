# Wadeal 결제 흐름 (Payment Flow)

> 마지막 업데이트: 2026-05-28

Wadeal은 **토스페이먼츠 결제위젯**으로 카드·간편결제·휴대폰·가상계좌를 지원합니다.  
일반 상품은 **즉시 결제**, 공동구매는 **마감·가격 확정 후 결제**(또는 카드 자동결제 예약)입니다.

---

## 환경 변수

| 변수 | 노출 | 용도 |
| --- | --- | --- |
| `NEXT_PUBLIC_TOSS_CLIENT_KEY` | 클라이언트 | 결제위젯 초기화 |
| `TOSS_SECRET_KEY` | **서버만** | 결제 승인·조회·취소 API |
| `TOSS_WEBHOOK_SECRET` | 서버 (선택) | payout/seller 웹훅 HMAC |
| `SUPABASE_SERVICE_ROLE_KEY` | 서버 | 가상계좌 입금 웹훅 (RLS bypass) |

레거시 별칭: `NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY`, `TOSS_PAYMENTS_SECRET_KEY`, `TOSS_PAYMENTS_WEBHOOK_SECRET`

---

## payment_flow 값

| 값 | 설명 |
| --- | --- |
| `instant` | 일반 상품 — 주문 후 `/payment/request/[orderId]` |
| `post_deadline_manual` | 공동구매 — 마감 후 사용자가 직접 결제 (기본) |
| `post_deadline_auto` | 공동구매 — 마감 후 등록 카드 자동결제 (빌링키) |

---

## 1. 일반 상품 — 즉시 결제

1. 체크아웃에서 결제 수단 선택 (`card`, `kakaopay`, `tosspay`, `naverpay`, `phone`, `virtual_account`)
2. 주문 생성 — `order_status=pending`, `payment_status=ready`
3. 리다이렉트 → `/payment/request/[orderId]`
4. 서버 검증 후 토스 결제위젯 렌더 (`variantKey`는 수단별, Toss 어드민과 동일 키 필요)
5. 성공 리다이렉트 → `/payment/success?paymentKey&orderId&amount`
6. **서버** `POST /api/payments/toss/confirm` — 금액은 DB 기준으로만 검증 (클라이언트 amount 신뢰 금지)
7. 승인 성공 시:
   - 카드/간편/휴대폰: `paid`, `order_status=confirmed`, `shipping_status=preparing`
   - 가상계좌 발급: `waiting_deposit`, `order_status=confirmed` (입금 후 웹훅으로 `paid`)

---

## 2. 공동구매 — 마감 후 직접 결제

1. 참여 시 `payment_flow=post_deadline_manual`, `payment_status=ready`
2. 관리자/시스템 마감 → `final_price` 확정, `prepare_payment_after_finalize`
3. 알림 `payment_ready` → `/payment/request/[orderId]`
4. 이후 흐름은 일반 상품과 동일 (위젯 → success → confirm API)

---

## 3. 공동구매 — 카드 자동결제 예약

- 마감 후 `processAutoChargesForDeal` → `chargeWithBillingKey`
- 실패 시 `payment_ready` 알림으로 수동 결제 페이지 안내
- 자동결제 예약 주문은 결제 요청 페이지에서 `auto_pay_scheduled` 로 차단

---

## API · 페이지

| Method | Path | 설명 |
| --- | --- | --- |
| GET | `/payment/request/[orderId]` | 결제위젯 (소유자·금액·수단 서버 검증) |
| GET | `/payment/success` | Toss 리다이렉트 → 서버 confirm |
| GET | `/payment/fail` | 실패 사유 + 재시도 링크 |
| POST | `/api/payments/toss/confirm` | Toss 승인 API (로그인 사용자, 주문 소유자) |
| POST | `/api/payments/toss/webhook` | 입금 완료·상태 변경 |

---

## 결제 상태

| status | 의미 |
| --- | --- |
| `ready` | 결제 준비 |
| `waiting_deposit` | 가상계좌 입금 대기 |
| `paid` | 결제 완료 |
| `failed` / `cancelled` / `refunded` | 실패·취소·환불 |

`payments.raw_response`에 Toss 응답 JSON 전체 저장.

---

## 웹훅 (`POST /api/payments/toss/webhook`)

- `DEPOSIT_CALLBACK` + `DONE` → 입금 완료, `paid`, 배송 준비(일반 상품)
- `PAYMENT_STATUS_CHANGED` → 승인/취소/실패 등
- 멱등: 이미 `paid`면 skip
- 검증: HMAC(`TOSS_WEBHOOK_SECRET`) 또는 Payment Query API / 입금 `secret`

자세한 이벤트 매핑은 기존 `webhook_logs`·핸들러 문서를 참고하세요.

---

## Toss 위젯 variantKey (어드민 설정)

| Wadeal `payment_method` | 권장 `variantKey` |
| --- | --- |
| `card` | `CARD` |
| `kakaopay` | `KAKAOPAY` |
| `tosspay` | `TOSSPAY` |
| `naverpay` | `NAVERPAY` |
| `phone` | `MOBILE_PHONE` |
| `virtual_account` | `VIRTUAL_ACCOUNT` |

약관 UI: `AGREEMENT`

---

## 보안 원칙

- Secret key는 서버 전용 (`TOSS_SECRET_KEY`)
- 결제 금액은 `computePayableAmountForOrder`로만 계산
- 주문 소유자만 결제·confirm 가능
- 결제 상태 변경은 PG confirm / 웹훅 / admin RPC 경로만

---

## 관련 코드

```
app/payment/request/[orderId]/page.tsx
app/payment/success/page.tsx
app/payment/fail/page.tsx
app/api/payments/toss/confirm/route.ts
app/api/payments/toss/webhook/route.ts
components/toss-payment-widget.tsx
lib/payments/toss/
  env.ts, client.ts, amount.ts, map-method.ts
  validate-order-payment.ts, apply-confirm-result.ts
  webhook/
lib/payments/can-pay-order.ts
lib/data/orders.ts
lib/orders/finalize-deal.ts
```
