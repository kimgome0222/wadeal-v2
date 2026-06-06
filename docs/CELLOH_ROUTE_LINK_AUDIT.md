# CELLOH Route & Link Audit

**Date:** 2026-05-31  
**Branch:** `mobile-ui`  
**Start commit:** `b850a92`

## Scope

- Static grep for broken `href`, `router.push`, empty links
- Required route list smoke (see `scripts/qa-routes.sh`)
- Dynamic route fallbacks: product, category, collection, seller
- Button / overlay clickability spot-check

## href / router.push 검색 결과

| Pattern | Result |
|---------|--------|
| `href="#"` (non-anchor) | 1건 — `#product-reviews` (PDP in-page anchor, 정상) |
| `href=""` / `undefined` / `null` | **0건** |
| `router.push('')` / `router.push('#')` | **0건** |
| `TODO/FIXME href` | **0건** (admin-seller-trust-ops-card TODO only) |

## 수정한 링크 / fallback

| File | Change |
|------|--------|
| `lib/product/route-aliases.ts` | QA legacy id `1`, `11` → mock slug |
| `lib/deals.ts` | `wd-wipes-001` mock deal + alias lookup |
| `lib/services/deals.ts` | `resolveProductRouteId` in fetchDealBySlug |
| `app/not-found.tsx` | 추천상품, 장바구니, 고객센터 링크 |
| `app/product/[id]/not-found.tsx` | **신규** — 추천상품 4개 + safe links |
| `components/seller-profile-unavailable.tsx` | `/sellers/celloh`, 추천상품 |
| `components/collections/collection-page-content.tsx` | empty → `/collections/recommended` |
| `scripts/qa-routes.sh` | 필수 route 50+ 확장 |

## 필수 route 점검 (build static)

| Group | Status |
|-------|--------|
| 고객 `/`, `/search`, categories, `/product/1`, `/join-cart`, `/mypage` | ✅ build |
| `/checkout/wd-wipes-001` | ✅ mock alias + deal |
| 컬렉션 16종 | ✅ `getCollectionDefinition` fallback |
| 정책/혜택 `/policies/*`, `/support`, `/invite` | ✅ |
| 판매자 5 profiles | ✅ unavailable UI if missing |
| `/seller/*`, `/admin/dashboard` | ✅ 기존 (auth gated) |

## Dynamic fallback

| Route | Behavior |
|-------|----------|
| `/product/[id]` | unknown → `not-found.tsx` + 추천상품 |
| `/category/[slug]` | invalid slug → global notFound |
| `/collections/[slug]` | unknown → recommended deals fallback |
| `/sellers/[id]` | unknown → `SellerProfileUnavailable` |

## 클릭 불가 의심 (검토만, 수정 없음)

| Component | Note |
|-----------|------|
| `deal-card.tsx` overlay | `pointer-events-none` — badge only, intentional |
| `home-recommended-deal-card.tsx` | overlay decorative |
| `hero-carousel` inactive slides | `pointer-events-none` intentional |
| Link/button nesting | **0건** |

## 남은 404 후보

| Route | Note |
|-------|------|
| `/category/{invalid}` | global 404 (의도) |
| `/mypage/*`, `/seller/*`, `/admin/*` | login redirect (middleware) |
| Supabase-only legacy ids | mock alias `1`, `11` covers QA |

## lint / build

Run after changes:

```bash
rm -rf .next && npm run lint && npm run build
```

## Push

Not performed.
