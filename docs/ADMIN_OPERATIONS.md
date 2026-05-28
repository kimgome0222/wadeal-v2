# Wadeal v2 관리자 운영 매뉴얼

> 마지막 업데이트: 2026-05-28  
> 접근: 관리자 로그인 + `users.role = 'admin'` (또는 QA용 데모 관리자)  
> 출시 준비 대시보드: [`/admin/dashboard`](/admin/dashboard)

---

## 관리자 메뉴 구조

| 경로 | 기능 |
| --- | --- |
| `/admin/dashboard` | 출시 준비 상태·env·미처리 건수 |
| `/admin/products` | 상품·공동구매 관리 |
| `/admin/orders` | 주문·배송·결제 상태 |
| `/admin/suppliers` | 공급사 관리 |
| `/admin/settlements` | 정산 관리 |
| `/admin/reviews` | 리뷰 관리 |
| `/admin/review-reports` | 리뷰 신고 처리 |

---

## 1. 상품 등록

**경로:** `/admin/products` → **상품 등록** → `/admin/products/new`

### 입력 항목

1. **기본 정보** — 상품명, slug(URL), 카테고리, 브랜드, 설명
2. **가격** — 정가(`original_price`), 공동구매 기준가(`group_price`)
3. **이미지** — 대표 이미지 URL 또는 Storage 업로드
4. **공동구매 설정**
   - 목표 참여 인원
   - 마감일(`ends_at`)
   - 섹션(메인 노출 등)
5. **가격 단계** — 참여 인원별 단가 tier 입력 (관리자 폼의 Price Tiers Editor)

### 저장 후 확인

- 홈·카테고리에 상품 노출
- `/product/[slug]` 상세 페이지 확인
- `/admin/dashboard` 등록 상품 수 증가

---

## 2. 가격 단계 입력

**경로:** `/admin/products/new` 또는 `/admin/products/[id]/edit`

- 각 tier: **최소 참여 인원** + **단가**
- 인원이 많을수록 단가가 낮아지도록 설정
- 저장 시 `group_buy_deals.price_tiers` JSONB에 저장
- 상품 상세·참여 화면에 단계별 가격 UI 표시

**팁:** 마감 시 현재 참여 인원에 맞는 tier가 최종 단가로 적용됩니다.

---

## 3. 공동구매 마감 처리

**경로:** `/admin/products/[id]/edit` → **공동구매 마감** 버튼

### 동작

1. 현재 참여 인원 기준 최종 단가 계산
2. 해당 딜의 모든 주문 `final_price` 업데이트
3. 결제 준비 상태 갱신 (`preparePaymentAfterFinalize`)
4. 딜 상태 `closed` 전환
5. **정산 레코드 생성** (`/admin/settlements`에서 확인)

### 주의

- 마감 시간 전에도 관리자 **강제 마감** 가능 (`force: true`)
- 참여 주문이 없으면 마감 실패
- 가격 tier가 없으면 마감 불가
- 마감 후 사용자는 추가 참여 불가

---

## 4. 주문 상태 변경

**경로:** `/admin/orders`

### 필터

상단 탭으로 주문 상태별 필터 (참여완료·결제대기·배송중·구매확정·취소·환불 등)

### 수정 가능 항목

| 필드 | 설명 |
| --- | --- |
| `order_status` | joined → confirmed → cancelled / refunded |
| `payment_status` | ready → paid → refunded 등 |
| `shipping_status` | none → preparing → shipped → delivered |
| 관리자 메모 | 내부 메모 |

각 주문 카드 펼침 → 값 수정 → **저장**

---

## 5. 배송 송장 입력

**경로:** `/admin/orders` → 주문 상세 펼침

1. **택배사** (`courier_company`) 입력 — 예: CJ대한통운
2. **송장번호** (`tracking_number`) 입력
3. **배송 상태** → `shipped` 로 변경
4. **발송일** (`shipped_at`) 필요 시 입력
5. 저장

배송 완료 시 `delivered` + `delivered_at` 설정.

---

## 6. 리뷰 관리

**경로:** `/admin/reviews`

- 전체 리뷰 목록 조회
- **숨김** — 부적절 리뷰 노출 중단 (`status: hidden`)
- **복구** — 숨김 해제
- **삭제** — 소프트 삭제 (`deleted`)

필터: 전체 / 신고된 리뷰

---

## 7. 리뷰 신고 처리

**경로:** `/admin/review-reports`

1. 신고 사유·리뷰 내용 확인
2. 리뷰 숨김 또는 유지 결정 (`/admin/reviews` 연계)
3. 신고 상태 **resolved** 처리

---

## 8. 문의 답변

**경로:** 현재 전용 admin UI 없음 — `/admin/dashboard` **미처리 문의** 건수 확인

### 데이터

- 테이블: `support_tickets`
- 미처리: `status IN ('open', 'in_progress')`

### 처리 방법 (현재)

1. Supabase Dashboard 또는 SQL로 티켓 조회
2. `admin_reply` 작성
3. `status` → `answered` → `resolved`

> 향후 `/admin/support` 페이지 추가 예정. 티켓 API: `lib/data/support-tickets.ts` → `updateSupportTicketAdmin`

### 문의 유형

| type | 설명 |
| --- | --- |
| product | 상품 문의 |
| order | 주문 문의 |
| payment | 결제 문의 |
| shipping | 배송 문의 |
| refund | 환불 요청 |
| cancel | 주문 취소 |
| other | 기타 |

---

## 9. 환불 요청 처리

**경로:** `/admin/orders` + `/admin/dashboard` (환불 요청 대기 건수)

### 사용자 요청

- 배송 후 주문 상세 → **환불 요청**
- `orders.refund_reason`, `refund_requested_at` 기록

### 관리자 처리

1. `/admin/dashboard`에서 **환불 요청 대기** 건수 확인
2. `/admin/orders`에서 해당 주문 조회
3. PG 연동 전: 수동 환불 후 상태 변경
   - `payment_status` → `refunded`
   - `order_status` → `refunded`
4. 관련 support ticket 있으면 답변·resolved

> PG 미연동 시 실제 환불은 수동 처리 후 DB 상태만 반영

---

## 10. 정산 확정

**경로:** `/admin/settlements` → `/admin/settlements/[id]`

### 흐름

1. 공동구매 **마감** 시 정산 레코드 자동 생성 (`status: pending`)
2. 정산 목록에서 매출·수수료·지급액 확인
3. 공급사(`/admin/suppliers`) 정보와 대조
4. 지급 완료 후 상태 **settled** (또는 해당 workflow) 로 확정

### 필터

`/admin/settlements?status=pending` — 미정산 건만 조회

---

## 11. 공급사 관리

**경로:** `/admin/suppliers`

- 공급사 등록·수정
- 정산 시 공급사명·수수료율 연동

---

## 12. 출시 준비 대시보드

**경로:** `/admin/dashboard`

| 항목 | 설명 |
| --- | --- |
| 필수 환경변수 | Supabase URL·Key 설정 여부 |
| Supabase 연결 | DB 쿼리 성공 여부 |
| 등록 상품 수 | `products` count |
| 진행 중 공동구매 | `group_buy_deals.status = active` |
| 미처리 문의 | `support_tickets` open/in_progress |
| 환불 요청 대기 | `refund_requested_at` 있고 미환불 주문 |

출시 전 **필수 env 전부 녹색**, **데모 로그인 경고 없음** 확인.

---

## 13. 일일 운영 체크 (권장)

- [ ] `/admin/dashboard` 미처리 문의·환불 건수
- [ ] 마감 예정 공동구매 확인 → 필요 시 마감 처리
- [ ] 신규 주문 배송 준비·송장 입력
- [ ] 리뷰 신고 접수 확인
- [ ] pending 정산 검토

---

## 14. 권한·보안

- 관리자는 Supabase `users.role = 'admin'` 으로 지정
- QA 데모: `NEXT_PUBLIC_ALLOW_DEMO_LOGIN` + 프로토타입 사용자 ID (개발 전용)
- 모든 admin server action은 `isAdminUser()` 검증
- Service Role Key는 Wadeal 앱에 설정하지 않음

---

## 15. 관련 문서

- [LAUNCH_QA_CHECKLIST.md](./LAUNCH_QA_CHECKLIST.md) — 출시 QA
- [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md) — env 설정
- [kakao-auth-reconnect.md](./kakao-auth-reconnect.md) — 카카오 로그인
