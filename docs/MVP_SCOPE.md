# Wadeal v2 MVP 범위 정의

> 마지막 업데이트: 2026-05-28  
> 자동 점검: [`/admin/dashboard`](/admin/dashboard) **「MVP 출시 준비」** 섹션 (`getMvpReadiness()`)  
> 관련: [RELEASE_PLAN.md](./RELEASE_PLAN.md) · [TODO_AUDIT.md](./TODO_AUDIT.md) · [GO_LIVE_CHECKLIST.md](./GO_LIVE_CHECKLIST.md)

---

## 상태 범례

| 상태 | 의미 |
| --- | --- |
| **done** | 출시 MVP 기준으로 사용 가능 |
| **partial** | UI·스키마·스텁은 있으나 프로덕션 전 검증·연동 필요 |
| **missing** | MVP 출시 전 구현·설정 필요 |

코드 탐색 기준일: 2026-05-28. 배포 DB·env에 따라 런타임 결과는 대시보드 점검값이 최신입니다.

---

## MVP 필수 (must have for launch)

### 인증·회원

| 항목 | 상태 | 근거 |
| --- | --- | --- |
| 카카오 OAuth 로그인 | **done** | `lib/auth/supabase-oauth.ts`, `app/login/page.tsx` |
| 세션·프로필 동기화 | **done** | `lib/auth/server-session.ts`, `lib/auth/sync-user-profile.ts` |
| 프로토타입/데모 로그인 | **partial** | `lib/auth/prototype-session.ts` — 프로덕션에서는 `NEXT_PUBLIC_ALLOW_DEMO_LOGIN` 비활성화 필수 |

### 상품·카탈로그

| 항목 | 상태 | 근거 |
| --- | --- | --- |
| 홈·카테고리·검색 목록 | **done** | `app/page.tsx`, `app/category/[slug]`, `app/search` |
| 상품 상세 | **done** | `app/product/[id]`, 티어·공유·리뷰 섹션 |
| 수량 티어 가격 | **done** | `components/tier-pricing.tsx`, `013_price_tiers_jsonb.sql`, `lib/orders/finalize-deal.ts` |

### 결제·주문

| 항목 | 상태 | 근거 |
| --- | --- | --- |
| 일반 즉시 결제 | **partial** | `components/toss-payment-widget.tsx`, `app/api/payments/toss/confirm` — PG 키·실결제 E2E 검증 필요 |
| 공동구매 참여·장바구니 | **done** | `app/join/[id]`, `app/join-cart`, `lib/data/join-cart.ts` |
| 체크아웃 | **done** | `app/checkout/[id]`, `components/checkout-order-shell.tsx` |
| 주문 내역 | **done** | `app/mypage/orders`, `lib/data/orders.ts` |
| 배송지 | **done** | `app/mypage/addresses`, `lib/data/addresses.ts` |
| 결제수단 선택·저장 | **partial** | `app/mypage/payment`, `023_saved_payment_methods.sql` — 빌링 실 API는 스텁 |
| 토스 결제 연동 구조 | **done** | confirm·webhook·`lib/payments/toss/client.ts`, `docs/PAYMENT_FLOW.md` |

### 운영(관리자)

| 항목 | 상태 | 근거 |
| --- | --- | --- |
| 상품 CRUD·승인 | **done** | `app/admin/products`, `lib/data/admin-products.ts` |
| 주문 관리 | **done** | `app/admin/orders`, `lib/data/admin-orders.ts` |
| 공동구매 확정 | **done** | `lib/orders/finalize-deal.ts`, `components/admin-finalize-deal-button.tsx` |
| 결제·PG 모니터링 | **done** | `app/admin/payments` |
| 활성 상품(운영) | **partial** | DB에 활성 상품 등록·시드 필요 (대시보드 자동 점검) |

### 고객 경험

| 항목 | 상태 | 근거 |
| --- | --- | --- |
| 기본 리뷰 | **partial** | `lib/data/reviews.ts`, `components/product-reviews-section.tsx` — 좋아요는 `local-review-likes` localStorage |
| 고객 문의 티켓 | **done** | `app/support`, `app/admin/support`, `018_support_tickets.sql` |
| 인앱 알림 센터 | **done** | `app/notifications`, `017_notifications_table.sql` (푸시 아님) |

### 법무·푸터

| 항목 | 상태 | 근거 |
| --- | --- | --- |
| 이용약관·개인정보·환불·공동구매 정책 | **done** | `app/terms`, `privacy`, `refund-policy`, `commerce-policy` |
| 사업자 정보·푸터 | **partial** | `components/site-footer.tsx`, `/admin/settings/business` — 실제 사업자 데이터 입력·노출 QA |

### 인프라·보안

| 항목 | 상태 | 근거 |
| --- | --- | --- |
| Supabase 데이터 레이어 | **done** | `lib/data/*`, `lib/supabase/*` |
| RLS·보안 강화 | **done** (마이그레이션) | `009_production_rls.sql`, `019_security_rls_hardening.sql` — **프로덕션 DB 적용 확인 필수** |
| Vercel·Supabase 배포 | **partial** | env·마이그레이션·도메인·`NEXT_PUBLIC_SITE_URL` 수동 검증 |

---

## 베타 이후 (post-beta)

| 항목 | 상태 | 근거 |
| --- | --- | --- |
| 자동결제·빌링키 강화 | **partial** | `lib/payments/toss/billing.ts` — mock/스텁, 실 API TODO |
| 알림톡(카카오) | **missing** | `lib/data/alerts.ts`, `price-alerts.ts` TODO, `KAKAO_ALIMTALK_API_KEY` |
| 앱·웹 푸시 | **missing** | 알림은 DB·인앱만, FCM/Web Push 없음 |
| 공급사 셀프 온보딩 | **partial** | `app/admin/suppliers`, `app/seller/apply` — 운영자 중심 |
| 정산 자동화 | **partial** | `app/admin/settlements`, mock 폴백 in `lib/data/settlements.ts` |
| 추천·개인화 랭킹 | **missing** | 추천 엔진 없음, 대시보드 인기 공동구매 집계만 |
| 쿠폰·포인트 고도화 | **partial** | `026_coupons_points.sql`, 체크아웃 할인 — 마케팅·운영 UI 제한적 |
| 친구 초대 리워드 | **partial** | `017_share_referral_system.sql`, `app/share` — 리워드 정산 자동화 미완 |
| 인기 검색어(로그) | **partial** | `lib/data/search.ts` `search_logs`·RPC — 데이터 축적 후 UI |
| 리뷰 이미지 강화 | **partial** | `017_review_images_storage.sql`, 업로드 UI — 운영·용량 정책 후속 |

---

## 보류·주의 (deferred / caution)

| 항목 | 권고 |
| --- | --- |
| 공격적 자동결제 | 출시 전 전 상품·전 사용자 빌링 강제 금지. 확정 후 결제 플로우 우선. |
| 복잡한 공급사 정산 | 초기에는 수동·스프레드시트. PG·회계 자동 분개는 이후. |
| 과도한 프로모션·포인트 | 기본 할인만. 대규모 적립·중복 쿠폰은 트래픽·정산 검증 후. |
| 미검증 외부 API | 알림톡·PG 웹훅·서드파티는 스테이징·계약 검증 후 프로덕션 ON. |

---

## MVP vs Go-Live 점검 차이

| 구분 | MVP 출시 준비 | 오픈 준비 상태 |
| --- | --- | --- |
| 목적 | **기능 범위** 충족 여부 | **운영·PG·DB** 즉시 출시 가능 여부 |
| 위치 | 대시보드 「MVP 출시 준비」 | 대시보드 「오픈 준비 상태」 |
| 구현 | `lib/admin/mvp-readiness.ts` | `lib/admin/go-live-readiness.ts` |

두 섹션을 함께 확인한 뒤 [RELEASE_PLAN.md](./RELEASE_PLAN.md) 단계별 체크리스트를 진행하세요.
