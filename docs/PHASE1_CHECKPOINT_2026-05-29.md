# Phase 1 Checkpoint — 2026-05-29

> Wadeal v2 only · `~/Documents/wadeal-v2` · push/Vercel/원격 DB 미적용

## 이번 세션 완료

### 쿠팡형 UX
- 홈 헤더 장바구니 수량 뱃지 (`getJoinCartCountForUser` → `Header`)
- 상품 상세 탭 UI (`ProductDetailTabs`: 상품설명 / 배송·교환·환불 / 리뷰)

### 회원·인증 (Cloud 유실분 로컬 재구현)
- `/signup` — 아이디 중복확인, 비밀번호 정책, 약관, 본인인증 fallback
- 로그인 — 아이디+비밀번호, Google OAuth 버튼, 회원가입/찾기 링크
- `/forgot-username`, `/forgot-password`, `/reset-password`
- `/mypage/security` → `/mypage/settings` 리다이렉트
- `/mypage/withdrawal` — 전용 탈퇴 페이지
- 회원정보 수정 하단 `Wadeal 서비스 탈퇴` 링크 (작은 글씨·연한 빨강)

### DB (파일만)
- `supabase/migrations/047_profile_usernames.sql`
- `lib/types.ts` — `profile_usernames` 타입

### 검증
- `npm run build` — **PASS**

## 아직 deferred
- Supabase Auth 실제 연결 E2E (env/Provider 설정)
- NICE/PASS/다날 본인인증 API
- Vercel Deployment Protection 해제 후 public QA
- 체크아웃·주문완료 쿠팡형 요약 UI
- 결제수단 7종 UI 보강 (Toss 연동은 로컬에 존재)

## Cloud 17 추가 재구현 (동일 세션)
- 검색 모달/자동완성 (`components/search/search-panel.tsx`)
- 본인인증 checkout guard (`lib/auth/identity-guards.ts`)
- `/mypage/invite`, `/admin/search`, `/admin/viral`, `/marketing-terms`
- migration `048_featured_search_terms.sql`
- 상세: `docs/CLOUD17_REIMPLEMENT_2026-05-29.md`

## 백업
- `~/Documents/wadeal-backups/wadeal-phase1-2026-05-29/wadeal-v2-phase1-2026-05-29.tar.gz`
- `~/Desktop/wadeal-v2-phase1-2026-05-29.tar.gz`

## 다음 (전반 수정 전)
1. 사용자 지시 시 `047` migration 원격 적용
2. Supabase Google/Kakao Provider + env
3. 체크아웃 요약 UX
4. push / Vercel — 사용자 지시 후
