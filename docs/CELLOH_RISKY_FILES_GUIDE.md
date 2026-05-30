# CELLOH Risky Files Guide

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Status:** Pre-edit checklist — read before touching listed files

**Related:** [CELLOH_SCREEN_TO_FILE_MAP.md](./CELLOH_SCREEN_TO_FILE_MAP.md), [CELLOH_DESIGN_SYSTEM.md](./CELLOH_DESIGN_SYSTEM.md)

---

## How to use

1. Find your file below  
2. Complete **Before edit** checks  
3. Make minimal change  
4. Run **Test routes** at all listed widths (375 / 390 / 430)  
5. `npm run lint && npm run build`

---

## `app/globals.css`

| | |
|---|---|
| **Why risky** | Defines `--celloh-app-width`, rail widths, z-index stack, product card layout |
| **Blast radius** | Home rails, cart rails, seller rails, ranking columns, PLP — **all pages** |

### Before edit

- Read `.commerce-rail-item`, `.ranking-column`, `.only-celloh-item` formulas  
- Do not switch rails to raw `100vw`  
- Check z-index tokens (`--celloh-z-header`, dropdown, bottom nav)

### Test routes

`/`, `/join-cart`, `/collections/ranking`, `/category/food`, `/sellers/moon-fruit`

### Common mistakes

- 2.5 peek becomes 2.0 or 3.0 — wrong `calc()` divisor  
- Horizontal page scroll appears — element wider than shell  
- Filter dropdown clipped — z-index lowered accidentally

---

## `components/product-card-content.tsx`

| | |
|---|---|
| **Why risky** | Single source for card body on home, PLP, collections, mypage rails |
| **Blast radius** | Every `DealCard`, `HomeRecommendedDealCard`, seller product grids |

### Before edit

- Preserve field order: name → review → price → sold  
- Keep `line-clamp-2` on title  
- Rail vs grid font sizes (`variant` prop)

### Test routes

`/`, `/category/food`, `/collections/today-special`, `/mypage/recent`

### Common mistakes

- Stepper overlap — stepper is **not** in this file (parent positions it)  
- Review format regression — check `lib/product/card-badge-meta.ts`  
- Price colors wrong — use `#E28A3B` / `#111` / `#999`

---

## `components/cart/cart-quantity-control.tsx`

| | |
|---|---|
| **Why risky** | All + / stepper behavior, guest + logged-in persistence |
| **Blast radius** | Home, PLP, PDP overlay, cart preview cards |

### Before edit

- Keep anchor `bottom-2 right-2`, stepper expands **left**  
- `stopPropagation` on buttons inside product links  
- `openSheetOnFirstAdd` behavior for guest

### Test routes

`/`, `/product/1` (+ tap), `/join-cart`

### Common mistakes

- Clicks navigate to PDP instead of adding  
- Stepper clipped by `overflow-hidden` on parent  
- Login required silently fails — test guest + logged-in

---

## `components/home-catalog.tsx`

| | |
|---|---|
| **Why risky** | **Only** home section order & conditional render |
| **Blast radius** | `/` entire scroll experience |

### Before edit

- Match [CELLOH_DESIGN_SYSTEM.md](./CELLOH_DESIGN_SYSTEM.md) section order  
- Update `HOME_SECTION_COPY` keys if titles change  
- Empty catalog → `DealsEmptyState` path

### Test routes

`/`, smoke: `npm run qa:routes`

### Common mistakes

- Duplicate sections after copy-paste  
- `setCatalog(catalog)` effect broken — cart sheet recommendations empty  
- Removing `RecommendationBasisHint` without product approval

---

## `components/category-sub-nav.tsx`

| | |
|---|---|
| **Why risky** | Subcategory chips + URL `?sub=` sync |
| **Blast radius** | All `/category/[slug]` pages |

### Before edit

- Glyph map in `lib/categories/subcategory-glyphs.ts`  
- Active state from searchParams  
- Used inside `CategoryPlpContent` — don't duplicate nav elsewhere

### Test routes

`/category/food`, `/category/food?sub=fruit`, `/category/living`

### Common mistakes

- Double sub-nav row with `categories-split-view`  
- Sub click doesn't update grid — URL not pushed  
- Wrong active chip when back navigation

---

## `components/deal-catalog-toolbar.tsx`

| | |
|---|---|
| **Why risky** | Sort + quick filters + filter sheet entry — URL driven |
| **Blast radius** | Category PLP, search results |

### Before edit

- `buildDealCatalogSearchParams` compatibility  
- Popover position uses `barRef` — test at 375px  
- Chip active styles (filled green)

### Test routes

`/category/food`, `/search?q=test`  
Capture: sort dropdown open, filter sheet open

### Common mistakes

- Filter sheet behind product images (z-index)  
- Scroll not reset after filter apply  
- Duplicate toolbar row on category page

---

## `components/product/product-detail-purchase-bar.tsx`

| | |
|---|---|
| **Why risky** | Fixed bottom CTA — cart + buy now + tier pricing |
| **Blast radius** | All PDPs |

### Before edit

- Main has bottom padding for bar + bottom nav  
- `openLastLook` vs direct checkout href  
- Sold-out disables buttons

### Test routes

`/product/1`, `/product/11`  
Test: 장바구니, 구매하기, last-look sheet

### Common mistakes

- Bar hidden under bottom tab  
- Quantity not passed to checkout URL  
- Tier price mismatch vs summary panel

---

## `lib/home/collection-data.ts`

| | |
|---|---|
| **Why risky** | Collection slug metadata + deal selectors for `/collections/*` |
| **Blast radius** | Every quick menu collection link |

### Before edit

- Sync with `lib/home/quick-menu-items.ts` hrefs  
- Slug must match `app/collections/[slug]`  
- `getCollectionDefinition` fallback for unknown slug

### Test routes

Each quick menu href (17 items), especially new slugs

### Common mistakes

- Quick menu 404 — href/collection slug mismatch  
- Empty collection — selector too strict  
- Title/copy out of sync with `HOME_SECTION_COPY`

---

## `lib/home/quick-menu-items.ts`

| | |
|---|---|
| **Why risky** | **Single source of truth** for quick menu labels + hrefs |
| **Blast radius** | Home QM + any doc referencing menu order |

Always edit together with `collection-data.ts` when adding collections.

---

## `lib/home/build-home-view.ts`

| | |
|---|---|
| **Why risky** | Which deals appear in each home section |
| **Blast radius** | All home rails |

### Test routes

`/`, verify each section has items or intentional empty skip

---

## `components/home/home-commerce-rail-track.tsx`

| | |
|---|---|
| **Why risky** | Shared rail scroll behavior (snap, gap, padding) |
| **Blast radius** | All `HomeCommerceRailSection` instances |

Prefer CSS width changes in `globals.css` over per-component width.

---

## Escalation

| Symptom | Likely files |
|---------|--------------|
| Rail width wrong everywhere | `globals.css` |
| Card text wrong everywhere | `product-card-content.tsx` |
| + broken everywhere | `cart-quantity-control.tsx` |
| Home order wrong | `home-catalog.tsx` |
| Category filter broken | `deal-catalog-toolbar.tsx`, `plp-filter-sheet.tsx` |
| Collection 404 | `collection-data.ts`, `quick-menu-items.ts` |
