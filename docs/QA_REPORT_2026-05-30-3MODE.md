# Wadeal 3모드 QA 리포트 — 2026-05-30

> Wadeal v2 only · KIBI 금지 · celloh 리브랜딩 미시작  
> 방식: 코드·라우트·권한·build 정적 QA (로컬 E2E 수동 테스트는 별도)

## Build / Git 스냅샷

| 항목 | 결과 |
|------|------|
| `npm run build` | **PASS** (Next.js 16.2.6 Turbopack) |
| 미커밋 파일 | **78개** (수정 42 + 신규 36) |
| HEAD | `9fbf679` Save reboot checkpoint before Cursor restart |
| origin/main 대비 | **39 commits ahead** (미 push) |
| KIBI 문자열 | **0건** |
| celloh 코드 변경 | **없음** (분석 문서만) |

---

## Buyer QA

| 항목 | 결과 | 비고 |
|------|------|------|
| 비로그인 홈/검색/카테고리 | ✅ | 공개 라우트 |
| 비로그인 checkout/join-cart/mypage | ✅ | middleware → `/login?next=` |
| 로그인 후 주문 흐름 | ⚠️ | mypage orders 풍부, `/orders/[id]` 얇음 |
| 결제 (Toss) | ⚠️ | 위젯 있음; billing/refund API TODO |
| 리뷰 작성 | ✅ | PDP + mypage; 구매자 제한 로직 있음 |
| Q&A | ❌ | PDP Q&A 탭 없음; 1:1 support만 |
| 찜 | ✅ | `/saved` + toggle |
| 알림 | ✅ | in-app; 카카오 push 준비 중 |
| 마이페이지 | ✅ | 20+ 서브라우트 |
| Cloud17 signup/recovery | ✅ | 미커밋 상태 |
| 본인인증 checkout guard | ✅ | `identity-guards.ts` |
| 검색 모달 | ✅ | header + search-panel |
| 모바일 반응형 | ⚠️ | Tailwind 반응형 클래스 사용; 실기기 미검 |

**Buyer 완성도: ~78%**

---

## Seller QA

| 항목 | 결과 | 비고 |
|------|------|------|
| 미로그인 `/seller/*` | ✅ | → `/seller/login` |
| pending seller | ✅ | → `/seller/pending` |
| rejected / suspended | ✅ | 전용 페이지 |
| approved seller 주문/송장 | ✅ | `requireSeller` = approved |
| 상품 등록 요청 | ⚠️ | `/seller/product-requests` → redirect only; 셀러 자가 등록 폼 없음 |
| 리뷰 답글 | ✅ | `/seller/reviews` |
| 상품 문의 CS | ❌ | placeholder "연동 예정" |
| 정산 확인 | ✅ | confirm flow |
| 출금요청 | ⚠️ | UI 있음; **migration 049 미적용 시 실패** |
| 대시보드 KPI | ✅ | 오늘주문/환불/정산예정 등 |
| 알림 | ✅ | DB 연동 |

**Seller 완성도: ~67%**

---

## Admin QA

| 항목 | 결과 | 비고 |
|------|------|------|
| 비관리자 `/admin/*` | ✅ | middleware + `isAdminUser` + AccessDenied |
| server action admin 검증 | ✅ | `ensureAdmin` / `isAdminUser` |
| 대시보드 | ✅ | stats + readiness |
| 카테고리/배너/이벤트 | ⚠️ | **세션 메모리** — 재시작 시 초기화 |
| 쿠폰 | ✅ | DB CRUD |
| 주문/환불/판매자 | ✅ | DB |
| 정산 | ⚠️ | payout UI; 049 + 필터 부족 |
| 회원 관리 | ❌ | 전용 라우트 없음 |
| Cloud17 admin/search, viral | ✅ | 미커밋 |

**Admin 완성도: ~68%** (회원관리 0% 포함)

---

## 권한 매트릭스 (코드 기준)

| 역할 | /admin | /seller (approved) | /seller (pending) | /checkout |
|------|--------|---------------------|-------------------|-----------|
| guest | login | seller/login | seller/login | login |
| buyer | unauthorized | apply/pending | apply/pending | OK if logged in |
| seller approved | unauthorized* | OK | — | OK |
| admin | OK | OK (bypass) | — | OK |

\*admin은 seller layout에서 bypass

---

## P0 (오픈 차단)

1. **Migration 047/048/049 로컬·운영 미적용** — username, featured search, payout
2. **Admin CMS 세션 메모리** — 배너/카테고리/기벤트 운영 불가 (재시작 소실)
3. **실결제/환불 Toss live** — refund API TODO
4. **Seller 상품 자가 등록** — 판매자 온보딩 핵심 누락
5. **PDP Q&A** — 쿠팡형 필수 기능 gap
6. **Admin 회원 관리** — 없음
7. **78개 미커밋** — 작업 손실 위험
8. **39 commits 미 push** — GitHub 백업 없음
9. **수동 3계정 E2E** — 미실행
10. **Supabase env/RLS 프로덕션 검증** — 미완

---

## P1 (오픈 전 권장)

- `/orders/[id]` mypage 수준으로 보강
- Admin payout_requested 필터/알림
- Seller CS 문의 답변 연동
- 배송조회 API (현재 택배사 URL만)
- checkout/order-complete 쿠팡형 요약 UI
- OAuth E2E (Kakao dedicated callback)

---

## 오픈 가능 여부

**현재: 오픈 불가 (내부 QA·스테이징만 가능)**

- build는 통과하나 DB migration·CMS persistence·결제 live·E2E 미완

---

## celloh 리브랜딩

**시작 불가** — Wadeal 안정화·migration·E2E 선행 필요

---

## 다음 액션 (합의 순서)

1. ✅ 3모드 QA (본 문서)
2. ✅ git commit `2a44b1b`
3. ⬜ Supabase SQL Editor → `APPLY_047_048_049_COMBINED.sql`
4. ⬜ migration probe: `node scripts/probe-pending-migrations.mjs`
5. ⬜ P0 seller product request + PDP Q&A (2026-05-30 session)
6. ⬜ push (사용자 지시 후)
