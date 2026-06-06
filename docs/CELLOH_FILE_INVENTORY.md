# CELLOH File Inventory

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Status:** Architecture reference — **no code changes**

**Related:** [CELLOH_SCREEN_TO_FILE_MAP.md](./CELLOH_SCREEN_TO_FILE_MAP.md), [CELLOH_RISKY_FILES_GUIDE.md](./CELLOH_RISKY_FILES_GUIDE.md)

---

## Overview

| Area | Path | Role |
|------|------|------|
| Routes | `app/` | Next.js App Router pages & API |
| UI | `components/` | React components by domain |
| Logic | `lib/` | Data, cart, sellers, categories, copy |
| Styles | `app/globals.css`, `lib/design-system.ts` | Shell width, rails, tokens |
| Docs | `docs/` | Planning, QA, policies |
| Backups | `backups/` | Local git diff patches (not deployed) |

**App shell:** `components/app-buyer-layout.tsx` → `app-buyer-shell.tsx` (cart providers) → page content.

---

## `app/` — major routes

| Group | Paths | Role |
|-------|-------|------|
| **Buyer home** | `app/page.tsx` | Home catalog |
| **Category / search** | `app/category/[slug]`, `app/categories`, `app/search` | PLP, filters |
| **Product** | `app/product/[id]` | PDP |
| **Cart / checkout** | `app/join-cart`, `app/checkout/[id]`, `app/payment/*` | Cart → pay |
| **Collections** | `app/collections/[slug]` | Quick menu destinations |
| **Seller public** | `app/sellers/[id]` | Buyer-facing seller profile |
| **Growth** | `app/invite`, `app/membership` | Referral, membership mock |
| **Support / policy** | `app/support/*`, `app/policies/[slug]`, `/privacy`, `/terms` | CS & legal |
| **Mypage** | `app/mypage/*` | Account, orders, coupons |
| **Seller center** | `app/seller/*` | Seller ops (mock + partial DB) |
| **Admin** | `app/admin/*` | Operations dashboard |
| **API** | `app/api/payments/*`, `app/api/tracking/*` | Webhooks, billing |

**Impact if changed:** Route file = entire screen entry; layout wrappers affect all buyer pages.

**Caution:** `dynamic = "force-dynamic"` on many pages — no static export assumption.

---

## `components/home/`

| File | Role |
|------|------|
| `hero-carousel.tsx` | Home hero banner |
| `home-quick-menu.tsx` | 2-row quick menu grid |
| `home-commerce-rail-section.tsx` | Section wrapper + rail |
| `home-commerce-rail-track.tsx` | 2.5-up scroll track |
| `home-ranking-section.tsx` | Category ranking block |
| `home-ranking-column.tsx` | Single ranking column |
| `home-seller-showcase-section.tsx` | Popular/new sellers |
| `home-only-celloh-section.tsx` | Only Celloh rail |
| `home-seller-stories-section.tsx` | Seller stories |

**Parent orchestrator:** `components/home-catalog.tsx` (not in subfolder)

**Screens affected:** `/` only (plus growth client sections in `components/growth/`)

**Caution:** Section order lives in `home-catalog.tsx` — not individual section files.

---

## `components/cart/`

| File | Role |
|------|------|
| `cart-quantity-control.tsx` | Universal + / stepper |
| `cart-added-bottom-sheet.tsx` | “담았어요” sheet |
| `cart-preview-bottom-sheet.tsx` | Cart preview / last-look |
| `header-cart-button.tsx` | Header badge |
| `cart-sheet-catalog-sync.tsx` | Sync catalog to sheet context |
| `sticky-order-bar.tsx` | Checkout CTA bar |

**Context (lib):** `lib/cart/add-to-cart-sheet-context.tsx`, `lib/cart/cart-preview-sheet-context.tsx`

**Screens affected:** All product surfaces, `/join-cart`, PDP, home rails, PLP grid

---

## `components/product/`

| File | Role |
|------|------|
| `product-detail-purchase-bar.tsx` | Fixed buy bar |
| `product-detail-shipping-summary.tsx` | Shipping lines |
| `product-detail-seller-card.tsx` | Seller on PDP |
| `product-detail-info-table.tsx` | Disclosure table |
| `product-inquiry-*.tsx` | Q&A tab |
| `quantity-stepper.tsx` | PDP quantity |

**Root card atoms:** `components/product-card-*.tsx`, `components/deal-card.tsx`

**Screens affected:** `/product/[id]`, similar sections on seller profile

---

## `components/plp/` (category PLP)

| File | Role |
|------|------|
| `category-plp-content.tsx` | Category page body |
| `plp-filter-sheet.tsx` | Filter bottom sheet |
| `plp-sort-dropdown.tsx` | Sort popover |
| `plp-recommended-sellers.tsx` | Seller strip on PLP |

**Also used:** `components/category-sub-nav.tsx`, `components/deal-catalog-toolbar.tsx`, `components/deal-product-grid.tsx`

**Screens affected:** `/category/*`, partially `/search`

---

## `components/seller/`

| File | Role |
|------|------|
| `seller-*-mock-panel.tsx` | Dashboard mock data panels |
| `seller-mock-forms.tsx` | Apply / product request forms |
| `seller-profile-*.tsx` | Public profile sections |
| `seller-profile-trust-panel.tsx` | Trust display |

**Screens affected:** `/seller/*`, `/sellers/[id]`

---

## `components/admin/`

| File | Role |
|------|------|
| `admin-dashboard-content.tsx` | KPI dashboard |
| `admin-*-content.tsx` | List pages (orders, sellers, …) |
| `admin-nav.tsx` | Admin sidebar nav |
| `admin-go-live-readiness-section.tsx` | Launch checks |

**Screens affected:** `/admin/*` only

---

## `lib/home/`

| File | Role |
|------|------|
| `build-home-view.ts` | Home section deal lists |
| `quick-menu-items.ts` | Quick menu hrefs (SoT) |
| `collection-data.ts` | Collection slug definitions |
| `mock-home-commerce-data.ts` | Mock curations |
| `seller-showcase-mock.ts` | Seller showcase data |

**Impact:** Changing `quick-menu-items` or `collection-data` affects home + `/collections/*` + menu dead links.

---

## `lib/cart/`

| File | Role |
|------|------|
| `cart-store.ts` | Guest cart local state |
| `add-to-cart-client.ts` | Client add helpers |
| `add-to-cart-sheet-context.tsx` | Sheet provider |
| `cart-preview-sheet-context.tsx` | Last-look provider |
| `coupon-tiers.ts` | Tier discount mock |

**Impact:** Any + button, cart badge, sheets.

---

## `lib/product/`

| File | Role |
|------|------|
| `card-badge-meta.ts` | Review/sold format, badges |
| `detail-data.ts` | Shipping summary lines |
| `display-fallbacks.ts` | Image/price fallbacks |
| `product-disclosure.ts` | Info table rows |

**Impact:** All product cards + PDP shipping block.

---

## `lib/sellers/`

| File | Role |
|------|------|
| `types.ts` | Seller types, status enum |
| `showcase-seller-profiles.ts` | Demo sellers (`moon-fruit`, …) |
| `build-seller-profile-view.ts` | Profile page VM |
| `routes.ts` | Public profile URL helpers |
| `show-seller-mock.ts` | Mock vs DB toggle |

**Impact:** `/sellers/[id]`, seller rails, admin seller review.

---

## `lib/categories/`

| File | Role |
|------|------|
| `catalog.ts` | Category slug registry |
| `build-category-panel-view.ts` | PLP view model |
| `category-display-subcategories.ts` | Subcategory labels |
| `subcategory-glyphs.ts` | Chip icons |

**Impact:** `/category/*`, category bar, sub-nav.

---

## `docs/`

| Type | Examples |
|------|----------|
| Design / QA | `CELLOH_DESIGN_SYSTEM.md`, `CELLOH_SCREENSHOT_QA_CHECKLIST.md` |
| Architecture | `CELLOH_FILE_INVENTORY.md` (this file), `CELLOH_SCREEN_TO_FILE_MAP.md` |
| Planning | `CELLOH_DATA_MODEL_PLAN.md`, `CELLOH_PRIORITY_BACKLOG.md` |
| Hub | `README_CELLOH.md` |

**Caution:** Docs do not affect runtime; keep in sync when changing risky files.

---

## `backups/`

| Content | Purpose |
|---------|---------|
| `celloh-*-before-*.patch` | Pre-task git diff snapshots |
| `celloh-*-status-*.txt` | git status at task start |

**Not in production build.** Safe to delete old patches locally; do not commit secrets.

---

## Quick “where do I edit?”

| I want to… | Start here |
|------------|------------|
| Change home section order | `components/home-catalog.tsx` |
| Add quick menu item | `lib/home/quick-menu-items.ts` + `lib/home/collection-data.ts` |
| Fix + button everywhere | `components/cart/cart-quantity-control.tsx` |
| Fix card text order | `components/product-card-content.tsx` |
| Fix rail width | `app/globals.css` `.commerce-rail-item` |
| Category filter UI | `components/deal-catalog-toolbar.tsx`, `plp/plp-filter-sheet.tsx` |

See [CELLOH_RISKY_FILES_GUIDE.md](./CELLOH_RISKY_FILES_GUIDE.md) before editing.
