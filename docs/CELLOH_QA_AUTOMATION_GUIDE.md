# CELLOH QA Automation Guide

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Scope:** Local QA workflow — no new package installs

---

## Every change — run this sequence

```bash
cd /Users/kimgana/Documents/wadeal-v2

rm -rf .next
npm run lint
npm run build
```

If lint/build PASS, start dev and smoke:

```bash
npm run dev
# new terminal:
npm run smoke:check
# or separately:
npm run qa:routes
npm run smoke:content
```

**Rule:** Do not commit until lint + build PASS.

---

## Command reference

| Step | Command | Purpose |
|------|---------|---------|
| Clear cache | `rm -rf .next` | Fix stale Turbopack/Next cache |
| Type check | `npm run lint` | `tsc --noEmit` |
| Production build | `npm run build` | Catch SSR/route errors |
| Dev server | `npm run dev` | Manual browser QA |
| Route HTTP | `npm run qa:routes` | 50+ routes → 200 |
| Content smoke | `npm run smoke:content` | curl + grep key text |
| Combined smoke | `npm run smoke:check` | routes + content (dev server required) |
| Preflight | `npm run qa:preflight` | rm .next + lint + build |

Optional env: `CELLOH_QA_BASE_URL=http://localhost:3001 npm run qa:routes`

---

## Manual browser routes (after dev starts)

| Area | Routes |
|------|--------|
| Home | `/`, Quick Menu, product + on card |
| Category | `/category/food`, `/category/living` |
| Product | `/product/1`, add to cart, stepper |
| Cart | `/join-cart`, tier coupon notice |
| Collections | `/collections/today-special`, `/collections/ranking` |
| Growth | `/invite`, `/membership` |
| Support | `/support`, `/support/faq` |
| Policies | `/policies/privacy`, `/policies/refund` |
| Seller | `/seller/login` → dashboard (if creds) |
| Admin | `/admin/login` → dashboard (if creds) |

---

## Per-screen checks

| Screen | Check |
|--------|-------|
| Home | Header, Quick Menu, rails scroll, +/stepper on cards |
| Product detail | Image, price, purchase bar, seller card |
| Join cart | Line items, coupon rail, checkout CTA |
| Mypage | Login gate, orders/benefits links |
| Collection | Title, grid, empty fallback (no crash) |
| Error state | "다시 시도", "홈으로", "고객센터" (`RouteErrorFallback`) |

---

## Failure priority

| Priority | Symptom | Action |
|----------|---------|--------|
| **P0** | `npm run lint` or `npm run build` fails | Fix before any commit |
| **P1** | Button/link dead, checkout blocked, login loop | Fix same session |
| **P2** | Layout break, overlap, missing section | Fix before merge |
| **P3** | Copy typo, spacing, color | Batch or follow-up |

---

## Port conflicts

```bash
# Free port 3000
lsof -ti:3000 | xargs kill -9

# Also check 3001, 3002 if dev was restarted
lsof -ti:3001 | xargs kill -9
lsof -ti:3002 | xargs kill -9

# Run on alternate port
npm run dev -- -p 3001
CELLOH_QA_BASE_URL=http://localhost:3001 npm run qa:routes
```

---

## `.next` cache issues

Symptoms: stale routes, wrong chunks, "Cannot find module" after file moves.

```bash
rm -rf .next
npm run build
npm run dev
```

If still broken:

```bash
rm -rf node_modules/.cache
npm run build
```

Last resort (slow):

```bash
rm -rf node_modules
npm install
rm -rf .next
npm run build
```

---

## Playwright / E2E

**Not installed** — do not add packages in this phase. See `docs/CELLOH_SMOKE_TEST_PLAN.md`.

---

## Related

- `docs/CELLOH_SMOKE_TEST_PLAN.md`
- `docs/CELLOH_RELEASE_CHECKLIST.md`
- `docs/CELLOH_BACKUP_RESTORE_RUNBOOK.md`
- `scripts/qa-routes.sh`, `scripts/smoke-content.sh`
