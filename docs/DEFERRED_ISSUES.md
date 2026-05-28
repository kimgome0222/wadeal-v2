# Wadeal 미해결 이슈 (Deferred)

> 갱신: 2026-05-29 · 외부 인증/원격 작업은 `docs/EXTERNAL_AUTH_DEFERRED.md` 참고

## 외부 인증·배포 (사용자 확인 필요)

| ID | 이슈 | 상태 | 다음 액션 |
|---|---|---|---|
| B003 | Git push HTTPS auth 실패 | blocked | SSH 또는 PAT 설정 후 `git push origin main` |
| B004 | Vercel prod 배포 | pending | push 후 `npx vercel --prod` |
| PAY-001 | Toss 실환불 API | TODO | `TOSS_SECRET_KEY` + Toss cancel API (`/api/payments/toss/refund`는 DB 상태만 반영, `apiDeferred: true`) |
| AUTH-001 | Kakao OAuth 프로덕션 | deferred | REST/CLIENT_SECRET/redirect URI Vercel 등록 |

## Supabase SQL (원격 미적용 가능)

| 파일 | 내용 | 확인 방법 |
|---|---|---|
| `042_seller_extended_tables.sql` | seller 확장 테이블 | Supabase SQL Editor |
| `043_order_timelines.sql` | order_timelines | 테이블 존재 여부 |
| `044_storage_seller_settlement_buckets.sql` | storage buckets | bucket 목록 |
| `045_refunds_cancel_flow.sql` | refunds 흐름 | refunds 컬럼 |

## 기능 부분완료

| 영역 | 항목 | 상태 |
|---|---|---|
| 정산 | seller_settlements 자동 생성 | 부분 — migration·UI read 위주 |
| order_items | 별도 line-item 테이블 | 앱은 `orders` 단일 row 모델 — `order_items` 미사용 |
| 홍보비 | promotion_fee/ad_fee | UI 표시만, 실제 광고 시스템 TODO |
| 마이페이지 | 포인트/쿠폰/결제수단 | UI 또는 준비중 |
| Toss webhook | 실패 시 error_logs | env guard 있음, live 검증 필요 |

## 빌드·런타임

- `NODE_OPTIONS='--max-old-space-size=6144'` 로 build 메모리 부족 완화 가능
- Turbopack 이슈 시 `npx next build --webpack` 사용

## Pre-launch audit (2026-05-29)

| 영역 | 결과 |
|---|---|
| Auth | middleware `redirect`+`next`, `/admin`·`/seller` exact path, `requireAdmin` → login |
| Payment | Toss 미설정 시 위젯 비활성·503 JSON, 결제 성공 시 timeline `paid`/`created` |
| Refund | admin-only 승인/반려, 금액 검증, Toss API는 deferred |
| DB fallback | orders/sellers/refunds/reviews/support-tickets 등 missing table → 빈/기본값 |
