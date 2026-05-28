# Wadeal 미해결 이슈 (Deferred)

> 갱신: 2026-05-29 · 외부 인증/원격 작업은 `docs/EXTERNAL_AUTH_DEFERRED.md` 참고

## Supabase SQL Editor 실행 순서 (030–045)

아래 순서대로 Supabase Dashboard → **SQL Editor**에서 실행하세요.  
관리자 페이지 `/admin/settings/migrations`에서 원격 적용 여부를 확인할 수 있습니다.

| 순서 | 파일 | 주요 대상 | 원격 상태 (2026-05-29 probe) |
|------|------|-----------|------------------------------|
| 1 | `030_business_settings.sql` | `business_settings` | **applied** |
| 2 | `038_notifications_unified.sql` | `notifications.target_role`, `seller_id`, RPC | **partial** — 테이블은 있으나 `target_role`·`seller_id` 컬럼 미적용 |
| 3 | `039_seller_notices.sql` | `seller_notices` | **applied** |
| 4 | `040_seller_application_review.sql` | `seller_documents`, `seller_review_checks` | **applied** |
| 5 | `041_category_product_review.sql` | `category_review_rules`, `product_review_checklists` | **applied** |
| 6 | `042_seller_extended_tables.sql` | `seller_users`, `seller_product_requests`, `seller_payout_accounts`, `seller_settlements` view | **applied** |
| 7 | `043_order_timelines.sql` | `order_timelines`, `append_order_timeline` | **applied** |
| 8 | `044_storage_seller_settlement_buckets.sql` | Storage buckets `seller-documents`, `settlement-files` | **missing/unknown** — anon 키로 버킷 목록 조회 불가; Dashboard → Storage에서 확인 |
| 9 | `045_refunds_cancel_flow.sql` | `refunds`, `orders.refund_status` | **applied** |

### Migration별 테이블/대상 상세

**030** — `business_settings` (singleton id=1), RLS, `updated_at` trigger

**038** — ALTER `notifications`: `seller_id`, `target_role`, type check 확장, role-based RLS, `create_role_notification`, `mark_notification_read` RPC

**039** — `seller_notices` (draft/published/archived, category)

**040** — `seller_documents`, `seller_review_checks` (입점 심사 체크리스트)

**041** — `category_review_rules` (카테고리별 시드), `product_review_checklists`

**042** — `seller_users`, `seller_product_requests`, `seller_payout_accounts`, `sellers.status` 확장, `seller_settlements` view

**043** — `order_timelines`, `append_order_timeline` RPC

**044** — Storage buckets + RLS policies (파일 업로드용)

**045** — `refunds` 테이블, `orders.refund_status` / `refund_rejected_reason`, timeline status 확장

### 우선 적용 필요

1. **`038_notifications_unified.sql`** — 판매자/관리자 역할 알림, unread count, `target_role` 필터 전부 의존
2. **`044_storage_seller_settlement_buckets.sql`** — 입점 서류·정산 파일 업로드 (Dashboard에서 bucket 존재 확인)

로컬 probe: `node scripts/probe-migrations.mjs` (env 값 출력 없음)

---

## 외부 인증·배포 (사용자 확인 필요)

| ID | 이슈 | 상태 | 다음 액션 |
|---|---|---|---|
| B003 | Git push HTTPS auth 실패 | blocked | SSH 또는 PAT 설정 후 `git push origin main` (2026-05-29: `fatal: could not read Username for 'https://github.com'`) |
| B004 | Vercel prod 배포 | pending | push 후 `npx vercel --prod` |
| PAY-001 | Toss 실환불 API | TODO | `TOSS_SECRET_KEY` + Toss cancel API (`/api/payments/toss/refund`는 DB 상태만 반영, `apiDeferred: true`) |
| AUTH-001 | Kakao OAuth 프로덕션 | deferred | REST/CLIENT_SECRET/redirect URI Vercel 등록 — `docs/EXTERNAL_AUTH_DEFERRED.md` |

---

## 기능 부분완료

| 영역 | 항목 | 상태 |
|---|---|---|
| 알림 | seller/admin role 알림 | **038 partial** — migration 적용 전 seller·admin 알림 제한 |
| Storage | seller-documents / settlement-files | **044** — Dashboard 확인 필요 |
| 정산 | seller_settlements 자동 생성 | 부분 — migration·UI read 위주 |
| order_items | 별도 line-item 테이블 | 앱은 `orders` 단일 row 모델 — `order_items` 미사용 |
| 홍보비 | promotion_fee/ad_fee | UI 표시만, 실제 광고 시스템 TODO |
| 마이페이지 | 포인트/쿠폰/결제수단 | UI 또는 준비중 |
| Toss webhook | 실패 시 error_logs | env guard 있음, live 검증 필요 |

---

## 빌드·런타임

- `NODE_OPTIONS='--max-old-space-size=6144'` 로 build 메모리 부족 완화 가능
- Turbopack 이슈 시 `npx next build --webpack` 사용
- **2026-05-29**: `npm run build` 통과 (Next.js 16.2.6 Turbopack)

---

## Pre-launch audit (2026-05-29)

| 영역 | 결과 |
|---|---|
| Auth | middleware `redirect`+`next`, `/admin`·`/seller` exact path, `requireAdmin` → login |
| Payment | Toss 미설정 시 위젯 비활성·503 JSON, 결제 성공 시 timeline `paid`/`created` |
| Refund | admin-only 승인/반려, 금액 검증, Toss API는 deferred |
| DB fallback | orders/sellers/refunds/reviews/support-tickets 등 missing table → 빈/기본값 |
| Migration checker | `/admin/settings/migrations` — admin-only, env 값 미노출 |
