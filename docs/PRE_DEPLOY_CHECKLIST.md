# Wadeal Pre-Deploy Checklist

## Repository and location

- Actual Cloud workspace path: `/workspace`
- Requested local path `~/Documents/wadeal-v2`: not present in this Linux Cloud environment
- Current repository: Wadeal only; no KIBI/other project files detected in the app/lib/docs scope
- Current branch: `cursor/wadeal-commerce-discovery-e402`
- Base branch checked against: `origin/main`
- Ahead of `origin/main`: 10 commits at time of check

## Git readiness

- `git status -sb`: clean before this checklist update
- Latest checked commit before this update: `4ef2ca6 Add opening QA report and risk audit`
- Uncommitted runtime artifacts: none detected before docs update
- Forbidden tracked files: none detected for `.next`, `node_modules`, `.vercel`, `.env*.local`, `*.tar.gz`, `backups/**`

## Large file readiness

- No `backups/*.tar.gz` found inside the project
- No `*.tar.gz` found inside the project
- Largest tracked file observed: `package-lock.json` at about 70KB
- Vercel 100MB single-file risk: not detected
- `.gitignore` now includes `.vercel/`, `backups/`, and `*.tar.gz`

## Build readiness

- `npm run build`: PASS
- Build mode: Next.js 16.2.6 Turbopack
- Generated app routes: 74
- Webpack fallback: not required because Turbopack build passed

## Environment variables required before production deploy

### Supabase

- `NEXT_PUBLIC_SUPABASE_URL`: missing in current Cloud env
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: missing in current Cloud env
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: missing in current Cloud env
- `SUPABASE_SERVICE_ROLE_KEY`: missing in current Cloud env

### Toss Payments

- `NEXT_PUBLIC_TOSS_CLIENT_KEY`: missing in current Cloud env
- `TOSS_SECRET_KEY`: missing in current Cloud env
- `TOSS_WEBHOOK_SECRET`: missing in current Cloud env

### Kakao

- `NEXT_PUBLIC_KAKAO_CLIENT_ID`: missing in current Cloud env
- `KAKAO_CLIENT_SECRET`: missing in current Cloud env
- `KAKAO_REST_API_KEY`: missing in current Cloud env
- `KAKAO_REDIRECT_URI`: missing in current Cloud env

### App URL

- `NEXT_PUBLIC_SITE_URL`: missing in current Cloud env

## Supabase checklist

- Migration files/folder not present in this repository
- Migration 030-045 application status cannot be verified from this checkout
- RLS policies are not verified
- Storage buckets/policies are not verified
- Service role key is missing in current Cloud env, so admin DB functions must remain fallback-only

## External integration checklist

- Toss live payment: deferred until live/test keys and confirm API are verified
- Toss live refund: deferred until cancel API and secret key are verified
- Toss webhook HMAC: deferred until webhook secret and event signature format are verified
- Kakao production OAuth: deferred until production app/callbacks/env are configured
- Kakao notification sending: deferred until Kakao messaging channel/API is configured
- GitHub push auth: already worked for branch pushes in Cloud, but production release push/merge is pending user approval
- Vercel production deploy: do not run until user says `진짜 배포해`

## Final gate before deploy

Do not deploy until all of these are true:

1. Vercel production env is populated and verified.
2. Supabase migrations/RLS/storage are applied and tested.
3. Toss payment/cancel/webhook E2E passes in test mode.
4. Kakao production OAuth is configured if login is in launch scope.
5. Route-level auth middleware replaces mock/fallback access checks.
6. A final `npm run build` passes from a clean working tree.
