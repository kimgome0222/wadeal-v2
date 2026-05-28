# Wadeal v2 상용 준비 체크리스트 (Commercial Readiness)

> 갱신: 2026-05-29  
> 연관 문서: [DEFERRED_ISSUES.md](./DEFERRED_ISSUES.md) · [EXTERNAL_AUTH_DEFERRED.md](./EXTERNAL_AUTH_DEFERRED.md) · [GO_LIVE_CHECKLIST.md](./GO_LIVE_CHECKLIST.md)  
> 자동 점검: `/admin/go-live-readiness` · `/admin/dashboard` (MVP 출시 준비)

상태 범례: **ready** · **partial** · **deferred** · **missing**

---

## 1. 요약 (2026-05-29)

| 영역 | ready | partial | deferred | 비고 |
|------|-------|---------|----------|------|
| 구매자 (buyer) | 대부분 | 포인트·쿠폰·일부 PG | Kakao OAuth prod | 핵심 구매·리뷰·환불 UI 구현 |
| 판매자 (seller) | 대부분 | 정산 자동화·광고비 결제 | Toss billing | `seller_id` 서버측 검증 |
| 관리자 (admin) | 대부분 | Toss 실환불 API | git push · Vercel prod | 마이그레이션 체커 있음 |
| DB / SQL | 030–045 (038·044 포함) | anon probe 한계 | — | 사용자 Dashboard 적용 확인 2026-05-29 |
| 외부 인증·배포 | — | — | B003–B005, AUTH-001, PAY-001 | 사용자 대시보드 작업 |

**SQL 030–045:** 사용자 확인 기준 **전체 applied** (038 notifications unified, 044 storage buckets 포함).

로컬 확인: `node scripts/probe-migrations.mjs` (env 값 출력 없음). anon probe는 038 컬럼·044 bucket을 false로 표시할 수 있음 — service role 또는 Dashboard Storage로 교차 확인.

앱 폴백: RPC/컬럼 불일치 시 `lib/notifications/unified.ts` direct insert · `lib/data/notifications.ts` legacy `user_id` read 유지.

---

## 2. 구매자 라우트 (Buyer)

| 경로 | 기능 | 상태 | SQL / 외부 |
|------|------|------|------------|
| `/` | 홈·카탈로그·섹션(마감임박·인기·**리뷰 좋은 딜**·신규) | **ready** | deals/products |
| `/category/[slug]` | 카테고리 목록 | **ready** | — |
| `/search` | 검색 | **ready** | search_logs (집계 partial) |
| `/product/[id]` | 상품 상세·티어·리뷰 | **ready** | reviews |
| `/join/[id]` | 공동구매 참여 | **ready** | orders, inventory |
| `/checkout/[id]` | 체크아웃·약관 동의 | **ready** | orders |
| `/payment/request/[orderId]` | Toss 결제 위젯 | **partial** | Toss keys (PAY*) |
| `/payment/success` · `/payment/fail` | 결제 결과 | **ready** | payments |
| `/orders/[id]` | 주문 상세·타임라인 | **ready** | 043 order_timelines |
| `/mypage` | 마이페이지 허브 | **ready** | — |
| `/mypage/orders` | 주문·구매확정·환불 요청 | **ready** | 045 refunds |
| `/mypage/reviews` | 리뷰 관리 (15일·작성완료) | **ready** | reviews |
| `/mypage/addresses` | 배송지 CRUD | **ready** | addresses |
| `/mypage/payment` | 결제수단 | **partial** | UI·준비중 문구 |
| `/mypage/points` · `/mypage/benefits` | 포인트·쿠폰 | **partial** | 026 schema, 운영 미완 |
| `/mypage/participating` · `/groupbuys` | 참여 공동구매 | **ready** | orders |
| `/notifications` · `/mypage/alerts` | 알림센터 | **ready** | 038 applied; RPC + read_at 폴백 |
| `/support` · `/support/new` | 1:1 문의 | **ready** | support_tickets |
| `/saved` | 찜 | **ready** | saved_deals |
| `/login` | 로그인 (Kakao 등) | **partial** | **AUTH-001** prod OAuth |
| `/terms` · `/privacy` · `/refund-policy` · `/commerce-policy` | 약관·정책 | **ready** | 030 business_settings |

---

## 3. 판매자 라우트 (Seller)

모든 데이터 조회·변경은 **서버에서 `seller_id` 검증** (세션·`sellers.user_id` 매핑). 클라이언트에 `seller_id` 노출·신뢰 금지.

| 경로 | 기능 | 상태 | SQL / 외부 |
|------|------|------|------------|
| `/seller` | 리다이렉트·상태 게이트 | **ready** | sellers.status |
| `/seller/apply` | 입점 신청 | **ready** | 040 seller_documents |
| `/seller/pending` · `/rejected` · `/suspended` | 상태별 안내 | **ready** | — |
| `/seller/dashboard` | 대시보드·KPI | **ready** | orders, reviews |
| `/seller/products` | 상품 목록 | **ready** | products |
| `/seller/product-requests` | 상품 등록 요청 | **ready** | 042 seller_product_requests |
| `/seller/orders` · `/orders/[id]` | 주문·발송 | **ready** | 043 timeline |
| `/seller/settlements` · `/finance/settlements` | 정산 확인 | **partial** | settlement_records, 042 view |
| `/seller/finance/billing` | 광고비·추가청구 | **partial** | seller_billings; Toss 즉시결제 deferred |
| `/seller/cs-reviews` · `/reviews` | 문의·리뷰 | **ready** | reviews |
| `/seller/notices` | 공지 | **ready** | 039 seller_notices |
| `/seller/notifications` | 알림 | **ready** | 038 seller role |
| `/seller/settings` · `/settings/account` | 설정·정산계좌 | **ready** | 042 seller_payout_accounts |
| `/seller/policies` · `/resources` · `/support` | 정책·자료·지원 | **ready** | — |

**판매자 partial 상세**

- 정산 레코드 자동 생성·PG 입금 연동: 운영 프로세스 + SQL 검증 필요
- `seller_billings` 테이블 미적용 시 빈 목록·`not_configured` (missing table fallback)
- 입점 서류 업로드: 044 bucket applied — 수동 E2E 업로드 QA 권장

---

## 4. 관리자 라우트 (Admin)

`requireAdmin` · middleware `/admin` exact path. env 값은 UI에 노출하지 않음.

| 경로 | 기능 | 상태 | SQL / 외부 |
|------|------|------|------------|
| `/admin` · `/admin/dashboard` | 대시보드·KPI | **ready** | — |
| `/admin/go-live-readiness` | 오픈 준비 점검 | **ready** | — |
| `/admin/products` · `new` · `[id]/edit` | 상품 CRUD | **ready** | 041 category_review |
| `/admin/orders` | 주문·환불 승인 UI | **ready** | 045 refunds |
| `/admin/refunds` | 환불 큐 | **ready** | refunds |
| `/admin/sellers` · `[id]/review` | 입점 심사 | **ready** | 040–041 |
| `/admin/reviews` · `/review-reports` | 리뷰·신고 | **ready** | review_reports |
| `/admin/settlements` · `[id]` | 정산 관리 | **partial** | settlement_records |
| `/admin/payments` | PG·결제 설정 안내 | **partial** | Toss live keys |
| `/admin/support` · `[id]` | 문의 처리 | **ready** | support_tickets |
| `/admin/notifications` | 관리자 알림 | **ready** | 038 |
| `/admin/coupons` | 쿠폰 | **partial** | 026 |
| `/admin/suppliers` | 공급사 | **partial** | post-MVP |
| `/admin/seller-notices` | 판매자 공지 발행 | **ready** | 039 |
| `/admin/settings/business` | 사업자 정보 | **ready** | 030 |
| `/admin/settings/migrations` | 마이그레이션 상태 | **ready** | probe (no env leak) |
| `/admin/activity-logs` · `/error-logs` | 감사·에러 | **ready** | — |

---

## 5. 기능별 준비도 (역할 무관)

| 기능 | 상태 | 메모 |
|------|------|------|
| 공동구매 참여·티어 가격 | **ready** | 확정 로직·관리자 확정 |
| Toss 결제 (구조) | **ready** | confirm·webhook·widget |
| Toss 실환불·실결제 live | **deferred** | PAY-001, `TOSS_SECRET_KEY` |
| 환불 DB 플로우 | **ready** | admin 승인; PG cancel API deferred |
| 리뷰 CRUD·신고·관리자 처리 | **ready** | 좋아요 localStorage (**partial**) |
| 통합 알림 (user/seller/admin) | **ready** | 038 applied; RPC 폴백 in `lib/notifications/unified.ts` |
| 입점 심사·금지어 | **ready** | 040–041 |
| 정산·광고비 청구 UI | **partial** | settlement 자동화·Toss billing |
| Storage 서류·정산 파일 | **ready** (코드) | 044 applied; 업로드 E2E 수동 QA |
| order_items 라인 | **deferred** | 단일 `orders` row 모델 |
| 포인트·쿠폰·프로모션 엔진 | **partial** | UI·schema, 운영 TODO |
| Kakao OAuth 프로덕션 | **deferred** | AUTH-001 |
| git push · Vercel prod | **deferred** | B003, B004 |

---

## 6. SQL 마이그레이션 (030–045)

| ID | 파일 | 원격 (2026-05-29) | 앱 영향 |
|----|------|-------------------|---------|
| 030 | business_settings | applied | 푸터·PG 심사 |
| 038 | notifications_unified | **applied** ✓ | seller/admin/user 알림·RPC; direct insert + legacy read 폴백 |
| 039 | seller_notices | applied | 판매자 공지 |
| 040 | seller_application_review | applied | 입점 심사 |
| 041 | category_product_review | applied | 카테고리·상품 검수 |
| 042 | seller_extended_tables | applied | seller_users, payouts, requests |
| 043 | order_timelines | applied | 주문 타임라인 |
| 044 | storage buckets | **applied** ✓ | seller-documents · settlement-files |
| 045 | refunds_cancel_flow | applied | 환불·취소 |

---

## 7. 외부 인증·연결 (사용자 작업 — 코드 완료 후)

상세 ID·블로커: [EXTERNAL_AUTH_DEFERRED.md](./EXTERNAL_AUTH_DEFERRED.md) · [DEFERRED_ISSUES.md](./DEFERRED_ISSUES.md)

| ID | 항목 | 다음 액션 |
|----|------|-----------|
| B003 | Git push HTTPS | SSH 또는 PAT · `gh auth login` |
| B004 | Vercel prod | push 후 `npx vercel --prod` |
| B005 / E006 | Supabase 038·044 | **applied** ✓ (2026-05-29 사용자 확인) |
| AUTH-001 | Kakao OAuth prod | REST 키·redirect·Vercel URL |
| PAY-001 | Toss 실환불 API | `TOSS_SECRET_KEY` + cancel API |

---

## 8. 빌드·런타임

- `npm run build` · `npx next build --webpack` — 2026-05-29 **PASS** ([QA_REPORT_2026-05-29.md](./QA_REPORT_2026-05-29.md))
- 메모리: `NODE_OPTIONS='--max-old-space-size=6144'`
- Turbopack 이슈 시: `npx next build --webpack`

---

## 9. 출시 전 최소 수동 QA

1. 비로그인 → 홈 → 상품 → 참여 → 결제(테스트 키) → 주문·타임라인
2. 리뷰 작성(구매확정 후)·신고·관리자 처리
3. 판매자 입점·상품 요청·주문 발송
4. 관리자 환불 승인·입점 심사·마이그레이션 페이지 038/044 상태
5. `/admin/go-live-readiness` 경고 0건 목표 (PG·OAuth 제외)

---

## 10. 변경 이력

| 날짜 | 변경 |
|------|------|
| 2026-05-29 | 최초 작성 — DEFERRED_ISSUES·라우트 스캔·038/044·홈 리뷰 섹션 반영 |
| 2026-05-29 | Post-DB QA — 038/044 applied 반영 · QA_REPORT_2026-05-29 · 알림 mock 제거 |
