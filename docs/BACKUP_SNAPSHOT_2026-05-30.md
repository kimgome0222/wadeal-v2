# Wadeal 백업 스냅샷 (2026-05-30)

> **HEAD:** `2837b7a` (backup tag `backup-2026-05-30`)  
> **브랜치:** `main` (origin/main 대비 push 시도)  
> **원격:** `origin` → https://github.com/kimgome0222/wadeal-v2.git  
> **로컬 태그:** `backup-2026-05-30`  
> **로컬 백업 브랜치:** `backup/session-2026-05-29`

## 재개 방법

```
시작 — docs/START.md 우선순위대로. 각 작업 끝 npm run build. push/vercel/원격 DB는 마지막.
```

정본: `docs/work-queue.json`, `docs/START.md`, `docs/DEFERRED_ISSUES.md`

---

## 이번 세션 완료 작업 요약

### 개인정보 (쿠팡 스타일)
- `components/mypage-profile-content.tsx` — 프로필 헤더, 바로가기(배송지·결제·보안·알림), 계정/필수/추가 정보 폼, 휴대폰 인증
- `components/header.tsx` — 로그인 후 아이디 클릭 → `/mypage/profile`
- `app/mypage/profile/page.tsx` — 제목 「개인정보」

### 고객센터
- `lib/support/inquiry-options.ts` — 문의 유형·15일 주문 필터
- `components/support-inquiry-hub.tsx`, `support-order-picker.tsx`
- `components/support-ticket-create-form.tsx` — 카카오/이메일/1:1 채널·주문 선택

### 홈 / 카탈로그 / 딜
- Pretendard 폰트, Wadeal 워드마크, 카탈로그 필터
- `lib/deals/lifecycle.ts` — ends_at만으로 구매 차단하지 않음 (품절·관리자 마감만)
- `components/product-summary-panel.tsx` — 마감임박 뱃지 타입 수정

---

## Build 상태 (2026-05-30)

| 명령 | 결과 |
|------|------|
| `NODE_OPTIONS='--max-old-space-size=6144' npm run build` | **PASS** |

---

## 복구 명령

```bash
git checkout backup-2026-05-30
# 또는
git checkout backup/session-2026-05-29

node scripts/probe-migrations.mjs
```

## 로컬 아카이브

- **경로:** `backups/wadeal-v2-2026-05-30.tar.gz` (node_modules/.next 제외)
- **복원:** `tar -xzf backups/wadeal-v2-2026-05-30.tar.gz -C /path/to/restore`

## Deploy

```bash
git push origin main
npx vercel --prod
```
