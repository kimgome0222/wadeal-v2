# Wadeal 백업 스냅샷 (2026-05-29)

> **HEAD:** `721e17e` (백업 커밋 포함)  
> **브랜치:** `main` (origin/main 대비 **23 commits ahead**)  
> **원격:** `origin` → https://github.com/kimgome0222/wadeal-v2.git  
> **로컬 태그:** `backup-2026-05-29`  
> **로컬 백업 브랜치:** `backup/session-2026-05-29`

## 재개 방법

채팅에 `시작` 또는:

```
시작 — docs/START.md 우선순위대로. 각 작업 끝 npm run build. push/vercel/원격 DB는 마지막.
```

정본: `docs/work-queue.json`, `docs/START.md`, `docs/DEFERRED_ISSUES.md`

---

## 이번 세션 완료 작업 요약

### 홈 / UI
- `app/page.tsx` — HomeCatalog + Supabase deals, 섹션(마감임박·인기·최근참여·신규)
- `components/home-catalog.tsx` — `mainDeals` prop
- `components/deal-card.tsx`, `deal-card-featured.tsx` — DealCardMeta, urgency 문구
- `lib/deals/card-display.ts`, `lib/deals.ts` — `getRecentJoinedDeals`
- `components/wadeal-logo.tsx` — Wadeal 브랜딩 통일

### 환불 / 주문
- `lib/data/refunds.ts`, `lib/data/order-claims.ts`, `lib/data/order-timelines.ts`
- `app/admin/refunds/`, `components/admin-refunds-content.tsx`, `app/actions/admin-refunds.ts`
- `app/api/payments/toss/refund/route.ts` — admin-only, env guard, Toss deferred
- `supabase/migrations/045_refunds_cancel_flow.sql`
- mock-success 제거 — DB 없으면 실패 반환 + 사용자 안내

### 인증 / 권한 (pre-launch)
- `middleware.ts` — `/login?redirect=&next=` 보호 경로
- `lib/auth/access.ts` — requireAdmin → login redirect
- seller apply 로그인 필수 (`app/seller/apply/page.tsx`)
- `app/admin/page.tsx` — `/admin/dashboard` redirect

### 결제
- Toss env 없을 때 결제 버튼 비활성 + 503 JSON
- payment confirm → order_timelines `paid`/`created`
- 중복 주문 방지, 결제 후 주문 없을 때 crash 방지

### Supabase 방어
- `lib/supabase/query-fallback.ts` — missing table/column
- orders, sellers, refunds, notifications, business-settings, support-tickets, review-reports 등 fallback
- `lib/supabase/config.ts` — ANON_KEY alias

### Migration 점검
- `lib/admin/migration-status.ts`
- `app/admin/settings/migrations/page.tsx`
- `scripts/probe-migrations.mjs`
- **038 partial** — `038_notifications_unified.sql` SQL Editor 실행 필요
- **044 unknown** — Storage bucket Dashboard 확인

### 문서
- `docs/DEFERRED_ISSUES.md` — 미해결·SQL 순서·pre-launch audit
- `docs/EXTERNAL_AUTH_DEFERRED.md` — 외부 인증 지연 항목
- `docs/START.md`, `docs/work-queue.json`

---

## Build 상태 (2026-05-29)

| 명령 | 결과 |
|------|------|
| `NODE_OPTIONS='--max-old-space-size=6144' npm run build` | **PASS** |
| `npx next build --webpack` | **PASS** |

---

## 미푸시 커밋 (22개, origin/main..HEAD)

```
e9c5a94 Gracefully fallback when notification role columns are missing.
2ce8de2 Document git push auth failure and fix deferred table row.
37a0845 Add admin migration status checker and document SQL apply order.
66ac893 Stabilize Wadeal buyer seller admin flows
27a79a4 Restore header after logo edit
17344b6 Fix seller review build type issue
d7ef75e Add seller notices, policies, resources, and admin publish flow.
492aa78 Add seller review list, detail, and reply CRUD.
4b00def Wire remaining seller and admin notifications end-to-end.
5578954 Fix build blockers and save reboot work queue checkpoint.
… (이하 5675540 Wadeal prototype UI까지)
```

---

## 사용자가 직접 해야 할 것 (외부)

1. **Supabase SQL Editor** — `038_notifications_unified.sql` 실행 (최우선)
2. **Storage** — `044_storage_seller_settlement_buckets.sql` 확인/실행
3. **Git push** — SSH 또는 `gh auth login` 후 `git push origin main`
4. **Vercel** — push 후 `npx vercel --prod`
5. **Toss/Kakao live** — `docs/EXTERNAL_AUTH_DEFERRED.md`

---

## 복구 명령

```bash
# 이 시점으로 되돌리기
git checkout backup/session-2026-05-29
# 또는
git checkout backup-2026-05-29

# migration probe (env 값 출력 없음)
node scripts/probe-migrations.mjs
```

## 로컬 아카이브 (GitHub push 전)

- **경로:** `backups/wadeal-v2-2026-05-29.tar.gz` (~797KB, node_modules/.next 제외)
- **복원:** `tar -xzf backups/wadeal-v2-2026-05-29.tar.gz -C /path/to/restore`
