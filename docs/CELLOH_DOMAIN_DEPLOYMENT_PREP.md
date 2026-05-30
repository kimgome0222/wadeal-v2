# CELLOH Domain & Deployment Prep

**Date:** 2026-05-31  
**Branch:** `mobile-ui`  
**Status:** Pre-launch checklist — **no deploy, DNS, or env changes in this task**

**Related:** [CELLOH_HOLD_ITEMS_BEFORE_LAUNCH.md](./CELLOH_HOLD_ITEMS_BEFORE_LAUNCH.md), [CELLOH_LAUNCH_CHECKLIST.md](./CELLOH_LAUNCH_CHECKLIST.md), [CELLOH_SECRET_ENV_AUDIT.md](./CELLOH_SECRET_ENV_AUDIT.md)

---

## Domain (placeholder)

| Item | Value |
|------|-------|
| **Primary** | https://www.celloh.co.kr |
| **Apex** | celloh.co.kr → www redirect (recommended) |
| **Local dev** | http://localhost:3000 |
| **Code placeholder** | `LAUNCH_SITE_ORIGIN_PLACEHOLDER` in `lib/seo/site.ts` |

⚠️ **DNS not connected.** Do not change registrar records until owner approval.

---

## Vercel project (confirm before deploy)

| Check | Action |
|-------|--------|
| Project linked | Verify repo → Vercel project name |
| Branch | `mobile-ui` → preview; production branch TBD |
| Root directory | `/` (monorepo N/A) |
| Node version | Match `package.json` engines if set |
| Build command | `npm run build` |
| Output | Next.js default |

**Hold:** Production deploy forbidden until legal/PG sign-off.

---

## Environment separation

| Env | `NEXT_PUBLIC_SITE_URL` | Secrets |
|-----|------------------------|---------|
| **Local** | unset → localhost | `.env.local` only |
| **Preview** | Vercel preview URL or staging subdomain | Vercel preview env |
| **Production** | `https://www.celloh.co.kr` | Vercel production env only |

**Never commit:** `.env.local`, Toss keys, Supabase service role.

See [CELLOH_SECRET_ENV_AUDIT.md](./CELLOH_SECRET_ENV_AUDIT.md)

---

## OAuth redirect URLs (pre-config list)

Update in Google Cloud / Kakao Developers **at launch only**:

| Provider | Redirect (production placeholder) |
|----------|-------------------------------------|
| Google | `https://www.celloh.co.kr/auth/callback` |
| Kakao | `https://www.celloh.co.kr/auth/callback` |
| Local | `http://localhost:3000/auth/callback` |

---

## Supabase Site URL

| Setting | Production value |
|---------|------------------|
| Site URL | `https://www.celloh.co.kr` |
| Redirect URLs | Same + preview URLs for staging |
| Email templates | Update links to production origin |

**Hold:** Production DB migration not executed.

---

## Toss Payments callback URLs

| Endpoint | Production URL |
|----------|----------------|
| Success / fail | `https://www.celloh.co.kr/payment/success`, `/payment/fail` |
| Confirm API | `https://www.celloh.co.kr/api/payments/toss/confirm` |
| Webhook | `https://www.celloh.co.kr/api/payments/toss/webhook` |
| Refund API | `https://www.celloh.co.kr/api/payments/toss/refund` |

Register in Toss merchant admin after PG approval.

---

## SEO: robots & sitemap

| File | Route | Notes |
|------|-------|-------|
| `app/robots.ts` | `/robots.txt` | `allow: /`, sitemap via `getSiteOrigin()` |
| `app/sitemap.ts` | `/sitemap.xml` | Home, categories, collections, policies, products |

When live, sitemap URL becomes: `https://www.celloh.co.kr/sitemap.xml`

**Disallow (robots):** `/admin/`, `/checkout/`, `/mypage/`, auth paths

---

## SSL & www

| Item | Plan |
|------|------|
| SSL | Vercel automatic HTTPS |
| www | CNAME `www` → Vercel; apex → redirect or ALIAS |
| HSTS | Enable after stable launch (optional) |
| Canonical | Prefer `www.celloh.co.kr` in metadata |

---

## Rollback

| Layer | Method |
|-------|--------|
| Vercel | Instant rollback to previous deployment |
| Git | Revert commit; redeploy |
| DB | Supabase snapshot restore (post-migration) |
| DNS | Revert TTL-lowering before cutover |

See [CELLOH_BACKUP_RESTORE_RUNBOOK.md](./CELLOH_BACKUP_RESTORE_RUNBOOK.md)

---

## Pre-deploy verification (without deploying)

Run locally before any production push:

```bash
rm -rf .next && npm run lint && npm run build
npm run dev
# Check:
# /manifest.webmanifest
# /robots.txt
# /sitemap.xml
# View page source → og:title, og:description, og:image
```

| Route | Expect |
|-------|--------|
| `/manifest.webmanifest` | name celloh, theme `#2E5E4E`, standalone |
| `/robots.txt` | Allow / + Sitemap line |
| `/sitemap.xml` | Public routes only |

---

## Current hold state

| Item | Status |
|------|--------|
| Vercel production deploy | ❌ ON HOLD |
| DNS change | ❌ ON HOLD |
| `NEXT_PUBLIC_SITE_URL` in repo | ❌ Not set (env at launch) |
| GitHub push | ❌ Not executed in overnight tasks |

**No deployment executed in this task.**
