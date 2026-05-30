# CELLOH Smoke Test Plan

**Date:** 2026-05-29 (updated)  
**Branch:** `mobile-ui`  
**Scope:** bash + curl smoke — **no Playwright**, no external API calls

---

## Tooling

| Script | Command | Checks |
|--------|---------|--------|
| Route HTTP 200 | `npm run qa:routes` | Public buyer routes |
| Content smoke | `npm run smoke:content` | Required routes + text patterns |

**Prerequisite:** `npm run dev` on `:3000` (or `CELLOH_QA_BASE_URL`).

```bash
rm -rf .next && npm run lint && npm run build
npm run dev
# separate terminal:
npm run qa:routes && npm run smoke:content
```

`package.json` has **no** `test:e2e` / Playwright — intentional.

---

## Required smoke routes

| Route | HTTP | Title / content | Render | Header | CTA | JS crash |
|-------|------|-----------------|--------|--------|-----|----------|
| `/` | 200 | celloh, tagline | product rails | ✅ | Quick Menu, + | none |
| `/category/food` | 200 | 식품 | product grid | ✅ | cards | none |
| `/category/living` | 200 | 생활 | product grid | ✅ | cards | none |
| `/product/1` | 200 | product title | price, image | ✅ | cart/stepper | none |
| `/join-cart` | 200 | 장바구니 | lines or empty | ✅ | checkout link | none |
| `/collections/today-special` | 200 | 오늘의특가 | grid or empty | ✅ | cards | none |
| `/collections/ranking` | 200 | 랭킹 | ranking columns | ✅ | cards | none |
| `/collections/popular-sellers` | 200 | 판매자 | seller cards | ✅ | links | none |
| `/invite` | 200 | 지인초대 | referral panel | ✅ | copy buttons | none |
| `/membership` | 200 | 멤버십 | benefit cards | ✅ | policy link | none |
| `/support` | 200 | 고객센터 | FAQ/support | ✅ | contact | none |
| `/policies/privacy` | 200 | 개인정보 | policy body | ✅ | — | none |
| `/seller/dashboard` | 200 or 307→login | 로그인/대시보드 | gate or dashboard | ✅ | login CTA | none |
| `/admin/dashboard` | 200 or 307→login | 로그인/대시보드 | gate or dashboard | ✅ | login CTA | none |

Auth-gated routes: unauthenticated users should **redirect to login**, not 404/500.

---

## Automated coverage (`smoke-content.sh`)

| Route | grep pattern |
|-------|--------------|
| `/` | celloh, tagline |
| `/category/food` | 식품 |
| `/category/living` | 생활 |
| `/product/1` | (product shell) |
| `/join-cart` | 장바구니 |
| `/collections/today-special` | 특가 |
| `/collections/ranking` | 랭킹 |
| `/collections/popular-sellers` | 판매자 |
| `/invite` | 친구 |
| `/membership` | 멤버십 |
| `/support` | 고객 |
| `/policies/privacy` | 개인정보 |

---

## Manual-only checks

- [ ] Product card +/stepper adds to cart sheet
- [ ] Bottom nav does not cover purchase bar
- [ ] Safe-area on iOS notch
- [ ] Error boundary: 다시 시도 / 홈 / 고객센터 (`components/route-error-fallback.tsx`)
- [ ] Seller/admin login → dashboard (with test account)

---

## Future E2E (post-launch)

When Playwright is approved:

1. Add `@playwright/test` as devDependency
2. Add `test:e2e` + `scripts/smoke-check.mjs`
3. CI against preview URL with `CELLOH_QA_BASE_URL`

---

## Related

- `docs/CELLOH_QA_AUTOMATION_GUIDE.md`
- `scripts/qa-routes.sh`, `scripts/smoke-content.sh`
- `docs/CELLOH_RELEASE_CHECKLIST.md`
