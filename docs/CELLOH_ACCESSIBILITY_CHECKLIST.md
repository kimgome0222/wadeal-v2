# CELLOH Accessibility Checklist

**Date:** 2026-05-31  
**Branch:** `mobile-ui`  
**Status:** Mobile-first buyer shell (430px) — **no logic changes in this task**

**Related:** [CELLOH_COLOR_CONTRAST_NOTES.md](./CELLOH_COLOR_CONTRAST_NOTES.md), [CELLOH_EMPTY_ERROR_STATE_GUIDE.md](./CELLOH_EMPTY_ERROR_STATE_GUIDE.md), [CELLOH_PERFORMANCE_ACCESSIBILITY_CHECKLIST.md](./CELLOH_PERFORMANCE_ACCESSIBILITY_CHECKLIST.md)

**Code:** `components/cart/*`, `components/header.tsx`, `components/deal-catalog-toolbar.tsx`, `lib/copy/ux-writing.ts`

---

## Touch targets

| Item | Standard | Implementation |
|------|----------|----------------|
| Primary CTA | ≥ **44px** height | `h-14` purchase bars, `min-h-[44px]` toolbar |
| Icon buttons | ≥ 44px hit area | Header cart, gallery prev/next `min-h-[44px] min-w-[44px]` |
| Compact stepper (cards) | 44px hit via padding | `CartQuantityControl` — `-m-2 p-2` on ± buttons |
| Bottom nav | Full tab cell tap | `AppBuyerShell` bottom navigation |

---

## Images & alt

| Surface | Rule | Code |
|---------|------|------|
| Product card | `deal.title` or fallback | `ProductCardImage` |
| PDP gallery | Product title | `ProductImageGallery` |
| Empty gallery | `role="img"` + aria-label | `ProductImageGallery` |
| Decorative icons | `aria-hidden` | Quick Menu glyphs, toolbar icons |
| Review photos | Descriptive alt or "리뷰 사진" | Review upload preview |

---

## Interactive labels (aria-label)

| Control | Label | File |
|---------|-------|------|
| Cart + (first add) | `장바구니에 담기` | `cart-quantity-control.tsx` |
| Cart − / + | `수량 줄이기` / `수량 늘리기` | `cart-quantity-control.tsx` |
| Header cart | `장바구니` | `header-cart-button.tsx` |
| Search | `상품 검색` | `header.tsx` |
| Filter open | `필터 열기` | `deal-catalog-toolbar.tsx` |
| Filter close | `필터 닫기` | `plp-filter-sheet.tsx` |
| Sort open | `정렬 옵션 열기` | `deal-catalog-toolbar.tsx` |
| Sort close | `정렬 닫기` | `plp-sort-dropdown.tsx` |
| Sort option | `{label}으로 정렬` | `plp-sort-dropdown.tsx` |
| Gallery prev/next | `이전 이미지` / `다음 이미지` | `product-image-gallery.tsx` |
| Gallery dot | `{n}번째 이미지` | `product-image-gallery.tsx` |
| Product card link | `{title} 상세보기` | `deal-card.tsx`, rails |
| Seller card | `{name} 판매자 프로필 보기` | `home-seller-showcase-card.tsx` |
| Quick Menu item | `{label}` | `home-quick-menu.tsx` |
| PDP purchase | `구매하기` / `장바구니에 담기` | `product-detail-purchase-bar.tsx` |
| Join cart checkout | Dynamic total label | `join-cart-checkout-bar.tsx` |
| Quantity stepper | `수량 줄이기` / `수량 늘리기` | `quantity-stepper.tsx` |

---

## Tabs & structure

| Item | Standard |
|------|----------|
| PDP tabs | `role="tablist"`, tabs `role="tab"`, `aria-selected` |
| Sort dropdown | `role="listbox"`, options `role="option"` |
| Quick Menu | `<nav aria-label="빠른 메뉴">` |
| Empty states | `role="status"`, `aria-live="polite"` |

---

## Color & contrast

See [CELLOH_COLOR_CONTRAST_NOTES.md](./CELLOH_COLOR_CONTRAST_NOTES.md)

- Primary `#2E5E4E` on white or white on green buttons
- Body `#111111`, secondary `#666666`, disabled `#999999`
- Verify WCAG AA on muted text before launch

---

## Keyboard & focus

| Item | Status |
|------|--------|
| `lang="ko"` on `<html>` | ✅ |
| Visible focus ring | `focus-visible:ring-*` on header, tabs |
| Escape closes cart sheet | ✅ |
| Tab order logical | Manual QA per release |
| Skip link | ⏳ future |

---

## Disabled states

| Pattern | Implementation |
|---------|----------------|
| Native `disabled` | Buttons, stepper at min/max |
| Sold out | `role="status"` + visible "품절" (not only color) |
| Checkout disabled | Gray bg + `cursor-not-allowed` + `disabled` attr |
| `aria-disabled` | Use when visually disabled but focusable — rare |

---

## Error messages

| Rule | Example |
|------|---------|
| Plain language | `CELLOH_ERRORS` in `lib/copy/ux-writing.ts` |
| Near field | Form errors below input |
| Screen reader | `role="alert"` for critical inline errors (future) |
| Retry CTA | `다시 시도하기` |

See [CELLOH_EMPTY_ERROR_STATE_GUIDE.md](./CELLOH_EMPTY_ERROR_STATE_GUIDE.md)

---

## Test routes (manual)

| Route | Check |
|-------|-------|
| `/` | Quick Menu labels, rail card links, cart + |
| `/category/food` | Sort/filter aria, product links |
| `/product/1` | Gallery, tabs, purchase bar, stepper |
| `/join-cart` | Checkout bar label, empty cart |
| `/collections/ranking` | Grid cards, scroll rails |
| `/invite`, `/membership` | CTA buttons, readable copy |

---

## Pre-release commands

```bash
rm -rf .next && npm run lint && npm run build
```

VoiceOver (iOS) / TalkBack (Android) spot-check on `/product/1` and `/join-cart`.

**No feature logic changed in this task.**
