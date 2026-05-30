# CELLOH Next Session Prompt

Copy everything below the line into a new Cursor chat to continue work.

---

```
CELLOH 이어서 작업.

프로젝트: /Users/kimgana/Documents/wadeal-v2
브랜치: mobile-ui

GitHub push는 아직 하지 않음.
DB 변경 / 배포 / 실제 결제 연결 / Supabase SQL·RLS 변경 / KIBI 접근 금지.

Cursor가 밤샘 작업을 했으므로, 코드 수정 전에 보고서·매뉴얼 먼저 확인:
- docs/CELLOH_PRE_LAUNCH_MANUAL.md (통합 매뉴얼)
- docs/CELLOH_FINAL_LOCAL_STATUS.md (로컬 상태)
- docs/CELLOH_HOLD_ITEMS_BEFORE_LAUNCH.md (보류 목록)
- docs/CELLOH_MORNING_HANDOFF.md (핸드오프)

먼저 lint/build 확인 (커밋·수정 전):
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
- docs/README_CELLOH.md (문서 인덱스)
- docs/CELLOH_QA_AUTOMATION_GUIDE.md

남은 P0/P1부터 수정. CSS/layout/mock 중심. lint/build PASS 후 로컬 커밋만 (push 금지).

문서-only 작업은 큐 맨 뒤 — 코드/UX 먼저. 기존 docs 갱신만, 대량 신규 생성 금지.
```

---

## Context snapshot (2026-05-31)

| Item | Value |
|------|-------|
| Branch | `mobile-ui` |
| Latest commit | `f6b7f9f` → run `git log -1 --oneline` for current |
| Pre-launch manual | `docs/CELLOH_PRE_LAUNCH_MANUAL.md` |
| Hold items | `docs/CELLOH_HOLD_ITEMS_BEFORE_LAUNCH.md` |
| lint/build | Re-run before any new work |
| Push | Not executed |
| DB | Not changed |
| Deploy | Not executed |
