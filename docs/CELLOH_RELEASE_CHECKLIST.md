# CELLOH Release Checklist

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Scope:** Pre-release gate — **deploy not executed in overnight tasks**

Complements `docs/CELLOH_LAUNCH_CHECKLIST.md` (business/legal) with **technical release gate**.

---

## Pre-release (required)

### Git & build

- [ ] `git status` clean (or intentional staged only)
- [ ] `rm -rf .next && npm run lint` — **PASS**
- [ ] `npm run build` — **PASS**
- [ ] Rollback commit hash recorded: `git log -1 --oneline`

### Smoke

- [ ] `npm run dev` running
- [ ] `npm run qa:routes` — **PASS**
- [ ] `npm run smoke:content` — **PASS**
- [ ] Manual: product +/stepper, join-cart, error boundary links

### Environment & secrets

- [ ] No `.env.local` in git
- [ ] `docs/CELLOH_SECRET_ENV_AUDIT.md` reviewed
- [ ] Production env on Vercel only (not committed)
- [ ] GitHub secret scanning alerts resolved
- [ ] Mock vs real payment keys verified (`TOSS_*`)

### Access & policies

- [ ] `/policies/privacy`, `/policies/terms`, `/policies/refund` reachable
- [ ] Admin gate: `/admin/*` without role → login/deny
- [ ] Seller gate: pending/rejected states
- [ ] OAuth redirect URLs for production domain

### Infrastructure

- [ ] Supabase production project + env vars confirmed (ops)
- [ ] Vercel project + domain `www.celloh.co.kr` (ops)
- [ ] DB migrations reviewed if any ( **overnight tasks: none** )

---

## Release blockers (do NOT deploy)

| Blocker | Reason |
|---------|--------|
| Build or lint failure | Broken production bundle |
| Secret in git diff | Security incident |
| DB migration unreviewed | Data loss risk |
| Live PG keys unverified | Payment failure / compliance |
| Privacy policy not finalized | Legal |
| Refund/shipping policy not finalized | Commerce law |
| Admin access control untested | Privilege escalation |
| Unresolved critical error logs | Active incident |

---

## Release command sequence (ops)

```bash
# Local verification (developer)
rm -rf .next
npm run lint
npm run build
npm run qa:routes      # with preview URL when available
npm run smoke:content

# After approval (ops — not in overnight tasks)
# git push origin mobile-ui
# Vercel promote preview → production
# Post-deploy smoke on production URL
```

---

## Rollback

1. Vercel: instant rollback to previous deployment  
2. Git: deploy previous commit hash  
3. DB: restore snapshot if migration ran (ops only)  
4. Customer notice if user-facing (see `CELLOH_OPERATIONS_RUNBOOK.md`)

---

## Related

- `docs/CELLOH_LAUNCH_CHECKLIST.md`
- `docs/CELLOH_QA_AUTOMATION_GUIDE.md`
- `docs/CELLOH_BACKUP_RESTORE_RUNBOOK.md`
- `docs/CELLOH_SMOKE_TEST_PLAN.md`
