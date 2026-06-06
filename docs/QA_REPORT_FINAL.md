# CELLOH mobile-ui — 최종 QA 보고서

**검수일:** 2026-05-30  
**브랜치:** `mobile-ui`  
**커밋:** `f4a5cca` — `fix: join cart login flow and qa updates`  
**환경:** localhost:3000 (Next.js 16.2.6 dev)  
**제약:** 기능 추가·디자인 변경·DB 변경·리팩토링 없음

---

## 1. 점검 범위

실사용자 buyer/seller/admin 핵심 경로 HTTP·리다이렉트·링크·로그인 흐름.

| 영역 | 경로 |
|------|------|
| 홈 | `/` |
| 검색 | `/search`, `/search?q=test` |
| 상품 상세 | `/product/1`, `/product/99999` |
| 판매자 프로필 | `/sellers/celloh` |
| 장바구니 | `/join-cart`, `/join-cart?pending={slug}` |
| 로그인/회원가입 | `/login`, `/signup` |
| 마이페이지 | `/mypage`, `/mypage/orders`, `/mypage/recent`, `/mypage/reviews` |
| 찜 | `/saved` |
| 문의 | `/support`, `/support/new` |
| 주문/결제 진입 | `/join/{slug}`, `/checkout/{slug}` |
| 판매자센터 | `/seller`, `/seller/login` |
| 관리자센터 | `/admin`, `/admin/login` |

**prototype 세션** (`wadeal_prototype_session=1`)으로 로그인 후 흐름 추가 검증.

---

## 2. 테스트 URL · HTTP 결과

### 미로그인 (anon)

| URL | HTTP | 비고 |
|-----|------|------|
| `/` | 200 | OK |
| `/search` | 200 | idle hub |
| `/search?q=test` | 200 | 결과/empty |
| `/product/1` | 200 | sticky CTA·장바구니 |
| `/product/99999` | 200 | not-found UI (dev) |
| `/sellers/celloh` | 200 | 공개 프로필 |
| `/join-cart` | 307 | → login `next=/join-cart` |
| `/login` | 200 | OK |
| `/signup` | 200 | OK |
| `/mypage` | 307 | → login |
| `/mypage/orders` | 307 | → login |
| `/saved` | 200 | inline 로그인 CTA |
| `/mypage/recent` | 307 | → login |
| `/mypage/reviews` | 307 | → login |
| `/support` | 307 | → login |
| `/support/new` | 307 | → login |
| `/seller` | 307 | → seller login |
| `/seller/login` | 200 | OK |
| `/admin` | 307 | → admin login |
| `/admin/login` | 200 | OK |
| `/join/wd-citrus-001` | 200 | 구매 진입 |
| `/checkout/wd-citrus-001` | 307 | → login |

**HTTP 404 재현 없음.**

### prototype 로그인 후

| URL | HTTP |
|-----|------|
| `/join-cart` | 200 |
| `/join-cart?pending=wd-citrus-001` | 200 (pending 처리 코드 반영) |
| `/mypage` | 200 |
| `/mypage/orders` | 200 |
| `/checkout/wd-citrus-001` | 200 |
| `/support/new` | 200 |

---

## 3. 발견 버그

| # | 버그 | 심각도 |
|---|------|--------|
| 1 | 미로그인 「장바구니」 클릭 → 로그인 후 상품 미담김 (`next=/product/{slug}`) | P1 |

---

## 4. 수정 내용 (커밋 `f4a5cca`)

| 파일 | 변경 |
|------|------|
| `components/add-to-join-cart-button.tsx` | login `next=/join-cart?pending={slug}` |
| `app/join-cart/page.tsx` | 로그인 후 `pending` 자동 담기 → `/join-cart` redirect |
| `docs/QA_REPORT.md` | 런타임 QA 기록 |
| `docs/CELLOH_MOBILE_UI_AUDIT.md` | push·QA 타임스탬프 |
| `docs/FINAL_CAPTURE_QA_REPORT.md` | §8 QA 로그 |

---

## 5. 남은 이슈

| 항목 | 상태 |
|------|------|
| OAuth Google/Kakao 실로그인 | **미검** |
| Toss 테스트 결제 1건 | **미검** |
| Vercel production smoke | **미검** |
| 375/390/430px 실기기 clipping | **미검** (코드 토큰 반영됨) |
| Supabase `join_cart` persist (로컬 mock 시 empty) | 환경 제한 |
| `git push origin mobile-ui` | **실패** (HTTP 400 · 로컬 재시도 필요) |
| middleware → proxy deprecation | build 경고 only |

---

## 6. OAuth / Toss / Vercel

| 서비스 | 상태 |
|--------|------|
| **OAuth** | 미검 — 버튼·redirect 코드 존재, 실세션 QA 필요 |
| **Toss** | 미검 — `/payment/request/{orderId}` 수동 1건 필요 |
| **Vercel** | 미검 — prod `/seller` `/search` `/product/1` smoke 필요 |

---

## 7. build / lint

```
npm run lint  → PASS (tsc --noEmit)
npm run build → PASS (Next.js 16.2.6)
경고: Proxy (Middleware) deprecation
```

---

## 8. git

```
commit: f4a5cca fix: join cart login flow and qa updates
push:   FAILED (HTTP 400 unexpected disconnect) — 로컬에서 git push -u origin mobile-ui 재실행 필요
```

---

## 9. 런칭 판정

| | |
|---|---|
| **코어 buyer 플로우 (코드+HTTP)** | PASS |
| **배포 가능** | **NO** — OAuth/Toss/Vercel 미검 · push 미완 |
| **런칭 준비률** | **~72%** |

---

*CELLOH mobile-ui final QA · bugfix only · no deploy*
