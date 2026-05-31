# CELLOH Overnight Work Rule

**Date:** 2026-05-31  
**Branch:** `mobile-ui`  
**Status:** Agent/session workflow — **canonical overnight process**

**Related:** [CELLOH_MORNING_HANDOFF.md](./CELLOH_MORNING_HANDOFF.md), [CELLOH_QA_AUTOMATION_GUIDE.md](./CELLOH_QA_AUTOMATION_GUIDE.md), [README_CELLOH.md](./README_CELLOH.md)

**Project:** `/Users/kimgana/Documents/wadeal-v2`

---

## Goal

밤샘 작업 중 **문서**와 **코드/화면 수정**을 섞지 않는다.

- 문서 → 큐 **뒤쪽**, `docs/` 폴더만
- 기능/화면/오류 → **원래 파일 위치**, 최소 수정
- 각 작업 후 **lint/build** → PASS 후 보고·로컬 커밋

---

## Hard constraints (never)

| Forbidden |
|-----------|
| KIBI access |
| GitHub push |
| Vercel deploy |
| Supabase DB / SQL / RLS changes |
| Toss / OAuth live integration |
| Real payment / coupon / point / referral payout |
| env / secret changes |
| Large refactors |
| Commit before lint/build PASS |

---

## Work order

1. **Feature / screen / bug fixes first**
2. route / link / 404 / click issues
3. UI layout / button breakage
4. **Docs last** (queue tail) — policy, ops, checklists, guides
5. Final full lint/build
6. Report
7. Local commit
8. Stop dev servers

**Do not** insert doc tasks in the middle of code fixes.

---

## Doc storage rules

### Allowed

- `docs/*.md`
- `docs/CELLOH_*.md`
- `docs/README_CELLOH.md`

Examples: policy, privacy, seller/admin guides, QA checklists, launch checklists, backup runbooks, marketing drafts, next-session prompts.

### Forbidden

- Docs in `app/`, `components/`, `lib/`
- Internal docs outside `docs/`

### After doc work

- Link from `docs/README_CELLOH.md`
- Legal/privacy/payment docs: mark **초안**, **placeholder**, **정식 오픈 전 검토 필요**

---

## Code / screen fix locations

Fix in **existing** files — no duplicates, no temp files.

| Area | Paths |
|------|-------|
| Home | `app/page.tsx`, `components/home/*`, `lib/home/*` |
| Quick Menu | `lib/home/quick-menu-items.ts`, `components/home/home-quick-menu.tsx` |
| Product card | `components/deal-card*.tsx`, `components/cart/cart-quantity-control.tsx` |
| Category / PLP | `app/category/[slug]`, `components/plp/*`, `lib/categories/*` |
| PDP | `app/product/[id]`, `components/product/*` |
| Cart | `app/join-cart/*`, `components/cart/*`, `lib/cart/*` |
| Collections | `app/collections/[slug]`, `lib/home/collection-data.ts` |
| Seller | `app/sellers/[id]`, `components/seller/*` |
| Policy pages | `app/policies/*` (body source in `docs/` or `lib/policies/`) |

---

## Pre-work backup

```bash
cd /Users/kimgana/Documents/wadeal-v2
git branch --show-current
git log -1 --oneline
git status --short
mkdir -p backups
git diff > backups/celloh-before-work-$(date +%Y%m%d-%H%M).patch
git status --short > backups/celloh-before-work-status-$(date +%Y%m%d-%H%M).txt
```

---

## Error check (after each major task)

```bash
rm -rf .next
npm run lint    # tsc --noEmit → PASS required
npm run build   # Next.js → PASS required
```

On failure:

1. Fix **first error** only
2. Re-run lint/build
3. **No commit** until PASS

Cache suspicion → `rm -rf .next` then re-run.

---

## Route / link / 404 check

```bash
grep -RIn 'href="#"|href=""|href={undefined}|href={null}|router.push("")|router.push('\''#'\'')' app components lib || true
```

| Rule | |
|------|--|
| `href="#"` | forbidden |
| empty / undefined href | forbidden |
| 404 routes | forbidden |
| clickable UI with no action | forbidden |

### Key routes (smoke)

`/`, `/category/food`, `/category/living`, `/product/1`, `/join-cart`, `/collections/ranking`, `/collections/celloh-coupon`, `/collections/popular-sellers`, `/invite`, `/membership`, `/support`, `/policies/privacy`, `/sellers/moon-fruit`, `/seller/dashboard`, `/admin/dashboard`

---

## Doc queue processing

1. Create/edit in `docs/`
2. Update `docs/README_CELLOH.md`
3. lint/build
4. Commit if PASS

Do **not** touch app/components for doc-only tasks.

---

## Report files

| File | Use |
|------|-----|
| `CELLOH_OVERNIGHT_QA_REPORT.md` | QA runs |
| `CELLOH_MORNING_HANDOFF.md` | Morning status |
| `CELLOH_FINAL_LOCAL_STATUS.md` | Local snapshot |

Report must include: start commit, files changed, work done, errors fixed, remaining issues, routes tested, lint/build, new commit hash, push/deploy/DB = **not done**.

---

## Commit messages

| Type | Example |
|------|---------|
| Fix | `fix: stabilize celloh overnight ux issues` |
| Docs | `docs: add celloh overnight operations guides` |
| Closeout | `docs: finalize celloh overnight handoff` |

After commit: `git log -1 --oneline`, `git status --short`. **No push.**

---

## Final closeout

```bash
git branch --show-current
git log -10 --oneline
git status --short
rm -rf .next && npm run lint && npm run build
mkdir -p backups
git diff > backups/celloh-final-overnight-$(date +%Y%m%d-%H%M).patch
git status --short > backups/celloh-final-overnight-status-$(date +%Y%m%d-%H%M).txt
# Update docs/CELLOH_MORNING_HANDOFF.md
git add . && git commit -m "docs: finalize celloh overnight handoff"  # if changes
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
lsof -ti:3002 | xargs kill -9 2>/dev/null || true
```

---

## Final report template (14 items)

1. 시작 커밋  
2. 최종 커밋  
3. 수정/생성 파일  
4. 기능/화면 수정 결과  
5. 문서 작업 결과  
6. route/link/404 검사 결과  
7. 클릭 문제 검사 결과  
8. lint 결과  
9. build 결과  
10. 남은 이슈  
11. git status  
12. push 여부: 안 함  
13. DB 변경 여부: 안 함  
14. 배포 여부: 안 함  

---

**This document is the canonical overnight workflow. Follow it for all future CELLOH overnight sessions.**
