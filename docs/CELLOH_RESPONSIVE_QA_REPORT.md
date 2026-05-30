# CELLOH Responsive / Mobile QA Report

**Branch:** `mobile-ui`  
**Date:** 2026-05-29  
**Starting commit:** `f6956f3` — `chore: audit celloh routes and links`  
**Scope:** CSS / layout / overflow / spacing only — no DB, deploy, or push.

---

## 1. App shell width

| Item | Value / location |
|------|------------------|
| CSS token | `--celloh-app-width: min(100vw, 430px)` in `app/globals.css` |
| Layout shell | `AppBuyerLayout` / `ds.page.wrap` → `max-w-[430px]` |
| Design system | `lib/design-system.ts` → `appShell.widthVar: "var(--celloh-app-width)"` |

**Rail width (all use `--celloh-app-width`, not raw `100vw`):**

| Class | Formula |
|-------|---------|
| `.commerce-rail-item`, `.card-rail-item`, `.home-commerce-rail-item`, `.celloh-product-carousel-item` | `(app-width − 72px) / 2.5` → 2.5-up peek |
| `.only-celloh-item` | `app-width − 96px` |
| `.ranking-column` | `(app-width − 48px) / 1.6` |
| `.seller-rail-item`, `.plp-seller-rail-item`, `.celloh-seller-carousel-item` | `(app-width − 72px) / 4` |

**`100vw` usage:** only in `--celloh-app-width`, hero `sizes`, seller cover `sizes` — no product card full-bleed abuse.

**Result:** ✅ Shell and rails aligned. Desktop browser centers 430px column; rails scale with shell, not viewport bleed.

---

## 2. Sticky / fixed stack

**Target z-index (documented in `:root`):**

| Layer | Token / value |
|-------|----------------|
| Header | `--celloh-z-header: 80` |
| Dropdown | `--celloh-z-dropdown: 90` |
| Sheet | `--celloh-z-sheet: 100` |
| Purchase bar | `--celloh-z-purchase: 110` |

**Verified elements:**

| Element | z-index | Notes |
|---------|---------|-------|
| `AppBuyerChrome` header | `z-[80]` | sticky `top-0` |
| PLP sort backdrop / menu | `z-[85]` / `z-[90]` | portal to body |
| `.filter-dropdown` | `var(--celloh-z-dropdown)` | was `20`, fixed |
| Cart / pay sheets | `z-[100]`–`z-[101]` | backdrop + panel |
| PDP purchase bar | `z-[110]` | full-width bottom |
| Bottom nav | `z-[60]` | `ds.chrome.bottomNav` |
| Join-cart checkout bar | `z-[70]` | **fixed** — was `z-[55]` (below nav); now above nav |
| Product detail sub-header | `z-[80]` | was `z-[52]` |

**Bottom padding patterns:**

| Screen | Pattern |
|--------|---------|
| Tab-root pages | `ds.spacing.bottomNav` → `pb-[max(calc(env(safe-area-inset-bottom)+120px),120px)]` |
| PDP | `pb-[max(calc(env(safe-area-inset-bottom)+120px),120px)]` on `<main>` |
| Join-cart content | `pb-[max(calc(env(safe-area-inset-bottom)+144px),144px)]` — clears checkout bar above bottom nav |

**Result:** ✅ Join-cart checkout bar no longer hidden under bottom nav. Content padding increased for dual fixed bars.

---

## 3. Horizontal overflow

| Check | Status |
|-------|--------|
| `html`, `body` | `overflow-x: hidden` |
| App shell | `overflow-x-hidden` on `AppBuyerLayout` + `ds.page.wrap` |
| Main content | `overflow-x-clip overflow-y-visible` |
| Rails | `overflow-x-auto` on track wrappers only |
| `w-screen` in components | none found |

**Result:** ✅ Body horizontal scroll suppressed; rails scroll independently within shell.

---

## 4. Screen-by-screen QA (code review + layout rules)

| Route | Checks | Status |
|-------|--------|--------|
| `/` | Quick menu 2-row grid `min-h-[168px]`; commerce rail 2.5-up; ranking column width | ✅ layout rules applied |
| `/category/food` | 2-col `.product-grid`; filter dropdown z-90; page `pb` for bottom nav | ✅ |
| `/product/1` | Gallery in shell; purchase bar z-110; main pb-120+safe; section nav `sticky top-14` | ✅ |
| `/join-cart` | Checkout bar z-70 above nav; content pb-144+safe | ✅ fixed |
| `/collections/ranking` | `.ranking-column` shell-based width | ✅ |
| `/sellers/moon-fruit` | Seller rail 4-up; page pb for bottom nav | ✅ |
| `/membership` | Standard page wrap + bottom nav padding | ✅ (manual visual) |
| `/invite` | Standard page wrap + bottom nav padding | ✅ (manual visual) |

---

## 5. CSS cleanup (`app/globals.css`)

| Change | Detail |
|--------|--------|
| Z-index tokens | Added `--celloh-z-header/dropdown/sheet/purchase` |
| Rail dedup | Merged `.seller-rail-item` + `.plp-seller-rail-item` + `.celloh-seller-carousel-item` |
| Rail dedup | Merged `.celloh-product-carousel-item` into commerce rail group |
| Scrollbar alias | `.scrollbar-hide` mirrors `.no-scrollbar` |
| Sheet backdrop | `.celloh-sheet-backdrop` `z-40` → `z-[100]` |
| Filter dropdown | `z-index: 20` → `var(--celloh-z-dropdown)` |
| Duplicate rule | Removed second `.plp-filter-sheet` block |

---

## 6. Modified files

- `app/globals.css`
- `components/app-buyer-layout.tsx`
- `components/cart/cart-added-bottom-sheet.tsx`
- `components/home/home-quick-menu.tsx`
- `components/join-cart/join-cart-checkout-bar.tsx`
- `components/join-cart-content.tsx`
- `components/product/product-detail-header.tsx`
- `docs/CELLOH_RESPONSIVE_QA_REPORT.md` (this file)

---

## 7. Remaining manual checks

- [ ] Real device: iOS safe-area on PDP purchase bar and join-cart checkout bar
- [ ] 375 / 390 / 430px Chrome DevTools: home quick menu horizontal scroll feel
- [ ] PLP filter sheet vs purchase bar stacking on `/category/food`
- [ ] Seller profile cover full-bleed at 430px desktop shell
- [ ] `/membership`, `/invite` long-content scroll with bottom nav

---

## 8. Lint / build

```
npm run lint   → PASS (tsc --noEmit)
npm run build  → PASS (Next.js 16.2.6, 67 routes)
```

Run after: `rm -rf .next && npm run lint && npm run build`
