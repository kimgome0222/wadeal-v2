# REBOOT CHECKPOINT

> 2026-05-29 handoff · **188개** 작업 요청 + **504** backlog · 백업: `docs/BACKUP_SNAPSHOT_2026-05-29-handoff.md`

## 재개: `시작`

또는 ChatGPT용: `docs/HANDOFF_CHATGPT.md`

## 정본 파일
- **`docs/work-queue.json`** — W001~W188 + backlog_incomplete
- **`docs/HANDOFF_CHATGPT.md`** — 완료/미완/블로커 전체 요약 (ChatGPT용)
- **`docs/START.md`** — 재개 명령·우선순위
- **`docs/DEFERRED_ISSUES.md`** — 미해결·SQL·pre-launch audit
- **`docs/BACKUP_SNAPSHOT_2026-05-29-handoff.md`** — 최신 백업 스냅샷
- **`docs/COMMIT_PUSH_QUEUE.md`** — push 실패 (6건)
- **`docs/EXTERNAL_AUTH_DEFERRED.md`** — 외부 인증 지연

## 추적 합계
- work_items: **188**
- backlog_incomplete: **504**
- **합계: 692**

## Git (2026-05-29 handoff)
- **태그:** `backup-2026-05-29-handoff`
- **main**, origin/main 대비 **unpushed commits**
- push ❌ HTTPS 인증 (`B003`)
- build ✅ (`npm run build`)

## Supabase
- **030–045 applied** (038·044 사용자 확인)
- **046** 선택 적용
- probe: `node scripts/probe-migrations.mjs`

## 로컬 백업
- `~/Documents/wadeal-backups/wadeal-v2-2026-05-29-handoff.tar.gz`
- `~/Documents/wadeal-backups/wadeal-v2-handoff-download.zip`

## 우선순위
1. Q-DOABLE-BACKLOG (N002~, S001~)
2. W001~188 (로컬 가능)
3. Git push (SSH/PAT) → Vercel
4. Toss/Kakao live (마지막)
