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
