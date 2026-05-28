# Wadeal v2 — 관리자 가이드

> 마지막 업데이트: 2026-05-28  
> 운영 매뉴얼(일상): [ADMIN_OPERATIONS.md](./ADMIN_OPERATIONS.md) · 출시 QA: [LAUNCH_QA_CHECKLIST.md](./LAUNCH_QA_CHECKLIST.md) · 감사 로그: [ADMIN_AUDIT_LOGS.md](./ADMIN_AUDIT_LOGS.md)

---

## 접근 권한

| 조건 | 결과 |
| --- | --- |
| `users.role = 'admin'` | 전체 `/admin/*` 접근 |
| QA 데모 | `NEXT_PUBLIC_ALLOW_DEMO_LOGIN=true` + 프로토타입 UID allowlist |
| 비관리자 | `AdminAccessDenied` 화면 |

권한 검사: `lib/auth/admin-access.ts` — 모든 admin server action에서 `isAdminUser()` 호출.

---

## 관리자 메뉴

| 경로 | 기능 |
| --- | --- |
| `/admin/dashboard` | 출시 준비·KPI·미처리 건 |
| `/admin/go-live-readiness` | Go-live 자동 점검 상세 |
| `/admin/products` | 상품 목록 |
| `/admin/products/new` | 상품 등록 |
| `/admin/products/[id]/edit` | 수정·tier·마감 |
| `/admin/orders` | 주문·배송·환불 |
| `/admin/payments` | 결제·웹훅 로그 |
| `/admin/suppliers` | 공급사 |
| `/admin/settlements` | 정산 |
| `/admin/reviews` | 리뷰 |
| `/admin/review-reports` | 리뷰 신고 |
| `/admin/support` | 고객 문의 |
| `/admin/sellers` | 판매자 승인 |
| `/admin/settings/business` | 사업자·법적 정보 |
| `/admin/activity-logs` | 감사 로그 |

---

## 1. 상품 등록

**경로:** `/admin/products/new`

### 입력 항목

1. **기본** — 상품명, slug, 카테고리, 브랜드, 설명
2. **유형** — `normal` (즉시구매) / `groupbuy` (공동구매)
3. **가격** — `original_price`, `sale_price` / `group_price`
4. **이미지** — URL 또는 Storage 업로드 (`admin-product-images` action)
5. **공동구매** — 목표 인원, `ends_at`, section, badge
6. **가격 단계** — Price Tiers Editor → JSONB 저장
7. **배송** — shipping_type, fee, free threshold
8. **재고** — stock / per-user limit (normal·groupbuy)
9. **결제 수단** — allowed_payment_methods

### 승인 워크플로

| approval_status | 노출 |
| --- | --- |
| `draft` | 비노출 |
| `pending_review` | 비노출 |
| `approved` | 카탈로그 노출 |
| `rejected` | 비노출 + 사유 |

Admin: 상품 상세에서 **승인** / **반려** (`app/actions/admin-products.ts`).

---

## 2. 가격 단계 (Price tiers)

**경로:** 상품 등록·수정 폼

```
[{ "minQty": 1, "price": 29900 }, { "minQty": 10, "price": 24900 }, …]
```

- `minQty` 오름차순
- 마감 시 현재 참여 수에 맞는 tier → `final_price`
- 저장 후 `sync_price_tiers_from_jsonb` 로 relational table 동기화

---

## 3. 공동구매 마감

**경로:** `/admin/products/[id]/edit` → **공동구매 마감**

| 단계 | 동작 |
| --- | --- |
| 1 | tier 기준 최종 단가 계산 |
| 2 | 참여 주문 `final_price`·금액 필드 UPDATE |
| 3 | `prepare_payment_after_finalize` |
| 4 | `post_deadline_auto` → 자동결제 시도 |
| 5 | deal `status = closed` |
| 6 | settlement 레코드 생성 |

**주의:** tier 없음·주문 없음 → 실패. 기한 전 **강제 마감** (`force: true`) 가능.

---

## 4. 주문·결제 관리

**경로:** `/admin/orders`

### 필터 탭

참여완료, 결제대기, 결제완료, 배송중, 구매확정, 취소, 환불 등.

### 수정 필드

| 필드 | 값 예 |
| --- | --- |
| `order_status` | joined → confirmed → cancelled / refunded |
| `payment_status` | ready → paid → refunded |
| `shipping_status` | none → preparing → shipped → delivered |
| `courier_company`, `tracking_number` | CJ대한통운, 송장번호 |
| `admin_memo` | 내부 메모 |

**결제 상세·웹훅:** `/admin/payments`

---

## 5. 배송·송장

1. 결제 완료 주문 필터
2. 택배사·송장 입력
3. `shipping_status` → `shipped`, `shipped_at` 기록
4. 배달 완료 → `delivered`, `delivered_at`

사용자 `/mypage/orders` 에 송장 표시.

---

## 6. 리뷰·신고

### 리뷰 (`/admin/reviews`)

- **숨김** — `status: hidden`
- **복구** — `visible`
- **삭제** — `deleted`

구매 확인 리뷰만 작성 가능 (15일 이내, DB trigger).

### 신고 (`/admin/review-reports`)

1. 신고 내용 확인
2. 리뷰 숨김/유지
3. 신고 `resolved`

---

## 7. 고객 문의

**경로:** `/admin/support`, `/admin/support/[id]`

| type | 설명 |
| --- | --- |
| product | 상품 |
| order | 주문 |
| payment | 결제 |
| shipping | 배송 |
| refund | 환불 |
| cancel | 취소 |
| other | 기타 |

**처리:** `admin_reply` 작성 → `status`: answered → resolved.

알림: `support_reply`, `support_resolved`.

---

## 8. 환불

1. Dashboard **환불 요청 대기** 건수 확인
2. `/admin/orders` 에서 주문 조회
3. PG 미연동: **실제 환불 수동 처리** 후 DB `refunded`
4. PG 연동: Toss cancel API + webhook 동기화
5. 관련 support ticket resolved

---

## 9. 공급사·정산

### 공급사 (`/admin/suppliers`)

- 사업자 정보, 수수료율(`commission_rate`), 계좌
- 상품 `supplier_id` 연결

### 정산 (`/admin/settlements`)

| status | 의미 |
| --- | --- |
| `pending` | 마감 후 자동 생성 |
| `confirmed` | 검토 완료 |
| `paid` | 지급 완료 |
| `cancelled` | 취소 |

**흐름:** 마감 → pending → 금액 검토 → confirmed → paid

---

## 10. 판매자(셀러) 승인

**경로:** `/admin/sellers`

- 신청: `/seller/apply` → `sellers.status = pending_review`
- Admin 승인 → `approved`, `users.role = seller`
- 셀러 센터: `/seller/dashboard`

---

## 11. 사업자·법적 설정

**경로:** `/admin/settings/business`

- 상호, 대표, 사업자등록번호, 통신판매업 신고번호
- CS 연락처, 개인정보 책임자
- `hosting_provider` (Vercel)

푸터 `SiteFooter` 에 반영 — 출시 전 필수.

---

## 12. Go-live readiness (출시 준비)

**자동 점검:** `/admin/dashboard`, `/admin/go-live-readiness`

| 항목 | 확인 |
| --- | --- |
| Supabase URL·Key | env 녹색 |
| Supabase 연결 | DB ping |
| 데모 로그인 | 프로덕션 **비활성** |
| Mock data | 프로덕션 **미사용** |
| 등록 상품·진행 딜 | count > 0 |
| 미처리 문의·환불 | 0 또는 처리 계획 |
| Toss PG keys | live 키 (실결제 시) |
| Auth redirect | production domain |

**수동 체크:** [GO_LIVE_CHECKLIST.md](./GO_LIVE_CHECKLIST.md)  
**QA:** [LAUNCH_QA_CHECKLIST.md](./LAUNCH_QA_CHECKLIST.md)  
**PG 심사:** [PG_REVIEW_PREP.md](./PG_REVIEW_PREP.md)

---

## 13. 감사 로그

모든 주요 admin mutation은 `admin_activity_logs` 에 기록.

**조회:** `/admin/activity-logs` — action, target, before/after JSON.

상세 action 목록: [ADMIN_AUDIT_LOGS.md](./ADMIN_AUDIT_LOGS.md).

---

## 14. 일일 운영 체크리스트

- [ ] Dashboard 미처리 문의·환불
- [ ] 마감 예정 공동구매 → 마감 처리
- [ ] 신규 paid 주문 송장 입력
- [ ] 리뷰 신고
- [ ] pending 정산 검토

---

## 15. 보안 주의

- Service Role Key를 Wadeal Vercel env에 **넣지 않음**
- `NEXT_PUBLIC_ALLOW_DEMO_LOGIN` — QA 후 즉시 제거
- Admin role은 Supabase SQL로만 부여 (자가 승격 trigger 차단)
- `billing_key` 클라이언트 노출 금지
