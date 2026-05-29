# celloh 리브랜딩 1단계 — 영향 범위 분석

> **작성일:** 2026-05-29  
> **프로젝트:** `~/Documents/wadeal-v2` (Wadeal v2 only — KIBI 코드 없음)  
> **단계:** 1단계 분석만 — **코드/DB/파일명 변경 없음**

## celloh 브랜드 정의 (요약)

| 항목 | 내용 |
|------|------|
| 브랜드명 | celloh |
| 도메인 | www.celloh.co.kr |
| 메인 슬로건 | 누가 만들었는지 알고 사세요. |
| 서브 슬로건 | 좋은 상품은 좋은 판매자에게서 시작됩니다. |
| 철학 | 판매자를 알면, 상품이 보입니다. |
| Primary | `#2E5E4E` |
| Accent | `#E28A3B` |
| Background | `#FFFFFF` |
| 제외 | 공동구매 팀 모집·100명 모집·빨간색 중심 UI |
| 추가 제외 (2026-05-29) | 판매자 스토리/영상 피드, 생산과정 필수, 농산물 전용 구조 |

---

## 1. 문자열 검색 결과

### 1.1 Wadeal / wadeal / 와딜

| 영역 | 파일 수 (대략) | 비고 |
|------|----------------|------|
| **앱·컴포넌트·lib** | **~230** | UI 문구, 클래스명, env, SEO |
| **docs/** | **~54** | work-queue, handoff, QA, 백업 스냅샷 |
| **supabase/** | **~10** | seed, schema, migration 주석 |
| **package.json / lock** | 2 | npm 패키지명 `wadeal` |
| **public/** | 1 | `wadeal-wordmark.svg` |

**핵심 집중 파일 (브랜드 노출 빈도 높음):**

- `components/wadeal-logo.tsx` — 로고·워드마크·「와딜 \| 공동구매」
- `lib/seo/site.ts` — siteConfig name/title/description/themeColor
- `app/layout.tsx`, `app/manifest.ts` — metadata, PWA
- `components/login-screen.tsx`, `components/signup-form.tsx` — 온보딩
- `components/app-splash.tsx` — 스플래시 (`wadeal-splash-shown`, wordmark)
- `components/site-footer-content.tsx` — 푸터·사업자 정보
- `components/hero-banner.tsx`, `components/mypage-*` — 마케팅/안내 문구
- `lib/auth/credentials.ts` — `@users.wadeal.local` 이메일 매핑
- `.env.local.example`, `next.config.ts` — SITE_URL, 앱 식별자

### 1.2 공동구매 / group buy / group_buy

| 영역 | 파일 수 (대략) |
|------|----------------|
| 코드 (docs 제외) | **~90** |
| docs | **~40** |

**DB·도메인 핵심:**

- `group_buy_deals`, `price_tiers` — `supabase/migrations/001_initial_schema.sql` 이후 다수 migration
- `lib/deals.ts`, `lib/pricing/tiers.ts`, `lib/pricing/compute-joined-price.ts`
- `lib/orders/finalize-deal.ts` — 마감 시 단가 확정
- `lib/products/product-type.ts` — normal vs groupbuy 구분

**UI·라우트 핵심:**

- `app/join/[id]/page.tsx`, `app/join-complete/page.tsx`
- `app/mypage/groupbuys/page.tsx`, `app/mypage/participating/page.tsx`
- `components/group-buy-progress.tsx`, `components/price-tier-steps.tsx`
- `components/tier-price-summary.tsx`, `components/product-invite-section.tsx`
- `components/checkout-complete-button.tsx` — 공동구매 마감 연동
- `app/commerce-policy/page.tsx`, `lib/policies/content.ts` — 공동구매 정책
- `components/user-consent-form.tsx` — groupbuy 필수 동의

### 1.3 viral / invite / referral / team purchase

| 패턴 | 코드 파일 (docs 제외) | 대표 경로 |
|------|----------------------|-----------|
| referral | ~15 | `lib/share/referral-code.ts`, `lib/share/log-referral-visit.ts`, `supabase/migrations/017_share_referral_system.sql` |
| invite / share | ~12 | `components/product-invite-section.tsx`, `app/share/[id]/page.tsx`, `components/mypage-share-stats.tsx` |
| viral | 0 (코드) | docs/work-queue에만 언급 |
| team purchase / 100명 / 목표 인원 | ~25 | `components/group-buy-progress.tsx`, `product-summary-panel.tsx`, tier UI |

---

## 2. UI·에셋·메타데이터 존재 파일

### 2.1 로고 / favicon / PWA

| 유형 | 파일 | celloh 영향 |
|------|------|-------------|
| 로고 컴포넌트 | `components/wadeal-logo.tsx` | **전면 교체** (이름·문구·색·SVG) |
| 워드마크 SVG | `public/wadeal-wordmark.svg` | **신규 celloh 워드마크** |
| 앱 아이콘 | `public/icons/icon-192.svg`, `icon-512.svg` | 빨간 `#e53935` + W → celloh 아이콘 |
| favicon | `app/icon.svg` (layout 연동) | themeColor·브랜드색 |
| 스플래시 | `components/app-splash.tsx` | wordmark → celloh |
| manifest | `app/manifest.ts` | `siteConfig` 의존 |

### 2.2 metadata / SEO

| 파일 | 내용 |
|------|------|
| `lib/seo/site.ts` | `와딜`, `공동구매`, `#e53935`, keywords |
| `app/layout.tsx` | `rootMetadata`, `siteConfig.themeColor` |
| `app/manifest.ts` | name, description, theme_color |
| `app/sitemap.ts`, `app/robots.ts` | 도메인·경로 (join-cart 등) |

### 2.3 Header / Footer / 네비

| 파일 | 역할 |
|------|------|
| `components/header.tsx` | 검색 placeholder「공동구매」, wadeal-* 색 |
| `components/bottom-navigation.tsx` | active `wadeal-red` |
| `components/site-footer-content.tsx` | 링크「공동구매 운영정책」, Wadeal 사업자 표기 |
| `components/sub-header.tsx`, `components/search-header.tsx` | 서브 네비 |

### 2.4 인증·마이페이지

| 파일 | 역할 |
|------|------|
| `components/login-screen.tsx` | WadealLogo, 카카오/구글, 약관 |
| `components/signup-form.tsx`, `forgot-*`, `reset-password-form.tsx` | Wadeal 브랜딩 |
| `components/mypage-dashboard.tsx`, `mypage-page-content.tsx` | 공동구매 퀵링크, groupbuys |
| `components/mypage-account-hub.tsx`, `mypage-profile-content.tsx` | 프로필·탈퇴 문구 |
| `components/mypage-settings-content.tsx`, `mypage-withdrawal-content.tsx` | Wadeal 서비스 탈퇴 |
| `app/mypage/groupbuys/page.tsx`, `participating/page.tsx` | 공동구매 전용 메뉴 |

### 2.5 상품·구매 흐름

| 파일 | 역할 |
|------|------|
| `app/product/[id]/page.tsx` | 상세 + referral 로깅 |
| `components/product-summary-panel.tsx` | 목표 달성, tier, GroupBuyProgress |
| `components/product-detail-cta.tsx` | join-cart / join 참여 |
| `components/product-invite-section.tsx` | 초대·공유 (제거 후보) |
| `app/join-cart/page.tsx`, `join/[id]/page.tsx` | 장바구니·참여 |
| `app/checkout/[id]/page.tsx`, `checkout-order-shell.tsx` | tier·공동구매 할인 요약 |
| `app/payment/*` | 결제 완료/실패 문구 |

### 2.6 판매자·관리자

| 파일 | 역할 |
|------|------|
| `app/seller/dashboard/page.tsx` | 판매자 대시보드 |
| `components/seller-shell.tsx`, `seller-sidebar.tsx` | Wadeal 판매자센터 |
| `app/seller/apply/page.tsx` | 입점 신청 |
| `app/admin/*` | 관리자 전역 Wadeal 문구 |
| `components/admin-nav.tsx` | 관리자 네비 |

### 2.7 이메일·알림 템플릿

| 파일 | 역할 |
|------|------|
| `lib/notifications/*.ts` | 이벤트 타입·메시지 (order, seller, price-tier, deadline) |
| `components/notification-card.tsx` | 알림 UI 문구 |
| `lib/share/share-message.ts`, `lib/share/kakao.ts` | 공유/카카오 메시지 (Wadeal·공동구매) |

**별도 HTML 이메일 템플릿 디렉터리는 없음** — 알림은 DB + in-app 위주.

### 2.8 문서

| 범주 | 파일 수 | 비고 |
|------|---------|------|
| docs/*.md | ~50+ | Wadeal·공동구매 대량 언급 |
| docs/work-queue.json | 1 | 580+ wadeal 문자열 |
| docs/work-queue-prompts/ | 7 | 작업 프롬프트 |

---

## 3. 브랜드 컬러 사용 위치

### 3.1 Tailwind 테마 (단일 소스)

```22:31:tailwind.config.ts
      colors: {
        wadeal: {
          red: "#e53935",
          coral: "#ff6b4a",
          ink: "#111827",
          muted: "#6b7280",
          line: "#e5e7eb",
          surface: "#f7f8fa",
          kakao: "#fee500",
        },
```

**2단계 권장:** `wadeal` → `celloh` 팔레트 추가 후 점진 치환  
- Primary `#2E5E4E`, Accent `#E28A3B`  
- `ink/line/surface/muted`는 오늘의집형 neutrals 유지 가능

### 3.2 전역 CSS

| 파일 | 내용 |
|------|------|
| `app/globals.css` | `.btn-primary` → `bg-wadeal-red`, `.deal-card`, `.btn-kakao` |
| `lib/ui.ts` | `btnPrimary`, `input focus:border-wadeal-red`, `badgeTone` 공동구매 배지 |

### 3.3 wadeal-* 클래스 사용

| 토큰 | 영향 파일 수 (대략) |
|------|---------------------|
| `wadeal-red` / red 계열 | **~220** |
| `#e53935` (themeColor, SVG) | `lib/seo/site.ts`, `public/icons/*.svg` |
| `text-red-*` / `bg-red-*` (일반 Tailwind) | **~130** (일부는 에러·탈퇴 UI) |

### 3.4 celloh 컬러와 충돌

- 현재 **Primary = 빨강 `#e53935`** → celloh **녹색 `#2E5E4E`** 로 전환 필요
- Accent **코랄/레드** → **`#E28A3B`** (따뜻한 포인트)
- 카카오 노랑(`wadeal-kakao`)은 유지 가능

---

## 4. 공동구매 중심 요소

### 4.1 UI 컴포넌트 (제거·대체 후보)

| 파일 | 기능 |
|------|------|
| `components/group-buy-progress.tsx` | N명/N% 진행률 |
| `components/price-tier-steps.tsx` | 구간별 할인 단계 |
| `components/tier-price-summary.tsx` | tier 예상가 |
| `components/group-buy-order-card.tsx` | 주문 카드 groupbuy 표시 |
| `components/product-invite-section.tsx` | 친구 초대 공동구매 |
| `components/deal-deadline.tsx` | 마감 카운트다운 (일반 마감과 구분 필요) |
| `components/admin-price-tiers-editor.tsx` | 관리자 tier 편집 |
| `components/admin-finalize-deal-button.tsx` | deal 마감 확정 |

### 4.2 라우트·페이지

| 경로 | 설명 |
|------|------|
| `/join/[id]` | 공동구매 참여 |
| `/join-complete` | 참여 완료 |
| `/mypage/groupbuys` | 내 공동구매 |
| `/mypage/participating` | 참여 중 |
| `/share/[id]` | referral 랜딩 |
| `/commerce-policy` | 공동구매 운영정책 |

### 4.3 데이터·비즈니스 로직

| 파일/테이블 | 설명 |
|-------------|------|
| `group_buy_deals` | 마감일, target_members, current_members |
| `price_tiers` | 인원별 단가 JSON |
| `lib/orders/finalize-deal.ts` | 마감 후 joined_price 확정 |
| `lib/notifications/deadline.ts`, `price-tier.ts` | tier/마감 알림 |
| `lib/settlements/calculate-settlement.ts` | groupbuy 정산 |
| `join_cart` | 이름은 cart이나 공동구매 deal 연동 |

### 4.4 유지·전환 판단

- **일반 e-commerce로 전환:** tier·target_members·finalize 흐름 **deprecated 또는 normal product only**
- **「모일수록 할인」 완전 제거 vs 일반 할인/쿠폰으로 대체** — 2단계 PM 결정 필요

---

## 5. 판매자 정보 — 기존 구조 vs celloh 요구

### 5.1 celloh 요구 (상품 상세 공통 노출)

| 필드 | 현재 존재 | 위치/비고 |
|------|-----------|-----------|
| 판매자명 | △ | `sellers.company_name`, `suppliers.name` — **상품 상세 UI 미노출** |
| 프로필 이미지/로고 | ✗ | DB·UI 없음 |
| 한줄 인사글 | ✗ | 없음 |
| 사업자 인증 | △ | `sellers.status`, `business_number` — 관리자/입점만 |
| 본인/계정 인증 | △ | `users.phone_verified_at` — 판매자↔구매자 UI 분리 없음 |
| 누적 판매수 | △ | `seller-analytics` — **판매자 대시보드만** |
| 평균 평점 | △ | seller-analytics `avgRating` — **상품 리뷰 기준, 판매자 카드 없음** |
| 리뷰 수 | △ | 상품별 `reviewSummary` — 판매자 집계 UI 없음 |
| 재구매율 | ✗ | 없음 |
| 문의 응답률 | ✗ | support tickets 있으나 **응답률 집계 없음** |
| 가입/입점일 | △ | `sellers.created_at` — buyer-facing 없음 |

### 5.2 기존 관련 파일

| 영역 | 파일 |
|------|------|
| Seller DB/타입 | `lib/sellers/types.ts`, `lib/data/sellers.ts`, `supabase/migrations/020_sellers_center.sql` |
| Supplier(공급사) | `lib/data/suppliers.ts`, `app/admin/suppliers/*` |
| Seller analytics | `lib/data/seller-analytics.ts` — dashboard stats |
| Seller dashboard | `app/seller/dashboard/page.tsx` |
| Seller reviews/CS | `app/seller/reviews/*`, `app/seller/support/page.tsx` |
| Admin seller review | `app/admin/sellers/*`, `components/admin-sellers-content.tsx` |
| Product trust (상품) | `components/product-trust-stats.tsx`, `lib/reviews/product-trust.ts` |
| Reviews/Q&A | `components/product-reviews-section.tsx`, `lib/data/reviews.ts`, support tickets |

### 5.3 celloh 2단계 신규 필요 (예상)

- `SellerProfileCard` (상품 상세·검색 카드 하단)
- DB: `seller_profiles` 또는 `sellers` 확장 — `tagline`, `logo_url`, `display_name`, `response_rate`, `repurchase_rate`
- API: product → seller join + stats materialized view

---

## 6. 보고 요약표

### 6.1 브랜드명 변경 대상

**우선순위 P0 (사용자 노출):**

- `components/wadeal-logo.tsx`
- `public/wadeal-wordmark.svg`, `public/icons/icon-*.svg`
- `lib/seo/site.ts`, `app/layout.tsx`, `app/manifest.ts`
- `components/login-screen.tsx`, `signup-form.tsx`, `app-splash.tsx`
- `components/site-footer-content.tsx`, `components/hero-banner.tsx`

**P1 (전역 문구):**

- `components/mypage-*`, `components/header.tsx`, `components/admin-*`, `components/seller-*`
- `lib/policies/content.ts`, `lib/share/share-message.ts`
- `.env.local.example` (`NEXT_PUBLIC_SITE_URL`, `@users.wadeal.local`)

**P2 (문서·내부):**

- `docs/**` (~54 files), `README.md`, `package.json` name

**파일명 변경 후보 (2단계, 1단계 미실시):**

- `wadeal-logo.tsx` → `celloh-logo.tsx`
- `wadeal-wordmark.svg` → `celloh-wordmark.svg`
- Tailwind `wadeal.*` → `celloh.*`

### 6.2 문구 변경 대상

| 카테고리 | 대표 문구 | 파일 예 |
|----------|-----------|---------|
| 브랜드명 | 와딜, Wadeal | SEO, 로고, 푸터 |
| 서비스 정의 | 공동구매, 함께 사면 | hero, signup, policies |
| 슬로건 | (없음 → celloh 슬로건 신규) | hero, login, about |
| 법적/약관 | 공동구매 가격 확정 | `user-consent-form`, `commerce-policy` |
| 알림 | tier/마감/참여 | `lib/notifications/*` |

### 6.3 컬러 변경 대상

1. `tailwind.config.ts` — palette 정의
2. `app/globals.css` — component layer
3. `lib/ui.ts` — design tokens + badgeTone
4. `lib/seo/site.ts` + `app/manifest.ts` — themeColor
5. **~220 files** — `wadeal-red` 등 class 치환 (자동화 권장)
6. `public/icons/*.svg` — fill color

### 6.4 공동구매 관련 파일 (핵심 ~40)

- UI: `group-buy-progress`, `price-tier-steps`, `tier-price-summary`, `product-invite-section`, `group-buy-order-card`
- Pages: `join/[id]`, `join-complete`, `mypage/groupbuys`, `mypage/participating`, `share/[id]`
- Lib: `lib/pricing/*`, `lib/orders/finalize-deal.ts`, `lib/deals/lifecycle.ts`
- DB: migrations 001, 013, 025, … `group_buy_deals`, `price_tiers`
- Admin: `admin-price-tiers-editor`, `admin-finalize-deal-button`

### 6.5 판매자 정보 관련 기존 파일

- `lib/sellers/types.ts`, `lib/data/sellers.ts`
- `lib/data/seller-analytics.ts`
- `lib/data/suppliers.ts`
- `app/seller/dashboard/page.tsx`
- `app/admin/sellers/*`, `app/admin/suppliers/*`
- `components/product-trust-stats.tsx` (상품 단위만)
- **celloh 판매자 카드 UI: 미구현**

---

## 7. 리브랜딩 예상 수정 범위

| 레이어 | 규모 | 설명 |
|--------|------|------|
| **Design tokens** | S | tailwind + globals + ui.ts |
| **Brand assets** | S | logo, icons, splash |
| **SEO / metadata** | S | site.ts, manifest, sitemap |
| **Copy pass (UI)** | **L** | ~230 코드 파일 문구 |
| **Group buy removal** | **XL** | UI + checkout + orders + DB schema |
| **Seller profile (new)** | **L** | 신규 UI + DB migration + stats |
| **Docs** | M | 54+ md/json |
| **Tests / QA** | M | build, E2E, 결제 |

**총 예상:** 코드 **300+ touch points**, DB migration **1~3개** (seller profile, groupbuy deprecate), 문서 **전량**.

---

## 8. 위험 요소

| # | 위험 | 설명 |
|---|------|------|
| 1 | **KIBI 혼선** | 반드시 `wadeal-v2` only 작업; 다른 repo/path 금지 |
| 2 | **공동구매 제거 파급** | orders, payments, settlements, notifications, consent 전부 tier/groupbuy 가정 |
| 3 | **DB schema** | `group_buy_deals`/`price_tiers` 제거 시 migration·RLS·seed 연쇄 |
| 4 | **도메인/env** | `@users.wadeal.local`, `NEXT_PUBLIC_SITE_URL`, Kakao OAuth callback |
| 5 | **색상 일괄 치환** | 220+ 파일 — 누락 시 빨강/녹색 혼재 |
| 6 | **파일명 변경** | import 경로 대량 수정 (`wadeal-logo` 등) |
| 7 | **work-queue.json** | 580+ Wadeal 참조 — 문서 동기화 부담 |
| 8 | **판매자 신뢰 지표** | 재구매율·응답률 **신규 집계** 필요 — 데이터 없으면 mock/fallback |
| 9 | **배포** | Vercel env, Supabase, Toss webhook URL 도메인 변경 |
| 10 | **법무 문구** | TERMS/PRIVACY/commerce-policy celloh 기준 재검토 |

---

## 9. 2단계 추천 수정 순서

1. **Design system** — `tailwind.config.ts`, `globals.css`, `lib/ui.ts` celloh palette (`#2E5E4E`, `#E28A3B`)
2. **Brand assets + SEO** — logo, icons, `lib/seo/site.ts`, manifest, splash (문구·색만, 파일명 유지 가능)
3. **Header / Footer / Login / Signup** — 첫 인상 celloh 통일
4. **Hero + 홈 카피** — 슬로건 반영, 공동구매 히어로 제거
5. **상품 상세 1차** — 공동구매 UI 숨김 + **SellerProfileCard** scaffold (mock stats)
6. **구매 흐름** — join-cart → 일반 cart naming, checkout에서 tier 제거
7. **마이페이지** — groupbuys/participating 메뉴 정리
8. **판매자센터 / 관리자** — 브랜드 문구 + seller profile 필드 (tagline, logo)
9. **알림·공유·referral** — 메시지 celloh화; invite/referral 정책 결정
10. **DB migration** — seller profile columns; groupbuy deprecate (별 migration, 적용은 사용자 지시 후)
11. **docs/work-queue** — celloh 기준 재정렬
12. **전체 build + QA**

---

## 10. 1단계 결론

- Wadeal 브랜드는 **코드 ~230파일**, **Tailwind wadeal 토큰 ~220파일**에 깊게 박혀 있음.
- **공동구매**는 UI·주문·결제·DB·약관까지 **아키텍처 핵심** — 단순 문구 변경이 아니라 **제품 모델 전환**에 가깝다.
- **celloh 판매자 정보**는 입점(`sellers`)·통계(`seller-analytics`) 기반은 있으나, **구매자-facing 판매자 카드·신뢰지표 UI/DB는 거의 없음** → 2단계에서 신규 개발 필요.
- **KIBI와 겹침 없음** — 현재 repo는 `wadeal-v2` 단일.

---

## 부록: 분석 명령 (재현)

```bash
# 브랜드 문자열 (코드, docs 제외)
grep -rl 'Wadeal\|wadeal\|와딜' --include='*.{ts,tsx,css,svg,sql,json}' --exclude-dir=docs .

# wadeal tailwind tokens
grep -rl 'wadeal-red\|wadeal-ink\|wadeal-line' --include='*.{ts,tsx,css}' .

# 공동구매
grep -rl '공동구매\|group_buy\|group-buy\|price_tier' --include='*.{ts,tsx,sql}' .
```

---

*1단계: 분석 문서만 생성. 코드/DB/배포 변경 없음.*
