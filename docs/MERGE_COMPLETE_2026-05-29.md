# Wadeal v2 — Local + Cloud 병합 완료 (2026-05-29)

> **기준:** Cursor 로컬 `main` (Supabase·auth·692 작업큐) + GitHub `gn2872-hash/wadeal-v2` `cursor/post-deploy-qa-e402`  
> **KIBI와 분리:** `~/Documents/wadeal-v2` 전용 · KIBI 미사용

## 병합 전략

| 소스 | 역할 |
|------|------|
| **로컬 main (`50ab4c1`)** | **본편** — Supabase, Kakao OAuth, buyer/seller/admin, migrations, lib/data |
| **Cloud (`3db5222`)** | **선별 이식** — 배포/QA 문서, admin commerce UI, 기획전 |
| **Cloud 미푸시 작업** | GitHub에 없음 (signup/search/viral 등 17커밋) — 로컬 기존 기능이 더 완성 |

## 이번에 합친 항목

### Cloud에서 이식
- `docs/PRE_DEPLOY_CHECKLIST.md`, `POST_DEPLOY_QA.md`, `OPEN_CHECKLIST.md`, `QA_REPORT_2026-05-30.md`, `DEPLOYMENT_STATUS.md`
- `lib/data/admin-commerce.ts` — 배너·카테고리·기획전 (로컬 catalog 연동)
- `app/actions/admin-commerce.ts` — real `isAdminUser` 검증
- `app/admin/banners`, `categories`, `events`
- `app/events` — 구매자 기획전 목록
- `app/finance-terms` — 전자금융거래 약관
- `components/admin-nav` — 배너/카테고리/기획전/쿠폰 링크

### 로컬 본편 유지 (Cloud mock 대신)
- `app/join-cart`, `checkout/[id]`, `product/[id]`, `mypage/*`
- Supabase `lib/data/*`, migrations 001–046
- Kakao OAuth, Toss payments, notifications, refunds, settlements
- `docs/work-queue.json`, `HANDOFF_CHATGPT.md`, `COUPANG_UX_ROADMAP.md`

### Cloud와 충돌 → 로컬 우선 (미이식)
- `app/cart`, `app/checkout/page`, `app/products/[slug]`, `app/my` — mock 라우트
- `lib/auth/roles.ts`, mock session — 로컬 real auth 사용
- Cloud-only signup/forgot-* — **GitHub 미푸시**; 로컬에 `login-screen`, profile, withdrawal 이미 존재

## 백업

| 이름 | 용도 |
|------|------|
| `pre-merge-cloud-2026-05-29` | 병합 직전 로컬 main |
| `before_change_to_celloh` | celloh 전환 전 원본 |
| `wadeal-v2-before_change_to_celloh/` | 폴더 복사본 |

## 복구

```bash
git checkout pre-merge-cloud-2026-05-29   # 병합 전
git checkout before_change_to_celloh      # celloh 전 원본
```

## 다음 단계 (celloh 방향)

1. `docs/COUPANG_UX_ROADMAP.md` 잔여 항목 (상품상세 탭, 장바구니 뱃지, 체크아웃 요약)
2. `docs/START.md` Q-DOABLE-BACKLOG
3. push / Vercel / Toss live — 사용자 지시 후

## 재개 명령

```
시작 — docs/START.md 우선순위대로. 각 작업 끝 npm run build. push/vercel/원격 DB는 마지막.
```
