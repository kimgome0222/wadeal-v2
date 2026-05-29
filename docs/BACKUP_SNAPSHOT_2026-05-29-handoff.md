# Wadeal 백업 스냅샷 (2026-05-29 handoff)

> **생성:** 2026-05-29 · ChatGPT 핸드오프 + 전체 저장  
> **태그:** `backup-2026-05-29-handoff`  
> **tarball:** `~/Documents/wadeal-backups/wadeal-v2-2026-05-29-handoff.tar.gz`  
> **다운로드 번들:** `~/Documents/wadeal-backups/wadeal-v2-handoff-download.zip`

## 재개

```
시작 — docs/START.md 우선순위대로. 각 작업 끝 npm run build. push/vercel/원격 DB는 마지막.
```

정본: `docs/work-queue.json`, `docs/HANDOFF_CHATGPT.md`, `docs/START.md`

---

## 이번 저장에 포함된 변경

### 카탈로그 / UX
- `app/categories/page.tsx` — 전체 카테고리 보기
- `components/categories-all-view.tsx`
- `components/deal-card-skeleton.tsx`, `deal-catalog-sort-bar.tsx`
- category/search loading skeleton 개선
- `components/deal-card.tsx` — lazy image
- `lib/categories/catalog.ts` — catalog helpers 확장
- `docs/COUPANG_UX_ROADMAP.md` — 진행 상태 갱신

### 문서
- `docs/HANDOFF_CHATGPT.md` — ChatGPT 재개용 전체 현황
- `docs/BACKUP_SNAPSHOT_2026-05-29-handoff.md` (본 파일)
- `docs/REBOOT_CHECKPOINT.md` 갱신

---

## Build

| 명령 | 결과 |
|------|------|
| `NODE_OPTIONS='--max-old-space-size=6144' npm run build` | **PASS** |

---

## Git / Deploy

- push: ❌ B003 HTTPS auth
- Vercel prod: ❌ B004 (push 후)

```bash
git push origin main
npx vercel --prod
```

---

## 복구

```bash
git checkout backup-2026-05-29-handoff
# 또는
tar -xzf ~/Documents/wadeal-backups/wadeal-v2-2026-05-29-handoff.tar.gz -C ~/Documents/
cd ~/Documents/wadeal-v2 && npm install && npm run dev
```
