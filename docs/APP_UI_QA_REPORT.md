# CELLOH 앱 UI 2차 고도화 QA 리포트

**브랜치:** `mobile-ui`  
**작업일:** 2026-05-30  
**범위:** 공통 앱 레이아웃 · 마이셀로 · 검색 · 카테고리 · 알림 · 내정보 관리

---

## 수정 파일 (16)

| 파일 | 변경 요약 |
|------|-----------|
| `app/page.tsx` | `AppBuyerLayout` 적용, 중복 헤더 제거 |
| `app/search/page.tsx` | 공통 앱 크롬 + 검색 idle/결과 분기 |
| `app/categories/page.tsx` | `CategoriesSplitView` + 공통 레이아웃 |
| `app/mypage/page.tsx` | 공통 레이아웃, 마이셀로 콘텐츠 |
| `app/mypage/settings/page.tsx` | 내정보 관리 앱형 UI, 레이아웃 |
| `app/join-cart/page.tsx` | 공통 레이아웃 |
| `app/notifications/page.tsx` | 공통 레이아웃 + 탭 필터 |
| `components/home-catalog.tsx` | 상단 Header 제거 (크롬으로 통합) |
| `components/bottom-navigation.tsx` | 5탭(홈/카테고리/검색/마이셀로/장바구니), z-index·불투명 |
| `components/icons.tsx` | `MenuIcon` 추가 |
| `components/mypage-page-content.tsx` | 로그인 전/후 마이셀로 분기 |
| `components/mypage-settings-content.tsx` | 쿠팡형 내정보 관리 섹션 |
| `components/notifications-list.tsx` | 카테고리 탭 필터 연동 |
| `components/search/search-idle-hub.tsx` | 급상승 검색어 섹션 추가 |
| `lib/design-system.ts` | 하단 탭 z-index/shadow |
| `middleware.ts` | `/mypage`, `/notifications`, `/join-cart` 게스트 접근 허용 |

---

## 신규 파일 (11)

| 파일 | 역할 |
|------|------|
| `components/app-buyer-layout.tsx` | 탭 루트 공통 레이아웃 래퍼 |
| `components/app-buyer-chrome.tsx` | sticky 헤더 + 검색 + 카테고리 바 |
| `components/app-sticky-header.tsx` | 로고 · 찜 · 알림 |
| `components/app-category-bar.tsx` | 마켓컬리형 sticky 카테고리 칩 |
| `components/mypage-cello-login.tsx` | 마이셀로 비로그인 유도 |
| `components/mypage-cello-logged-in.tsx` | 마이셀로 로그인 후 대시보드 |
| `components/categories-split-view.tsx` | 쿠팡형 좌/우 카테고리 |
| `components/notifications-app-tabs.tsx` | 알림 8탭 필터 |
| `components/search-trending-section.tsx` | 급상승 검색어 1~10위 UI |
| `lib/app/category-bar-items.ts` | 카테고리 바 항목 정의 |
| `lib/search/trending-search-terms.ts` | 급상승 검색어 mock (1시간 로테이션) |

---

## 앱 UI 변경점

### 상단 헤더
- sticky, 흰색 배경, z-40
- 좌: CELLOH 로고 / 우: 찜(`/saved`), 알림(`/notifications`)
- 로그인·회원가입·마이·장바구니 상단 버튼 제거

### 검색창 + 카테고리 바
- 헤더 아래 검색창 (포커스 시 `/search` 이동)
- 마켓컬리형 가로 스크롤 카테고리 칩 (초록 `#2E5E4E`, sticky)
- 전체/식품/생활/뷰티/패션/디지털/반려동물/혜택/판매자소식

### 하단 탭바
- 5탭: 홈 · 카테고리(≡) · 검색 · 마이셀로 · 장바구니
- `z-[60]`, 흰색 불투명, safe-area, 그림자
- 경로: `/`, `/categories`, `/search`, `/mypage`, `/join-cart`

### 마이셀로
- **비로그인:** "로그인이 필요해요" + OAuth/셀로 아이디 로그인 (네이버 준비중)
- **로그인:** 이름·설정, 요약 카드, 빠른 메뉴, 쿠팡형 텍스트 메뉴, 로그아웃

### 내정보 관리 (`/mypage/settings`)
- 프로필 아이콘 + 이름
- 회원 정보 / 수령인 정보 / 멤버십 / 계정 설정 / 기타 섹션
- 기존 비밀번호 변경·로그아웃 기능 유지

### 검색
- 최근·추천·인기 검색어 + **급상승 검색어 1~10위** (mock, 1시간 단위)

### 카테고리
- 좌측 카테고리 목록 + 우측 하위 링크 (쿠팡형 split view)
- 혜택/기획전 섹션 포함

### 알림
- 탭: 전체/주문배송/찜/판매자소식/재입고/혜택/리뷰/고객센터
- 데이터 없을 때 empty state 유지

---

## HTTP 테스트 결과 (localhost:3000)

| 경로 | HTTP | 비고 |
|------|------|------|
| `/` | 200 | PASS |
| `/search` | 200 | PASS |
| `/categories` | 200 | PASS |
| `/notifications` | 200 | PASS (게스트 empty) |
| `/join-cart` | 200 | PASS (게스트 로그인 유도) |
| `/mypage` | 200 | PASS (게스트 로그인 유도) |
| `/product/1` | 200 | PASS |
| `/sellers/celloh` | 200 | PASS |
| `/seller` | 307 | → seller/login (기존 동작) |
| `/seller/dashboard` | 307 | → seller/login (기존 동작) |

---

## lint / build

```
npm run lint  → PASS (tsc --noEmit)
npm run build → PASS (Next.js 16.2.6)
```

---

## 유지한 기능 / 제약 준수

- KIBI 미접근
- DB schema 변경 없음
- OAuth / Toss 로직 변경 없음
- 기존 route 전부 유지
- SEO metadata 수정 없음
- 기능 삭제 없음 (판매자/관리자 role 링크, 로그아웃 등 유지)

---

## 남은 이슈

1. **네이버 로그인** — 버튼 disabled (준비중), 기존 OAuth 미연동
2. **최근 주문 / 자주 구매 상품** — 가로 스크롤 상품 카드는 데이터 연동 전 empty/요약 텍스트 상태
3. **일부 메뉴** — 선물함, 구독서비스, 체험단, 대량주문 등 `준비중` meta 표시
4. **급상승 검색어** — mock 함수 (1시간 로테이션), 실시간 서버 연동 없음
5. **알림 재입고 탭** — 타입 매핑 empty, 필터 시 empty state
6. **상품 상세·카테고리 서브 페이지** — 탭 루트 외 페이지는 기존 `SubHeader` 레이아웃 유지 (의도적 최소 범위)
7. **middleware** — `/mypage` 루트·알림·장바구니만 게스트 허용, `/mypage/*` 하위는 로그인 필수 유지

---

## git status (작업 완료 시점)

수정 16 + 신규 11 (미커밋). `docs/QA_REPORT_FINAL.md`는 별도 QA 문서로 untracked.

**커밋/푸시:** 사용자 요청에 따라 수행하지 않음.

---

## 3차 — 로그인/보호 액션 + 여백/가독성 (2026-05-30)

### 수정 파일 (11)

| 파일 | 변경 |
|------|------|
| `components/user-consent-form.tsx` | 전체 동의 ↔ 하위 약관 양방향 동기화, indeterminate |
| `components/auth-login-prompt.tsx` | **신규** — 공통 로그인 유도 UI |
| `components/mypage-cello-login.tsx` | 여백·정렬 정리, 카드 박스 제거 |
| `components/mypage-page-content.tsx` | 비로그인 시 최근 활동 제거 |
| `app/mypage/page.tsx` | 비로그인 SiteFooter 숨김 |
| `app/saved/page.tsx` | AppBuyerLayout + 공통 로그인 UI |
| `app/notifications/page.tsx` | 비로그인 → 로그인 유도 (empty state 아님) |
| `app/join-cart/page.tsx` | 제목 "장바구니" |
| `components/join-cart-content.tsx` | cart variant 로그인 유도 |
| `components/signup-form.tsx` | 필수 약관 미동의 시 가입 버튼 비활성 |
| `components/home-rail-deal-card.tsx` | 썸네일 할인 배지 제거, 가격 영역 통일 |

### 약관 전체 동의

- 전체 ON → 필수+선택 모두 체크
- 전체 OFF → 모두 해제
- 하위 전체 체크 → 전체 ON / 하나 해제 → 전체 OFF
- signup 제출 버튼: 필수 미동의 시 disabled

### 모바일 카카오 로그인

- 코드: `lib/auth/supabase-oauth.ts` — `redirectTo = window.location.origin + /auth/callback` (localhost 하드코딩 없음)
- `/auth/callback` 경로 유지
- **콘솔 등록 필요 Redirect URI 후보:**
  - `http://localhost:3000/auth/callback`
  - `http://192.168.45.9:3000/auth/callback`
  - `https://<vercel-preview>.vercel.app/auth/callback`
  - `https://<production-domain>/auth/callback`
- Supabase Dashboard → Authentication → URL Configuration 에도 동일 origin 추가 필요
- Kakao Developers → Redirect URI 동일 등록 필요
- 미등록 시 코드 수정으로 해결 불가 — 콘솔 설정 이슈

### 보호 액션 / 로그인 유도

| 경로 | 비로그인 동작 |
|------|----------------|
| `/mypage` | OAuth 로그인 유도 (마이셀로) |
| `/saved` | 공통 로그인 UI → `/login?next=/saved` |
| `/notifications` | 공통 로그인 UI → `/login?next=/notifications` |
| `/join-cart` | cart variant → `/login?next=/join-cart` |
| 찜 버튼 | `/login?next=현재경로` (기존) |
| 장바구니 담기 | `/login?next=/join-cart?pending=slug` (기존) |

### 홈 전체 상품 / 할인율

- `HomeAllProductsSection` — 2열 Grid + infinite scroll (이전 커밋 유지)
- 썸네일 `%` 배지 제거, `DealCardPriceBlock`에서 `17,900원 44%` + 정가 표시

### lint / build (3차)

```
npm run lint  → PASS
npm run build → PASS
```

### git status (3차, 미커밋)

수정 10 + 신규 1 (`components/auth-login-prompt.tsx`)

---

## 4차 — UI 디테일 수정 (2026-05-30)

**목표:** 중복 카테고리 바 제거 · 필터 active 상태 · 추천 판매자 문구 · 전체 상품 가격 잘림 · 카드 여백

### 수정 파일 (Phase 4 관련)

| 파일 | 변경 |
|------|------|
| `app/category/[slug]/page.tsx` | `CategoryGrid`·`DealCatalogSortBar`·`SubHeader` 중복 제거, 제목+하위카테고리+툴바+그리드만 유지 |
| `app/search/page.tsx` | 검색 결과 `DealCatalogSortBar` 중복 제거 (툴바 정렬/필터만 유지) |
| `components/deal-catalog-toolbar.tsx` | 필터 칩 active: celloh green `#2E5E4E` + white, `aria-pressed`, `router.push scroll:false` |
| `components/category-sub-nav.tsx` | 하위 카테고리 칩 active 스타일 통일 (green/white) |
| `lib/sellers/trust-copy.ts` | 추천 판매자 섹션 문구 개선 |
| `app/globals.css` | `.deal-card` overflow-visible, body padding·gap 확대 |
| `components/deal-card.tsx` | 가격 영역 하단 여백, flex 레이아웃 정리 |
| `components/deal-card-price-block.tsx` | compact 가격 line-height·wrap 조정 (정가 취소선 잘림 방지) |
| `components/deal-product-grid.tsx` | 2열 grid gap 13px |
| `components/home-all-products-section.tsx` | 2열 grid gap 13px |
| `lib/design-system.ts` | grid 제목 min-height 제거, 2줄 clamp 유지 |

### 카테고리 중복 바 정리

- **유지:** 공통 sticky `AppCategoryBar` (헤더 아래)
- **유지:** 카테고리 상세 — 페이지 제목 + `CategorySubNav`(하위) + `DealCatalogToolbar`(정렬/필터)
- **제거:** `CategoryGrid`(전체/추천/인기… 중복 칩), `DealCatalogSortBar`(정렬 중복 줄), `SubHeader` sticky 스택
- `/categories` — split view만 (추가 카테고리 줄 없음)

### 필터 버튼 active

- 인증판매자·리뷰·빠른응답·가격 프리셋 클릭 시 URL query 반영 + green active 표시
- 비활성: white bg + `#DDE8E2` border

### 추천 판매자 문구

- 제목: **좋은 판매자의 상품**
- 설명: **신뢰할 수 있는 판매자의 상품을 먼저 만나보세요.**
- 색상: `SectionHeader` — 제목 `#1F2A24`(charcoal), 설명 `slate-500`(muted)

### 전체 상품 가격 잘림

- `.deal-card` `overflow-hidden` → `overflow-visible`
- 카드 body `pb-3.5`, 가격 block `leading-snug` + bottom padding
- grid gap 13px, 상품명 2줄 clamp (min-height 강제 제거)

### lint / build (4차)

```
npm run lint  → PASS (tsc --noEmit)
npm run build → PASS (Next.js 16.2.6)
```

### git status (4차, 미커밋)

Phase 3·4 포함 수정 22 + 신규 1 (`components/auth-login-prompt.tsx`). **커밋/푸시 하지 않음.**

---

## 5차 — 앱 spacing / 여백 (2026-05-30)

**목표:** sticky chrome 아래 본문 여백 · 검색 섹션 간격 · 탭 루트 페이지 rhythm 통일

### 공통 spacing 기준 (`lib/design-system.ts`)

| 토큰 | 값 | 용도 |
|------|-----|------|
| `page.appBody` | `pt-8 pb-4 px-4` | sticky 아래 본문 top 32px |
| `page.appSectionGap` | `space-y-10` | 주요 섹션 간 40px |
| `spacing.sectionHead` | `mb-4` | 섹션 제목 하단 16px |
| `spacing.chipRow` | `gap-2.5` | 칩 row 10px |
| `spacing.chipRowPy` | `py-1` | 칩 row 상하 여백 |
| `spacing.bottomNav` | safe-area + 96px | 하단 탭 겹침 방지 |

`lib/ui.ts`: `appPageBody`, `appSectionStack` export

### 수정 파일

| 파일 | 변경 |
|------|------|
| `lib/design-system.ts` | spacing 토큰 · appBody · appSectionGap |
| `lib/ui.ts` | `appPageBody`, `appSectionStack` |
| `components/app-buyer-layout.tsx` | bottomNav padding (safe-area + 96px) |
| `app/search/page.tsx` | `appPageBody` 적용 |
| `components/search/search-idle-hub.tsx` | 섹션 stack 40px, 제목/칩 spacing |
| `components/search/featured-search-terms.tsx` | 제목 mb-4, 칩 gap |
| `components/search-trending-section.tsx` | h2 통일, sectionHead |
| `components/home-catalog.tsx` | 홈 상단 pt-8 |
| `app/categories/page.tsx` | `appPageBody` |
| `app/category/[slug]/page.tsx` | `appPageBody` + section stack |
| `app/mypage/page.tsx` | `appPageBody` |
| `app/notifications/page.tsx` | `appPageBody` + 제목 spacing |
| `app/saved/page.tsx` | `appPageBody` (찜/wishlist) |
| `app/join-cart/page.tsx` | `appPageBody` |
| `components/auth-login-prompt.tsx` | empty state 상단 pt 확대 |

### 검색 페이지 여백

- sticky 카테고리 바 아래 **32px** (`appPageBody pt-8`)
- 추천/인기/급상승 섹션 간 **40px** (`appSectionStack`)
- 섹션 제목 하단 **16px**, 칩 row **gap 10px** + py-1

### HTTP 테스트

| 경로 | HTTP |
|------|------|
| `/` | 200 |
| `/search` | 200 |
| `/categories` | 200 |
| `/notifications` | 200 |
| `/join-cart` | 200 |
| `/mypage` | 200 |
| `/saved` | 200 |

### lint / build (5차)

```
npm run lint  → PASS
npm run build → PASS
```

**커밋/푸시 하지 않음.**

---

## 6차 — 카테고리 split view 썸네일/너비 (2026-05-30)

**목표:** 쿠팡형 좁은 좌측 메뉴 + 우측 하위 카테고리 카드 + 샘플 상품 6개 grid

### 수정·신규 파일

| 파일 | 변경 |
|------|------|
| `components/categories-split-view.tsx` | 좌 96px · 우측 17px padding · 하위 카테고리 3열 카드 · 2열 상품 grid |
| `lib/categories/category-sample-deals.ts` | **신규** — catalog 기반 샘플 6개 (부족 시 mock 제목 + 기존 이미지) |
| `lib/categories/subcategory-glyphs.ts` | **신규** — 하위 카테고리 이모지 |
| `app/categories/page.tsx` | `getAllActiveDeals` 전달 · `?category=` URL 지원 |

### 좌측 너비

- **96px** (기존 108px → 축소)
- 텍스트 `11px` + `line-clamp-2`
- 선택: celloh green `#2E5E4E` border + text

### 하위 카테고리 UI

- 3열 icon 카드 (이모지 + 2줄 라벨)
- `{카테고리} 전체` + 각 하위 카테고리
- 클릭 시 active 상태 + 해당 sub 필터

### 샘플 상품 6개

- `getCategorySampleItems(catalog, slug, subSlug)` — `dealMatchesSubCategory` + catalog fallback
- 2열 grid · 1:1 이미지 · 상품명 2줄
- 클릭: `getProductDetailHref` → `/product/{id}`

### overflow / 하단 탭

- 우측 `min-w-0 overflow-x-hidden`
- layout `bottomNav` padding 유지

### HTTP 테스트

| 경로 | HTTP |
|------|------|
| `/categories` | 200 |
| `/categories?category=food` | 200 |
| `/categories?category=living` | 200 |
| `/categories?category=beauty` | 200 |
| `/categories?category=pet` | 200 |
| `/product/101` | 200 |

### lint / build (6차)

```
npm run lint  → PASS
npm run build → PASS
```

**커밋/푸시 하지 않음.**

---

## 7차 — 로그인/UI 동작 + spacing (2026-05-30)

### 수정 파일

| 파일 | 변경 |
|------|------|
| `lib/ui.ts` | 카카오 `#FEE500`/`#191919`, `formInput`, `formBtnInline`, `authBtn`, `afterChromeBody` |
| `app/globals.css` | `.btn-kakao` 52px · 노란 배경 |
| `components/login-screen.tsx` | 카카오/Google OAuth, 셀로 아이디 폼, 준비중 disabled |
| `components/mypage-cello-login.tsx` | 로그인하기 → `/login?next=/mypage`, 카카오 스타일 |
| `components/auth-login-prompt.tsx` | z-index, `/login?next=` Link |
| `components/signup-form.tsx` | input 52px, 중복확인 104px, px-6 |
| `components/app-buyer-chrome.tsx` | 검색창 48px, pb-4 |
| `components/app-category-bar.tsx` | 검색↔카테고리 간격 |
| `components/app-buyer-layout.tsx` | 본문 `min-w-0` wrapper |
| `components/policy-page-content.tsx` | `afterChromeBody` |
| `components/home-catalog.tsx` | hero pt-6 |
| `lib/design-system.ts` | searchInput 48px |

### 카카오 버튼

- 배경 `#FEE500`, 글자 `#191919`, 높이 52px, radius 14px, 💬 아이콘
- disabled 시 opacity 60% (약관 미동의 등)

### 로그인 버튼 동작

| 경로 | 동작 |
|------|------|
| `/mypage` (비로그인) | 로그인하기 → `/login?next=/mypage` |
| `/saved`, `/notifications`, `/join-cart` | AuthLoginPrompt → `/login?next=...` |
| `/login` | 카카오/Google → Supabase OAuth, 셀로 아이디 → 폼 submit |

### 회원가입 입력칸

- input `flex-1 min-w-0` + 중복확인 `104×52px`, gap 10px
- 폼 padding 24px (`px-6`)

### 검색창 / 본문 여백

- 검색 48px, form `pb-4`, 본문 `appPageBody pt-8` (32px)

### lint / build (7차)

```
npm run lint  → PASS
npm run build → PASS
```

**커밋/푸시 하지 않음.**

---

## 8차 — 상품 카드/섹션 여백·비율 (2026-05-30)

### 수정 파일

| 파일 | 변경 |
|------|------|
| `lib/design-system.ts` | 섹션 pt-10, head mb-5, `productGrid`, grid card h-auto |
| `components/ds/section-header.tsx` | 제목↔설명 mt-1.5 |
| `app/globals.css` | rail/grid body padding, carousel overflow-visible |
| `components/deal-card.tsx` | h-full 제거, flex column, body gap |
| `components/deal-card-price-block.tsx` | 가격/정가 line-height 1.5 |
| `components/deal-card-meta.tsx` | compact 1줄 truncate |
| `components/home-recommended-deal-card.tsx` | rail 카드 잘림 제거 |
| `components/home-all-products-section.tsx` | productGrid |
| `components/deal-product-grid.tsx` | productGrid items-start |
| `components/policy-page-content.tsx` | 카드 간격·line-height 1.6 |

### 섹션 여백

- 제목↔설명 **6px** (`mt-1.5`)
- 설명↔상품 리스트 **20px** (`section.head mb-5`)
- 섹션 간 **40px** (`section.home pt-10 pb-5`)

### 전체 상품 grid

- `height` 고정 제거, `items-start min-w-0`
- body `pt-3 pb-4`, gap 8px
- 가격 영역 2줄 (판매가+할인 / 정가)

### 가로 스크롤 카드

- carousel item `overflow-visible`
- rail card/body `overflow-visible`, pb-4

### lint / build (8차)

```
npm run lint  → PASS
npm run build → PASS
```

**커밋/푸시 하지 않음.**

---

## 9차 — 카테고리 버튼 클릭/라우팅 버그 (2026-05-29)

### 원인

| 항목 | 내용 |
|------|------|
| **핵심** | `CategoriesSplitView`의 `useEffect`가 `selected`를 dependency에 포함 → 왼쪽 카테고리 클릭 시 `setSelected` 직후 URL 갱신 전 effect가 재실행되어 **이전 카테고리로 되돌림** |
| **부가** | 일부 영역이 `overflow-hidden` / z-index 미지정으로 클릭 영역 불안정 가능 |
| **sticky bar** | `/categories?category=food`에서 상단 바 active 미반영, `/category/*` 링크만 사용 |

### 수정 파일

| 파일 | 변경 |
|------|------|
| `components/categories-split-view.tsx` | URL↔state 분리, `button`/`onClick`, query(`category`/`sub`/`sort`/필터), `relative z-10`, `overflow-x-hidden` |
| `lib/categories/category-sample-deals.ts` | `sort` 파라미터로 샘플 상품 정렬 |
| `components/app-category-bar.tsx` | `/categories`에서 `?category=` 링크·active, `useSearchParams` |
| `components/app-buyer-chrome.tsx` | `AppCategoryBar` `Suspense` 래핑 |
| `components/deal-catalog-toolbar.tsx` | `relative z-10`, chip active (celloh green) |

### active / query 동작

| 영역 | 동작 |
|------|------|
| **왼쪽 카테고리** | 클릭 → active(좌측 green border) + 오른쪽 패널 교체 + `?category=food` 등 |
| **하위 카테고리** | 클릭 → active(border green) + 샘플 상품·제목 변경 + `?category=food&sub=food-fresh` |
| **sticky bar** | `/categories`에서 식품 등 → `/categories?category=food`, active pill 표시 |
| **필터/정렬** | chip 클릭 → URL query 갱신 + green active; 샘플 목록 sort 반영 |

**URL slug 참고:** 하위 카테고리는 `sub=fresh`가 아니라 catalog slug (`food-fresh`, `food-processed` 등). 생활은 `living`.

### QA 경로

- `/categories`, `/categories?category=food`, `/categories?category=living`, `/categories?category=beauty`
- `/categories?category=food&sub=food-fresh`, `/categories?category=food&sort=reviews`
- `/category/food` — `DealCatalogToolbar` chip 클릭·active
- sticky bar → `/categories?category=*` 또는 `/category/*`

### lint / build (9차)

```
npm run lint  → PASS
npm run build → PASS
```

**커밋/푸시 하지 않음.**

---

## 10차 — 홈 PHASE 3 개편 (2026-05-30)

### 홈 섹션 순서

1. Hero Carousel  
2. Quick Menu  
3. TOP SELLERS  
4. 실시간 인기 상품 (2열 Grid)  
5. 추천 판매자 (가로 스크롤)  
6. 셀로 추천 상품 (2열 Grid)  
7. 새로 입점했어요 (가로 스크롤)  
8. 후기 좋은 상품 (2열 Grid)  
9. 오늘의 특가 (가로 스크롤)  
10. 판매자 이야기 (가로 스크롤)  
11. 전체 상품 (2열 Grid, 20개+ lazy load)

### 수정 파일

| 파일 | 변경 |
|------|------|
| `components/home-catalog.tsx` | 섹션 순서·구성 전면 개편 |
| `app/page.tsx` | `buildHomeViewModel` 연동 |
| `lib/home/hero-carousel-slides.ts` | 배너 4종 카피·CTA |
| `components/home-all-products-section.tsx` | 초기 20개, pt-10 |
| `components/home/hero-carousel.tsx` | 상단 pt 제거 (catalog에서 24px) |

### 신규 파일

| 파일 | 역할 |
|------|------|
| `lib/home/build-home-view.ts` | 홈 view model (catalog 재사용) |
| `lib/home/quick-menu-items.ts` | Quick Menu 10항목 |
| `lib/home/seller-stories.ts` | 판매자 스토리 mock |
| `components/home/home-quick-menu.tsx` | Quick Menu |
| `components/home/home-top-sellers-section.tsx` | TOP SELLERS |
| `components/home/home-top-seller-card.tsx` | 280×240 판매자 카드 |
| `components/home/home-seller-rail-section.tsx` | 추천/신규 판매자 rail |
| `components/home/home-product-grid-section.tsx` | 2열 ProductCard grid |
| `components/home/home-special-price-section.tsx` | 오늘의 특가 rail |
| `components/home/home-seller-stories-section.tsx` | 판매자 이야기 320×280 |

### 제거/정리

- `HomeCategoryIcons` (중복 카테고리)
- `HomeTrustStrip`
- 기존 `HomeProductRailSection` 홈 노출
- 어색한 rail subtitle 문구

### lint / build (10차)

```
npm run lint  → PASS
npm run build → PASS
```

**커밋/푸시 하지 않음.**

---

## 11차 — 카테고리 / PLP PHASE 4 개편 (2026-05-30)

### 카테고리 구조 변경

- 좌측 **28%** (`#F8F8F8`, active: white + 3px `#2E5E4E`, 14px)
- 우측 **72%** (padding 16px, min-w-0)
- 좌측 메뉴: 전체 · 식품 · 생활 · 뷰티 · 패션 · 디지털 · 반려동물 · 기획전 · 판매자소식
- 우측 순서: 카테고리 제목 → 하위 2열 Grid (88px) → 추천 판매자 → 인기 상품 → 후기 좋은 상품
- 하위 카테고리: `lib/categories/category-display-subcategories.ts` (display mock)
- ProductCard: `DealProductGrid` + PHASE 2 `DealCard`

### 상품목록(PLP) 구조 변경

- `DealCatalogToolbar`: 제목 24px, 상품수 13px, 정렬바 44px `#F5F7F6` radius 14px
- 필터칩 6종: 전체 · 무료배송 · 특가 · 신상품 · 평점4.5+ · 판매자추천
- active chip: `#2E5E4E` bg + white text
- `/category/[slug]`, `/search` 공통 적용

### 클릭 버그 수정

- `CategoriesSplitView` URL↔state sync 유지 (`searchParams` deps only)
- 좌측/하위 카테고리 전부 `<button>` + `router.replace`
- `?category=` / `?sub=` URL 반영

### 추천 판매자

- `PlpRecommendedSellers`: 8명 가로 스크롤, 140px 카드
- 카테고리 패널 · PLP · 검색 결과에 노출

### 수정 파일

| 파일 | 변경 |
|------|------|
| `components/categories-split-view.tsx` | 28/72 레이아웃, 섹션 재구성 |
| `components/deal-catalog-toolbar.tsx` | PLP 헤더·필터칩 |
| `app/category/[slug]/page.tsx` | toolbar title, 추천 판매자 rail |
| `app/search/page.tsx` | toolbar title, 추천 판매자 |
| `app/categories/page.tsx` | bottom padding |
| `lib/search/types.ts` | freeShipping filter |
| `lib/search/params.ts` | freeShip param |
| `lib/search/query.ts` | freeShip mock filter |

### 신규 파일

| 파일 | 역할 |
|------|------|
| `lib/categories/category-display-subcategories.ts` | 하위 카테고리 display mock |
| `lib/categories/build-category-panel-view.ts` | 패널 view model |
| `lib/search/plp-quick-filters.ts` | PLP 필터칩 정의 |
| `components/plp/plp-recommended-sellers.tsx` | 추천 판매자 rail |

### 남은 이슈

- 무료배송 칩: mock 기준 `groupPrice >= 30000` (DB 필드 연동 전)
- 하위 카테고리 slug(`fruit` 등)는 display 전용 — PLP `/category/food?sub=` 는 기존 catalog slug 병행

### lint / build (11차)

```
npm run lint  → PASS
npm run build → PASS
```

**커밋/푸시 하지 않음.**

---

## 12차 — Search PHASE 5 개편 (2026-05-30)

### 검색 첫 화면 구조 (`/search`)

1. 상단 검색창 (sticky chrome, 52px, radius 16px)
2. 최근 검색어 (localStorage, 최대 10)
3. 추천 검색어 (mock 10)
4. 급상승 검색어 (1~10위, 2열, 1시간 mock)
5. 추천 판매자 (8명 rail)

### 검색 결과 구조 (`/search?q=`)

1. 상단 검색창
2. 상품 / 판매자 탭 (`?tab=sellers`)
3. 정렬 chip (추천·인기·최신·평점·가격)
4. 상품 Grid 또는 판매자 카드 리스트
5. 결과 없음 → 추천 검색어 + 추천 판매자

### 수정 파일

| 파일 | 변경 |
|------|------|
| `app/search/page.tsx` | idle/results 분기, SearchResultsView |
| `components/search/search-idle-hub.tsx` | 섹션 순서·스타일 개편 |
| `components/search/search-empty-results.tsx` | empty copy, 추천 chip/seller |
| `components/search-trending-section.tsx` | 2열 grid, 토큰 정렬 |
| `components/app-buyer-chrome.tsx` | 검색창 52px, placeholder |
| `lib/design-system.ts` | searchInput token |
| `lib/search/trending-search-terms.ts` | search-data pool 연동 |

### 신규 파일

| 파일 | 역할 |
|------|------|
| `lib/search/search-data.ts` | 추천/급상승 mock, sort options |
| `components/search/search-term-chips.tsx` | chip UI |
| `components/search/search-results-tabs.tsx` | 상품/판매자 탭 |
| `components/search/search-product-sort-bar.tsx` | 정렬 chip |
| `components/search/search-results-view.tsx` | 결과 뷰 orchestrator |
| `components/search/search-seller-result-list.tsx` | 판매자 결과 카드 |

### 남은 이슈

- 최근 검색어: localStorage 없으면 섹션 숨김 (첫 방문 empty)
- 판매자 대표 썸네일: catalog brandName 매칭 mock

### lint / build (12차)

```
npm run lint  → PASS
npm run build → PASS
```

**커밋/푸시 하지 않음.**

---

## 13차 — PDP PHASE 6 개편 (2026-05-30)

### 상품상세 구조 (16섹션)

1. 상품 이미지 (420~480px, swipe)
2. 판매자명 → 상품명 → 평점 → 가격
3. 배송정보 (단순 리스트)
4. 판매자 카드
5. WHY SELLER
6. 상세 탭 (상품설명 / 상세정보 / 후기 / 문의)
7. 상품설명
8. 상세정보 (표)
9. 후기 (포토 16 / 베스트 10 / 전체 20+)
10. 문의 (상품·판매자 탭)
11. 이 판매자의 다른 상품 (8)
12. 함께 본 상품 (8)
13. sticky 구매바 (찜 / 장바구니 / 구매하기)

### 수정 파일

| 파일 | 변경 |
|------|------|
| `app/product/[id]/page.tsx` | 섹션 순서 재구성 |
| `components/product-summary-panel.tsx` | 판매자명·가격·평점 정리 |
| `components/product-image-gallery.tsx` | 420~480px, swipe |
| `components/product-detail-section-nav.tsx` | 4탭 sticky |
| `components/product-detail-cta.tsx` | 72px sticky bar |
| `components/product-reviews-section.tsx` | 포토/베스트/전체 |
| `components/product-detail-visual-section.tsx` | 상품설명 |
| `components/similar-products-section.tsx` | 8개 grid |
| `components/product-detail-bottom-sections.tsx` | 추천 상품 |

### 신규 파일

| 파일 | 역할 |
|------|------|
| `lib/product/detail-data.ts` | mock·배송·WHY SELLER |
| `components/product/product-detail-shipping-summary.tsx` | 배송정보 |
| `components/product/product-detail-seller-card.tsx` | 판매자 카드 |
| `components/product/product-why-seller-section.tsx` | WHY SELLER |
| `components/product/product-detail-info-table.tsx` | 상세정보 표 |
| `components/product/product-photo-reviews-grid.tsx` | 포토후기 4×4 |
| `components/product/product-inquiry-section.tsx` | 문의 탭 |

### 남은 이슈

- 판매자 후기: 태그 mock만 (PHASE 7 판매자관 확대 예정)
- 문의 상품/판매자 탭: 동일 데이터 (DB 구분 없음)
- 포토후기: 리뷰 부족 시 상품 이미지 mock padding

### lint / build (13차)

```
npm run lint  → PASS
npm run build → PASS
```

**커밋/푸시 하지 않음.**

---

## 14차 — 판매자관 PHASE 7 개편 (2026-05-29)

### 판매자관 구조 (12섹션)

1. 판매자 커버 이미지 (220px, full-width)
2. 판매자 프로필 (72px 아바타 · 이름 · 한줄소개 · 지역)
3. 핵심 통계 3개 (평점 · 판매 · 후기)
4. 팔로우 / 문의 버튼 (48px)
5. 대표 상품 (8 · 2열 DealCard)
6. 인기 상품 (8 · 2열 DealCard)
7. 전체 상품 (24+ · 더보기 · 정렬 칩)
8. 판매자 이야기 (6 · 320×280 가로 스크롤)
9. 상품 후기 (포토 16 · 베스트 10 · 전체 20+)
10. 판매자 후기 (15 · 태그 카드)
11. 문의 (상품·판매자 탭 · 기존 Q&A)
12. 하단 탭바 (`AppBuyerLayout` — sticky CTA 제거)

### 수정 파일

| 파일 | 변경 |
|------|------|
| `app/sellers/[id]/page.tsx` | `AppBuyerLayout` + view model 빌드·리뷰 집계 |
| `components/seller-profile-page-content.tsx` | 12섹션 순서 재구성 |
| `components/seller-profile-all-products.tsx` | 24개 초기 노출 + 더보기, 2열 grid |

### 신규 파일

| 파일 | 역할 |
|------|------|
| `lib/sellers/seller-profile-data.ts` | 커버·스토리·판매자후기 mock |
| `lib/sellers/build-seller-profile-view.ts` | 판매자관 view model |
| `components/seller/seller-profile-cover.tsx` | 220px 커버 |
| `components/seller/seller-profile-header.tsx` | 프로필 헤더 |
| `components/seller/seller-profile-stats.tsx` | 통계 3개 |
| `components/seller/seller-profile-actions.tsx` | 팔로우·문의 |
| `components/seller/seller-profile-deals-section.tsx` | 대표/인기 상품 grid |
| `components/seller/seller-profile-product-reviews.tsx` | 상품 후기 |
| `components/seller/seller-profile-service-reviews.tsx` | 판매자 후기 |

### 커버 / 프로필

- 커버: 220px · `object-cover` · radius 0 · 이미지 없으면 `#F5F7F6` + 판매자명 fallback
- 프로필: 72px 원형 아바타 (white border) · 이름 22px/700 · 한줄소개 14px/#666 · 지역 라벨
- 제거: 인증 배지 · 신뢰 지표 5열 · 응답속도 · 재구매율 상단 노출

### 통계 3개

- ⭐ 평점 · 📦 판매 N건 · 💬 후기 N개
- 3열 · `#F5F7F6` · radius 20px · padding 16px

### 팔로우 / 문의

- 2열 grid · height 48px · radius 16px
- 팔로우 primary `#2E5E4E` · 문의 secondary white+border
- 로그인 전 팔로우 → `/login?next=` 기존 흐름 유지

### 대표 / 인기 / 전체 상품

- 대표·인기: 각 8개 · `DealProductGrid` + PHASE 2 `DealCard`
- 전체: 24개 초기 + 더보기 · 인기/최신/할인율 정렬 칩
- 가로 스크롤 상품 rail 제거

### 판매자 이야기

- `HomeSellerStoriesSection` 재사용 · 6카드 · 320×280
- 부제: "상품 뒤에 있는 사람과 이야기를 만나보세요."

### 후기

- 상품 후기: 포토 16 (4×4) · 베스트 10 · 전체 20+ 더보기
- 판매자 후기: 태그(포장/배송/응답/재구매) + 텍스트 카드 15개

### 문의

- `ProductInquirySection` 재사용 · 상품문의/판매자문의 탭 · 답변완료/대기 표시

### 남은 이슈

- 판매자 후기: mock 태그 기반 (DB `seller_reviews` 연동 예정)
- 문의 상품/판매자 탭: 동일 Q&A 데이터 (DB 구분 없음)
- 포토후기: 리뷰 부족 시 상품 이미지 mock padding
- celloh 셀러: catalog 전체 fallback 노출 (기존 동작 유지)

### lint / build (14차)

```
npm run lint  → PASS
npm run build → PASS
```

**커밋/푸시 하지 않음.**

---

## 15차 — 마이셀로 / 장바구니 / 주문 PHASE 8 개편 (2026-05-29)

### 마이셀로 비로그인

- 중앙 정렬 · 넓은 여백
- 로그인하기 · 카카오 · 구글 · 셀로 아이디 로그인 · 회원가입 링크
- 버튼 height 56px · primary `#2E5E4E` · 카카오 `#FEE500`
- 최근 활동/주문/본 상품 미노출

### 마이셀로 로그인 후

- 프로필 카드 140px · `#F5F7F6` · 셀로캐시/쿠폰 · 설정 아이콘
- 주문상태 4칸 (결제완료/상품준비중/배송중/배송완료)
- 빠른 메뉴 2×3 (주문·찜·판매자·최근본·리뷰·문의)
- 최근 주문 8 · 최근 본 상품 12 · 찜 판매자 10 (가로 스크롤)
- 텍스트 메뉴: 쇼핑 / 결제·혜택 / 고객센터 / 설정

### 내 정보 관리 (`/mypage/settings`)

- 프로필 아이콘 · 회원정보 · 주소록 · 계정 설정 · 기타
- 제목 24px/700 · 섹션 40px · row border `#E8ECEA`

### 장바구니 (`/join-cart`)

- 비로그인 로그인 유도 · pending 자동 담기 유지
- 판매자별 묶음 · 전체선택/선택삭제 · sticky 결제 영역
- 상품 row: 체크박스/이미지/수량/가격/삭제

### 주문/결제

- `/checkout/[id]`: 주문상품 → 배송지 → 쿠폰·셀로캐시 → 결제수단 → 최종금액 → sticky 주문
- `/join-complete`, `/payment/success`: 주문 완료 CTA
- Toss/결제 로직 변경 없음

### 수정 파일

| 파일 | 변경 |
|------|------|
| `app/mypage/page.tsx` | hubData fetch |
| `components/mypage-cello-login.tsx` | 비로그인 UI |
| `components/mypage-cello-logged-in.tsx` | 로그인 후 허브 |
| `components/mypage-page-content.tsx` | hubData prop |
| `components/mypage-settings-content.tsx` | 내 정보 관리 |
| `components/join-cart-content.tsx` | 판매자별 장바구니 |
| `app/join-cart/page.tsx` | 제목·padding |
| `app/checkout/[id]/page.tsx` | 주문상품 섹션 |
| `components/checkout-order-shell.tsx` | 섹션 재구성 |
| `components/checkout-consent-section.tsx` | 배송지·결제수단 |
| `components/checkout-payment-method-picker.tsx` | 스타일 |
| `components/auth-login-prompt.tsx` | 장바구니 variant |
| `lib/data/join-cart.ts` | sellerName/imageUrl |
| `app/join-complete/page.tsx` | 주문 완료 |
| `app/payment/success/page.tsx` | 결제 완료 |

### 신규 파일

| 파일 | 역할 |
|------|------|
| `lib/mypage/hub-data.ts` | 주문상태·최근주문·최근본 mock |
| `components/mypage/mypage-profile-card.tsx` | 프로필 카드 |
| `components/mypage/mypage-order-status-bar.tsx` | 4칸 상태바 |
| `components/mypage/mypage-quick-menu.tsx` | 빠른 메뉴 |
| `components/mypage/mypage-recent-orders-rail.tsx` | 최근 주문 |
| `components/mypage/mypage-recent-views-rail.tsx` | 최근 본 상품 |
| `components/mypage/mypage-following-sellers-rail.tsx` | 찜 판매자 |
| `components/mypage/mypage-text-menus.tsx` | 텍스트 메뉴 |
| `components/checkout/checkout-section.tsx` | checkout wrapper |

### 남은 이슈

- 찜 판매자: localStorage + catalog fallback (서버 follow API 없음)
- 장바구니 주문하기: 선택 1건 `/join` 이동 (다건 통합결제 미지원)
- 쿠폰 표시: 실제 보유 쿠폰 수와 usage count 구분 필요
- 자주 산 상품/선물함/체험단: 준비중 링크

### lint / build (15차)

```
npm run lint  → PASS
npm run build → PASS
```

**커밋/푸시 하지 않음.**

---

## 16차 — 알림 / 리뷰 / 문의 PHASE 9 개편 (2026-05-29)

### 알림 (`/notifications`)

- 비로그인: `AuthLoginPrompt` — 로그인 유도만 (최근 활동/주문 미노출)
- 로그인 후: 제목 "알림" · 8탭 (전체/주문배송/찜/판매자소식/재입고/혜택/리뷰/고객센터)
- 탭: height 44px · active `#2E5E4E` · sticky
- 카드: 80px · 아이콘 · 제목 · 설명 · 시간 · 읽지 않음 `#2E5E4E` 점
- Empty: "아직 받은 알림이 없어요"

### 리뷰 (`/mypage/reviews`, PDP `#product-reviews`)

- 마이셀로 리뷰관리: 탭 (작성 가능 / 작성한) · 상품사진 · 구매일 · 리뷰쓰기/수정
- PDP: 포토 16 · 베스트 10 · 전체 20+ · `ReviewCard` white card
- 판매자 후기: `ProductSellerReviewsSection` (태그 + 10카드 mock)
- 포토후기 최대 3장 노출 (review-card)

### 문의 (`#product-qna`, `/mypage/support`)

- 탭: 상품문의 / 판매자문의
- `InquiryQuestionCard`: 제목 · 내용 · 답변상태(완료 `#2E5E4E` / 대기 `#999999`) · 판매자 답변 gray box
- 문의하기 버튼 52px · radius 16px

### 고객센터

- `InquiryCustomerCenterMenu`: FAQ · 공지 · 배송 · 상품문의 · 1:1 · 대량주문
- `/mypage/support` — AppBuyerLayout + 문의 내역

### Empty State

- `ds.empty`: 아이콘 56px · 제목 20px/700 · 설명 14px/#666 · 버튼 56px

### 수정 파일

| 파일 | 변경 |
|------|------|
| `app/notifications/page.tsx` | 비로그인/로그인 UI |
| `components/notifications-list.tsx` | sticky 탭 · 카드 리스트 |
| `components/notifications-app-tabs.tsx` | 44px pill 탭 |
| `components/notification-card.tsx` | 80px 카드 · green dot |
| `components/mypage-reviews-content.tsx` | 탭 · 상품사진 카드 |
| `app/mypage/reviews/page.tsx` | hub data · AppBuyerLayout |
| `components/product-reviews-section.tsx` | 판매자 후기 섹션 |
| `components/review-card.tsx` | white card · 사진 3장 |
| `components/product-qa-section.tsx` | inquiry cards · 52px CTA |
| `components/product/product-inquiry-section.tsx` | 탭 스타일 |
| `app/mypage/support/page.tsx` | 문의 + 고객센터 |
| `lib/data/reviews.ts` | `getReviewsByUserId` |
| `lib/design-system.ts` | empty icon 56px |

### 신규 파일

| 파일 | 역할 |
|------|------|
| `lib/notifications/display.ts` | 알림 아이콘 매핑 |
| `lib/mypage/review-hub-data.ts` | 작성 가능/작성한 리뷰 빌드 |
| `components/product/product-seller-reviews-section.tsx` | PDP 판매자 후기 |
| `components/inquiry/inquiry-question-card.tsx` | 문의 카드 |
| `components/inquiry/inquiry-customer-center-menu.tsx` | 고객센터 메뉴 |

### 남은 이슈

- 판매자 후기: mock (DB `seller_reviews` 연동 예정)
- 상품/판매자 문의 탭: 동일 Q&A 데이터
- 리뷰 판매자 답변: DB 필드 없음 (UI 준비만)
- `/mypage/inquiries` route 없음 → `/mypage/support` 사용

### lint / build (16차)

```
npm run lint  → PASS
npm run build → PASS
```

**커밋/푸시 하지 않음.**

---

## PHASE 5~9 통합 QA (2026-05-29)

PHASE 5 Search · PHASE 6 Product Detail · PHASE 7 Seller Profile · PHASE 8 My/Cart/Checkout · PHASE 9 Notification/Review/Q&A 변경분을 한 번에 점검.

### QA 경로

| 경로 | HTTP | 결과 |
|------|------|------|
| `/` | 200 | 홈 · sticky header/category · 하단 탭 · ProductCard 정상 |
| `/search` | 200 | 추천 검색어 · 급상승 · 추천 판매자 표시 (최근 검색어는 localStorage) |
| `/search?q=감귤` | 200 | 상품/판매자 탭 · 정렬 칩 · 결과/empty 분기 |
| `/categories` | 200 | 카테고리 PLP · 하단 탭 패딩 |
| `/categories?category=food` | 200 | food 필터 PLP |
| `/product/1` | 200 | 갤러리 · 판매자 카드 · 왜 이 판매자인가요 · 후기/문의 탭 · sticky CTA 72px |
| `/product/12` | 200 | 동일 PDP 구조 |
| `/sellers/celloh` | 200 | 커버/프로필 · 대표/인기/전체 · 이야기/후기/문의 · AppBuyerLayout |
| `/sellers/nonexistent-seller-xyz` | 200 | empty state · 404 아님 |
| `/mypage` | 200 | 비로그인 로그인 유도 (`MypageCelloLogin`) |
| `/join-cart` | 200 | 장바구니 · 판매자별 묶음 · sticky checkout bar · `?pending=` 로직 유지 |
| `/notifications` | 200 | 비로그인 `AuthLoginPrompt` |
| `/mypage/reviews` | 307→login | auth 필요 (middleware) · 로그인 후 탭 UI |
| `/mypage/support` | 307→login | auth 필요 · 문의 + 고객센터 |
| `/mypage/inquiries` | 307→login | **route 없음** — 로그인 후 404 예상 → `/mypage/support` 사용 |

모바일 shell: `max-w-[430px] overflow-x-hidden` · `ds.spacing.bottomNav` / `pb-[120px+safe-area]` 패턴으로 375/390/430px 가로 overflow 방지.

### 수정한 버그

통합 QA 중 **build/lint 실패·명백한 클릭/링크/overflow 버그 없음** — 코드 수정 없음.

### 남은 이슈 (PHASE 5~9 공통 · 커밋 블로커 아님)

| 구분 | 내용 |
|------|------|
| Route | `/mypage/inquiries` 미구현 — `/mypage/support` 대체 |
| Search | 최근 검색어 localStorage 의존 (SSR 미노출) |
| Seller | 판매자 후기 mock · celloh catalog fallback |
| PDP | 상품/판매자 문의 탭 동일 Q&A 데이터 |
| Cart | 다중 선택 시 첫 항목만 `/join` 이동 (기존 동작) |
| Review | 판매자 답변 DB 필드 없음 · 포토후기 이미지 pad |
| Mypage | 팔로잉 판매자 localStorage + catalog fallback |
| Remote | `mobile-ui` push 미완 (credential/remote 이슈) |

### lint / build (통합)

```
npm run lint  → PASS (tsc --noEmit)
npm run build → PASS (Next.js 16.2.6 · 39 static pages)
```

### 커밋 가능 여부

**YES** — lint/build 통과, QA 경로 404 없음( `/mypage/inquiries` 제외 ), 제약(KIBI/DB/OAuth/route/기능) 준수. PHASE 5~9 uncommitted working tree 일괄 커밋 가능.

**커밋/푸시 하지 않음 (사용자 요청).**

---

## Screenshot QA P0/P1 Fix (2026-05-29)

스크린샷 QA 기반 UI/UX·버그 최소 수정.

### 홈

- 섹션 순서: Hero → Quick Menu → 실시간 인기 → 오늘의 특가 → 셀로 추천 → 후기 좋은 → **인기 판매자** → 신규 판매자 → 판매자 스토리 → 전체 상품
- TOP SELLERS → **인기 판매자** 한글화
- 인기/특가/추천/후기 상품 **가로 스크롤 rail** (180px card · gap 16px · 10~12개)
- 전체 상품 **2열 Grid 유지** (gap-x 16px · gap-y 24px)

### ProductCard

- **판매자명 카드에서 제거** — 상품명 → 별점 → 가격만 노출
- 상품명 → 별점 8px · 별점 → 가격 10px
- grid/rail gap 16px · image radius 18px · 가격 line-height 확보

### 카테고리 PLP

- 섹션 순서: 카테고리명 → sub chip → 정렬/필터 → 인기 rail → 특가 rail → 신상 rail → 전체 Grid → 추천 판매자(하단)
- 필터 5개: 무료배송 · 특가 · 평점4.5+ · 신상품 · 판매자추천
- 정렬 5개: 인기순 · 구매순 · 할인순 · 평점순 · 신상품순
- empty state compact · mock pool 최소 12개 grid 보충

### 판매자 페이지

- 구조: 프로필 → 대표상품 → 전체상품 → 판매자소개 → 짧은 이야기(2개) → 후기 → 문의
- 인기상품 섹션 제거 · empty 영역 compact

### Header

- `AppBuyerChrome` sticky `z-[52]` + shadow
- PDP 전용 header: 뒤로가기 · 검색 · 장바구니 badge

### PDP 구매

- 수량 stepper `[-] n [+]` · 장바구니/구매하기 50:50 · height 56px
- 구간별 혜택가 `selectedQuantity` 연동 강조 (#2E5E4E)
- 선물하기 / 여러 주소 보내기 UI stub (준비중 alert)

### Checkout

- 동의 overlay: **fixed sticky footer 제거** → 본문 inline 흐름
- 배송지 · 결제수단 checkout 본문 노출 (동의 전에도 UI 확인 가능)
- 쿠폰/포인트 input `flex-1` · 버튼 104px · height 52px
- 주소지: 받는 사람 · 연락처 · 주소 · [변경]

### 알림

- 편집 모드: 전체선택 · 읽음처리 · 삭제 (local state)

### 남은 이슈

- 선물/다중배송: UI만 · PHASE 분리 예정
- 구간별 혜택가: 선택 수량 vs 실제 tier 가격 계산은 join/checkout 기존 로직 유지
- 알림 삭제: DB API 없음 · local filter
- 네이버페이/휴대폰 결제: 준비중 표시

### lint / build

```
npm run lint  → PASS
npm run build → PASS
```

**커밋/푸시 하지 않음.**

---

## Home Rail Size Fix (2026-05-29)

홈·카테고리·마이셀로 상품 rail **2-up** 규격 통일.

### 카드 폭

```
card width = calc((min(100vw, 430px) - 60px) / 2)
```

- page padding 48px + gap 12px
- 375px → 157.5px · 390px → 165px · 430px → 185px
- 180px 고정값 제거

### rail 스타일

- container `px-6` · track `gap-3` · snap-x mandatory · scrollbar hidden
- 이미지 **1:1 square** · radius 18px · object-cover
- 카드 본문: image→title 10px · title→rating 6px · rating→price 8px
- 할인율 16px / 가격 18px · 판매자명 미노출

### 적용 섹션

- 실시간 인기 / 오늘의 특가 / 셀로 추천 / 후기 좋은 상품
- 마이셀로 최근 본 / 추천 rail

---

## Seller Rail 4-up Fix (2026-05-29)

홈 추천·인기·신규 판매자 rail **4-up 아이콘 카드**.

### item 폭

```
width = calc((min(100vw, 430px) - 72px) / 4)
```

- gap-2 (8px × 3) + padding 48px
- avatar circle 64~72px · #F5F7F6 · 판매자명 12px · ⭐ 평점만
- 280px 대형 카드 제거 (홈 상단)

### 인기 판매자

- 상품 rail 4개 뒤 배치 · subtitle "평점과 판매 이력이 좋은 판매자예요"
- 8~12명 · 한 화면 4명 snap scroll

---

## Product Gap Fix (2026-05-29)

상품 2열 grid / rail gap 정리.

- grid: `repeat(2, minmax(0, 1fr))` · column-gap 16px · row-gap 24px
- rail: gap 12px (부모 gap만 사용 · margin-right hack 제거)
- ProductCard `width: 100%` · `min-width: 0`
- image wrapper `display: block` · `width: 100%`

확인 경로: `/` · `/category/food` · `/sellers/celloh`

---

## MyCelloh Completion Pass (2026-05-29)

마이셀로 마켓컬리·오늘의집형 보강.

1. **프로필 카드** — 이름 · 등급(WELCOME) · 포인트 P · 쿠폰 N장 · radius 24px
2. **주문 진행 5단계** — 결제완료/배송준비/배송중/배송완료/리뷰작성 + 숫자 (#2E5E4E)
3. **빠른 메뉴 2열** — 10항목 (주문·쿠폰·포인트·찜·최근본·스크랩·리뷰·문의·배송지·결제수단)
4. **최근 본 상품 rail** — 홈과 동일 2-up
5. **고객님을 위한 추천 rail** — catalog 인기순 12개
6. **고객센터/설정** — 고객센터 · 공지 · 알림설정 · 로그아웃
7. **비로그인** — "로그인하고 셀로 혜택을 받아보세요" 프로필형 카드
8. 하단 `pb 120px+safe-area`

**커밋/푸시 하지 않음.**

