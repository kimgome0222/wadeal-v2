# REBOOT CHECKPOINT

> **갱신: 2026-05-29 (재부팅 전 저장)** · `~/Documents/wadeal-v2` only · KIBI 분리  
> 재개 시: **`시작`** 또는 이 문서 읽고 이어가기

---

## 지금 상태 (한 줄)

**celloh 리브랜딩 2차 텍스트/SEO/로고 정리 완료 · `npm run build` PASS · 아직 커밋 안 됨 (미저장 변경 11파일)**

---

## Git

| 항목 | 값 |
|------|-----|
| 최근 커밋 | `b77122c` rebrand: change visible brand text to celloh |
| 그 전 | `1298878` fix: oauth callback session handling |
| 브랜치 | `main` (push 금지 — 사용자 지시 전) |
| build | **PASS** (Next.js 16.2.6, 38+ routes) |

### 미커밋 변경 (working tree)

```
 M app/icon.svg
 M components/hero-banner.tsx
 M components/login-screen.tsx
 M components/seller-product-compliance-notice.tsx
 M components/seller-products-content.tsx
 M components/signup-form.tsx
 M components/wadeal-logo.tsx
 M lib/seo/site.ts
 M public/icons/icon-192.svg
 M public/icons/icon-512.svg
 M public/wadeal-wordmark.svg
?? public/wadeal-wordmark.svg.bak   ← 백업 파일, 커밋 제외 권장
```

**돌아온 뒤:** `git diff` 확인 → 만족하면 커밋 (사용자 요청 시)

---

## 이번 세션에서 한 일

### celloh 리브랜딩 2차 (텍스트/SEO만, 구조 유지)

1. **`public/wadeal-wordmark.svg`**
   - 텍스트: `celloh`
   - fill: `#2E5E4E`
   - aria-label: `celloh`

2. **`lib/seo/site.ts`**
   - title: `celloh | 누가 만들었는지 알고 사세요.`
   - description: `좋은 상품은 좋은 판매자에게서 시작됩니다. 판매자를 알면, 상품이 보입니다.`
   - keywords: celloh, 셀로, 판매자, 스토리커머스, 공동구매, 쇼핑
   - themeColor: `#2E5E4E`

3. **홈 슬로건** (`components/hero-banner.tsx`)
   - 메인/서브 celloh 철학 문구 반영

4. **로그인/가입**
   - buyer tagline → `누가 만들었는지 알고 사세요.`
   - signup → `celloh에 오신 것을 환영해요`

5. **판매자 문구**
   - `운영팀` → `celloh 운영팀`

6. **아이콘** (탭/PWA)
   - `app/icon.svg`, `public/icons/icon-192.svg`, `icon-512.svg`
   - `#2E5E4E` + `c`, aria-label `celloh`

7. **`components/wadeal-logo.tsx`**
   - brand/light 배지 `W` → `c`
   - **유지:** `WadealLogo` 이름, `/wadeal-wordmark.svg` 경로, `wadeal-*` Tailwind

### 이전 세션에서 분석만 (DB 실행 안 함)

- **018_support_tickets.sql** 적용 전 분석 리포트 완료
- DB/migration/push/Vercel — **하지 않음**

### KIBI (별도 프로젝트)

- Cross-browser UI polish (`~/Documents/KIBI`) — wadeal-v2와 무관
- wadeal-v2 작업 범위 아님

---

## 의도적으로 바꾸지 않은 것

- `WadealLogo`, `WadealLogoProps`, 파일명 `wadeal-logo.tsx`
- Tailwind: `text-wadeal-*`, `bg-wadeal-*`, `border-wadeal-*`, `wadeal-red` 등
- 경로/파일명의 `wadeal` (예: `/wadeal-wordmark.svg`)
- `getcellohDataSource` / `markcellohDataSource` 등 내부 식별자
- `docs/` 대량 문서의 Wadeal 언급 (운영 문서, work-queue.json)
- KIBI 코드 혼입

---

## DB / 배포 (미적용)

| 객체 | 상태 |
|------|------|
| `public.users` | ✅ (051 v3) |
| `support_tickets` | ❌ → **018 다음** |
| `profile_usernames`, `featured_search_terms`, CMS tables | ❌ |
| push / Vercel | ❌ 금지 |

**권장 migration 순서:** `018 → 047 → 048 → (033) → 036 → 049 → 050`

---

## 환경 (.env.local)

- `NEXT_PUBLIC_SUPABASE_URL` — 있음
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — 있음
- `SUPABASE_SERVICE_ROLE_KEY` — **없음** (P0)
- Toss keys — **없음** (P0)

---

## 돌아온 뒤 바로 할 수 있는 것

```bash
cd ~/Documents/wadeal-v2
git status
git diff --stat
npm run build
npm run dev   # 로컬 확인
```

### 선택 작업 (우선순위)

1. **커밋** — 리브랜딩 2차 변경 저장 (`.bak` 제외)
2. **018 migration** — Dashboard SQL Editor (분석 리포트 참고, 실행은 사용자)
3. **047 → 048** — username / featured search
4. **로컬 QA** — 홈 슬로건, 로고 색 `#2E5E4E`, SEO 메타

---

## 정본 참고 문서

- `docs/WADEAL_LAUNCH_AUDIT.md` — P0~P2 블로커
- `docs/CELLOH_REBRAND_AUDIT.md` — 리브랜딩 범위
- `docs/CHATGPT_TASK_QUEUE_2026-05-29.md` — 작업 큐
- `docs/START.md` — 재개 우선순위

---

## Cursor 재개 프롬프트 (복붙용)

```
wadeal-v2 이어서. docs/REBOOT_CHECKPOINT.md 읽고 진행.
- 미커밋 celloh 리브랜딩 2차 변경 확인
- push/Vercel/DB migration은 내 지시 전 금지
- KIBI 섞지 말 것
```
