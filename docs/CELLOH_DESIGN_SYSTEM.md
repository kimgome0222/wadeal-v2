# CELLOH Design System

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Status:** Developer reference — **UI 변경 없음, 문서만**

**Companion:** [CELLOH_DESIGN_SYSTEM_V1.md](./CELLOH_DESIGN_SYSTEM_V1.md) (토큰·spacing·typography 상세)  
**Code:** `lib/design-system.ts`, `app/globals.css`, `tailwind.config.ts`

---

## 1. Brand philosophy

celloh는 **판매자 중심 스토리 커머스**입니다. 상품만 보이는 마켓이 아니라, **누가 만들었는지**가 구매 결정의 출발점입니다.

| Principle | Copy direction |
|-----------|----------------|
| 판매자를 알면, 상품이 보입니다. | PDP·홈에서 seller card/story 노출 |
| 누가 만들었는지 알고 사세요. | 판매자 프로필·인증·이야기 링크 |
| 좋은 상품은 좋은 판매자에게서 시작됩니다. | 큐레이션·랭킹·신뢰 배지와 연결 |

**Voice:** 담백·신뢰·로컬 감성. 과장 광고·게임화·네온 톤 지양.  
**Copy guide:** [CELLOH_PRODUCT_COPY_GUIDE.md](./CELLOH_PRODUCT_COPY_GUIDE.md), [CELLOH_UX_WRITING_GUIDE.md](./CELLOH_UX_WRITING_GUIDE.md)

---

## 2. Design references

| Source | Weight | What we borrow |
|--------|--------|----------------|
| **오늘의집** | 50% | 여백·카드 radius·정돈된 홈·판매자/스토리 톤 |
| **쿠팡** | 35% | 상품카드 정보 밀도·가격 block·rail peek |
| **당근** | 15% | 친근한 카피·로컬 신뢰·담백한 empty state |
| **B마트** | UX ref | 장바구니 목표 배너·계속 담기·쿠폰/무료배송 progress |

**Not copying:** 쿠팡식 정보 과밀, 중국식 복잡 UI, 핑크/네온 이커머스, 과도한 그라데이션·게임화.

---

## 3. Color system

| Role | Hex | Tailwind / token |
|------|-----|------------------|
| Primary | `#2E5E4E` | `wadeal-red`, `ds.brand.primary` |
| Accent | `#E28A3B` | `wadeal-coral`, 할인율·urgency |
| Background | `#FFFFFF` | `bg-white` |
| Border | `#E8ECEA` | `wadeal-line` |
| Soft background | `#F5F7F6` | `wadeal-surface` |
| Text primary | `#111111` | `wadeal-ink` |
| Text secondary | `#666666` | `wadeal-muted` |
| Text muted | `#999999` | `wadeal-tabInactive`, line-through 원가 |

### Forbidden moods

- 핑크/네온/클럽형 이커머스
- 과도한 게임화 (레벨·뽑기·폭죽)
- 복잡한 중국식 UI (과다 배지·깜빡임)
- 과한 그라데이션 hero (단색·soft surface 우선)

소셜 로그인 고유색(카카오 `#FEE500` 등)은 예외.

---

## 4. Product card rules

### Information order (top → bottom)

1. **Image** (+ optional badge overlay)
2. **Product name** — 2 lines max
3. **Rating · review count** — `★ 4.8 · 리뷰 128`
4. **Discount % · sale price**
5. **Original price** (line-through)
6. **Sold count** — `판매 2,314`
7. **+ / stepper** — image bottom-right (outside text flow)

### Typography & color

| Element | Rule |
|---------|------|
| 상품명 | `line-clamp-2`, 15px grid / 14px rail, `#111`, semibold |
| 리뷰 | 12px `#666`, `★ {score} · 리뷰 {count}` |
| 할인율 | `#E28A3B`, bold, 16–18px |
| 판매가 | `#111`, bold, 17–18px |
| 원가 | `#999`, line-through, 13px |
| 판매수 | 12px `#666` |

### Count formatting (`lib/product/card-badge-meta.ts`)

| Type | Rule | Examples |
|------|------|----------|
| 리뷰 | 0→`1+`, 1–9→`N+`, 10+→comma, ≥10k→`9,999+` | `리뷰 1+`, `리뷰 2,314`, `리뷰 9,999+` |
| 판매 | 0→`판매 1+`, &lt;10→`판매 N+`, &lt;10k→comma, ≥10k→`9,999+` | `판매 1+`, `판매 2,314`, `판매 9,999+` |

### + / stepper behavior

| State | UI |
|-------|-----|
| qty = 0 | Green `+` circle, **image bottom-right** (`CartQuantityControl`) |
| qty ≥ 1 | Pill `[- 1 +]`, **expands left** from anchor (right-aligned) |
| Click + | Optimistic local cart + optional bottom sheet on first add |
| Sold out | Disabled +, no stepper |

**Components:** `DealCard` (grid), `HomeRecommendedDealCard` (rail), `ProductCardImage`, `ProductCardContent`, `CartQuantityControl`

**Fragile:** stepper must use `pointer-events-auto` on anchor; rail card width from `.commerce-rail-item` — do not hardcode px width in TSX.

---

## 5. Home section rules

**Source of truth:** `components/home-catalog.tsx`, `lib/copy/home-section-copy.ts`

### Section order (current)

| # | Section | Component |
|---|---------|-----------|
| 1 | Hero | `HomeHeroCarousel` |
| 2 | Quick Menu | `HomeQuickMenu` |
| 3 | 오늘의특가 | `HomeCommerceRailSection` |
| 4 | 추천상품 | + `RecommendationBasisHint` |
| 5 | 마감세일 | rail |
| 6 | 인기 판매자 | `HomeSellerShowcaseSection` |
| 7 | 실시간 인기상품 | rail |
| 8 | 주말특가 | rail |
| 9 | 카테고리 랭킹 | `HomeRankingSection` |
| 10 | 오늘의 최저가 상품 | rail |
| 11 | 셀로단독특가 | `HomeOnlyCellohSection` |
| 12 | 쿠폰세일 | rail + coupon price |
| 13 | 많이담은상품 | rail (`frequent` key) |
| 14 | AI기반 계절상품 | rail + mock disclaimer |
| 15 | 신규상품 | rail |
| 16 | 신규 입점 판매자 | `HomeSellerShowcaseSection` |
| 17 | 판매자 이야기 | `HomeSellerStoriesSection` |

**Removed:** 홈 **전체상품 미리보기** grid — 카테고리/검색/컬렉션으로 분리.

### Layout rules

| Pattern | Rule |
|---------|------|
| Product rail | **2.5 cards peek** — `.commerce-rail-item` in `globals.css` |
| Seller sections | Horizontal scroll, fixed card width (`SellerCard` 288px / compact 252px) |
| Category ranking | Vertical columns `.ranking-column`, horizontal snap between categories |
| Quick Menu | **2 rows**, horizontal scroll, 72px columns, `grid-flow-col grid-rows-2` |
| Section spacing | `pt-10` between rails, hero `pt-4`, quick menu `mt-5 mb-5` |
| Section header | `SectionHeader` — title 20px bold, subtitle 13px muted, optional 더보기 |

**Do not:** re-add full catalog grid on home; break `--celloh-app-width` rail calc.

---

## 6. Buttons, badges, chips

### Buttons

| Variant | Style | Min height |
|---------|-------|------------|
| Primary | `#2E5E4E` bg, white text, `rounded-2xl` | 44px+ (`h-11`~`h-14`) |
| Secondary | white bg, `#2E5E4E` or `#E8ECEA` border | 44px+ |
| Disabled | `#E8ECEA` bg / `#999` text, no pointer | — |
| Purchase / cart CTA | Primary, **56px (`h-14`)** recommended | PDP bar, checkout |

**Tokens:** `ds.btn.primary`, `ui.btnPrimary`, `ui.btnOutline`

### Promo badges (product overlay)

| Badge | Usage |
|-------|-------|
| 셀로단독특가 | `ONLY CELLOH`, only-celloh section |
| 쿠폰세일 | coupon rail + `ProductCardPromoBadgeView` |
| 마감세일 | ending-sale, urgency copy |
| 추천상품 | recommended / mock badge |
| 인증상품 | seller verified chip (판매자) |
| 리뷰많음 | `getMockPopularBadge` |
| 재구매많음 | repurchase collection (copy exists; home uses `frequent`) |

**Overlay:** `ProductCardBadgeOverlay` — top-left on image, do not cover + button.

### Chips

| Type | Component | Active state |
|------|-----------|--------------|
| Category | `CategoryChip` | border `#2E5E4E`, text primary green |
| Filter (PLP) | `DealCatalogToolbar` pills | filled primary when active |
| 혜택가 | tier / coupon chips on PDP | accent or soft green bg |
| Seller keyword | `SellerTrustBadges` | small rounded pills |

---

## 7. Component reference

### ProductCard (composite)

| | |
|---|---|
| **Purpose** | Grid + rail product display |
| **Files** | `deal-card.tsx`, `home-recommended-deal-card.tsx`, `product-card-*.tsx` |
| **Display** | See §4 order; link wraps image+body, stepper **sibling** outside link |
| **Click** | Card body → PDP; + → cart only (`stopPropagation`) |
| **Fragile** | Rail width CSS; stepper z-index; sold-out state |

### HomeRail (`HomeCommerceRailTrack`)

| | |
|---|---|
| **Purpose** | 2.5-up horizontal product rails |
| **Files** | `home-commerce-rail-track.tsx`, `home-commerce-rail-section.tsx` |
| **Display** | `gap-4`, `px-6`, snap-x, `overflow-y-visible` |
| **Click** | Scroll horizontal; card navigates to PDP |
| **Fragile** | Changing `--celloh-app-width` without updating CSS calc |

### QuickMenu (`HomeQuickMenu`)

| | |
|---|---|
| **Purpose** | Home shortcut grid (collections, category, invite…) |
| **Files** | `home-quick-menu.tsx`, `lib/home/quick-menu-items.ts` |
| **Display** | 2-row × N cols, 72px cell, glyph in `#F5F7F6` circle |
| **Click** | Each item → `href` route |
| **Fragile** | Dead links if `quick-menu-items` out of sync with routes |

### CategoryChip

| | |
|---|---|
| **Purpose** | Subcategory / home category navigation |
| **Files** | `category-chip.tsx` |
| **Display** | 68px box, 16px radius, icon + 12px label |
| **Click** | Link or `onClick`; `aria-current` when active |
| **Fragile** | Grid vs rail layout prop |

### DealCatalogToolbar

| | |
|---|---|
| **Purpose** | PLP sort, quick filters, count |
| **Files** | `deal-catalog-toolbar.tsx`, `plp-filter-sheet.tsx` |
| **Display** | Sticky filter chip row; sort dropdown |
| **Click** | Updates URL search params; scroll top on filter |
| **Fragile** | Popover position at 430px; chip overflow clip |

### CartQuantityControl

| | |
|---|---|
| **Purpose** | Universal + / stepper on cards |
| **Files** | `cart-quantity-control.tsx` |
| **Display** | `absolute bottom-2 right-2 z-20`; sizes `default`/`compact`/`rail` |
| **Click** | + adds; − removes; login_required silent fail |
| **Fragile** | Guest vs logged-in persistence; optimistic rollback |

### ProductDetailPurchaseBar

| | |
|---|---|
| **Purpose** | Fixed bottom buy bar on PDP |
| **Files** | `product-detail-purchase-bar.tsx` |
| **Display** | Above bottom nav + safe-area; quantity stepper + CTA |
| **Click** | 장바구니 / 바로구매 → checkout or cart sheet |
| **Fragile** | `pb-[max(...,120px)]` on main; tier pricing display |

### SellerCard

| | |
|---|---|
| **Purpose** | Seller discovery on home / search |
| **Files** | `seller-card.tsx` |
| **Display** | Horizontal scroll item; avatar, name, badges, stats |
| **Click** | Profile link when public profile enabled |
| **Fragile** | Fixed widths — don't shrink in flex parent |

### PolicyPage (`PolicyPageContent`)

| | |
|---|---|
| **Purpose** | Render legal/policy documents |
| **Files** | `policy-page-content.tsx`, `/policies/[slug]` |
| **Display** | Legal notice banner + section cards |
| **Click** | Internal links only |
| **Fragile** | `legalNotice` copy — policy pages only, not checkout |

### EmptyState

| | |
|---|---|
| **Purpose** | No data / no orders / no search results |
| **Files** | `empty-state.tsx`, `ds.empty.*` |
| **Display** | Icon + 20px title + 14px description + optional CTA |
| **Click** | Optional `actionHref` |
| **Fragile** | Variants: shopping, orders, saved, search |

### BottomSheet (cart family)

| | |
|---|---|
| **Purpose** | Cart preview, add confirmation, celloh-pay password |
| **Files** | `cart-preview-bottom-sheet.tsx`, `cart-added-bottom-sheet.tsx`, `celloh-pay-password-sheet.tsx` |
| **Display** | Slide up, rounded top, backdrop |
| **Click** | Dismiss on backdrop; CTA inside sheet |
| **Fragile** | z-index vs bottom nav (60); safe-area padding |

---

## 8. App shell (quick ref)

| Element | Spec |
|---------|------|
| Max width | 430px centered |
| Page gutter | 24px (`px-6`) |
| Header | 56px sticky |
| Category bar | 44px sticky |
| Bottom tab | 64px + safe-area, z-60 |

See [CELLOH_DESIGN_SYSTEM_V1.md](./CELLOH_DESIGN_SYSTEM_V1.md) for spacing, radius, typography tables.

---

## 9. Related docs

| Doc | Topic |
|-----|-------|
| [CELLOH_MOBILE_UI_AUDIT.md](./CELLOH_MOBILE_UI_AUDIT.md) | Layout QA findings |
| [CELLOH_PROMOTION_DISPLAY_RULES.md](./CELLOH_PROMOTION_DISPLAY_RULES.md) | Badge / 최저가 cautions |
| [CELLOH_PRODUCT_COPY_GUIDE.md](./CELLOH_PRODUCT_COPY_GUIDE.md) | Card & listing copy |
| [CELLOH_RESPONSIVE_QA_REPORT.md](./CELLOH_RESPONSIVE_QA_REPORT.md) | Breakpoints 375/390/430 |

---

## 10. Change policy

- **Prefer tokens** (`ds`, `ui`, CSS vars) over one-off hex in new code.
- **Do not reorder home sections** without product sign-off — update this doc + `home-catalog.tsx` together.
- **Product card field order** is contractual for conversion — changing order requires design review.
- Docs-only updates: queue **back** per [CELLOH_PRIORITY_BACKLOG.md](./CELLOH_PRIORITY_BACKLOG.md).
