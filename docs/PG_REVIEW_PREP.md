# Wadeal PG 심사 제출 가이드 (PG Review Prep)

> 마지막 업데이트: 2026-05-28  
> 대상: 토스페이먼츠(및 연동 PG) 심사 담당자·내부 준비팀  
> 상세 결제 흐름: [PAYMENT_FLOW.md](./PAYMENT_FLOW.md)  
> 출시 체크리스트: [GO_LIVE_CHECKLIST.md](./GO_LIVE_CHECKLIST.md)

---

## 1. 서비스 개요

**Wadeal(와딜)** 은 **공동구매(Group Buy) 전자상거래** 플랫폼입니다.

- 이용자가 진행 중인 공동구매에 **참여(수량 예약)** 합니다.
- **마감 시점**의 누적 참여 수량에 따라 **할인 단가(가격 티어)** 가 확정됩니다.
- 확정된 금액으로 **결제** 후 **배송**됩니다.
- 일반 상품(비공동구매)은 **즉시 결제** 후 출고합니다.

**운영 주체:** (사업자 정보는 `/admin/settings/business` 및 푸터·`/commerce-policy` 참고)

| 항목 | 내용 |
| --- | --- |
| 서비스 URL | `https://{production-domain}` |
| 결제 PG | 토스페이먼츠 결제위젯 |
| 회원 인증 | Supabase Auth — 카카오 OAuth |
| 호스팅 | Vercel |
| DB | Supabase (PostgreSQL, RLS) |

---

## 2. PG 심사 시 제출·확인 URL

| 구분 | URL | 설명 |
| --- | --- | --- |
| 메인 | `/` | 상품 목록·공동구매 진행 현황 |
| 상품 상세 | `/product/{id}` | 가격 티어·마감일·참여 CTA |
| 이용약관 | `/terms` | |
| 개인정보처리방침 | `/privacy` | |
| 환불·교환 정책 | `/refund-policy` | |
| 공동구매 운영정책 | `/commerce-policy` | 사업자·CS 정보 포함 |
| 결제 요청 | `/payment/request/{orderId}` | 로그인·본인 주문만 |
| 결제 성공 | `/payment/success` | 서버 승인(confirm) 후 완료 |
| 결제 실패 | `/payment/fail` | |
| 고객센터 | `/support` | 1:1 문의 |

**Webhook (서버):** `POST https://{domain}/api/payments/toss/webhook`  
**Confirm API (서버):** `POST https://{domain}/api/payments/toss/confirm`

---

## 3. Wadeal 결제 구조

Wadeal은 **4가지 결제 시나리오**를 지원합니다. PG 심사 시 **즉시 결제**와 **공동구매 마감 후 결제**를 모두 설명합니다.

### 3.1 일반 상품 — 즉시 결제 (`instant`)

```
체크아웃 → 주문 생성 → /payment/request/[orderId] → 토스 결제위젯
→ /payment/success → 서버 confirm API → paid → 배송 준비
```

- 주문 생성 직후 결제 페이지로 이동합니다.
- 결제 금액은 **서버(DB) 기준**으로만 검증합니다 (클라이언트 amount 신뢰 금지).
- 카드·간편결제·휴대폰: 승인 즉시 `paid`.
- 가상계좌: 발급 후 `waiting_deposit` → 입금 웹훅 수신 시 `paid`.

### 3.2 공동구매 — 참여 시점 (결제 없음 / 예약)

```
상품 상세 → 참여(join) → 주문 생성 (payment_flow=post_deadline_manual)
→ payment_status=ready (마감 전 미결제)
```

- **마감 전**에는 PG 결제가 발생하지 않습니다 (참여·수량 예약만).
- PG 심사 시 「공동구매는 마감 후 확정가 결제」임을 명시합니다.

### 3.3 공동구매 — 마감 후 직접 결제 (`post_deadline_manual`) [기본]

```
관리자/시스템 마감 → final_price 확정 → 알림(payment_ready)
→ /payment/request/[orderId] → 위젯 결제 → confirm → paid
```

- 마감 시점 참여 수량 기준 **최종 단가**가 확정됩니다.
- 이용자에게 **결제 요청 알림** 후 직접 결제합니다.
- 미결제 시 주문은 `payment_status=ready` 상태로 유지됩니다.

### 3.4 공동구매 — 마감 후 카드 자동결제 (`post_deadline_auto`) [선택]

```
마이페이지 카드 등록(빌링키) → 참여 시 자동결제 예약 선택
→ 마감·가격 확정 → chargeWithBillingKey
→ 성공: paid / 실패: payment_ready 알림 → 수동 결제 페이지
```

- 토스페이먼츠 **빌링(자동결제)** API 사용.
- 자동결제 실패 시 일반 결제 페이지로 fallback.

---

## 4. 지원 결제 수단

토스페이먼츠 결제위젯 `variantKey` (어드민 설정과 일치 필요):

| Wadeal 코드 | variantKey | PG 심사 확인 |
| --- | --- | --- |
| `card` | `CARD` | 신용·체크카드 |
| `kakaopay` | `KAKAOPAY` | 카카오페이 |
| `tosspay` | `TOSSPAY` | 토스페이 |
| `naverpay` | `NAVERPAY` | 네이버페이 |
| `phone` | `MOBILE_PHONE` | 휴대폰 결제 |
| `virtual_account` | `VIRTUAL_ACCOUNT` | 가상계좌 (입금 웹훅) |

> **심사 전 확인:** PG 계약 범위에 위 수단이 모두 포함되는지 토스페이먼츠 어드민에서 확인하세요.  
> 미계약 수단은 체크아웃 UI에서 비활성화할 수 있습니다.

---

## 5. 환불·취소 정책 (PG 심사용 요약)

정책 전문: `/refund-policy` · [REFUND_POLICY_DRAFT.md](./REFUND_POLICY_DRAFT.md)

### 5.1 공동구매 특성

- **마감 전:** 참여 취소 가능 (결제 전이면 PG 취소 불필요).
- **마감 후·결제 전:** 확정가 안내 후 결제; 미결제 주문은 일정 기간 후 자동 취소 정책 가능.
- **결제 후·배송 전:** 고객센터 또는 주문 상세에서 **전액/부분 취소** → PG 환불 API.
- **배송 후:** 단순 변심·불량·오배송 등 사유별 환불·교환 — CS 접수 후 PG 환불.

### 5.2 환불 처리

- 승인 후 **영업일 3~7일** 내 (카드사·PG사 정책 따름).
- 환불 상태: `orders.refund_requested_at` → 관리자 처리 → `payment_status=refunded`.
- PG: Toss Payments **Cancel API** (서버 `TOSS_SECRET_KEY`).

### 5.3 에스크로·정산

- 공동구매 **마감·결제 완료** 후 공급사 **정산** (`/admin/settlements`).
- PG 정산 주기는 가맹점 계약 조건 따름.

---

## 6. 배송 흐름

```
결제 완료 (paid) → shipping_status=preparing
→ 관리자 송장 입력 (shipped) → 배송 완료 (delivered)
```

- **출고 시점:** 공동구매는 **마감·결제 완료 후** 일괄 또는 순차 출고.
- **택배사:** CJ·롯데 등 (운영 계약).
- **제주·도서산간:** 추가 배송비 정책은 상품·정책 페이지에 명시.
- 송장 정보는 이용자 **마이페이지 주문 내역**에서 확인.

---

## 7. 고객센터

| 채널 | 내용 |
| --- | --- |
| 전화 | business_settings.customer_service_phone (푸터·commerce-policy) |
| 이메일 | customer_service_email |
| 1:1 문의 | `/support` — 로그인 후 티켓 생성 |
| 운영 시간 | customer_service_hours |

PG 심사 시 **실제 응대 가능한 연락처**를 등록해야 합니다.

---

## 8. 기술·보안 (PG 심사 FAQ)

| 질문 | 답변 |
| --- | --- |
| 결제 금액 위변조 방지 | confirm API에서 DB `computePayableAmountForOrder`와 Toss amount 대조 |
| Secret Key 노출 | 서버 env only (`TOSS_SECRET_KEY`), 클라이언트는 Client Key만 |
| Webhook 검증 | HMAC(`TOSS_WEBHOOK_SECRET`) 또는 Payment Query / deposit secret |
| 중복 결제 방지 | payment_key·order_id 멱등, 이미 `paid`면 skip |
| 로그 | `payments.raw_response`, `webhook_logs` 테이블 |
| 개인정보 | Supabase RLS, publishable key + 사용자 세션 |

---

## 9. 심사 전 내부 체크

- [ ] [GO_LIVE_CHECKLIST.md](./GO_LIVE_CHECKLIST.md) §3 PG 항목 완료
- [ ] `/admin/dashboard` **오픈 준비 상태** — PG 키·웹훅 green
- [ ] 테스트 키로 E2E: instant + post_deadline_manual 각 1회
- [ ] live 키 전환 후 소액 실결제 1회
- [ ] 정책 URL 4종 PG 제출용 PDF/링크 준비
- [ ] 사업자등록증·통신판매업 신고증 스캔 준비

---

## 10. 관련 문서·코드

| 문서/경로 | 설명 |
| --- | --- |
| [PAYMENT_FLOW.md](./PAYMENT_FLOW.md) | 시퀀스·API·상태값 |
| [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md) | env 목록 |
| [ADMIN_OPERATIONS.md](./ADMIN_OPERATIONS.md) | 운영·마감·환불 |
| `lib/payments/toss/` | Toss 연동 |
| `app/api/payments/toss/` | confirm·webhook |
| `components/toss-payment-widget.tsx` | 결제위젯 UI |

---

## 부록: PG 담당자용 한 페이지 요약 (복사용)

> Wadeal은 공동구매 이커머스입니다. 일반 상품은 주문 즉시 토스 결제위젯으로 결제합니다.  
> 공동구매는 마감 전 참여만 하고, 마감 후 확정된 할인가로 결제합니다(직접 결제 또는 등록 카드 자동결제).  
> 지원 수단: 카드, 카카오페이, 토스페이, 네이버페이, 휴대폰, 가상계좌.  
> Webhook: `/api/payments/toss/webhook`. 환불은 배송 전·후 정책에 따라 CS 경유 PG 취소.  
> 약관: /terms, /privacy, /refund-policy, /commerce-policy
