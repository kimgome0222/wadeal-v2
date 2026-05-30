# CELLOH Secret & Environment Audit

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Rule:** No secret values printed in this document.

---

## Summary

| Check | Result |
|-------|--------|
| Hardcoded API keys in `app/`, `components/`, `lib/` | ✅ None found |
| `.env.local` in git | ✅ Gitignored (not tracked) |
| Docs with literal secret fragments | ⚠️ 1 fixed (see below) |
| Env var **names** in code/docs | ✅ Expected (placeholders only in examples) |

---

## Scan method

Pattern search (excluded `node_modules`, `.next`, `.git`):

```
ghp_ | sk- | SUPABASE_SERVICE_ROLE | service_role | CLIENT_SECRET | PRIVATE_KEY | ACCESS_TOKEN | PASSWORD
```

**Application code:** References `process.env.*` only — no embedded tokens.

**Server-only env reads (expected):**

| Variable | File | Client exposure |
|----------|------|-----------------|
| `SUPABASE_SERVICE_ROLE_KEY` | `lib/supabase/service-role.ts` | ❌ Server only |
| `TOSS_SECRET_KEY` | Payment routes (docs reference) | ❌ Server only |
| `KAKAO_*` | Supabase-managed OAuth (not in app env per docs) | ❌ |

---

## Findings & fixes

| Location | Issue | Action |
|----------|-------|--------|
| `docs/WORK_QUEUE_MASTER.md` | Partial `KAKAO_CLIENT_SECRET` literal in work queue note | ✅ Replaced with `<REDACTED>` |
| `.env.local` (local only) | Contains real keys for dev | ✅ In `.gitignore` — **never commit** |
| `docs/work-queue-prompts/part-06.md` | Mentions `TOSS_SECRET_KEY` as name only | ✅ OK (no value) |
| `.env.local.example` | Commented placeholders | ✅ OK |

**No fixes required in application source** for hardcoded secrets.

---

## GitHub push precautions

Before push:

1. Run `git diff` — ensure `.env.local` / `.env` not staged
2. Run secret scan: `git secrets --scan` or GitHub push protection
3. If push blocked for detected secret in **history**:
   - Rotate the exposed key immediately (Supabase dashboard, Kakao dev console, etc.)
   - Use `git filter-repo` or BFG to remove from history, **or** GitHub “unblock secret” after rotation
   - This audit did **not** rewrite git history

---

## Env file policy

| File | Commit? | Content |
|------|---------|---------|
| `.env.local` | ❌ Never | Real dev keys |
| `.env.local.example` | ✅ | Placeholder comments only |
| Vercel / Cloud env | ❌ Not in repo | Set in dashboard |

**Never document actual env values** in markdown, commits, or chat logs.

---

## Client-safe public env

Only `NEXT_PUBLIC_*` may reach the browser:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Never** prefix service role, Toss secret, or Kakao REST keys with `NEXT_PUBLIC_`.

---

## OAuth / callback secrets

- Kakao/Google secrets live in **Supabase Auth provider settings**, not in Wadeal `.env` (see `docs/kakao-auth-reconnect.md`).
- Callback route: `/auth/callback` — no secrets in URL params stored in logs for production.

---

## If a secret was leaked

1. Revoke/rotate in provider console immediately  
2. Update local `.env.local` and deployment env  
3. Audit git history for the string  
4. Consider GitHub secret scanning alert resolution  

---

## Related docs

- `docs/ENVIRONMENT_VARIABLES.md`
- `docs/PRE_DEPLOY_CHECKLIST.md`
- `docs/CELLOH_AUTH_ROLE_CHECKLIST.md`

---

## lint / build (2026-05-29)

```
npm run lint  → PASS
npm run build → PASS
```
