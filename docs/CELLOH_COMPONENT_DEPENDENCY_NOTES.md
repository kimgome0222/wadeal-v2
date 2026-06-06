# CELLOH Component Dependency Notes

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Status:** Dependency reference for client/server boundaries

**Related:** [CELLOH_SCREEN_TO_FILE_MAP.md](./CELLOH_SCREEN_TO_FILE_MAP.md)

---

## Legend

| Tag | Meaning |
|-----|---------|
| **C** | Client component (`"use client"`) |
| **S** | Server component (default in `app/`) |
| **Ctx** | React context provider |

---

## ProductCard family

| Piece | Type | Props / inputs | Used on |
|-------|------|----------------|---------|
| `DealCard` | C | `deal: Deal` | PLP grid, collections, search |
| `HomeRecommendedDealCard` | C | `deal`, `promoBadge?`, `showCouponPrice?` | Home rails |
| `ProductCardImage` | C/S | `deal`, `variant`, `sizes` | All cards |
| `ProductCardContent` | S | `deal`, `variant`, `promoBadge?` | All cards |
| `ProductCardBadgeOverlay` | S | `badgeMeta`, `promoBadge?` | Image overlay |
| `CartQuantityControl` | C | `deal`, `size`, `openSheetOnFirstAdd?` | Sibling to Link |

### Click rules

- **Link** wraps image + content only  
- **Stepper** sits in absolute overlay — must `stopPropagation` on +/−  
- Do not nest `<button>` inside `<a>`

### Fallbacks

- Missing image → `resolveProductImageUrl` in `lib/product/display-fallbacks.ts`  
- Zero price → "가격 문의" in `DealCardPriceBlock`

---

## CartQuantityControl

| | |
|---|---|
| **Type** | C |
| **Props** | `deal`, `product?`, `size`, `variant`, `openSheetOnFirstAdd`, `onAdded` |
| **Screens** | Home, PLP, PDP, cart preview, mypage rails |

### Dependencies

- `lib/cart/cart-store.ts` — guest optimistic qty  
- `app/actions/join-cart.ts` — logged-in persist  
- `useAddToCartSheet()` — open “담았어요” sheet

### Click caution

- First + may open sheet (`openSheetOnFirstAdd=true` default)  
- `login_required` from server action — guest cart still works locally

### Fallback

- Sold out → disabled +, no stepper (`isDealSoldOut`)

---

## AddToCartSheetProvider

| | |
|---|---|
| **Type** | Ctx (`lib/cart/add-to-cart-sheet-context.tsx`) |
| **Mounted in** | `components/app-buyer-shell.tsx` |
| **Screens** | All buyer routes using `AppBuyerLayout` |

### API

- `openSheet(deal?)`, `closeSheet()`, `lastAddedDeal`  
- Renders via `CartAddedBottomSheet`

### Caution

- Must wrap buyer shell — hooks throw outside provider  
- Catalog should be synced via `CartSheetCatalogSync` on data pages

---

## CartPreviewSheetProvider

| | |
|---|---|
| **Type** | Ctx (`lib/cart/cart-preview-sheet-context.tsx`) |
| **Mounted in** | `app-buyer-shell.tsx` (nested inside AddToCart) |
| **Screens** | PDP buy flow, header cart preview |

### API

- `openPreview()`, `openLastLook(continueHref?)`, `closePreview()`  
- Renders `CartPreviewBottomSheet`

### Caution

- `openLastLook` used by purchase bar — sets checkout continue href  
- Closing must clear `lastLookContinueHref`

---

## Quick Menu

| | |
|---|---|
| **Type** | S (`components/home/home-quick-menu.tsx`) |
| **Data** | `HOME_QUICK_MENU_ITEMS` from `lib/home/quick-menu-items.ts` |
| **Screens** | `/` |

### Props

- None — static map from lib

### Caution

- 2-row layout is CSS grid — changing item count affects scroll width  
- Every `href` must resolve (collections + invite + membership)

### Fallback

- Broken href → 404 collection — fix in `collection-data.ts`

---

## Collections

| | |
|---|---|
| **Route** | S — `app/collections/[slug]/page.tsx` |
| **Content** | S — `CollectionPageContent` |
| **Data** | `getCollectionDefinition(slug)` → `lib/home/collection-data.ts` |

### Flow

```
quick-menu-items.href → collections/[slug] → collection-data selector → DealProductGrid
```

### Caution

- Unknown slug still renders with fallback definition — verify copy  
- `CartSheetCatalogSync` passes full catalog for stepper

---

## Seller Profile

| | |
|---|---|
| **Route** | S — `app/sellers/[id]/page.tsx` |
| **Content** | `SellerProfilePageContent` + `components/seller/seller-profile-*` |
| **Data** | `buildSellerProfileView`, `showcase-seller-profiles.ts` |

### Client parts

- Follow button, share — check individual components

### Caution

- Public profile gated by `isSellerPublicProfileEnabled()` in `lib/sellers/routes.ts`  
- Trust copy from `lib/copy/seller-trust-copy.ts` — no legal guarantee phrases

### Fallback

- Unknown seller id → `notFound()` or mock showcase depending on data source

---

## Category PLP

| | |
|---|---|
| **Route** | S — `app/category/[slug]/page.tsx` |
| **Content** | C — `CategoryPlpContent` (uses searchParams hooks via child toolbar) |
| **Children** | `CategorySubNav`, `DealCatalogToolbar`, `DealProductGrid` |

### Data flow

```
page (server fetch deals) → CategoryPlpContent → toolbar updates URL → page re-fetch
```

### Caution

- `Suspense` boundary around PLP for `useSearchParams`  
- Minimum grid count from `ensureMinimumCategoryGridDeals`

---

## Checkout

| | |
|---|---|
| **Route** | S — `app/checkout/[id]/page.tsx` |
| **Components** | `checkout-payment-method-picker`, `checkout-discount-section`, `PaymentPolicyNotice`, `celloh-pay/*` |
| **Actions** | `app/actions/payments.ts`, `lib/payments/*` |

### Client

- Payment method pickers, celloh-pay password sheet

### Caution

- Mock PG — no real card storage  
- Order must be in payable state (`lib/payments/can-pay-order.ts`)

### Fallback

- Invalid order → redirect or error state on page

---

## Policy Pages

| | |
|---|---|
| **Route** | S — `app/policies/[slug]/page.tsx` |
| **Content** | S — `PolicyPageContent` |
| **Data** | `lib/policies/content.ts` — `POLICY_BY_SLUG` |

### Props

- `document: PolicyDocument`

### Caution

- `legalNotice` banner intentional on policy pages  
- Do not import policy components into checkout customer copy

### Fallback

- Unknown slug → `notFound()`

---

## Provider stack diagram

```
AppBuyerLayout
  └── AppBuyerShell
        ├── AddToCartSheetProvider
        │     └── CartPreviewSheetProvider
        │           ├── {page children}
        │           ├── CartAddedBottomSheet
        │           └── CartPreviewBottomSheet
        └── (CartProvider legacy paths — see cart-provider.tsx)
```

---

## Server vs client rule of thumb

| Put in server | Put in client |
|---------------|---------------|
| Data fetch in `page.tsx` | + button, sheets, filters |
| `ProductCardContent` text | `CartQuantityControl` |
| Policy markdown render | Checkout payment pickers |
| `build-home-view` sorting | Home catalog `useEffect` catalog sync |

When adding interactivity to a server component, extract a small client child — do not convert entire page to client.
