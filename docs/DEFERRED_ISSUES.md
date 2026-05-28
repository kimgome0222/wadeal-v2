# Wadeal 미해결 이슈 (Deferred)

> 갱신: 2026-05-29 · 외부 인증/원격 작업은 `docs/EXTERNAL_AUTH_DEFERRED.md` 참고

## Supabase SQL Editor 실행 순서 (030–045)

아래 순서대로 Supabase Dashboard → **SQL Editor**에서 실행하세요.  
관리자 페이지 `/admin/settings/migrations`에서 원격 적용 여부를 확인할 수 있습니다.

| 순서 | 파일 | 주요 대상 | 원격 상태 (2026-05-29 probe) |
|------|------|-----------|------------------------------|
| 1 | `030_business_settings.sql` | `business_settings` | **applied** |
| 2 | `038_notifications_unified.sql` | `notifications.target_role`, `seller_id`, RPC | **applied** ✓ (2026-05-29 사용자 확인; anon probe는 컬럼 false 가능) |
| 3 | `039_seller_notices.sql` | `seller_notices` | **applied** |
| 4 | `040_seller_application_review.sql` | `seller_documents`, `seller_review_checks` | **applied** |
| 5 | `041_category_product_review.sql` | `category_review_rules`, `product_review_checklists` | **applied** |
| 6 | `042_seller_extended_tables.sql` | `seller_users`, `seller_product_requests`, `seller_payout_accounts`, `seller_settlements` view | **applied** |
| 7 | `043_order_timelines.sql` | `order_timelines`, `append_order_timeline` | **applied** |
| 8 | `044_storage_seller_settlement_buckets.sql` | Storage buckets `seller-documents`, `settlement-files` | **applied** ✓ (2026-05-29 사용자 확인; anon `listBuckets` probe false 가능) |
| 9 | `045_refunds_cancel_flow.sql` | `refunds`, `orders.refund_status` | **applied** |

로컬 probe: `node scripts/probe-migrations.mjs` (env 값 출력 없음)

---

## Integration audit (LAUNCH_QA §1–20, 2026-05-29)

| § | 영역 | 결과 | 비고 |
|---|------|------|------|
| 1 | 회원가입/로그인 | ✅ 코드 준비 | middleware 보호·`/admin` layout `requireAdmin`·Kakao prod deferred |
| 2 | 상품 목록/상세 | ✅ | 홈·카테고리·검색·`/product/[id]` |
| 3 | 가격 단계제 | ✅ | tier UI·admin 저장·마감 후 final_price |
| 4 | 공동구매 참여 | ✅ | join/join-cart/join-complete·orders 단일 row (order_items 미사용) |
| 5 | Checkout | ✅ | middleware 로그인 필수 |
| 6 | 주문 내역 | ✅ | mypage/orders·participating |
| 7 | 결제 준비 | ⚠️ | Toss env 없으면 위젯 비활성·503; live PG deferred |
| 8 | 마감 처리 | ✅ | admin finalize actions·정산 연동 |
| 9 | 배송/송장 | ✅ | admin orders·seller `registerTrackingNumberAction` |
| 10 | 구매 확정 | ✅ | confirmPurchaseAction |
| 11 | 리뷰 | ✅ | 작성·admin 숨김·신고; 좋아요 localStorage (post-launch) |
| 12 | 찜/최근/카트 | ✅ | saved·recent·join-cart |
| 13 | 검색/필터 | ✅ | search·category/[slug] |
| 14 | 알림 | ✅ DB | 038 applied; column-missing fallback 유지 |
| 15 | 공유/초대 | ⚠️ | share 로그·리퍼럴; 전환 통계 UI "준비 중" |
| 16 | 고객센터 | ✅ | support 티켓·취소/환불 요청·admin 답변 |
| 17 | 관리자 상품 | ✅ | CRUD·이미지·마감 |
| 18 | 관리자 주문 | ✅ | 상태·송장·메모·환불 대기 |
| 19 | 관리자 리뷰/신고 | ✅ | reviews·review-reports |
| 20 | 관리자 정산/공급사 | ✅ | settlements·suppliers |

### 이번 audit에서 수정한 항목

- **판매자 즉시 결제 mock-success 제거** — `paySellerBillingWithToss` 더 이상 paid 마킹 안 함; UI "즉시 결제 준비 중"
- **알림 insert mock 제거** — Supabase 미설정 시 `not_configured` 반환 (`lib/notifications/create.ts`)
- **`markNotificationAsRead`** — RPC missing 시 `read_at` direct update 폴백
- **`getNotificationsForUser` / `getUnreadCountByRole`** — `target_role` column error 시 legacy `user_id` query
- **`submitSellerProductForReviewAction`** — 승인 판매자 검증 추가
- **auth bypass 제거** — unauthenticated `notifySellerSettlementReady` server action 삭제 (lib 내부 함수만 사용)
- **KIBI** — app 코드에 잔존 없음 (grep 확인)

---

## 외부 인증·연결 (코드 밖 — 사용자/대시보드)

> 상용 체크리스트: `docs/COMMERCIAL_READINESS.md` · 전체 deferred ID: `docs/EXTERNAL_AUTH_DEFERRED.md`

### Git · Vercel

| ID | 이슈 | 상태 | 다음 액션 |
|---|---|---|---|
| B003 | Git push HTTPS auth | **blocked** | SSH 또는 GitHub PAT · `gh auth login` → `git push origin main` |
| B004 | Vercel Production | **pending** | B003 후 `npx vercel --prod` · Production env ([ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md)) |
| E003 | git push (work-queue) | **blocked** | B003과 동일 |
| E004 | Vercel prod 보류 | **pending** | B004와 동일 |

### Supabase · Storage

| ID | 이슈 | 상태 | 다음 액션 |
|---|---|---|---|
| B005 / E006 | 원격 마이그레이션 038·044 | **applied** ✓ | 2026-05-29 사용자 Dashboard 적용 확인 |
| N001 | (legacy) 038 알림 | **applied** ✓ | RPC 없을 때 앱 폴백: `lib/notifications/unified.ts` direct insert |

### 결제 · OAuth

| ID | 이슈 | 상태 | 다음 액션 |
|---|---|---|---|
| PAY-001 | Toss **실환불** cancel API | **deferred** | `TOSS_SECRET_KEY` · `/api/payments/toss/refund`는 DB·타임라인만 (`apiDeferred: true`) |
| AUTH-001 | Kakao OAuth **프로덕션** | **deferred** | Developers REST 키 · Client Secret · Redirect = Supabase callback · Vercel site URL |

### 코드 폴백 (원격/스키마 불일치 시)

| 모듈 | 동작 |
|---|---|
| `lib/notifications/unified.ts` | `create_role_notification` RPC missing → `notifications` insert · user 레거시 컬럼 2차 시도 |
| `lib/data/seller-billings.ts` | `seller_billings` missing table → `[]` / `not_configured` |
| `lib/data/*` (orders, refunds, reviews, …) | missing table/column → 빈·0·기본값 |

---

## 기능 부분완료

| 영역 | 항목 | 상태 |
|---|---|---|
| Storage | seller-documents / settlement-files | **applied** (044) — 업로드 E2E 수동 QA 권장 |
| 정산 | seller_settlements 자동 생성 | 부분 — migration·UI read 위주 |
| order_items | 별도 line-item 테이블 | 앱은 `orders` 단일 row 모델 — `order_items` 미사용 |
| 홍보비 | promotion_fee/ad_fee | UI·정산차감 청구 가능; 즉시 Toss 결제 준비 중 |
| 마이페이지 | 포인트/쿠폰/결제수단 | 포인트·결제수단 DB 연동; 쿠폰함 UI "준비 중" |
| Toss webhook | 실패 시 error_logs | env guard 있음, live 검증 필요 |
| 예금주 확인 | seller bank verify | API 연동 준비 중 — 수동 입력 fallback |
| 리뷰 좋아요 | review_likes 테이블 | localStorage — post-launch |

---

## 빌드·런타임

- `NODE_OPTIONS='--max-old-space-size=6144'` 로 build 메모리 부족 완화
- Turbopack 이슈 시 `npx next build --webpack` 사용
- **2026-05-29 post-DB QA**: `npm run build` **PASS** · `npx next build --webpack` **PASS** · [QA_REPORT_2026-05-29.md](./QA_REPORT_2026-05-29.md)

---

## Pre-launch audit (2026-05-29)

| 영역 | 결과 |
|---|---|
| Auth | middleware `redirect`+`next`, `/admin`·`/seller` exact path, admin layout `requireAdmin`, seller layout `enforceSellerRouteAccess` |
| Server actions | admin actions `ensureAdmin`/`isAdminUser`; seller actions `getSellerAccessContext`+`isApproved`; buyer actions `getServerAuthUser` |
| Payment | Toss 미설정 시 위젯 비활성·503 JSON |
| Refund | admin-only 승인/반려, Toss API deferred |
| DB fallback | orders/sellers/refunds/reviews/support-tickets/notifications 등 missing table/column → 빈/기본값 |
| Migration checker | `/admin/settings/migrations` — admin-only |

---

## TOP 5 remaining risks

1. **Toss live PG** — confirm/webhook/refund live 검증·`TOSS_SECRET_KEY` 필요
2. **Git push blocked** — unpushed commits; Vercel prod stale
3. **Webhook secret verification** — `process-webhook.ts` TODO (must-fix per TODO_AUDIT)
4. **Storage E2E** — bucket applied 후 서류/정산 파일 업로드 수동 QA
5. **Kakao OAuth prod** — redirect URI·Supabase provider 설정 필요
