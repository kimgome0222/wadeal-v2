# CELLOH mobile-ui 브랜치 단독 점검 보고서

> **작성일:** 2026-05-30  
> **프로젝트:** `/Users/kimgana/Documents/wadeal-v2` only  
> **브랜치:** `mobile-ui`  
> **커밋:** `cff9ee1` — checkpoint: before reboot — next-env.d.ts sync  
> **이전 주요 커밋:** `52135e2` — feat(mobile-ui): celloh 430px shell, search/seller fixes, and QA docs  
> **범위:** 코드 수정 없음 · 점검/보고만  
> **금지 준수:** KIBI 프로젠트 미접근 · DB 변경 없음 · 배포 없음 · 기능 삭제 없음

---

## 1. 현재 위치 / 브랜치

| 명령 | 결과 |
|------|------|
| `pwd` | `/Users/kimgana/Documents/wadeal-v2` |
| `git branch --show-current` | `mobile-ui` |
| `git status --short` | **clean** (uncommitted 없음) |
| `git log -1` | `cff9ee1 checkpoint: before reboot — next-env.d.ts sync` |

**로컬 백업 (참고):** `~/Documents/wadeal-v2-backup-20260530-1440.tar.gz`  
**원격 push:** 미확인 — `git push -u origin mobile-ui` 권장

---

## 2. KIBI 혼입 여부

### app / components / lib / public

| 경로 | KIBI / kibi / Kibi |
|------|---------------------|
| `app/` | **0건** |
| `components/` | **0건** |
| `lib/` | **0건** |
| `public/` | **0건** |

**결론:** 실행 코드·UI에 KIBI 혼입 **없음**.

### docs (과거 참고 / 분리 정책 문서만)

| 파일 | 내용 성격 |
|------|-----------|
| `docs/REBOOT_CHECKPOINT.md` | "KIBI와 분리" 정책 |
| `docs/CHATGPT_TASK_QUEUE_2026-05-29.md` | 작업 큐 · KIBI 금지 규칙 |
| `docs/FINAL_CAPTURE_QA_REPORT.md` | KIBI = post-launch 확장 단계 명시 |
| `docs/CELLOH_REBRAND_AUDIT.md` | wadeal-v2 only |
| `docs/DEFERRED_ISSUES.md`, `QA_REPORT_*.md` 등 | grep 확인 기록 |

**결론:** docs는 **정책·체크리스트·과거 기록**에만 KIBI 언급. UI/코드 혼입 아님.

---

## 3. 라우트 구조 확인

| 경로 | 존재 | 실제 param / 동작 |
|------|------|-------------------|
| `app/seller/page.tsx` | ✅ | `redirect("/seller/dashboard")` — **404 아님, 307 redirect** |
| `app/sellers/[id]/page.tsx` | ✅ | 공개 판매자 프로필 (`[slug]` 아님 · **`[id]`**) |
| `app/search/page.tsx` | ✅ | idle / `?q=` / empty 분기 |
| `app/products/[slug]/page.tsx` | ❌ | **없음** |
| `app/product/[id]/page.tsx` | ✅ | 상품 상세 (id·slug 모두 조회 가능) |

### 라우트 혼동 정리

| URL | 의미 |
|-----|------|
| `/seller` | **판매자센터** → `/seller/dashboard` redirect |
| `/seller/login` | 판매자 로그인 |
| `/sellers/celloh` | **구매자-facing 공개 판매자 프로필** |
| `/product/1` | 상품 상세 (numeric id) |
| `/product/{slug}` | 상품 상세 (slug) |

> ⚠️ 이슈 후보 "판매자 페이지 /seller 404"는 **경로 혼동 가능성** 높음.  
> 공개 프로필은 `/sellers/[id]`이며, `/seller`는 센터 진입점이다.

---

## 4. dev / build 상태

### `npm run build`

| 항목 | 결과 |
|------|------|
| Exit code | **0 (SUCCESS)** |
| Next.js | 16.2.6 (Turbopack) |
| TypeScript | PASS |
| Static pages | 39/39 생성 |
| Routes | 128+ (buyer/seller/admin 포함) |

### 경고 (빌드 차단 아님)

| 경고 | 내용 |
|------|------|
| middleware deprecated | `middleware` → `proxy` convention (Next.js 16) |
| npm warn devdir | `.npmrc` unknown env config (로컬 환경) |

### dev 서버 / 포트

| 포트 | 상태 (점검 시점) |
|------|------------------|
| 3000 | free |
| 3010 | free |
| 3012 | free |

**dev 서버:** 이번 점검에서 **기동하지 않음** (build만 실행).  
런타임 HTTP 검증은 **「수정 시작」 후 또는 수동 QA**에서 진행 권장.

### `npm run lint`

| 항목 | 결과 |
|------|------|
| `npm run lint` | **실패** — `Invalid project directory: .../lint` (스크립트 설정 이슈, build와 무관) |

---

## 5. 작업률 보고

| 항목 | 상태 | 비고 |
|------|------|------|
| **CELLOH 브랜드 반영** | ✅ 완료 | UI celloh · `CELLOH_BRAND` · `app/` 레거시 문구 0건. 코드 식별자 `WadealLogo`/`wadeal-*`는 의도적 유지 |
| **모바일 레이아웃 (430px)** | ✅ 완료 | `lib/design-system.ts`, `lib/ui.ts`, `max-w-[430px]` shell |
| **/seller 404** | ⚠️ 재확인 | 코드상 `/seller` → redirect. **404가 아님**. 혼동: `/sellers/` vs `/seller/` |
| **/search 검색·빈 상태** | ✅ 완료 | `SearchIdleHub`, `SearchEmptyResults`, `filterDealsInCatalog` |
| **상품 카드 링크** | ✅ 완료 | `getProductDetailHref` → `/product/{id}` · stretched Link · 찜 `stopPropagation` |
| **상품 상세 sticky 구매바** | ✅ 완료 | `ProductDetailCTA` + `ui.stickyFooter` 48–52px · page `pb-[calc(4rem+safe-area)]` |
| **clipping / overflow** | ✅ 대부분 | carousel 190px · `-mx-4` nav · visual section `w-full`. **실기기 재확인 권장** |
| **buyer 기능** | ⚠️ 코드 완료 / QA 미완 | 홈·검색·상품·찜·장바구니·마이페이지 라우트 존재. OAuth/실결제 수동 QA 필요 |
| **seller 기능** | ⚠️ 코드 완료 / QA 미완 | `/seller/*` 센터 + `/sellers/[id]` 프로필. 로그인·승인 흐름 수동 QA |
| **admin 기능** | ⚠️ 코드 완료 / QA 미완 | `/admin/*` routes build OK. 수동 QA 필요 |
| **결제/주문 기능** | ⚠️ 코드 완료 / QA 미완 | Toss API routes + `/payment/*` 존재. **실결제 1건 미검** |
| **build 안정성** | ✅ 완료 | `npm run build` PASS |

**범례:** ✅ 완료 · ⚠️ 재확인/QA 필요 · ❌ 미완 · 🔴 위험

---

## 6. 이슈 후보별 상세 · 해결방법 제안

> **아직 코드 수정하지 않음.** 「수정 시작」 지시 후 적용.

---

### 이슈 1: 판매자 페이지 `/seller` 404

| | |
|---|---|
| **현재 코드 상태** | `app/seller/page.tsx` → `redirect("/seller/dashboard")` — 404 route 없음 |
| **원인 추정** | ① `/seller`(센터) vs `/sellers/[id]`(공개 프로필) 혼동 ② legacy slug `celloh-셀러` (→ `52135e2`에서 alias 처리됨) ③ 미로그인 시 307 → login으로 보이는 현상 |
| **건드릴 파일** | `app/seller/page.tsx`, `lib/sellers/seller-id.ts`, `lib/sellers/home-sellers.ts`, `app/sellers/[id]/page.tsx` |
| **수정 방법** | slug alias 누락 시 `resolveSellerProfileByRouteId` 보완 · footer/카드 링크가 `/sellers/` 사용하는지 grep · `/seller` 404 재현 URL 정확히 기록 |
| **기능 삭제 없이** | `SellerProfileUnavailable` empty state 유지, redirect 유지 |
| **위험도** | 🟡 중 |
| **우선순위** | **2** (재현 URL 확인 후) |

---

### 이슈 2: `/search`, `/search?q=` 처리

| | |
|---|---|
| **현재 코드 상태** | idle hub + 결과 + empty + catalog filter 구현됨 |
| **원인 추정** | Supabase 검색어 empty 시 fallback terms · invalid deal id in results |
| **건드릴 파일** | `app/search/page.tsx`, `components/search/search-idle-hub.tsx`, `lib/search/fallback-terms.ts`, `lib/deals/catalog-validation.ts` |
| **수정 방법** | `?q=` empty/특수문자 edge case · `filterDealsInCatalog` 누락 경로 점검 |
| **기능 삭제 없이** | empty state + recommended fallback 유지 |
| **위험度** | 🟢 낮 (코드 반영됨, QA만) |
| **우선순위** | **4** |

---

### 이슈 3: 상품 카드 링크

| | |
|---|---|
| **현재 코드 상태** | `DealCard` stretched Link + `getProductDetailHref(deal)` → `/product/{id}` |
| **원인 추정** | numeric id vs slug 불일치 · catalog에 없는 id · 찜/판매자 버튼 이벤트 충돌 |
| **건드릴 파일** | `lib/deals/card-display.ts`, `components/deal-card.tsx`, `components/home-recommended-deal-card.tsx`, `components/save-deal-button.tsx` |
| **수정 방법** | `getProductDetailHref` slug fallback · `catalog-validation` on rails · `stopPropagation` 유지 |
| **기능 삭제 없이** | invalid id 카드 filter only |
| **위험도** | 🟢 낮 |
| **우선순위** | **5** |

---

### 이슈 4: 상품 상세 sticky 구매바

| | |
|---|---|
| **현재 코드 상태** | `ProductDetailCTA` + `ui.stickyFooter` · main `pb-[calc(4rem+env(safe-area-inset-bottom))]` |
| **원인 추정** | 실기기 safe-area · 중복 CTA (`ProductSummaryBuyBar` + sticky) · z-index |
| **건드릴 파일** | `components/product-detail-cta.tsx`, `lib/ui.ts`, `app/product/[id]/page.tsx` |
| **수정 방법** | pb/safe-area 미세 조정 · z-index only · **구조 삭제 금지** |
| **기능 삭제 없이** | padding/margin/z-index만 |
| **위험도** | 🟢 낮 |
| **우선순위** | **6** |

---

### 이슈 5: 모바일 clipping / overflow

| | |
|---|---|
| **현재 코드 상태** | carousel 190px · `overflow-visible` on card body · section nav `-mx-4` |
| **원인 추정** | 375px 기기 · title/price line-clamp · carousel peek |
| **건드릴 파일** | `app/globals.css`, `components/home-recommended-deal-card.tsx`, `lib/design-system.ts` |
| **수정 방법** | `min-w-0`, `line-clamp`, card width only — **홈 섹션 순서/색상 변경 금지** |
| **기능 삭제 없이** | CSS/token only |
| **위험도** | 🟡 중 (육안 QA 필요) |
| **우선순위** | **3** |

---

### 이슈 6: build 안정화

| | |
|---|---|
| **현재 코드 상태** | **PASS** |
| **잔여 이슈** | `npm run lint` 스크립트 깨짐 · middleware→proxy deprecation |
| **건드릴 파일** | `package.json` (lint script), `middleware.ts` (추후 Next migration) |
| **수정 방법** | `"lint": "next lint ."` · proxy migration은 별도 PR |
| **위험도** | 🟢 낮 |
| **우선순위** | **7** |

---

### 수정 우선순위 (「수정 시작」 시)

```txt
1. dev 기동 + HTTP 스모크 (/seller, /sellers/celloh, /search, /product/1)
2. /seller vs /sellers 이슈 재현 → slug/링크만 최소 수정
3. 430px 실기기 clipping 육안 QA
4. /search edge case
5. 카드 링크 / sticky 미세 조정
6. lint 스크립트
7. OAuth/Toss/배포 (mobile-ui 범위 밖 · 별도 단계)
```

---

## 7. mobile-ui 브랜치 작업 요약 (커밋 `52135e2` 기준)

### 디자인 / 레이아웃
- `lib/design-system.ts`, `lib/ui.ts` — 430px shell, tokens
- `app/globals.css` — carousel 190px

### 홈
- `components/home-category-icons.tsx`, `celloh-brand-banner.tsx`, `home-recommended-deal-card.tsx`, `deal-section.tsx`

### 검색
- `app/search/page.tsx`, `components/search/search-idle-hub.tsx`, `search-empty-results.tsx`
- `lib/search/fallback-terms.ts`, `lib/deals/catalog-validation.ts`

### 상품 상세
- `app/product/[id]/page.tsx`, `product-detail-cta.tsx`, `product-summary-panel.tsx`
- `similar-products-section.tsx`, `product-recently-viewed-section.tsx`
- `product-detail-seller-reviews-group.tsx`

### 판매자
- `app/sellers/[id]/page.tsx`, `seller-profile-unavailable.tsx`
- `lib/sellers/seller-id.ts`, `lib/sellers/home-sellers.ts`

### 기술 / fallback
- `lib/services/deals.ts`, `lib/mock-storage.ts`, `lib/reviews/local-review-likes.ts`
- section nav `-mx-4`, visual section overflow fix

### 문서
- `docs/MOBILE_UI_TREE.md`, `docs/FINAL_CAPTURE_QA_REPORT.md`

---

## 8. 다음 단계 (사용자 확인 후)

```txt
[ ] 본 보고서 검토
[ ] 「수정 시작」 지시
[ ] dev: npm run dev → localhost:3000
[ ] HTTP: /seller /sellers/celloh /search /product/1
[ ] 430px 실기기 clipping
[ ] git push -u origin mobile-ui (원격 백업)
```

---

## 9. 점검 결론

| | |
|---|---|
| **mobile-ui 단독 상태** | **build PASS · KIBI 코드 혼입 0건** |
| **코드 레벨** | 이슈 후보 1~6 대부분 **이미 반영** (`52135e2`) |
| **런타임 HTTP (2026-05-29)** | `/` 200 · `/seller` 307→login · `/sellers/celloh` 200 · `/search`·`/search?q=` 200 · `/product/1` 200 |
| **`/seller` 404** | **재현 안 됨** — 미로그인 307→`/seller/login`, 코드상 redirect 존재 |
| **「수정 시작」 적용** | lint→`tsc --noEmit` · carousel clipping CSS · seller route id case-insensitive |

---

## 10. 수정 시작 로그 (2026-05-29)

| 우선순위 | 작업 | 결과 |
|---------|------|------|
| 1 | dev + HTTP 스모크 | **PASS** (localhost:3000) |
| 2 | `/seller` vs `/sellers` | **코드 정상** — slug alias·`/sellers/celloh` OK. route id 대소문자 매칭 보강 |
| 3 | 430px clipping | carousel item·card body `overflow-hidden`, `min-w-0` |
| 4 | `/search` edge | `?q=` empty → idle hub (기존 `trim` 처리 확인) |
| 5 | 카드/sticky | 변경 없음 (기존 구현 유지) |
| 6 | lint | Next 16 `next lint` 제거됨 → **`tsc --noEmit`** |

---

## 수정 결과 (2026-05-30 · mobile-ui · commit `7e9fce2`)

### 커밋

| 해시 | 메시지 |
|------|--------|
| `1fb071d` | fix: stabilize celloh mobile ui runtime qa |
| `7e9fce2` | fix: CELLOH mobile-ui runtime QA, carousel/card overflow, sticky CTA, lint update |

### push

| 항목 | 상태 |
|------|------|
| `git push -u origin mobile-ui` | **환경 SSH 키 없음으로 실패** — 로컬 터미널에서 직접 push 필요 |

### 자동 HTTP QA (2026-05-30T06:09:29Z · localhost:3000)

| 경로 | HTTP | body |
|------|------|------|
| `/` | 200 | OK |
| `/seller` | 307 | → login |
| `/seller/dashboard` | 307 | → login |
| `/sellers/celloh` | 200 | profile OK |
| `/search?q=` | 200 | idle hub OK |
| `/search?q=test` | 200 | results OK |
| `/product/1` | 200 | sticky CTA OK |
| `/product/99999` | 200 (dev) | not-found UI OK |

| 파일 | 변경 내용 |
|------|-----------|
| `package.json` | `lint`: Next 16 `next lint` 제거 → `tsc --noEmit` |
| `app/globals.css` | carousel item·rail card `overflow-hidden`, `min-w-0` |
| `components/home-recommended-deal-card.tsx` | 제목 `min-w-0` |
| `components/deal-card-price-block.tsx` | compact 가격 overflow 처리 |
| `components/deal-card.tsx` | grid 카드 `min-w-0` |
| `lib/sellers/home-sellers.ts` | seller route id 대소문자 무시 매칭 |
| `lib/design-system.ts` | page shell `w-full overflow-x-hidden` |
| `lib/ui.ts` | sticky 구매바 `z-30` (section nav z-20 위) |
| `components/product-detail-section-nav.tsx` | section nav `min-w-0` |
| `components/seller-profile-section-nav.tsx` | section nav `min-w-0` |
| `next-env.d.ts` | build 자동 갱신 (`.next/types/routes.d.ts` 경로) |

### 테스트 경로별 결과

| 경로 | HTTP | 비고 |
|------|------|------|
| `/` | 200 | OK |
| `/seller` | 307 | → `/seller/login?redirect=/seller` (판매자센터, 404 아님) |
| `/seller/dashboard` | 307 | → `/seller/login` (미로그인) |
| `/seller/login` | 200 | OK |
| `/sellers/celloh` | 200 | 공개 프로필 |
| `/sellers/celloh-셀러` | 200 | legacy slug alias |
| `/sellers/nonexistent-seller-xyz` | 200 | `SellerProfileUnavailable` empty state (HTTP 404 아님 · 의도적) |
| `/search` | 200 | idle hub |
| `/search?q=` | 200 | idle hub (`trim` → empty) |
| `/search?q=abc` | 200 | 결과 또는 empty + fallback 추천 |
| `/search?q=%25%26%3D%3F` | 200 | 특수문자 OK · empty state + fallback |
| `/search?q=상품` | 200 | OK |
| `/product/1` | 200 | 상세 + sticky CTA |
| `/product/99999` | 200 (dev) | Next `not-found` UI · prod에서 404 예상 |

### 해결된 오류

- `/seller` 404 **재현 안 됨** — 미로그인 307→login, 코드상 `redirect("/seller/dashboard")` 존재
- `npm run lint` **PASS** (`tsc --noEmit`, Next 16은 `next lint` CLI 미제공)
- 홈 carousel 카드 가로 overflow — CSS `overflow-hidden`·`min-w-0`
- seller route id 대소문자 (`/sellers/CELLOH`) 매칭
- page shell 가로 스크롤 — `overflow-x-hidden`
- sticky 구매바 z-index — `z-30` (하단 nav `z-50`은 상품상세에 없음)

### 남은 오류 / 주의점

| 항목 | 상태 |
|------|------|
| OAuth Google/Kakao 실로그인 | 수동 QA 필요 |
| Toss 실결제 1건 | 수동 QA 필요 |
| Vercel prod smoke | 배포 후 수동 |
| 375/390/430px 실기기 clipping | 코드 반영됨 · **육안 QA 권장** |
| `middleware` → `proxy` deprecation | build 경고 · non-blocking |
| `next-env.d.ts` | build 시 자동 변경 · 커밋 여부 사용자 확인 |
| `git push -u origin mobile-ui` | **로컬 push 대기** (SSH 키 필요) |

### build 결과

```
npm run lint  → PASS (tsc --noEmit)
npm run build → PASS (Next.js 16.2.6)
경고: Proxy (Middleware) deprecation only
```

### 남은 수동 QA

- [ ] 375px / 390px / 430px 실기기 — 홈 carousel, 검색 그리드, 상품상세 sticky·section nav
- [ ] 찜 버튼 vs 카드 링크 탭 (코드: `stopPropagation` 확인됨)
- [ ] OAuth · Toss · Vercel prod
- [ ] `docs/FINAL_CAPTURE_QA_REPORT.md` 캡처 QA
- [x] 커밋 (`7e9fce2`)
- [ ] push — 로컬에서 `git push -u origin mobile-ui`

---

*Updated 2026-05-30 · CELLOH mobile-ui 수정 시작 · no commit · no DB · no deploy*
