# CELLOH Backup & Restore Runbook

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Scope:** Local + git workflow — **no DB changes in this task**

---

## Before risky work

1. Note current commit: `git log -1 --oneline`
2. Save patch: `git diff > backups/name-$(date +%Y%m%d-%H%M).patch`
3. Save status: `git status --short > backups/name-status-$(date +%Y%m%d-%H%M).txt`

---

## Local patch backup

```bash
cd /Users/kimgana/Documents/wadeal-v2
mkdir -p backups
git diff > backups/celloh-before-$(date +%Y%m%d-%H%M).patch
git diff --staged >> backups/celloh-before-$(date +%Y%m%d-%H%M).patch
```

Restore from patch (review first):

```bash
git apply --check backups/celloh-before-YYYYMMDD-HHMM.patch
git apply backups/celloh-before-YYYYMMDD-HHMM.patch
```

---

## Full directory tar backup

```bash
cd /Users/kimgana/Documents
tar --exclude='wadeal-v2/node_modules' \
    --exclude='wadeal-v2/.next' \
    -czvf "backups/wadeal-v2-$(date +%Y%m%d).tar.gz" wadeal-v2
```

Restore: extract tarball to a new folder — do not overwrite without backup.

---

## Git checkpoint

```bash
git status --short
git add .
git commit -m "checkpoint: describe work"
git log --oneline -10
```

View changes since commit:

```bash
git diff HEAD~1 --stat
git show HEAD --stat
```

---

## Restore specific file from commit

```bash
git log --oneline -10
git checkout <commit-hash> -- path/to/file.tsx
```

Discard unstaged changes in one file:

```bash
git restore path/to/file.tsx
```

Discard all unstaged changes:

```bash
git restore .
```

---

## ⚠️ Dangerous commands (backup first)

| Command | Risk |
|---------|------|
| `git reset --hard HEAD` | **Destroys** uncommitted work |
| `git reset --hard <commit>` | Moves branch, loses commits after target |
| `git clean -fd` | Deletes untracked files |
| `git push --force` | Rewrites remote history |

Only use after patch/tar backup and team approval.

---

## Build recovery

```bash
rm -rf .next
npm run lint
npm run build
```

---

## node_modules recovery

```bash
rm -rf node_modules
npm install
rm -rf .next
npm run build
```

---

## Working without DB changes

- Use mock data in `lib/*`, local state, docs
- Do not run Supabase migrations in overnight tasks unless explicitly approved
- Test with `isSupabaseConfigured()` false paths (mock fallbacks)
- Admin coupons/promotions show mock when DB empty

---

## Pre-Vercel deploy backup

- [ ] Git commit pushed to branch (when allowed)
- [ ] Vercel env vars documented (`docs/CELLOH_SECRET_ENV_AUDIT.md`)
- [ ] Rollback commit hash noted
- [ ] Supabase snapshot (production — ops team)

---

## Supabase change principle (future)

1. Snapshot / backup in Supabase dashboard  
2. Test migration on staging  
3. Review RLS with `docs/CELLOH_AUTH_ROLE_CHECKLIST.md`  
4. Deploy app + migration together  
5. Monitor `/admin/error-logs`

**Current overnight constraint:** DB/RLS changes forbidden.

---

## Related

- `docs/CELLOH_QA_AUTOMATION_GUIDE.md`
- `docs/CELLOH_RELEASE_CHECKLIST.md`
- `backups/` directory (local patches)
