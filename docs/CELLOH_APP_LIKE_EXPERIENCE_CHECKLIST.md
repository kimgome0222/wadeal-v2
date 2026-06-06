# CELLOH App-Like Experience Checklist

**Date:** 2026-05-31  
**Branch:** `mobile-ui`  
**Status:** Mobile UX QA reference — aligns with overnight UI work

**Related:** [CELLOH_MOBILE_UI_AUDIT.md](./CELLOH_MOBILE_UI_AUDIT.md), [CELLOH_DESIGN_SYSTEM.md](./CELLOH_DESIGN_SYSTEM.md), [CELLOH_DOMAIN_DEPLOYMENT_PREP.md](./CELLOH_DOMAIN_DEPLOYMENT_PREP.md)

**PWA:** `app/manifest.ts`, `app/layout.tsx` viewport

---

## PWA / install surface

| Item | Target | Status |
|------|--------|--------|
| `manifest.webmanifest` | name celloh, standalone, theme `#2E5E4E` | ✅ `app/manifest.ts` |
| Icons 192/512 | `/public/icons/icon-*.svg` | ✅ existing |
| `appleWebApp.capable` | true | ✅ `rootMetadata` |
| `theme-color` viewport | `#2E5E4E` | ✅ `app/layout.tsx` |
| **Install prompt** | Custom beforeinstallprompt UI | ⏳ future |
| **Offline fallback** | Service worker + offline page | ⏳ future |

---

## Mobile shell

| Item | Target | Verify route |
|------|--------|--------------|
| **Mobile shell** | Max-width column, app feel | `/` |
| **Sticky header** | Search + nav on scroll | `/`, `/category/food` |
| **Bottom nav** | Home / category / cart / my | All buyer routes |
| **Fixed CTA** | Purchase bar above bottom nav | `/product/1` |
| **Safe-area** | `env(safe-area-inset-*)` on bars | iPhone notch devices |
| **body overflow-x-hidden** | No horizontal page scroll | `app/globals.css` ✅ |

---

## Content layout

| Item | Target | Code / route |
|------|--------|--------------|
| **2.5 rail** | Horizontal peek on home rails | Home catalog rails |
| **Swipe/scroll** | Momentum scroll, no jank | Category chips, rails |
| **2-col grid** | Product grid at 375–430px | `/category/*` |
| **Tap target 44px** | Buttons, nav, stepper | PDP, join-cart checkout bar |

---

## Loading & polish

| Item | Target | Status |
|------|--------|--------|
| **Loading skeleton** | PLP/PDP placeholders | Partial — verify per route |
| **Splash** | Brief brand splash | `AppSplash` component |
| **No layout shift** | Image sizes / aspect ratio | `ProductCardImage` sizes |

---

## Manual QA order (P1)

1. `/` — shell, rails, bottom nav  
2. `/category/food` — filter, grid  
3. `/product/1` — sticky purchase bar, safe-area  
4. `/join-cart` — fixed checkout, coupon banner  
5. Add to home screen (iOS/Android) — icon + standalone (local only)

---

## Future (post-launch)

| Feature | Notes |
|---------|-------|
| Install prompt | After 2nd visit or cart add |
| Offline cart | localStorage already for guest |
| Push notifications | Web push + native wrapper TBD |
| Dedicated OG image 1200×630 | Replace icon fallback for richer shares |

---

## Related docs

| Doc | Topic |
|-----|-------|
| [CELLOH_RESPONSIVE_QA_REPORT.md](./CELLOH_RESPONSIVE_QA_REPORT.md) | Breakpoint QA |
| [CELLOH_SCREENSHOT_QA_CHECKLIST.md](./CELLOH_SCREENSHOT_QA_CHECKLIST.md) | Capture guide |
| [CELLOH_SHARE_COPY_GUIDE.md](./CELLOH_SHARE_COPY_GUIDE.md) | Share previews |

**No UI overhaul in this task — checklist + PWA metadata only.**
