# CELLOH Smoke Test Plan

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Scope:** Local/manual smoke — **no Playwright install**, no external API calls

---

## Existing tooling

| Script | Command | Checks |
|--------|---------|--------|
| Route HTTP 200 | `npm run qa:routes` | 50+ routes return 200 |
| Content smoke | `bash scripts/smoke-content.sh` | Key pages contain expected text |

**Prerequisite:** Dev server running (`npm run dev`) on `:3000` or set `CELLOH_QA_BASE_URL`.

```bash
npm run dev
# separate terminal:
npm run qa:routes
bash scripts/smoke-content.sh
```

`package.json` has **no** `test:e2e` / Playwright — intentional for this phase.

---

## Smoke targets

| Route | HTTP | Content checks |
|-------|------|----------------|
| `/` | 200 | celloh brand, tagline, product rails, Quick Menu |
| `/category/food` | 200 | category title, product cards |
| `/product/1` | 200 | product title, price, cart/add UI |
| `/join-cart` | 200 | 장바구니, tier coupon rail |
| `/collections/ranking` | 200 | ranking section |
| `/invite` | 200 | referral copy |
| `/membership` | 200 | membership copy |

---

## Manual checklist (no automation)

- [ ] Quick Menu visible on home (mobile shell)
- [ ] Cart / join-cart button reachable from product card
- [ ] Bottom nav does not overlap sticky CTAs
- [ ] Safe-area padding on iOS notch devices
- [ ] Login redirect works for `/mypage/orders`

---

## Future E2E (post-launch)

When Playwright is approved:

1. Add `@playwright/test` as devDependency
2. Add `test:e2e` script
3. Cover auth flows, checkout shell, seller/admin login gates
4. Run in CI against preview URL with `CELLOH_QA_BASE_URL`

---

## Related

- `scripts/qa-routes.sh`
- `docs/CELLOH_LAUNCH_CHECKLIST.md`
- `docs/CELLOH_ROUTE_LINK_AUDIT.md`
