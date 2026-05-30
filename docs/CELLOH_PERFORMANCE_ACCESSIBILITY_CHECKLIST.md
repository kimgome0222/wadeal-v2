# CELLOH Performance & Accessibility Checklist

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Scope:** Pre-launch QA — mobile-first buyer shell (430px max)

---

## Images

| Item | Standard | Code ref |
|------|----------|----------|
| Product rail sizes | `(max-width: 430px) 143px, 143px` | `home-rail-deal-card.tsx` |
| Only Celloh rail | `(max-width: 430px) 334px, 334px` | `home-only-celloh-section.tsx` |
| Hero banner | `(max-width: 430px) 430px, 430px` | `hero-banner.tsx` |
| Grid cards | `(max-width: 430px) 50vw, 215px` | `deal-card.tsx` |
| Placeholder fallback | `/wadeal-wordmark.svg` | `product-card-image.tsx` |
| `next/image` | Preferred over raw `<img>` | Most product surfaces |
| `priority` | Hero/featured only — no rail spam | `deal-card-featured`, splash |

---

## Layout & CLS

- [ ] Fixed aspect ratios on product cards (`aspect-[4/5]`, `aspect-square`)
- [ ] Skeleton loaders match final layout (`app/loading.tsx`, category/product/collection)
- [ ] Font `display: swap` on Noto Sans KR
- [ ] No layout shift from late-loading cart badge counts

---

## Touch & interaction

- [ ] Primary buttons ≥ 44px height (`min-h-[44px]`, cart controls)
- [ ] Icon-only buttons have `aria-label` (cart sheet close, quantity)
- [ ] Links with icon-only use `aria-label` on product cards
- [ ] Sticky header + bottom nav z-index stack documented (`z-30` / `z-50`)

---

## Accessibility

| Item | Status |
|------|--------|
| `lang="ko"` on `<html>` | ✅ `app/layout.tsx` |
| Page titles via `metadata` | ✅ per-route |
| Image `alt` | ✅ `ProductCardImage`; review preview labeled |
| Color contrast | Brand green `#2E5E4E` on white — verify WCAG AA on muted text |
| Keyboard focus | Escape closes cart sheet |
| `aria-busy` on skeletons | ✅ loading routes |
| Screen reader labels | SubHeader back, empty states |

---

## Performance

| Item | Notes |
|------|-------|
| Lazy loading | Default on `ProductCardImage` (non-priority) |
| Dynamic routes | Home/product use `force-dynamic` for auth/data |
| `.next` clean build | Required before release |
| Image domains | Configure in `next.config` if CDN added at launch |

---

## Mobile shell

- [ ] `max-w-[430px]` buyer shell centered
- [ ] `env(safe-area-inset-bottom)` on bottom sheets / purchase bar
- [ ] Sticky category bar does not cover product purchase bar
- [ ] Splash screen `priority` only on first paint

---

## Pre-release commands

```bash
rm -rf .next
npm run lint
npm run build
npm run qa:routes        # dev server required
bash scripts/smoke-content.sh
```

---

## Related

- `docs/CELLOH_MOBILE_UI_AUDIT.md`
- `docs/CELLOH_RESPONSIVE_QA_REPORT.md`
- `lib/design-system.ts`
