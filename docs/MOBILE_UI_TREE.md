# celloh 모바일 UI 구조 점검 & 개발 참고 트리

> **브랜치:** `mobile-ui`  
> **앱 셸:** 430px · 16px gutter · Primary `#2E5E4E`  
> **토큰 소스:** `lib/design-system.ts` (`ds`) · `lib/ui.ts` (`ui`)  
> **Cursor용:** 아래 트리 = 실제 파일명. 체크리스트 = 단계별 실행 명령.

---

## 빠른 시작 (Cursor / 로컬)

```bash
# 1. dev 서버 (430px 모바일 뷰포트 권장)
npm run dev

# 2. 빌드 검증
npm run build

# 3. 핵심 라우트 HTTP 스모크 (포트는 dev 출력 기준)
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/search
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/product/1
curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:3000/sellers/celloh"
```

**브라우저:** DevTools → Responsive → **430 × 932** (또는 iPhone 14 Pro Max)

---

## 1️⃣ 홈 화면 컴포넌트 트리

**라우트:** `app/page.tsx`

```
HomePage (app/page.tsx)
├─ HomeCatalog                    components/home-catalog.tsx
│  ├─ Header                      components/header.tsx
│  │  ├─ SearchBar                → SearchPanel (components/search/search-panel.tsx)
│  │  ├─ NotificationButton     → BellIcon → /notifications
│  │  └─ CartButton               → CartIcon → /join-cart (badge: joinCartCount)
│  ├─ HomeCategoryIcons           components/home-category-icons.tsx
│  ├─ CellohBrandBanner           components/celloh-brand-banner.tsx   ← HeroBanner / MainCTA
│  ├─ HomeTrustStrip              components/home-trust-strip.tsx
│  ├─ ProductRails
│  │  ├─ RecommendedProductsRail  HomeProductRailSection (recommendedSellerDeals)
│  │  ├─ PopularProductsRail      HomeProductRailSection (popularSellerDeals)
│  │  ├─ SpecialOfferProductsRail HomeProductRailSection (specialPriceDeals)
│  │  ├─ AllProductsRail          DealSection (sections — "전체 상품" 그리드)
│  │  └─ NewSellerProductsRail    HomeProductRailSection (newSellerDeals, variant=auxiliary)
│  │     └─ HomeRecommendedDealCard + ProductCarousel
│  │        └─ globals.css .celloh-product-carousel-item (190px)
│  └─ DealsEmptyState             components/deals-empty-state.tsx (레일 전부 비었을 때)
├─ SiteFooter                     components/site-footer.tsx
└─ AppBottomNavigation            components/app-bottom-navigation.tsx
```

**레일 데이터 소스:** `lib/sellers/home-sellers.ts` · `HOME_SECTION_COPY` (`lib/sellers/trust-copy.ts`)

**실제 렌더 순서 (코드 기준):**

```txt
카테고리 → 배너 → 신뢰 스트립
→ 추천 → 인기 → 특가 → 전체(그리드) → 신규
```

> ⚠️ 홈에는 **RecentlyViewedProducts 없음**. 최근 본 상품은 상품 상세·마이페이지(`/mypage/recent`)에만 존재.

---

## 2️⃣ 상품 상세 페이지

**라우트:** `app/product/[id]/page.tsx`

```
ProductDetailPage
├─ SubHeader                       components/sub-header.tsx          ← ProductDetailHeader
├─ ProductViewTracker              components/product-view-tracker.tsx
├─ ProductImageGallery             components/product-image-gallery.tsx
├─ ProductSummaryPanel             components/product-summary-panel.tsx
│  ├─ ProductTitle / Meta / Price  (패널 내부)
│  └─ SaveDealButton               components/save-deal-button.tsx
├─ ProductSellerPanel              components/product-seller-panel.tsx
│  ├─ SellerTrustStats             ds.seller.metrics
│  ├─ FollowSellerButton           components/follow-seller-button.tsx
│  └─ SellerLinkButtons            → /sellers/[id]
├─ ProductDetailVisualSection      components/product-detail-visual-section.tsx
├─ SellerStorySection              components/seller-story-section.tsx  (기본 접힘)
├─ ProductDetailSectionNav         components/product-detail-section-nav.tsx  ← Tabs 앵커
├─ ProductDetailHighlights         components/product-detail-highlights.tsx
├─ ProductShippingInfoBlock        components/product-shipping-info.tsx
├─ ProductDetailSellerReviewsGroup components/product-detail-seller-reviews-group.tsx
│  ├─ SellerSatisfactionSection    components/seller-satisfaction-section.tsx
│  └─ SellerReviewsListSection     components/seller-reviews-list-section.tsx
├─ ProductReviewsSection           components/product-reviews-section.tsx
├─ ProductDetailBottomSections     components/product-detail-bottom-sections.tsx
│  ├─ ProductDetailSellerReviewsGroup (상품 리뷰 0건일 때 위로 올림 — elevateSellerReviews)
│  ├─ ProductQASection             components/product-qa-section.tsx
│  ├─ SimilarProductsSection       components/similar-products-section.tsx
│  └─ ProductRecentlyViewedSection components/product-recently-viewed-section.tsx
└─ ProductDetailCTA                components/product-detail-cta.tsx  ← Sticky Buy Bar
```

**카탈로그 ID 검증:** `lib/deals/catalog-validation.ts` (`filterDealsInCatalog`, `isDealInCatalog`)

---

## 3️⃣ 판매자 페이지

**라우트:** `app/sellers/[id]/page.tsx`

```
SellerProfilePage
├─ PageShell                       components/page-shell.tsx
├─ SubHeader
├─ SellerProfilePageContent        components/seller-profile-page-content.tsx
│  ├─ SellerProfileBanner          components/seller-profile-banner.tsx
│  │  ├─ SellerProfileAvatar / Name / VerifiedBadge / Intro
│  ├─ SellerProfileTrustCard       components/seller-profile-trust-card.tsx
│  │  └─ Rating · ReviewCount · TotalSales · RepurchaseRate · ResponseRate
│  ├─ FollowSellerButton
│  ├─ SellerProfileSectionNav       components/seller-profile-section-nav.tsx
│  ├─ SellerFeaturedProductsRail   components/seller-featured-products-rail.tsx
│  ├─ SellerProfileAllProducts     components/seller-profile-all-products.tsx
│  ├─ SellerProfileReviewsSection  components/seller-profile-reviews-section.tsx
│  ├─ SellerStorySection
│  └─ SellerProfileStickyCta       components/seller-profile-sticky-cta.tsx
└─ SellerProfileUnavailable        components/seller-profile-unavailable.tsx  (404 대체)
```

**slug / id 해석:**

| 파일 | 역할 |
|------|------|
| `lib/sellers/seller-id.ts` | `buildSellerId`, `normalizeSellerRouteId`, legacy alias (`celloh-셀러` → `celloh`) |
| `lib/sellers/home-sellers.ts` | `resolveSellerProfileByRouteId`, `getDealsForSellerProfile` |
| `lib/sellers/routes.ts` | `getSellerPublicProfileHref` (encodeURIComponent) |

**테스트 URL:**

```txt
/sellers/celloh
/sellers/celloh-셀러   ← legacy alias
```

---

## 4️⃣ 검색 페이지

**라우트:** `app/search/page.tsx`

```
SearchPage
├─ SearchHeader                    components/search-header.tsx
├─ SearchCategoryNav               components/search-category-nav.tsx
├─ SearchSubNav                    components/search-sub-nav.tsx (카테고리+쿼리)
├─ DealCatalogSortBar              components/deal-catalog-sort-bar.tsx (쿼리 있을 때)
├─ [query 있음]
│  ├─ SearchResultsSummary         components/search/search-results-summary.tsx
│  ├─ SearchSellerResults          components/search-seller-results.tsx
│  ├─ DealProductGrid              components/deal-product-grid.tsx
│  ├─ SearchEmptyResults           components/search/search-empty-results.tsx
│  └─ DealCatalogLoadMore          components/deal-catalog-toolbar.tsx
└─ [query 없음 — idle]
   └─ SearchIdleHub                components/search/search-idle-hub.tsx
```

**카탈로그 필터:** `filterDealsInCatalog(result.deals, catalog)` — 존재하지 않는 deal id 제거

---

## 5️⃣ Tailwind / 디자인 토큰 체크

> **규칙:** 새 UI는 raw class 반복 대신 `ds` / `ui` 토큰 우선.

| 영역 | 토큰 / 클래스 | 정의 위치 |
|------|---------------|-----------|
| Container | `ds.page.wrap` → `max-w-[430px] mx-auto min-h-screen bg-white` | `lib/design-system.ts` |
| Gutter | `ds.page.gutter` / `ui.pageBody` → `px-4` | ↑ |
| Card | `ds.card.padded` → `rounded-[18px] border border-[#DDE8E2] bg-white p-4 shadow-sm` | ↑ |
| 제목 h2 | `ds.type.h2` → `text-[18px] font-semibold text-[#1F2A24]` | ↑ |
| 본문 | `ds.type.bodySm` / `caption` → `text-[13px] text-slate-500` | ↑ |
| 가격 (상세) | `ds.type.priceLg` → `text-[22px] font-semibold` | ↑ |
| 보조 | `ds.type.meta` → `text-[12px] text-slate-500` | ↑ |
| Primary 버튼 | `ui.btnPrimary` / `ds.btn.primary` → `bg-wadeal-red h-[50px] rounded-[14px]` | `lib/ui.ts` |
| Rail track | `ds.carousel.track` → `.celloh-product-carousel-track` | `app/globals.css` |
| Rail item | **190px** fixed width | `.celloh-product-carousel-item` |
| Sticky Buy Bar | `ui.stickyFooter` | `lib/ui.ts` |
| Bottom Nav | `ds.chrome.bottomNav` | `lib/design-system.ts` |

**색상 alias (Tailwind config):** `wadeal-red` = `#2E5E4E` · `wadeal-coral` = `#E28A3B`

---

## 6️⃣ 단계별 점검 체크리스트

### STEP A — 홈 레일

| # | 확인 | ☐ | 파일 / 방법 |
|---|------|---|-------------|
| A1 | 추천 → 인기 → 특가 → 전체 → 신규 순서 | ☐ | `components/home-catalog.tsx` L95–148 |
| A2 | 카드 width **190px**, title/price clipping 없음 | ☐ | DevTools + `app/globals.css` L223 |
| A3 | 빈 레일 → `EmptyState` 또는 섹션 숨김 | ☐ | `HomeProductRailSection` |
| A4 | 헤더 검색 → `/search?q=` 이동 | ☐ | `home-catalog.tsx` handleSearchSubmit |
| A5 | 장바구니·알림 badge | ☐ | `components/header.tsx` |

```bash
# 레일 순서·카드 클래스 grep
rg "HomeProductRailSection|DealSection" components/home-catalog.tsx
rg "celloh-product-carousel-item" app/globals.css
```

---

### STEP B — 상품 상세

| # | 확인 | ☐ | 파일 / 방법 |
|---|------|---|-------------|
| B1 | 이미지 갤러리 스와이프·비율 | ☐ | `product-image-gallery.tsx` |
| B2 | Sticky Buy Bar **48–52px**, safe-area, 430px 중앙 | ☐ | `product-detail-cta.tsx`, `ui.stickyFooter` |
| B3 | 판매자 패널 → `/sellers/...` 링크 | ☐ | `product-seller-panel.tsx` |
| B4 | SellerStory **기본 접힘** | ☐ | `seller-story-section.tsx` |
| B5 | 상품 리뷰 0건 → 판매자 리뷰 상단 노출 | ☐ | `app/product/[id]/page.tsx` elevateSellerReviews |
| B6 | Q&A compact empty | ☐ | `product-qa-section.tsx` compactEmpty |
| B7 | 비슷한 상품 / 같은 판매자 **max 4** + 더보기 | ☐ | `similar-products-section.tsx` |

```bash
rg "stickyFooter|ProductDetailCTA" components/product-detail-cta.tsx lib/ui.ts
rg "elevateSellerReviews|INITIAL_LIST_VISIBLE|initialVisible" app/product components/
```

---

### STEP C — 판매자 페이지

| # | 확인 | ☐ | 파일 / 방법 |
|---|------|---|-------------|
| C1 | `/sellers/celloh` 200 | ☐ | curl 또는 브라우저 |
| C2 | legacy slug `celloh-셀러` 리다이렉트/해석 | ☐ | `lib/sellers/seller-id.ts` |
| C3 | featured ≥3, 전체 상품 그리드 | ☐ | `seller-profile-page-content.tsx` |
| C4 | trust stats 4칸 그리드 | ☐ | `seller-profile-trust-card.tsx` |
| C5 | 프로필 없음 → `SellerProfileUnavailable` (not 404) | ☐ | `app/sellers/[id]/page.tsx` |

```bash
curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:3000/sellers/celloh-셀러"
rg "normalizeSellerRouteId|resolveSellerProfileByRouteId" lib/sellers/
```

---

### STEP D — 검색

| # | 확인 | ☐ | 파일 / 방법 |
|---|------|---|-------------|
| D1 | `/search` idle — 인기어·추천·판매자 | ☐ | `search-idle-hub.tsx` |
| D2 | `/search?q=xxx` 결과 그리드 | ☐ | `deal-product-grid.tsx` |
| D3 | 0건 → `SearchEmptyResults` + 추천 | ☐ | `search-empty-results.tsx` |
| D4 | invalid deal id 결과에서 제외 | ☐ | `filterDealsInCatalog` |

```bash
curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:3000/search?q=__no_result__"
rg "filterDealsInCatalog|SearchEmptyResults" app/search/
```

---

### STEP E — 최근 본 / 추천 상품 ID

| # | 확인 | ☐ | 파일 / 방법 |
|---|------|---|-------------|
| E1 | localStorage slug → catalog 존재 여부 필터 | ☐ | `product-recently-viewed-section.tsx` |
| E2 | similar / search 동일 검증 | ☐ | `catalog-validation.ts` |
| E3 | 빈 배열 → 섹션 미렌더 또는 empty | ☐ | 각 section 컴포넌트 early return |

```bash
rg "filterDealsInCatalog|isDealInCatalog|buildCatalogIndex" lib/ components/
```

---

### STEP F — Tailwind 일관성

| # | 확인 | ☐ | 방법 |
|---|------|---|------|
| F1 | 페이지 래퍼 `ui.pageWrap` / `PageShell` | ☐ | 주요 page.tsx |
| F2 | 섹션 제목 `ds.type.h2` | ☐ | grep `text-\[18px\]` 남발 여부 |
| F3 | 카드 `ds.card.padded` | ☐ | 신규 컴포넌트 |
| F4 | 버튼 `ui.btnPrimary` | ☐ | CTA·폼 |
| F5 | carousel 190px (185/200 혼용 없음) | ☐ | `globals.css` only |

```bash
rg "max-w-\[430px\]|max-w-\[393px\]" app/ components/
rg "190px|185px|200px" app/globals.css components/
```

---

## 7️⃣ Cursor 실행 프롬프트 (복붙용)

### 프롬프트 1 — 홈 레일 점검

```txt
docs/MOBILE_UI_TREE.md STEP A 기준으로 홈 레일 점검해줘.
components/home-catalog.tsx, home-product-rail-section.tsx, app/globals.css carousel 190px 확인.
카드 clipping 있으면 최소 diff로 수정. npm run build까지.
```

### 프롬프트 2 — 상품 상세 sticky bar

```txt
docs/MOBILE_UI_TREE.md STEP B 기준.
ProductDetailCTA sticky bar 높이·safe-area·430px shell 확인.
product-detail-cta.tsx, lib/ui.ts ui.stickyFooter만 수정.
```

### 프롬프트 3 — 판매자 slug

```txt
docs/MOBILE_UI_TREE.md STEP C 기준.
/sellers/celloh, /sellers/celloh-셀러 HTTP 200 및 상품 노출 확인.
lib/sellers/seller-id.ts, home-sellers.ts만 필요 시 수정.
```

### 프롬프트 4 — 검색 empty state

```txt
docs/MOBILE_UI_TREE.md STEP D 기준.
/search idle hub, /search?q=__no_result__ empty state 확인.
filterDealsInCatalog 적용 누락 있으면 수정.
```

### 프롬프트 5 — 토큰 drift

```txt
docs/MOBILE_UI_TREE.md STEP F 기준.
mobile-ui에서 ds/ui 토큰 안 쓰고 raw Tailwind 중복된 곳 찾아서
lib/design-system.ts 토큰으로 통일. scope: components/home-*, product-*, seller-profile-*.
```

---

## 8️⃣ 관련 파일 인덱스

| 영역 | 핵심 파일 |
|------|-----------|
| 디자인 토큰 | `lib/design-system.ts`, `lib/ui.ts` |
| 홈 | `app/page.tsx`, `components/home-catalog.tsx` |
| 상품 상세 | `app/product/[id]/page.tsx` |
| 판매자 | `app/sellers/[id]/page.tsx`, `lib/sellers/*` |
| 검색 | `app/search/page.tsx`, `components/search/*` |
| 카탈로그 검증 | `lib/deals/catalog-validation.ts` |
| 캐러셀 CSS | `app/globals.css` (`.celloh-product-carousel-*`) |
| 오픈 QA | `docs/GO_LIVE_CHECKLIST.md`, `docs/PRE_DEPLOY_CHECKLIST.md` |

---

## 9️⃣ 알려진 차이 (개념 트리 vs 코드)

| 개념 | 실제 |
|------|------|
| `HeroBanner` + `MainCTA` | `CellohBrandBanner` 단일 컴포넌트 |
| `ProductDetailTabs` | `ProductDetailSectionNav` (앵커 스크롤, 탭 UI 아님) |
| `RecentlyViewedProducts` (홈) | **미구현** — 상품 상세·마이페이지만 |
| `wishlist` | DB/API: `saved_deals` · UI: `/saved` |
| `profiles` | public `users` + Supabase Auth |
| Primary 버튼 h-12 | `ds.btn.primary` = **h-[50px]** (mobile-ui 기준) |

---

*마지막 동기화: mobile-ui 브랜치 · celloh 430px shell*
