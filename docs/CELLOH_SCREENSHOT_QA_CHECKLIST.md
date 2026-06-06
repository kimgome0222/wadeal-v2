# CELLOH Screenshot QA Checklist

**Date:** 2026-05-29  
**Branch:** `mobile-ui`  
**Status:** Manual QA guide — **no Playwright, no auto-capture implementation**

**Related:** [CELLOH_SMOKE_TEST_PLAN.md](./CELLOH_SMOKE_TEST_PLAN.md), [CELLOH_DESIGN_SYSTEM.md](./CELLOH_DESIGN_SYSTEM.md), [CELLOH_RESPONSIVE_QA_REPORT.md](./CELLOH_RESPONSIVE_QA_REPORT.md), [CELLOH_PRIORITY_BACKLOG.md](./CELLOH_PRIORITY_BACKLOG.md)

---

## 1. 촬영 목적

| Goal | Why |
|------|-----|
| **회귀 비교** | overnight 변경 후 레이아웃·카피·rail peek가 깨지지 않았는지 |
| **아침 핸드오프** | PM/디자인/개발이 같은 화면 기준으로 이슈 공유 |
| **출시 전 증빙** | P1 구매 전환 화면(홈·카테고리·PDP·장바구니) 스냅샷 보관 |
| **반응형 확인** | 375 / 390 / 430px에서 shell·sticky·overflow 동일 기준 |

자동 스크린샷 도구는 **범위外**. 본 문서는 **어디를, 어떤 순서로, 무엇을 보며** 캡처할지만 정의합니다.

---

## 2. 촬영 전 준비

### 환경

```bash
cd /Users/kimgana/Documents/wadeal-v2
rm -rf .next && npm run lint && npm run build
npm run dev   # :3000
```

| Item | Setting |
|------|---------|
| Base URL | `http://localhost:3000` (or `CELLOH_QA_BASE_URL`) |
| 브라우저 | **Chrome DevTools** 우선 |
| 보조 | **Safari** iOS 시뮬레이터 또는 실기기 수동 1회 |
| 모드 | 시크릿(캐시 최소) 또는 hard refresh `Cmd+Shift+R` |
| 로그인 | guest 기본 · seller/admin route는 테스트 계정 또는 gate 화면 캡처 |

### Smoke 선행 (선택)

```bash
npm run smoke:check   # dev server 필요
```

HTTP 500/404가 있으면 스크린샷보다 **P0 수정 먼저**.

### 저장 규칙

| Item | Convention |
|------|------------|
| 폴더 | `docs/screenshots/YYYY-MM-DD/` (로컬만, git optional) |
| 파일명 | `{date}_{route-slug}_{width}px_{section}.png` |
| 예시 | `2026-05-29_home_390px_hero-quickmenu.png` |

---

## 3. 브라우저 / viewport

**모바일 shell 기준** — 앱 max-width **430px** (`--celloh-app-width`).

| Width | Device ref | 필수 |
|-------|------------|------|
| **375px** | iPhone SE / mini | ✅ |
| **390px** | iPhone 14/15 | ✅ primary |
| **430px** | Design max shell | ✅ |

**Chrome 설정:** DevTools → Toggle device toolbar → Custom → width만 변경, DPR 2–3, **100% zoom**.

**Safari:** 동일 3 width에서 홈·PDP·장바구니만 spot-check (sticky, bottom sheet).

---

## 4. 우선순위 기준

| Priority | Screenshot focus | Rule |
|----------|------------------|------|
| **P0** | 500, blank, JS error overlay | 촬영 중단 → fix first |
| **P1** | `/`, `/category/*`, `/product/*`, `/join-cart` | 구매 전환 — **매일** |
| **P2** | collections, invite, membership, support | 주 1회 또는 릴리스 전 |
| **P3** | policies, seller/admin (logged in) | 변경 시만 |

Align with [CELLOH_PRIORITY_BACKLOG.md](./CELLOH_PRIORITY_BACKLOG.md).

---

## 5. 촬영 route 목록 (필수)

**권장 순서:** 아래 번호대로 진행 (스크롤 상태 누적 최소화).

| # | Route | Auth | Primary captures |
|---|-------|------|------------------|
| 1 | `/` | guest | §6 home scroll zones |
| 2 | `/category/food` | guest | §7 category |
| 3 | `/category/food?sub=fruit` | guest | sub-filter active |
| 4 | `/category/living` | guest | §7 living grid |
| 5 | `/product/1` | guest | §8 PDP full |
| 6 | `/product/11` | guest | alternate SKU / sold-out if any |
| 7 | `/join-cart` | guest | §9 cart empty + filled |
| 8 | `/collections/today-special` | guest | collection header + grid |
| 9 | `/collections/ranking` | guest | ranking columns |
| 10 | `/collections/popular-sellers` | guest | seller rail/cards |
| 11 | `/invite` | guest | event card + CTA |
| 12 | `/membership` | guest | benefit cards |
| 13 | `/support` | guest | hub + FAQ chips |
| 14 | `/policies/privacy` | guest | legal notice banner |
| 15 | `/sellers/moon-fruit` | guest | seller profile + products |
| 16 | `/seller/dashboard` | seller | dashboard or login gate |
| 17 | `/admin/dashboard` | admin | KPI or login gate |

**Note:** `moon-fruit` = showcase seller (`lib/sellers/showcase-seller-profiles.ts`).

---

## 6. 홈 (`/`) 촬영 기준

**Method:** 각 구간 **스크롤 멈춤 → full viewport 캡처** (sticky header 포함).

| Shot | Sections in frame | Checklist |
|------|-------------------|-----------|
| **H1** | Header + Hero + Quick Menu | header sticky · hero radius · QM **2줄** 가로 스크롤 |
| **H2** | 오늘의특가 + 추천상품 | rail **2.5 peek** · section title 20px · 더보기 link |
| **H3** | 마감세일 + 인기 판매자 | seller card horizontal scroll · card tap affordance |
| **H4** | 실시간 인기상품 + 주말특가 | product card order (§6.1) · + button visible |
| **H5** | 카테고리 랭킹 | vertical ranking columns · horizontal snap |
| **H6** | 오늘의 최저가 + 셀로단독특가 | lowest disclaimer subtitle · only-celloh wider card |
| **H7** | 많이담은/계절/신규상품 + 신규 입점 판매자 | seasonal disclaimer · new seller cards |
| **H8** | 판매자 이야기 | story cards · link to seller |

### 6.1 Quick Menu 첫 화면 노출

스크롤 **없이** QM 첫 viewport에 보이는 항목 확인:

- 셀로쿠폰 (`/collections/celloh-coupon`)
- 지인초대 (`/invite`)
- 인기 판매자 (`/collections/popular-sellers`)

→ H1 캡처에 포함. 가로 스크롤 후 추가 항목은 별도 1장 optional.

### 6.2 상품카드 (홈 rail)

| Order | Element |
|-------|---------|
| 1 | Image |
| 2 | Name (2 lines) |
| 3 | ★ score · 리뷰 count |
| 4 | Discount % · price |
| 5 | Original (line-through) |
| 6 | 판매 count |
| 7 | + / stepper bottom-right on **image** |

**+/stepper:** tap + → pill `[- 1 +]` expands **left**; no layout jump on rail width.

**Reference:** [CELLOH_DESIGN_SYSTEM.md](./CELLOH_DESIGN_SYSTEM.md) §4

---

## 7. 카테고리 촬영 기준

**Routes:** `/category/food`, `/category/food?sub=fruit`, `/category/living`

| Shot | What to capture |
|------|-----------------|
| **C1** | Top: app category bar + page title |
| **C2** | Subcategory **box grid** (CategoryChip) — default state |
| **C3** | Sort row + quick filter chips |
| **C4** | Product **2-column grid** (first screen) |
| **C5** | Sort **dropdown open** (popover above content) |
| **C6** | **Filter sheet open** (`PlpFilterSheet`) |

### Checklist

| Check | Pass criteria |
|-------|---------------|
| 중복 row | category bar / sub-nav / toolbar **한 줄씩** only |
| 이모티콘 | chip icon centered, label not clipped |
| 하위 클릭 | `?sub=fruit` → grid/filter updates, active chip state |
| Grid 변경 | sub/filter change → visible product set change |
| Filter z-index | dropdown/sheet **above** product images, not clipped at 430px |
| Stepper | + on grid cards, same as home |

**Files (if issues):** `components/deal-catalog-toolbar.tsx`, `components/plp/plp-filter-sheet.tsx`, `components/category-chip.tsx`, `app/category/[slug]/page.tsx`

---

## 8. 상품상세 촬영 기준

**Routes:** `/product/1`, `/product/11`

| Shot | What to capture |
|------|-----------------|
| **P1** | Image gallery (first slide + dots if any) |
| **P2** | Title, price, review summary, sold meta |
| **P3** | Quantity tier / 혜택가 block |
| **P4** | **Fixed bottom bar** — qty stepper + 장바구니 + 구매하기 |
| **P5** | Section nav tabs (상세/후기/문의) |
| **P6** | Scroll: 판매자 카드 + 판매자의 다른 상품 rail |
| **P7** | 관련 추천상품 section |
| **P8** | **Last-look sheet** — tap 구매하기 (`CartPreviewBottomSheet`) |
| **P9** | **담았어요 sheet** — tap + on card or add to cart (`CartAddedBottomSheet`) |

### Checklist

| Check | Pass criteria |
|-------|---------------|
| Bottom bar | Not hidden by bottom tab · safe-area padding |
| Purchase bar | Min 44px tap targets · 56px CTA height |
| Gallery | No horizontal page scroll bleed |
| Sheets | z-index above nav · dismiss on backdrop |
| Seller link | → `/sellers/[id]` works |

**Files:** `components/product/product-detail-purchase-bar.tsx`, `components/cart/cart-preview-bottom-sheet.tsx`, `components/cart/cart-added-bottom-sheet.tsx`

---

## 9. 장바구니 (`/join-cart`) 촬영 기준

| Shot | State |
|------|-------|
| **J1** | **Empty cart** — empty state + CTA to shop |
| **J2** | **Items in cart** — at least 2 lines, stepper |
| **J3** | Total amount card / summary block |
| **J4** | Coupon + free-shipping notice (`JoinCartCouponNotice`, goal banner) |
| **J5** | Upsell / 추천상품 rail (if cart non-empty) |
| **J6** | **Bottom checkout bar** — fixed, full width within shell |

### Prep for J2–J6

1. From `/product/1` tap + twice  
2. Navigate to `/join-cart`  
3. Capture J2–J6  

### Checklist

| Check | Pass criteria |
|-------|---------------|
| Coupon tier | Auto-applied tier message readable |
| Free shipping | "조건 충족 시" wording · progress if subtotal &lt; 30k |
| Checkout CTA | Visible without scrolling on 375px |
| No double footer | bottom nav + checkout bar stack OK |

---

## 10. 기타 route (간단 캡처)

| Route | 1–2 shots | Focus |
|-------|-----------|-------|
| `/collections/today-special` | header + grid top | collection copy |
| `/collections/ranking` | ranking columns | 1.6 peek columns |
| `/collections/popular-sellers` | seller cards | horizontal layout |
| `/invite` | hero + referral panel | no broken legal copy |
| `/membership` | banner + benefit list | 준비 중 badges |
| `/support` | hub links | policy chips |
| `/policies/privacy` | legal notice + §1 | draft banner OK |
| `/sellers/moon-fruit` | profile + product rail | trust badges |
| `/seller/dashboard` | full viewport | mock summary or login |
| `/admin/dashboard` | full viewport | KPI cards or login |

---

## 11. 문제 기록 템플릿

이슈 발견 시 아래 블록을 복사해 Slack/Linear/메모에 붙입니다.

```markdown
### Screenshot QA Issue

- **페이지:** (e.g. /category/food?sub=fruit)
- **캡처 위치:** (e.g. H3 — 마감세일 + 인기 판매자)
- **Viewport:** (375 / 390 / 430 px)
- **문제:** (한 줄 요약)
- **기대한 화면:** 
- **현재 화면:** 
- **우선순위:** P0 | P1 | P2 | P3
- **관련 파일 추정:** (e.g. components/deal-catalog-toolbar.tsx)
- **스크린샷 파일명:** 2026-05-29_category-food_390px_filter-sheet.png
```

### Severity guide

| Priority | Examples |
|----------|----------|
| P0 | White screen, 500, checkout broken |
| P1 | + button clipped, filter hidden under image, purchase bar overlap |
| P2 | 2px misalign, copy truncation non-critical |
| P3 | Policy placeholder, admin mock label |

---

## 12. 아침 30분 루틴 (축약)

1. `npm run qa:preflight`  
2. `npm run dev` + smoke optional  
3. **390px** — routes 1–7 (홈 H1–H8, food, fruit sub, product/1, join-cart)  
4. **375px** — home H1, category C4, PDP P4, join-cart J6  
5. **430px** — home H2 (2.5 peek), ranking collection  
6. Issues → template §11  
7. Compare to previous day folder (if exists)

---

## 13. Related automation (reference only)

| Tool | Scope |
|------|-------|
| `npm run qa:routes` | HTTP 200 only — not visual |
| `npm run smoke:content` | Text patterns — not layout |
| Playwright | **Not installed** — future optional |

Visual QA remains **manual screenshot** per this doc.

---

## 14. Change log

| Date | Note |
|------|------|
| 2026-05-29 | Initial checklist — routes, home/category/PDP/cart zones, issue template |
