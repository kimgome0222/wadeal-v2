# CELLOH Recommendation Foundation

**Branch:** `mobile-ui`  
**Scope:** mock / localStorage / display helpers only — no AI API, no DB changes, no personal profiling.

---

## 1. Search (`/search`)

| Route | Behavior |
|-------|----------|
| `/search` | Idle hub: recent terms, recommended terms, trending, seller/deal rails |
| `/search?q=감귤` | Product/seller tabs, 2-col grid, sort bar, empty → recommended fallback |
| `/search?filter=deal` | Redirect → `/category/closing-soon` |
| `/search?sort=popular` (no q) | Redirect → `/collections/popular` |

**localStorage:** `wadeal.recent-searches` (max 10) — chip click, per-term delete, clear all.

**Key files:** `app/search/page.tsx`, `components/search/search-idle-hub.tsx`, `components/search/search-empty-results.tsx`, `lib/search/recent-searches.ts`

---

## 2. Recent products (`celloh-recent-products`)

| Item | Detail |
|------|--------|
| Key | `celloh-recent-products` (migrates legacy `wadeal_recent_deals_v1`) |
| Max | 20 items, dedupe, newest first |
| Fields | `id`, `slug`, `name`, `image`, `price`, `viewedAt` — product info only |
| Write | PDP `ProductViewTracker` → `addRecentDeal` → `addRecentProduct` |
| Read | `/mypage`, `/join-cart`, cart-added sheet fallback |

**Module:** `lib/personalization/recent-products.ts`

---

## 3. Repurchase collection (`/collections/repurchase`)

Mock score: `repurchaseRate` + `reviewCount` + `soldCount` (participants proxy).

**Module:** `lib/recommendations/repurchase-deals.ts`  
**UI:** 2-col grid via `CollectionPageContent`, title “재구매율 높은 상품”

---

## 4. Cart recommendations

**Helper:** `getCartRecommendations(catalog, cartItems, { subtotal, limit })`  
**Module:** `lib/recommendations/cart-recommendations.ts`

Heuristics (mock):

- Empty cart → popular deals
- Together purchase (upsell)
- Same category
- Same seller
- Similar price band
- Coupon / free-shipping gap fill

**Wired:** `components/join-cart-content.tsx`

---

## 5. Seasonal mock (`/collections/seasonal`)

Month-based tag/keyword filter — **not** real AI API.

| Season | Themes |
|--------|--------|
| 봄 (3–5) | 피크닉, 뷰티, 간편식 |
| 여름 (6–8) | 음료, 선케어, 냉감, 간편식 |
| 가을 (9–11) | 간식, 홈카페 |
| 겨울 (12–2) | 난방, 보습, 간편식 |

**Disclaimer:** `SEASONAL_MOCK_DISCLAIMER` in `lib/personalization/recommendation-copy.ts`

---

## 6. Recommendation basis UI

Short copy: “최근 인기, 장바구니 담기, 계절성 등을 바탕으로 추천해요”

**Component:** `components/recommendations/recommendation-basis-hint.tsx`

Shown on: home recommended, seasonal, join-cart upsell, repurchase/seasonal collections.

---

## 7. Cart-added sheet fallback

`getRecentPurchasedRecommendations` order:

1. `celloh-recent-purchases-v1` (add-to-cart slugs)
2. `celloh-recent-products` (recent views)
3. Popular fallback

**Module:** `lib/mock/cart-recommendations.ts`

---

## 8. Constraints

- No KIBI / Supabase schema changes
- No AI API calls
- No personal-data profiling
- localStorage is device-local mock only

---

## 9. Lint / build

```
npm run lint  → PASS
npm run build → PASS (Next.js 16.2.6)
```
