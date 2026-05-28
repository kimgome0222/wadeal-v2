# External auth / remote setup — deferred to LAST

> Updated: 2026-05-29  
> Machine-readable list: `docs/work-queue.json` → `external_auth_deferred`  
> Resume order: `docs/START.md`

Work that needs **credentials, OAuth, API keys, or remote infrastructure** configured **outside the repo** is deferred until after all repo-local work (build, UI, server actions, migrations as files, in-app notifications).

## Resume order (reboot)

1. **Q-BUILD** — `npm run build` (B001, E001, E002, B006)
2. **Q-DOABLE-BACKLOG** — `backlog_incomplete[]` where `external_auth_deferred` does **not** include the ID; sort **high → medium → low**, then ID
3. **W001~W188** — chat `work_items[]` whose IDs are **not** in `external_auth_deferred.work_item_ids`
4. **Q-EXTERNAL-AUTH-LAST** — everything in `external_auth_deferred` (backlog + W items)

## Why an item is deferred

| Reason | Examples |
|--------|----------|
| `git_remote_auth` | B003, PF001–PF006, E003, W007, W170, W173, W175–177 |
| `vercel_auth` | B004, E004, W013, W014, W026, W029 (deploy/redeploy) |
| `remote_supabase_migration` | B005, N001, E006, MG001–MG046 |
| `payment_provider_keys` | P001–P008, PAY001–PAY046, LP001–LP031, API001–API005 |
| `oauth_provider_setup` | M001, LA011, W009–W029 (Kakao/OAuth/Vercel login) |
| `external_credentials` | M004 (SMS), M010 (identity), D006/D007 (prod env), Sentry DSN if dashboard-only |

## Deferred — infrastructure & git (B, E, PF)

| ID | Title | Blocker |
|----|-------|---------|
| B003 | git push origin main | GitHub HTTPS/SSH or `gh auth login` |
| B004 | npx vercel --prod | `vercel login` / token |
| B005 | Supabase migration 030–045 원격 적용 | partial | 038·044 우선 — SQL Editor 순서는 `docs/DEFERRED_ISSUES.md` |
| E003 | git push 실패 | Same as B003 |
| E004 | npx vercel --prod 보류 | Same as B004 |
| E006 | Supabase migration 원격 미적용 | Same as B005 |
| PF001–PF006 | Push 실패 복구 (W007, W170, W173, W175–177) | Same as B003 |
| N001 | migration 038 원격 적용 | Remote DB |

## Deferred — payments (P, PAY, LP, payment API)

All **P001–P008**, **PAY001–PAY046**, **LP001–LP031**, and payment **API001–API005** — Toss webhook secrets, confirm API, billing keys, live keys, E2E against real PG.

## Deferred — migrations (MG)

All **MG001–MG046** — apply/verify each `supabase/migrations/*.sql` on **remote** Supabase (not just local files).

## Deferred — OAuth / social / identity (M, LA, prod)

| ID | Title |
|----|-------|
| M001 | Mypage 소셜 로그인 UX |
| M004 | Mypage 휴대폰 인증 |
| M010 | identity verification |
| LA011 | lib/auth supabase-oauth |
| D006 | production mock 차단 검증 |
| D007 | DEMO_LOGIN 프로덕션 차단 |
| D009 | PWA/SEO 개선 (if CDN/analytics keys) |

## Deferred — chat work items (W)

**58** of **188** W items need external setup (push, Vercel deploy, Kakao/OAuth). IDs are listed in `work-queue.json` → `external_auth_deferred.work_item_ids` (e.g. W007, W009–W029, W013–W014, W170, W173, W175–177).

## Currently doable (repo / local build)

Implement without third-party dashboard access:

- UI pages, server actions, `lib/data` layers
- In-app notifications (`lib/notifications/*`, existing Supabase client patterns)
- Admin / seller / customer features against schema in migration **files** (even if not applied remotely)
- RLS policy SQL in `supabase/migrations/`
- Build fixes, type fixes
- **N002–N010** notification wiring (in-app)
- **S003** 입점 심사, **S004** 금지상품/카테고리 검수
- **A001–A010** admin order/seller/product UI (code)
- Most **AP/SP/CP/LD/AC/NT/RLS** verification that is code review + local build
- **B001**, **B002** (local build + local commit when user asks), **B006**

### Next high-priority doable backlog (after Q-BUILD)

From `work-queue.json` → `doable_queue_hint.next_high_backlog`:

1. **B001** — build pass  
2. **B002** — stage/commit local changes (user-triggered)  
3. **B006** — duplicate export check  
4. **N002** — new_product_question  
5. **N003** — new_review  
6. **N004** — seller_notice_published  
7. **N005** — product_change_request admin  
8. **N006** — settlement_pending admin  
9. **N007** — prohibited_keyword_detected  
10. **N008** — unread count UI  
11. **N009** — RLS 알림 (SQL in repo; runtime test needs DB)  
12. **N010** — 알림 통합 build  
13. **S001** — seller reviews  
14. **S002** — seller notices  
15. **S003** — 입점 심사 (in progress locally)  
16. **S004** — 금지상품/카테고리 검수 (in progress locally)

## Counts (2026-05-29)

| Bucket | Count |
|--------|------:|
| Backlog deferred | 172 |
| Backlog doable | 332 |
| W items deferred | 58 |
| W items doable | 130 |
