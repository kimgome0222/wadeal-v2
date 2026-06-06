# Wadeal v2 — 재부팅 전 저장 스냅샷 (2026-05-29)

> **프로젝트:** Wadeal v2 only · KIBI와 분리  
> **경로:** `~/Documents/wadeal-v2`  
> **저장 시각:** 2026-05-29 (재부팅/Cursor 재시작 전)

## Git 상태

| 항목 | 값 |
|------|-----|
| 브랜치 | `main` |
| HEAD | `c4e067a` — Update reboot checkpoint after cloud-local merge completion |
| origin/main | **38 commits ahead** (push 미완) |
| working tree | clean |
| build | **PASS** (`npm run build`) |

## 이번 세션까지 확인된 핵심

### 병합 완료 (선별)
- Cloud GitHub `cursor/post-deploy-qa-e402` → 로컬 `main` 일부 이식
- 문서: `PRE_DEPLOY_CHECKLIST`, `POST_DEPLOY_QA`, `OPEN_CHECKLIST`, `QA_REPORT_2026-05-30`, `DEPLOYMENT_STATUS`
- UI: `/admin/banners`, `/admin/categories`, `/admin/events`, `/events`, `/finance-terms`
- 상세: `docs/MERGE_COMPLETE_2026-05-29.md`

### Cloud Agent 후반 17커밋 — **로컬에 없음**
- GitHub upstream에 push되지 않은 작업 (signup, forgot-*, security, withdrawal, search modal, viral 등)
- 로컬 본편(Supabase 통합)이 buyer/seller/admin/결제/정산/배송/CS 쪽은 **더 완성**
- Cloud UX scaffold(회원가입·계정보안·검색모달)는 **재구현 필요**

## 로컬 본편 강점 (유지)
- Supabase migrations 001~046
- 실제 auth, Toss payments/webhook, seller/admin 전체 구조
- `/product/[id]`, `/checkout/[id]`, `/mypage/*`, `/seller/*`, `/admin/*`

## 재개 시 읽을 파일 (순서)
1. `docs/REBOOT_CHECKPOINT.md`
2. `docs/MERGE_COMPLETE_2026-05-29.md`
3. `docs/START.md`
4. `docs/COUPANG_UX_ROADMAP.md`

## 재개 명령
```
시작 — docs/START.md 우선순위대로. Wadeal만. push/vercel/원격 DB는 마지막.
```

## 다음 우선순위
1. Cloud 미푸시 17커밋 유실 여부 재확인 (gn2872-hash Cloud Agent)
2. 없으면 로컬 기준 signup/본인인증/계정보안/검색 UX 재구현
3. `docs/COUPANG_UX_ROADMAP.md` celloh 방향 UX
4. push/Vercel — 사용자 지시 후
