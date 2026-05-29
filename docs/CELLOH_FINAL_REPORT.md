# celloh 리브랜드 · 판매자 중심 UX — Cursor 최종 보고

> 작성 기준: `main` @ `f85b10b` + QA 후속 수정 7파일 (미커밋)  
> 범위: Wadeal/group-buy → **celloh** UI 리브랜드, 판매자 신뢰·팔로우·검색 강화  
> 원칙: **기능 삭제 없음** · DB/API/라우팅/권한 로직 변경 없음 (mock·localStorage 허용) · 코드 식별자(`WadealLogo`, `wadeal-*`) 유지

---

## 1. 수정 파일 목록

### 1-A. 커밋됨 — `f85b10b` `rebrand: finalize celloh seller-centered experience`

**합계: 257 files** (+5,279 / −937 lines)

| 영역 | 파일 수 | 대표 경로 |
|------|---------|-----------|
| `app/` | 37 | `page.tsx`, `product/[id]/page.tsx`, `search/page.tsx`, `mypage/following-sellers/page.tsx`, `seller/dashboard/page.tsx`, `globals.css` |
| `components/` | 154 | 홈·카드·판매자·상품상세·검색·로그인·Footer·관리자/판매자센터 |
| `lib/` | 65 | `lib/sellers/*`, `lib/copy/*`, `lib/search/*`, `lib/deals.ts`, `lib/ui.ts` |
| 기타 | 1 | `tailwind.config.ts` |

#### 신규 파일 (커밋에 포함)

**페이지**
- `app/mypage/following-sellers/page.tsx`

**판매자 신뢰 · UI (components)**
- `admin-seller-trust-ops-card.tsx`, `category-popular-sellers.tsx`, `celloh-brand-banner.tsx`
- `deal-card-price-block.tsx`, `deal-card-seller-row.tsx`, `follow-seller-button.tsx`
- `home-featured-sellers-section.tsx`, `home-new-sellers-section.tsx`, `home-popular-sellers-section.tsx`
- `home-product-rail-section.tsx`, `home-recommended-deal-card.tsx`, `home-sellers-carousel-section.tsx`, `home-trusted-sellers-section.tsx`
- `login-trust-cards.tsx`, `mypage-following-sellers-content.tsx`
- `product-detail-bottom-sections.tsx`, `product-seller-panel.tsx`, `product-seller-reviews-section.tsx`
- `search-seller-results.tsx`, `seller-card.tsx`, `seller-center-trust-ops-panel.tsx`
- `seller-detail-content.tsx`, `seller-detail-modal.tsx`, `seller-featured-products-rail.tsx`
- `seller-mock-data-note.tsx`, `seller-other-products-section.tsx`, `seller-profile-avatar.tsx`, `seller-profile-summary.tsx`
- `seller-realtime-trust-panel.tsx`, `seller-reviews-list-section.tsx`, `seller-satisfaction-section.tsx`
- `seller-stats-grid.tsx`, `seller-story-section.tsx`, `seller-trust-badges.tsx`, `seller-trust-score-card.tsx`, `seller-trust-score.tsx`, `seller-verified-chip.tsx`
- `auth-login-prompt-inline.tsx`, `ui-skeleton-card.tsx`, `use-seller-detail-interaction.ts`

**판매자 · 카피 (lib)**
- `lib/copy/display-copy.ts`, `lib/copy/empty-states.ts`, `lib/copy/home-display.ts`
- `lib/sellers/badge-priority.ts`, `build-seller-detail-view.ts`, `follow-storage.ts`, `home-sellers.ts`
- `lib/sellers/realtime-trust-metrics.ts`, `recommendation.ts`, `routes.ts`, `satisfaction.ts`, `search-sellers.ts`
- `lib/sellers/seller-detail-mock.ts`, `seller-other-products.ts`, `seller-reviews.ts`, `seller-story.ts`
- `lib/sellers/seller-trust-profile.ts`, `trust-copy.ts`, `trust-data-audit.ts`, `trust-display.ts`, `trust-profile.ts`, `trust-score.ts`

#### 전체 257파일 목록

```bash
git show f85b10b --name-only --format=""
```

---

### 1-B. QA · 정적 검토 후속 수정 (미커밋, working tree)

| 파일 | 변경 요약 |
|------|-----------|
| `app/page.tsx` | 홈 서버 fetch `Promise.all` 병렬화 |
| `app/product/[id]/page.tsx` | `ProductDetailTabs` `initialTab` (리뷰 딥링크) |
| `components/product-detail-tabs.tsx` | `#product-reviews` / `#product-qna` hash → 탭 전환 + 스크롤 |
| `components/product-detail-cta.tsx` | 375px sticky CTA `flex-wrap`, 버튼 `min-w-0` |
| `components/add-to-join-cart-button.tsx` | 장바구니 버튼 모바일 너비 조정 |
| `components/home-category-icons.tsx` | `"use client"` 제거 (서버 컴포넌트화) |
| `components/hero-banner.tsx` | `unoptimized` 제거, `sizes`·`alt` 추가 |

#### 정적 검토(P0) — `f85b10b`에 포함된 수정

| 파일 | 변경 요약 |
|------|-----------|
| `lib/sellers/types.ts` | 판매자센터 타입(`SellerRecord` 등) + 구매자 `SellerProfile` **병합** |
| `lib/search/query.ts` | `shouldUseMockData` import 복구 |
| `components/deal-catalog-toolbar.tsx` | 접힌 퀵필터 `highTrustSeller` 추가 |
| `components/deal-card-featured.tsx` | `currency` import |
| `components/deal-card.tsx` | stretched link (Link+button HTML 문제 해결) |
| `components/follow-seller-button.tsx` | hydration flicker (`null` state + `aria-busy`) |
| `components/product-detail-bottom-sections.tsx` | Q&A 중복 제거 → `#product-qna` 링크 카드 |
| `components/seller-trust-score.tsx` | `SellerTrustScoreCard` thin wrapper |
| `app/globals.css` | `.deal-card` `@apply group` 제거 (빌드 차단 해결) |

---

## 2. 주요 변경 사항

### 2-A. 브랜드 · 카피 (celloh)

- 사용자 노출 문구: **와딜/Wadeal/공동구매 → celloh·판매자 중심 쇼핑 카피**
- `lib/copy/display-copy.ts` — 레거시 문구 → celloh 매핑 (표시 전용)
- `components/wadeal-logo.tsx` — UI 렌더 `celloh` (컴ponent명·SVG 경로 유지)
- `components/site-footer-content.tsx` — celloh + 판매자 철학 3줄
- `lib/seo/site.ts`, `app/not-found.tsx`, `app/unauthorized/page.tsx` 등 메타·에러 카피

### 2-B. 홈 — 판매자 중심 디스커버리

- 판매자 레일: 추천·신규·평점·리뷰 많은 상품 (`home-product-rail-section`, `home-catalog`)
- 카드에 **판매자 행** (`deal-card-seller-row`): 이름·평점·배지·팔로우(+)
- `CellohBrandBanner`, 카테고리 아이콘, `HeroBanner` 철학 카피
- 검색: 판매자 결과 (`search-seller-results`), `seller-trust` 정렬·`highTrustSeller` 필터

### 2-C. 상품 상세 — 판매자 정보 카드

- `ProductSellerPanel` (`#seller-info`): 프로필·배지·**신뢰 점수**·**30일 실시간 지표**·통계·팔로우
- 탭: 상품설명 / 배송·교환·환불 / **상품 리뷰** / Q&A
- 하단: 다른 상품 → **판매자 만족·판매자 리뷰** → 문의 탭 링크
- `ProductDetailCTA`: 장바구니·구매·찜·공유 + 판매자 더보기·문의하기
- 판매자 상세: `SellerDetailModal` + `useSellerDetailInteraction` (공개 `/sellers/[id]` OFF 시 모달)

### 2-D. 팔로우 · 마이페이지

- `FollowSellerButton` — localStorage mock, 비로그인 → `/login?next=`
- `app/mypage/following-sellers/page.tsx` — 팔로우한 판매자 목록

### 2-E. 판매자센터 · 관리자 (운영 UI placeholder)

- `seller-center-trust-ops-panel.tsx` — 판매자 대시보드 신뢰 지표 안내
- `admin-seller-trust-ops-card.tsx` — 관리자 대시보드 신뢰 운영 카드

### 2-F. 타입 · 빌드 · HTML

- `lib/sellers/types.ts` — SellerRecord(센터) + SellerProfile(구매자) 공존
- TypeScript 0 error (`tsc --noEmit`), `npm run build` PASS
- `DealCard` stretched link, 중복 DOM id 제거, CSS `@apply group` 빌드 오류 수정

### 2-G. QA 후속 (미커밋)

- 주문내역/마이페이지 → `?review=true#product-reviews` **탭 자동 전환**
- `#product-qna` / 문의하기 hash **Q&A 탭 연동**
- 375px CTA overflow 수정
- 홈 fetch 병렬화·이미지·client boundary 소폭 개선

---

## 3. mock / placeholder 처리한 부분

> DB·API 연동 전 UI를 채우기 위한 mock. **기능은 유지**, 데이터만 가짜/로컬.

| 영역 | 구현 | 저장소 / 출처 | UI 표시 |
|------|------|----------------|---------|
| **판매자 팔로우** | `lib/sellers/follow-storage.ts` | `localStorage` (`celloh_followed_sellers_v1`) | 팔로우 버튼, 마이페이지 팔로우 목록 |
| **판매자 신뢰 프로필** | `lib/sellers/seller-trust-profile.ts` | `brand_name` + hash seed + 상품 리뷰 partial | `SellerTrustProfile.sources` 필드별 `mock`/`partial`/`db` |
| **신뢰 점수** | `lib/sellers/trust-score.ts` | 클라이언트 가중치 계산 | `SellerTrustScoreCard` |
| **30일 실시간 지표** | `lib/sellers/realtime-trust-metrics.ts` | seed 기반 mock, `source: "mock"` | `SellerRealtimeTrustPanel` |
| **판매자 리뷰** | `lib/sellers/seller-reviews.ts` | `getMockSellerReviews()` 고정 코멘트 풀 | `SellerReviewsListSection` (상품 리뷰와 **분리**) |
| **판매자 만족도** | `lib/sellers/satisfaction.ts` | mock 집계 | `SellerSatisfactionSection` |
| **홈·검색 판매자** | `lib/sellers/home-sellers.ts`, `search-sellers.ts` | deals catalog에서 이름·지표 derive | 홈 레일, 검색 판매자 카드 |
| **판매자 다른 상품** | `lib/sellers/seller-other-products.ts` | `lib/deals` mock catalog 필터 | `SellerOtherProductsSection` |
| **판매자 상세 모달** | `lib/sellers/seller-detail-mock.ts`, `build-seller-detail-view.ts` | mock deals pool | `SellerDetailModal` |
| **판매자 스토리** | `lib/sellers/seller-story.ts` | 템플릿 placeholder | `SellerStorySection` |
| **추천 가중치** | `lib/sellers/recommendation.ts` | 클라이언트 trust score 정렬 | 검색 `seller-trust` 정렬 |
| **공개 프로필 라우트** | `lib/sellers/routes.ts` | `isSellerPublicProfileEnabled() = false` | 모달만, `/sellers/[id]` 미구현 |
| **mock 안내 문구** | `components/seller-mock-data-note.tsx` | — | 상품상세 판매자 패널 하단 |
| **데이터 감사表** | `lib/sellers/trust-data-audit.ts` | 필드별 mock/partial/db 문서 | 개발·운영 참고 |
| **운영 패널** | `seller-center-trust-ops-panel.tsx`, `admin-seller-trust-ops-card.tsx` | placeholder 카피 | 대시보드 안내 UI |

### partial (실데이터 + mock 혼합)

| 필드 | 실데이터 | mock |
|------|----------|------|
| 상품 평점·리뷰 수 | `reviews` 테이블 → `reviewSummary` | 판매자 aggregate·재구매·응답률·인증 |
| 상품 리뷰 | DB `reviews` | — |
| 판매자명 | `deal.brandName` / products | tagline, logo, badges |

### localStorage / mock (판매자 외 기존)

- 찜: `SaveDealButton` → server action + local fallback
- 최근 본 상품: `recent-deals-section`
- 리뷰 좋아요: `lib/data/review-likes.ts` mock fallback

---

## 4. 추후 DB 연결 필요한 부분

### 4-A. 테이블 · API (우선순위)

| 우선순위 | 테이블 / API | 현재 | 연동 파일 |
|----------|--------------|------|-----------|
| **P0** | `seller_follows` (user_id, seller_id) | localStorage | `follow-storage.ts`, `FollowSellerButton`, `mypage/following-sellers` |
| **P0** | `seller_reviews` | mock 배열 | `seller-reviews.ts`, `SellerReviewsListSection` |
| **P0** | `seller_stats` (trust_score, avg_rating, review_count, total_sales, repurchase_rate, response_rate) | mock 계산 | `seller-trust-profile.ts`, `trust-score.ts`, `recommendation.ts` |
| **P1** | `seller_stats_daily` (30일 rolling) | mock | `realtime-trust-metrics.ts`, `SellerRealtimeTrustPanel` |
| **P1** | `sellers.logo_url`, `sellers.tagline`, `seller_public_profiles` | mock/seed | `SellerProfileSummary`, `seller-trust-profile.ts` |
| **P1** | `app/sellers/[id]/page.tsx` + RLS 공개 read | 모달 only | `routes.ts`, `isSellerPublicProfileEnabled()` |
| **P2** | support_tickets → response_rate 집계 | mock | `seller-trust-profile.ts` |
| **P2** | 추천 서비스 / `seller_stats.trust_score` 정렬 | client sort | `lib/search/query.ts`, `recommendation.ts` |

### 4-B. Supabase · 인프라 (코드 수정 없이 대시보드)

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` / publishable key
- Kakao OAuth (Supabase Auth provider)
- RLS: sellers 공개 read, seller_follows CRUD, seller_reviews read
- Migration 적용 (seller_stats, seller_follows, seller_reviews 등)
- Storage: `sellers.logo_url` 업로드 bucket

### 4-C. 결제 · 배포 (구매 동선)

- Toss: `NEXT_PUBLIC_TOSS_CLIENT_KEY`, `TOSS_SECRET_KEY`, webhook
- Vercel env, `NEXT_PUBLIC_SITE_URL`, 도메인 → OAuth/Toss redirect URI
- 상세: `docs/PRE_DEPLOY_CHECKLIST.md`

### 4-D. 코드 TODO 주석 위치 (grep 참고)

```bash
grep -R "TODO(DB)" lib/sellers components/seller-center-trust-ops-panel.tsx
```

---

## 5. 검증 상태

| 항목 | 결과 |
|------|------|
| `npx tsc --noEmit` | PASS |
| `npm run build` | PASS (커밋 `f85b10b` 기준) |
| `app/` 브랜딩 grep (와딜/Wadeal/공동구매) | 사용자 노출 0건 |
| Git | `f85b10b` 커밋됨; QA 7파일 **미커밋** |
| 기능 삭제 | 없음 |

---

## 6. 미커밋 QA 수정 커밋 권장

```bash
git add app/page.tsx app/product/[id]/page.tsx \
  components/product-detail-tabs.tsx components/product-detail-cta.tsx \
  components/add-to-join-cart-button.tsx components/home-category-icons.tsx \
  components/hero-banner.tsx

git commit -m "$(cat <<'EOF'
fix: product tab deep links and home perf polish

EOF
)"
```

---

## 7. 관련 문서

- [`CELLOH_QA_REPORT.md`](./CELLOH_QA_REPORT.md) — 사용자 동선·성능·모바일·배포 전 QA
- `docs/CELLOH_REBRAND_AUDIT.md` — 리브랜드 범위·1단계 분석
- `docs/PRE_DEPLOY_CHECKLIST.md` — 배포 전 env·외부 연동
- `docs/kakao-auth-reconnect.md` — Kakao OAuth (Supabase 경유)

---

*Cursor Agent 최종 보고 통합본 — 2026-05-29*
