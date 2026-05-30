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

