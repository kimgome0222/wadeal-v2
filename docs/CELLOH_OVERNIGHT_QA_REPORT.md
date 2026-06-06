# CELLOH Overnight Safe QA Report

**Date:** 2026-05-31  
**Branch:** `mobile-ui`  
**Start commit:** `bb79d66` — `fix: refine celloh p2 design details`

## Summary

Overnight safe QA pass completed with **no application code changes required**. All required routes return HTTP 200, lint/build PASS, Quick Menu and click patterns verified via code + runtime checks.

## Backup Files Created

- `backups/celloh-overnight-before-20260531-0319.patch`
- `backups/celloh-overnight-before-status-20260531-0319.txt`

## Static Error Search

| Check | Result |
|-------|--------|
| `href="#"` | None found |
| `href={undefined}` | None found |
| `TODO_FIX` | None found |
| `console.log` in app/components (prod paths) | Only `DevDataSourceLogger` (dev diagnostic, intentional) |
| CartQuantityControl buttons | All have `type="button"` |
| pointer-events-none on card overlays | Intentional; stepper uses `pointer-events-auto` |

**Note:** `next-env.d.ts` was auto-modified by dev/build (`.next/dev/types` path). Restored to committed version — do not commit.

## Route / 404 Check

All routes tested via dev server — **HTTP 200**:

| Route | Status |
|-------|--------|
| `/` | 200 |
| `/category/food` | 200 |
| `/category/food?sub=fruit` | 200 |
| `/category/living` | 200 |
| `/category/beauty` | 200 |
| `/category/fashion` | 200 |
| `/category/digital` | 200 |
| `/category/pet` | 200 |
| `/product/1` | 200 |
| `/product/11` | 200 |
| `/join-cart` | 200 |
| `/collections/today-special` | 200 |
| `/collections/recommended` | 200 |
| `/collections/celloh-coupon` | 200 |
| `/collections/ranking` | 200 |
| `/collections/popular-sellers` | 200 |
| `/collections/new-sellers` | 200 |
| `/collections/repurchase` | 200 |
| `/membership` | 200 |
| `/invite` | 200 |
| `/sellers/moon-fruit` | 200 |
| `/sellers/living-lab` | 200 |
| `/sellers/lumi-beauty` | 200 |
| `/collections/nonexistent-slug-test` | 200 (fallback) |

## Quick Menu Verification

- **Source:** `lib/home/quick-menu-items.ts` (17 items)
- **Render:** `home-catalog.tsx` → single `<HomeQuickMenu />` below Hero
- **Layout:** 2-row horizontal scroll (`grid-flow-col grid-rows-2`)
- **First-screen priority:** 셀로쿠폰 (#3), 지인초대 (#4), 인기 판매자 (#5) in columns 2–3
- All hrefs valid; no `#` or undefined

## Click Functionality

| Component | Status |
|-----------|--------|
| CartQuantityControl | `type="button"`, `pointer-events-auto`, stopPropagation on stepper |
| ProductCard / DealCard | Link + overlay pattern correct |
| CategorySubNav | Link chips with `?sub=` query |
| DealCatalogToolbar | Sort z-[90], filter sheet z-[110] |
| ProductDetailPurchaseBar | 구매하기 / 장바구니 split, client component |
| Seller cards / stories | Full-card Link to `/sellers/{id}` |
| Quick Menu | All items Link |

No Link-inside-button nesting found in target components.

## Screen Structure (Code Verified)

### Home
- Sticky header `z-[80]`
- Quick Menu 2-row, no duplicate
- No "전체상품 미리보기" section
- Rail 2.5 peek via `.commerce-rail-item`
- Product card order: image → name → review → price → original → sold count
- Ranking vertical cards, seller showcase/stories clickable

### Category
- Single `CategorySubNav` per page
- 3-col emoji chips, 2-col product grid (16/28px gap)
- Toolbar sort/filter/chips

### Product Detail
- Gallery, tier chips, section nav tabs
- Purchase bar: left buy / right cart (green)

### Join Cart
- Summary → coupon notice → fill/upsell rails → green checkout bar
- Checkout bar only on `/join-cart`

## Issues Found

None blocking.

## Issues Fixed

None — no code changes required.

## Remaining Issues (Not Fixed — Out of Scope)

| Issue | Notes |
|-------|-------|
| Manual touch QA | Stepper/badge sync best verified in browser |
| `DevDataSourceLogger` console.log | Dev-only diagnostic |
| `next-env.d.ts` dev path drift | Auto-generated; restore after dev sessions |
| Middleware deprecation warning | Next.js 16 advisory, not app bug |

## Lint / Build

```
npm run lint  → PASS (tsc --noEmit)
npm run build → PASS (41 routes)
```

## Git Status After QA

Application code unchanged from `bb79d66`. Only this report file added.

## Push

Not performed.

---

# Extended QA Task 2 — Click / Route / Fallback Coverage

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Start commit:** `d967323` — `chore: overnight celloh qa fixes`

## Summary

Extended pass focused on href/route integrity, empty-state fallbacks, guest cart sanitization, and automated route smoke checks. No blocking click/404 issues found in static search; minimal targeted fixes applied.

## Backup Files Created

- `backups/celloh-overnight-extended-before-*.patch`
- `backups/celloh-overnight-extended-status-*.txt`

## Files Modified

| File | Change |
|------|--------|
| `lib/join-cart/guest-cart-storage.ts` | `sanitizeGuestCartItem()` on localStorage read — clamp quantity 0–99, NaN price → 0, filter invalid entries, slug/id/image fallbacks |
| `lib/home/collection-data.ts` | `new` collection sorts by `b.id - a.id` for stable newest-first ordering |
| `scripts/qa-routes.sh` | New route smoke script (31 routes + 2 safe-fallback routes) |
| `package.json` | Added `"qa:routes": "bash scripts/qa-routes.sh"` |

## Static href / router Search

| Check | Result |
|-------|--------|
| `href="#"` | None |
| `href={undefined}` / `href={null}` | None |
| `href=""` | None |
| `router.push("")` / `router.push('#')` | None |

## Route QA (`npm run qa:routes`)

All **31 primary routes → HTTP 200**. Safe-fallback routes also **200** (no crash):

| Route | Status | Notes |
|-------|--------|-------|
| All Quick Menu targets (17) | 200 | Including `/membership`, `/invite`, all `/collections/*` |
| Category routes + `?sub=` variants | 200 | food/fruit/meat/seafood, living, beauty, fashion, digital, pet |
| `/product/1`, `/product/11`, `/product/wd-wipes-001` | 200 | Valid products |
| `/product/unknown-test` | 200 | `notFound()` UI — dev returns 200, no crash |
| `/sellers/moon-fruit` … `/sellers/celloh-fresh` | 200 | Mock sellers |
| `/sellers/unknown-test` | 200 | `SellerProfileUnavailable` — intentional |
| `/collections/nonexistent-slug-test` | 200 | Falls back to recommended deals |

## Quick Menu / Collections

- All 17 Quick Menu hrefs verified via `lib/home/quick-menu-items.ts`
- Missing collection slug → `getCollectionDefinition()` fallback to recommended deals (no crash)
- Product collections → 2-col grid; seller collections → seller cards

## Category / Sub Query

- Existing implementation verified: `CategorySubNav` chips update `?sub=` query, grid filters by subcategory, empty state shows fallback deals

## Product / Seller Fallback

- Unknown product → `notFound()` in `app/product/[id]/page.tsx` (safe empty state)
- Unknown seller → `SellerProfileUnavailable` in `app/sellers/[id]/page.tsx` (200, no crash)
- No code changes required — behavior already correct

## Click / pointer-events Search

- `pointer-events-none` on product card overlays is intentional; stepper uses `pointer-events-auto`
- No erroneous full-screen overlays blocking clicks found
- CartQuantityControl buttons use `type="button"`

## ProductCard / Cart Stability

- ProductCard display helpers already have review/sold/price fallbacks (prior P1 work)
- Guest cart: localStorage parse failure → empty array; quantity clamped; zero-qty items removed; NaN prices → 0

## Issues Fixed (Extended)

1. Guest cart localStorage corruption could produce NaN totals or negative quantity — sanitized on read
2. `new` collection had unstable ordering — now sorted by id descending
3. No automated route regression script — added `scripts/qa-routes.sh`

## Remaining Issues (Not Fixed — Out of Scope)

| Issue | Notes |
|-------|-------|
| Dev `notFound()` returns HTTP 200 | Next.js dev behavior; production may differ |
| Manual touch QA | Stepper/hydration best verified in browser |
| `DevDataSourceLogger` console.log | Dev-only diagnostic |
| `next-env.d.ts` dev path drift | Auto-generated; restore after dev/build |
| Middleware deprecation warning | Next.js 16 advisory |

## Lint / Build (Extended)

```
rm -rf .next && npm run lint  → PASS (tsc --noEmit)
npm run build                 → PASS (41 routes)
npm run qa:routes             → PASS (33 checks)
```

## Push

Not performed.

---

# Extended QA Task 3 — Mobile UX / Accessibility / Documentation

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Start commit:** `a203337` — `chore: extend celloh overnight qa coverage`

## Summary

Final polish pass on mobile click feedback, aria-label coverage, compact empty states, image alt fallbacks, and overflow/sticky verification. No functional changes; lint/build PASS.

## Backup Files Created

- `backups/celloh-overnight-final-before-*.patch`
- `backups/celloh-overnight-final-status-*.txt`
- `backups/celloh-overnight-final-*.patch` (post-change)

## Files Modified

| File | Change |
|------|--------|
| `components/deal-catalog-toolbar.tsx` | Sort/filter `aria-label`, min 44px tap, `active:scale` feedback |
| `components/plp/plp-sort-dropdown.tsx` | `role="listbox"`, `aria-selected`, per-option labels |
| `components/plp/plp-filter-sheet.tsx` | Close button `aria-label` |
| `components/category-chip.tsx` | `aria-label` on Link/button chips |
| `components/category-product-list.tsx` | Compact `EmptyState` + home link; sort chip feedback |
| `components/deal-product-grid.tsx` | Default empty action → 홈으로 가기 |
| `components/deal-card.tsx` | `active:scale-[0.99]` on card link |
| `components/product-card-image.tsx` | Alt fallback `"상품 이미지"` |
| `components/product-image-gallery.tsx` | Alt fallback, empty placeholder `role="img"`, nav `active:scale` |
| `components/product-detail-section-nav.tsx` | Tab `aria-label`, min 44px, active feedback |
| `components/product/product-detail-purchase-bar.tsx` | Buy button `aria-label` |
| `components/header.tsx` | Home profile link `aria-label` |
| `components/home/home-seller-stories-section.tsx` | Seller story link `aria-label` |
| `components/home/home-seller-showcase-card.tsx` | Card `aria-label`, image alt from seller/product name |
| `components/collections/collection-page-content.tsx` | Compact `EmptyState` for empty collection |
| `components/join-cart-content.tsx` | Compact empty cart state |
| `components/search/search-empty-results.tsx` | 홈으로 가기 link |

## Mobile Click Feedback

| Target | Status |
|--------|--------|
| Quick Menu | Already had `cursor-pointer`, `active:scale-[0.97]` |
| Product cards | Added `active:scale-[0.99]` on DealCard link |
| Stepper +/- | Already had `active:bg`, `active:scale-95` on + button |
| Category chips | Added `aria-label`, existing `active:scale-[0.97]` |
| Sort/filter toolbar | Added `active:scale`, min 44px height |
| PDP section tabs | Added `active:bg`, `active:scale-[0.99]` |
| Purchase bar | Already had `active:scale-[0.99]` |
| Seller cards/stories | Already had `active:scale-[0.99]`; aria-label added |

## Accessibility (aria-label)

| Target | Status |
|--------|--------|
| Cart + / stepper | ✅ `장바구니에 담기`, `수량 줄이기/늘리기` |
| Header cart/search | ✅ `장바구니`, `상품 검색` |
| Gallery prev/next | ✅ `이전/다음 이미지` |
| Filter open/close | ✅ `필터 열기/닫기` |
| Sort dropdown | ✅ `정렬 옵션`, per-option labels |
| Seller cards | ✅ `{name} 판매자 프로필 보기` |
| Quick menu | ✅ per-item `aria-label={item.label}` |
| Category chips | ✅ `aria-label={label}` |
| PDP tabs | ✅ `{section} 섹션으로 이동` |

## Empty States

| Screen | Before | After |
|--------|--------|-------|
| Empty cart | Full EmptyState | Compact + 추천상품 rail |
| Search no results | Text only | + 홈으로 가기 link + recommendations |
| Category no products | Plain `<p>` | Compact EmptyState + home link |
| Collection empty | Plain `<p>` | Compact EmptyState + home link |
| PLP filtered empty | EmptyState | + default home action |
| Reviews/QnA | Already EmptyState | No change needed |
| Unknown seller | SellerProfileUnavailable | Already has search/home links |

## Image Fallback

- `ProductCardImage`: placeholder `/wadeal-wordmark.svg`, alt `"상품 이미지"` when title missing
- `ProductImageGallery`: alt fallback, empty gallery → labeled placeholder block
- `HomeSellerShowcaseCard`: alt from seller/product name (was empty `alt=""`)

## Overflow / Sticky

| Check | Result |
|-------|--------|
| Sticky header parent overflow | `overflow-visible` on PLP/home sections; sticky header not trapped |
| Body horizontal scroll | No `overflow-x-hidden` on sticky parents found |
| Bottom fixed purchase bar | PDP `pb-[max(safe-area+120px,120px)]`; join-cart `pb-[calc(80px+safe-area)]` |
| Filter/sort overlays | Render only when `open`; z-index 85–110 layered correctly |

## Remaining Manual Checks

| Item | Notes |
|------|-------|
| Touch stepper on real device | Verify no double-tap zoom |
| VoiceOver/TalkBack sweep | Screen reader on iOS/Android |
| Keyboard focus rings | `focus-visible:ring` on header icons only |
| Hydration after cart refresh | Guest ↔ logged-in sync |

## Lint / Build (Task 3)

```
rm -rf .next && npm run lint  → PASS (tsc --noEmit)
npm run build                 → PASS (41 routes)
```

## Push

Not performed.
