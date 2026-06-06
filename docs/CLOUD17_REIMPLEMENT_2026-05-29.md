# Cloud 17 Selective Reimplementation — 2026-05-29

> Wadeal v2 only · local Supabase base · push/Vercel/remote DB not applied

## Scope

Cloud Agent `/workspace` ahead-17 commits were never pushed to GitHub. This session reimplemented the missing UX on the local Supabase codebase (not Cloud mock routes).

## Completed in this pass

### Auth & account (Phase 1, prior + verified)
- `/signup`, username login, `/forgot-username`, `/forgot-password`, `/reset-password`
- `/mypage/security`, `/mypage/withdrawal`, profile withdrawal link
- `supabase/migrations/047_profile_usernames.sql`

### Checkout identity guard (Cloud Auth Phase 2)
- `lib/auth/identity-guards.ts` — phone verification required for checkout/seller apply
- `app/actions/data.ts` — `phone_not_verified` on order submit
- Checkout UI blocks submit + guidance when unverified
- Env override: `REQUIRE_PHONE_VERIFICATION_FOR_CHECKOUT=false`

### Search modal / autocomplete
- `components/search/search-panel.tsx`, `components/search/search-box.tsx`
- Header focus opens full-screen search panel (recent / popular / suggestions)
- `app/actions/search.ts`, `getSearchSuggestions`, `getFeaturedSearchTerms`
- `supabase/migrations/048_featured_search_terms.sql`

### Viral / invite
- `/mypage/invite` — referral code + stats + copy link
- `/admin/viral` — share/referral visit summary

### Admin search
- `/admin/search` — featured keywords + popular term stats

### Terms
- `/marketing-terms` — marketing consent policy page

## Still deferred
- Supabase Auth E2E (Google/Kakao provider + env)
- NICE/PASS/다날 real identity provider
- Checkout/order-complete Coupang-style summary UI
- Payment method 7-type UI polish (local Toss stack already exists)
- Phase 3~4 from `docs/CHATGPT_TASK_QUEUE_2026-05-29.md` (안정화·3모드 QA)

## ChatGPT sources
- [Wadeal 프로젝트 상태 점검](https://chatgpt.com/share/6a198463-5f68-83a8-8649-80f175a29fd1)
- [와딜 프로젝트 진행](https://chatgpt.com/share/6a198564-0fc8-83a3-af7c-2c218cd370fd)
- 통합 큐: `docs/CHATGPT_TASK_QUEUE_2026-05-29.md`

## Verify
```bash
cd ~/Documents/wadeal-v2 && npm run build
```

## Migrations (files only)
- `047_profile_usernames.sql`
- `048_featured_search_terms.sql`
