# CELLOH Review Display Rules

**Date:** 2026-05-31  
**Branch:** `mobile-ui`  
**Status:** Display & formatting reference — **mock fallback documented**

**Related:** [CELLOH_REVIEW_UGC_POLICY.md](./CELLOH_REVIEW_UGC_POLICY.md), [CELLOH_PRODUCT_DATA_POLICY.md](./CELLOH_PRODUCT_DATA_POLICY.md)

**Code:** `components/product-reviews-section.tsx`, `lib/reviews/review-sort.ts`, `lib/product/card-badge-meta.ts`

---

## Product detail (PDP) — review section

### Sort & filter

| Mode | Label (UI) | Code | Notes |
|------|--------------|------|-------|
| Latest | 최신순 | `latest` | Default available |
| High rating | 별점 높은순 | `rating` | **Default on PDP** (`sortMode` initial) |
| Helpful | 도움순 | `helpful` | Local like counts |
| Low rating | 평점 낮은순 | — | ⏳ **추후 구현** |
| Photo only | 사진리뷰 | toggle `photoOnly` | Filters `images.length > 0` |

**Components:** `ReviewSortChips`, photo toggle chips in `ProductReviewsSection`

### Featured blocks

| Block | Rule |
|-------|------|
| **베스트리뷰** | `ReviewBestSection` — top 3 from `getFeaturedBestReviews()` |
| **사진리뷰 grid** | `ProductPhotoReviewsGrid` — thumbnails from reviews + product images fallback |
| **Summary header** | Avg rating + count from `ReviewSummary` (DB or mock) |

### Review card elements

| Element | Display |
|---------|---------|
| **구매자 인증 badge** | `isVerifiedPurchase` → "구매확정" label |
| **판매자 답글** | `sellerReply` body under review when present |
| **신고 버튼** | `ReviewCard` → report modal → `submitReviewReportAction` |
| **도움돼요** | Local like toggle (`local-review-likes.ts`) |
| **베스트 badge** | `isBestReview` prop from `getBestReviewIds()` |

### Empty state

| Condition | Copy / component |
|-----------|------------------|
| No reviews | `EmptyState` + CELLOH_PRODUCT_DETAIL empty copy |
| Photo filter empty | "사진 리뷰가 아직 없어요" (inline message) |
| Cannot write | `ProductReviewPolicyNotice` + link `/policies/review` |

---

## Product card — review count format

**Single standard for all cards** — `lib/product/card-badge-meta.ts`:

| Actual/mock count | Display label | Example line |
|-------------------|---------------|--------------|
| 0 or missing | `1+` | ★ 4.8 · 리뷰 **1+** |
| 1–9 | `{n}+` | ★ 4.9 · 리뷰 **3+** |
| 10–9,999 | comma format | ★ 4.7 · 리뷰 **2,314** |
| ≥ 10,000 | cap | ★ 4.8 · 리뷰 **9,999+** |

**Functions:** `formatReviewCountLabel()`, `getProductCardReviewMeta()`

### Mock fallback (pre-DB)

When no real review count:

1. Use `participants / 3` if `deal.participants > 0`
2. Else deterministic seed from `deal.id + slug` → 1–9000

⚠️ **운영 전 DB 연결 필요** — mock counts are for UI polish only. Same logic in `resolveReviewCountFallback()` for PDP trust row.

**Component:** `ProductCardContent` — `★ {score} · 리뷰 {countLabel}`

---

## PDP trust row (summary panel)

Uses `resolveReviewCountFallback(deal, reviewSummary.totalCount)` when DB count missing.

Display: `(2,314)` with `toLocaleString("ko-KR")` — same comma rules as cards where applicable.

---

## Seller profile review counts

- Full number with commas: `reviewCount.toLocaleString("ko-KR")`
- Source: seller analytics mock or DB when connected

---

## Admin / seller list previews

| Surface | Format |
|---------|--------|
| Seller reviews list | Rating as "N점", verified flag text |
| Admin reviews | Moderation status badges |

---

## Trust principles

| Do | Don't |
|----|-------|
| Same count format on every product card | Random formats per rail |
| Label mock data in internal docs | Claim mock counts are audited sales |
| Show verified badge only when `isVerifiedPurchase` | Fake "구매확정" on all reviews |
| Cap display at 9,999+ | Show exact 100000+ on cards |

---

## Code map

| Feature | File |
|---------|------|
| PDP section | `components/product-reviews-section.tsx` |
| Sort/filter | `lib/reviews/review-sort.ts` |
| Card meta | `lib/product/card-badge-meta.ts` |
| Fallback count | `lib/product/display-fallbacks.ts` |
| Policy notice | `components/product/product-review-policy-notice.tsx` |

**No display logic changed in this task — documentation only.**
