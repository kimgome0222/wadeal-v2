# CELLOH Design System V1

PHASE 1 — mobile-ui 브랜치 공통 토큰. 화면 구조는 유지하고 여백·타이포·색상·크롬만 통일.

---

## Colors

| Token | Value | Tailwind |
|-------|-------|----------|
| Primary | `#2E5E4E` | `wadeal-red`, `bg-[#2E5E4E]` |
| Accent | `#E28A3B` | `wadeal-coral` |
| Background | `#FFFFFF` | `bg-white` |
| Soft Background | `#F5F7F6` | `wadeal-surface`, `#F5F7F6` |
| Border | `#E8ECEA` | `wadeal-line` |
| Text | `#111111` | `wadeal-ink` |
| Muted Text | `#666666` | `wadeal-muted` |
| Tab Inactive | `#999999` | `wadeal-tabInactive` |

소셜 로그인 고유 색(카카오 `#FEE500` 등)은 유지.

---

## Spacing

| Token | Value | Class / token |
|-------|-------|---------------|
| Page horizontal padding | 24px | `px-6`, `ds.page.gutter` |
| Section gap | 40px | `space-y-10`, `ds.page.appSectionGap` |
| Large section gap | 56px | `space-y-14`, `ds.page.appSectionGapLg` |
| Title → content | 16px | `mb-4`, `ds.section.head` |
| Card internal padding | 12px | `p-3`, `ds.card.padded` |
| Product grid column gap | 16px | `gap-x-4` |
| Product grid row gap | 24px | `gap-y-6` |
| Chrome 아래 본문 top | 24px | `pt-6`, `ds.page.appBody` |
| Bottom tab safe padding | ≥120px | `ds.spacing.bottomNav` |

---

## Typography

| Role | Size | Weight | Token |
|------|------|--------|-------|
| Hero title | 28px | 700 | `ds.type.hero` |
| Page title | 24px | 700 | `ds.type.h1` |
| Section title | 20px | 700 | `ds.type.h2` |
| Card title / price | 18px | 600 | `ds.type.h3`, `ds.type.price` |
| Product name | 15px | 600 | `ds.type.productTitle` |
| Body / helper | 14px | 400 | `ds.type.body` |
| Seller / meta | 12px | 400~500 | `ds.type.meta` |
| Bottom tab label | 11px | 500~600 | `ds.type.tabLabel` |
| Button | 16px | 600 | `ds.btn.primary` |
| Empty title | 20px | 700 | `ds.type.emptyTitle` |

---

## Radius

| Element | Value | Token |
|---------|-------|-------|
| Hero / banner | 24px | `ds.radius.hero` |
| Card | 20px | `ds.radius.card` |
| Product image | 18px | `ds.radius.productImage` |
| Button | 16px | `ds.radius.button` (`rounded-2xl`) |
| Chip | 12px | `ds.radius.chip` (`rounded-xl`) |

---

## Buttons

**Primary** (`ds.btn.primary`, `ui.btnPrimary`)
- height 56px (`h-14`)
- radius 16px
- background `#2E5E4E`, text white
- font 16px / 600

**Secondary** (`ds.btn.outline`, `ui.btnOutline`)
- height 52px
- white background, border `#E8ECEA`
- text `#111111`

---

## Header

- height 56px (`ds.chrome.header`)
- sticky, white, border-bottom `#E8ECEA`
- left: celloh logo · right: 찜·알림 (24px icons)
- z-index 50 (chrome wrapper)

파일: `components/app-sticky-header.tsx`, `components/app-buyer-chrome.tsx`

---

## Category Bar

- height 44px (`ds.chrome.categoryBar`)
- sticky, white
- active `#2E5E4E`, inactive `#666666`
- font 14px / 600
- horizontal padding 24px

파일: `components/app-category-bar.tsx`

---

## Bottom Tab

- content height 64px + safe-area
- white opaque, top border `#E8ECEA`
- active `#2E5E4E`, inactive `#999999`
- icon 24px, label 11px
- z-index 60

파일: `components/bottom-navigation.tsx`, `components/app-buyer-layout.tsx`

---

## Empty / Login Required UI

- title 20px / 700
- description 14px / `#666666`
- icon ~56px (`h-14 w-14`)
- CTA primary 56px
- 중앙 정렬, 박스/테두리 없음

파일: `components/empty-state.tsx`, `components/auth-login-prompt.tsx`

---

## 적용한 파일

| 파일 | 변경 요약 |
|------|-----------|
| `lib/design-system.ts` | V1 토큰 전면 정리 |
| `lib/ui.ts` | 버튼·여백·입력 alias |
| `tailwind.config.ts` | wadeal 색상 V1 매핑 |
| `app/globals.css` | CSS 변수·grid·card·button |
| `components/app-sticky-header.tsx` | 56px header |
| `components/app-buyer-chrome.tsx` | z-50, px-6, border |
| `components/app-category-bar.tsx` | 44px, 14px/600 |
| `components/bottom-navigation.tsx` | 64px tab, 11px label |
| `components/empty-state.tsx` | Empty V1 |
| `components/auth-login-prompt.tsx` | Login required V1 |
| `components/ds/section-header.tsx` | title→subtitle 16px |

---

## 남은 이슈

- 일부 레거시 컴포넌트에 `#DDE8E2`, `#1F2A24`, `#F5F8F4` 하드코딩 잔존 (tailwind alias로 대부분 자동 반영, 개별 파일은 PHASE 2에서 점진 교체)
- 판매자센터·관리자 UI는 buyer 앱 V1 범위 외
- `CellohBrandBanner` 등 구형 단일 배너 컴포넌트는 Hero Carousel로 대체됨
- 정책 페이지(`PolicyPageContent`) 카드형 레이아웃 — 정보 페이지 PHASE에서 `info-page-layout` 확장 예정
- Product detail sticky bar / seller admin chrome 미적용

---

## PHASE 2 — ProductCard (2026-05-30)

### ProductCard 최종 구조

```
[상품사진 4:5 · radius 18px]

판매자명          12px / 500 / #666 / 1줄
상품명            15px / 600 / #111 / 2줄
⭐ 4.9 (234)      13px / #666
20% 29,900원     할인율 accent + 가격 18px bold
```

### 수정 파일

| 파일 | 변경 |
|------|------|
| `components/product-card-image.tsx` | **신규** — 4:5 이미지, 품절만 오버레이 |
| `components/product-card-content.tsx` | **신규** — 판매자→상품명→평점→가격 |
| `components/deal-card.tsx` | 그리드 카드 공통 body 적용 |
| `components/home-recommended-deal-card.tsx` | rail 카드 동일 구조 |
| `components/home-rail-deal-card.tsx` | rail 카드 동일 구조 |
| `components/deal-card-price-block.tsx` | `variant="card"` |
| `components/deal-card-meta.tsx` | `variant="card"` (평점만) |
| `components/saved-product-card.tsx` | 찜/최근본 타이포·가격 정리 |
| `lib/deals/card-display.ts` | `getDealCardRating()` |
| `lib/design-system.ts` | productCard 토큰 |
| `app/globals.css` | 4:5, borderless card, grid gap |

### 제거/숨김 (카드 UI만)

- 인증판매자 배지, SellerTrustBadges, 재구매율, 구매건수, 응답속도
- 썸네일 위 할인/인기 배지, SaveDealButton overlay (rail)
- 카드 border/shadow (이미지+텍스트만)

데이터·판매자관/상세는 `DealCardSellerRow`, `DealCardMeta default` 유지.

### 적용 페이지

`/`, `/search`, `/categories`, `/category/*`, `/saved`, `/mypage/recent`, 판매자 프로필 상품 그리드

### lint / build (PHASE 2)

```
npm run lint  → PASS
npm run build → PASS
```

---

*기준: PHASE 1–2 mobile-ui · lint/build PASS*
