# CELLOH Final Local QA Report

**작성일:** 2026-05-30  
**프로젝트:** `/Users/kimgana/Documents/wadeal-v2`  
**브랜치:** `mobile-ui`

---

## 요약

CELLOH 모바일 커머스 Final Polish 작업을 로컬에서 완료한 상태를 기록한다.  
lint/build는 PASS이며, GitHub push는 인증 문제로 보류 중이다.

---

## Git 상태

| 항목 | 값 |
|------|-----|
| **브랜치** | `mobile-ui` |
| **최신 커밋** | `fdb9436` — `ui: polish celloh mobile commerce experience` |
| **GitHub push** | **보류** — `fatal: could not read Username for 'https://github.com': Device not configured` (HTTPS 인증 미설정) |

### 최근 커밋 이력

```
fdb9436 ui: polish celloh mobile commerce experience
a835c67 ui: fix home rail 2-up sizing and finalize mobile polish
e696e2e ui: refine celloh mobile commerce layout and mycelloh
e8f2d6a ui: celloh v2 phase5-9 experience refresh
ee0b10d ui: celloh v2 phase1-4 design refresh
```

### Working tree (문서 작성 시점)

최신 커밋(`fdb9436`) 이후 **미커밋 변경**이 존재한다 (게스트 UX 보강):

| 상태 | 파일 |
|------|------|
| Modified | `app/checkout/[id]/page.tsx`, `app/mypage/page.tsx`, `app/notifications/page.tsx`, `components/mypage-page-content.tsx`, `components/mypage/mypage-quick-menu.tsx`, `middleware.ts` |
| Untracked | `components/checkout-guest-preview.tsx`, `components/checkout-guest-payment-section.tsx`, `components/mypage/mypage-cello-guest.tsx`, `components/mypage/mypage-profile-card-guest.tsx`, `components/notifications-guest-preview.tsx` |

> push 전 위 변경을 별도 커밋으로 정리하는 것을 권장한다.

---

## 최종 검증

### lint

```
npm run lint → PASS (tsc --noEmit)
```

> 참고: `npm run build` 전에 lint만 단독 실행하면 `.next/types/validator.ts` stale cache로 FAIL할 수 있다. build 후 재실행 시 PASS.

### build

```
npm run build → PASS (Next.js 16.2.6, 39 pages)
```

경고: middleware → proxy convention deprecated (기능 영향 없음)

---

## 완료된 주요 작업

### 1. 디자인 시스템 통일

- Primary `#2E5E4E`, Accent `#E28A3B`, Border `#E8ECEA`, Soft BG `#F5F7F6`, Text `#111111`
- `lib/design-system.ts` 토큰 정리 (검색 radius 16px, empty state 48px 등)
- lucide-react 기반 `components/icons.tsx` 통일 (header/tab 24px, strokeWidth 2)

### 2. ProductCard 정리

- 판매자명·인증·재구매율·구매건수·응답속도 배지 제거
- 상품명 15px / 별점 13px / 할인율·가격 간격 10·6·8px
- 정가 12px `#999` line-through
- `min-height`·`justify-between`·`w-[180px]` 고정 제거

### 3. Home 상품 중심 개편

- 섹션 순서: Hero → Quick → 특가 → 인기 → 추천 → 후기 → 신규 판매자 → 인기 판매자 → 스토리 → 전체 상품
- "TOP SELLERS" 제거 → "인기 판매자" 한글 통일

### 4. Home rail 2-up 구조

- `.card-rail-item`: `calc((100vw - 60px) / 2)`
- track: `flex gap-3 px-6`, snap-x, scrollbar hidden
- double padding 제거 (home-catalog 루트 `px-6` 분리)

### 5. 상품 사진 gap 수정

- rail gap 12px (`gap-3`)
- 전체 상품 grid: column-gap 16px, row-gap 28px (`.product-grid`)
- rail 이미지 aspect-square, radius 18px

### 6. 카테고리/PLP 개선

- fallback: 상위 16개 / 하위 8개 (`ensureMinimumCategoryGridDeals`)
- 구조: chip → 정렬/필터 → 특가 rail → 인기 rail → grid → 추천 판매자(하단)
- sort custom popover 6종, quick filter chip 5종 (무료배송·특가·평점·신상·가격대)

### 7. 검색 개선

- 공통 앱 크롬 + idle/결과 분기
- 최근·추천·인기·급상승 검색어 UI

### 8. 상품상세 개선

- PDP 전용 sticky header (뒤로/검색/장바구니 badge)
- 수량 stepper, 구간별 혜택가, compact 판매자 카드
- 하단 구매바: 찜 48px, CTA 52~56px, safe area

### 9. 결제/구매 UI 개선

- 쿠폰/포인트 `flex-1` + inline button, overflow 방지
- inline 에러, blocking overlay 없음
- 게스트: `/checkout/[id]` 미리보기 UI (배송지 stub · 결제수단 · 로그인 CTA) — **미커밋**

### 10. 마이셀로 보강

- 프로필/등급/포인트/쿠폰 → 주문 5단계 → 빠른 메뉴(아이콘) → 최근본 → 추천 → 고객센터
- 게스트: `MypageCelloGuest` 미리보기 (추천 rail · 빠른 메뉴) — **미커밋**

### 11. 판매자페이지 압축

- 대표 상품 → 전체 상품 → compact 소개 → 후기 → 문의
- 팔로우/문의하기/상품 grid gap 16px

### 12. 알림 편집/삭제 UI

- 편집 · 체크박스 · 전체선택 · 읽음 · 삭제 (logged-in: DB + local)
- 게스트: `NotificationsGuestPreview` 미리보기 알림 + local 편집/삭제 — **미커밋**

### 13. Empty state compact

- lucide 아이콘 48px, title 18px, desc 13px, py-10
- 화면 전체 비우지 않음, CTA 유지

### 14. Sticky header/bottom spacing 정리

- header z-52, bottom nav z-60
- 본문 `pb-[max(calc(env(safe-area-inset-bottom)+120px),120px)]`
- PDP/checkout fixed CTA safe area 대응

---

## 로컬 수동 확인 경로

| 경로 | HTTP | 비고 |
|------|------|------|
| `/` | 200 | rail 2-up, grid 2열 |
| `/category/food` | 200 | fallback grid |
| `/search` | 200 | |
| `/product/1` | 200 | PDP header, 수량 |
| `/join-cart` | 200 | |
| `/checkout/wd-wipes-001` | 200 | 게스트 미리보기 (미커밋) |
| `/mypage` | 200 | 게스트/로그인 분기 |
| `/notifications` | 200 | 편집/삭제 UI |
| `/sellers/celloh` | 200 | |

---

## 남은 이슈

| 이슈 | 심각도 | 비고 |
|------|--------|------|
| GitHub push 인증 문제 | 높음 | SSH/gh auth 설정 후 push 필요 |
| 미커밋 게스트 UX 변경 | 중간 | push 전 커밋 권장 |
| 실제 DB 연동 전 mock/fallback | 중간 | Supabase schema drift 일부 legacy fallback |
| Toss 실결제 QA | 높음 | 스테이징/실환경 시나리오 미완 |
| OAuth 모바일 QA | 높음 | Kakao/Google/셀로 아이디 실기기 확인 |
| 선물하기/다중배송 | 낮음 | UI stub (`window.alert` 준비중) |
| 알림 삭제 DB 연동 | 중간 | local state 삭제 vs 서버 persist 확인 |
| 상품 이미지 다양성 | 낮음 | 샘플 데이터 보강 필요 |
| 실기기 375/390/430px 재확인 | 중간 | DevTools + 실기기 캡처 QA |

---

## 다음 작업 제안

1. **GitHub push 인증 해결** — `gh auth login` 또는 SSH key 등록 후 `git push -u origin mobile-ui`
2. **미커밋 게스트 UX 커밋** — checkout/mypage/notifications guest preview 정리 후 커밋
3. **실기기 캡처 기반 최종 UI QA** — 375 / 390 / 430px 스크린샷 체크리스트
4. **상품 이미지/샘플 데이터 다양화** — rail/grid visual density 확인
5. **결제 실사용 시나리오 QA** — 로그인 → 배송지 → 결제수단 → Toss confirm
6. **OAuth 모바일 로그인 QA** — Kakao/Google redirect, next path 복귀
7. **Vercel 배포 smoke test** — preview URL 주요 경로 200 확인

---

## 관련 문서

- `docs/APP_UI_QA_REPORT.md` — 단계별 QA 및 Final Polish 검증 기록
- `docs/CELLOH_MOBILE_UI_AUDIT.md` — 초기 모바일 UI 감사

---

**코드 수정 / DB 변경 / 배포 / push — 본 문서 작성 시점 기준 수행하지 않음.**
