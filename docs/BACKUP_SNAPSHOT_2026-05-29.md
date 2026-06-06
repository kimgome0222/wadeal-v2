# Wadeal 백업 스냅샷 (2026-05-29 / backup-2026-05-30)

> **HEAD:** `c0ade86` (backup tag `backup-2026-05-30`)  
> **브랜치:** `main` (origin/main 대비 **27 commits ahead**)  
> **원격:** `origin` → https://github.com/kimgome0222/wadeal-v2.git  
> **로컬 태그:** `backup-2026-05-30`  
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
- `app/page.tsx` — HomeCatalog + 5개 섹션 (마감임박·인기·**리뷰 좋은 딜**·최근참여·신규)
- `lib/deals.ts` — `getReviewedDeals` 추가
- `components/home-catalog.tsx`, `deal-section.tsx` — empty guard·섹션 렌더

### 알림 / 판매자
- `lib/notifications/unified.ts`, `create.ts`, `lib/data/notifications.ts` — RPC/컬럼 폴백, mock success 제거
- `app/actions/seller-finance.ts` — mock paid 결제 제거
- `lib/data/seller-billings.ts`, `seller-billings-content.tsx` — missing table fallback

### 가격 알림
- `components/alert-form.tsx`, `/mypage/alerts` — 카카오톡 발송 "준비 중" 명시 (DB 저장만)

### 문서
- `docs/COMMERCIAL_READINESS.md` — 030–045 applied (038·044 포함)
- `docs/QA_REPORT_2026-05-29.md` — 10-section QA report
- `docs/DEFERRED_ISSUES.md` — post-DB audit·B005 applied

### 기타
- `app/global-error.tsx` — standalone HTML fallback

---

## Build 상태 (2026-05-29 final)

| 명령 | 결과 |
|------|------|
| `NODE_OPTIONS='--max-old-space-size=6144' npm run build` | **PASS** (Turbopack) |
| `NODE_OPTIONS='--max-old-space-size=6144' npx next build --webpack` | **PASS** (webpack) |
| `npx tsc --noEmit` | **PASS** |

---

## Supabase SQL (사용자 확인)

**030–045 전체 applied** (038 notifications unified, 044 storage buckets 포함).

로컬 probe: `node scripts/probe-migrations.mjs` (env 값 출력 없음). anon probe는 038 컬럼·044 bucket false 가능 — Dashboard 교차 확인.

---

## 사용자가 직접 해야 할 것 (외부)

1. **Git push** — SSH 또는 `gh auth login` 후 `git push origin main` (B003)
2. **Vercel** — push 후 `npx vercel --prod` (B004)
3. **Toss/Kakao live** — `docs/EXTERNAL_AUTH_DEFERRED.md`
4. **Storage E2E** — seller-documents / settlement-files 업로드 수동 QA

---

## 복구 명령

```bash
# 이 시점으로 되돌리기
git checkout backup-2026-05-30
# 또는
git checkout backup/session-2026-05-29

# migration probe (env 값 출력 없음)
node scripts/probe-migrations.mjs
```

## 로컬 아카이브

- **경로:** `backups/wadeal-v2-2026-05-29.tar.gz` (~797KB, node_modules/.next 제외)
- **복원:** `tar -xzf backups/wadeal-v2-2026-05-29.tar.gz -C /path/to/restore`

## Deploy (push 성공 후)

```bash
npx vercel --prod
```
