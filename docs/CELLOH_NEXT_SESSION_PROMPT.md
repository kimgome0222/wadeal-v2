# CELLOH Next Session Prompt

Copy everything below the line into a new Cursor chat to continue work.

---

```
CELLOH 이어서 작업.

프로젝트: /Users/kimgana/Documents/wadeal-v2
브랜치: mobile-ui

GitHub push는 아직 하지 않음.
DB 변경 / 배포 / 실제 결제 연결 / Supabase SQL·RLS 변경 / KIBI 접근 금지.

먼저 확인:
1. git branch --show-current
2. git log -5 --oneline
3. git status --short
4. rm -rf .next && npm run lint && npm run build

그다음 dev server + smoke:
- npm run dev
- npm run smoke:check

눈검수 순서 (P1 우선):
- / 
- /category/food
- /product/1
- /join-cart
- /collections/ranking
- /invite
- /membership
- /admin/dashboard (login gate)

참고 문서:
- docs/CELLOH_PRIORITY_BACKLOG.md (P0/P1/P2/P3)
- docs/CELLOH_MORNING_HANDOFF.md
- docs/CELLOH_QA_AUTOMATION_GUIDE.md

남은 P0/P1부터 수정. CSS/layout/mock 중심. lint/build PASS 후 로컬 커밋만 (push 금지).
```

---

## Context snapshot (2026-05-29)

| Item | Value |
|------|-------|
| Branch | `mobile-ui` |
| Latest commit | `9c981e5` — business ops docs |
| Overnight | 14 tasks complete (QA → closeout) |
| lint/build | PASS at last closeout |
| Push | Not executed |
