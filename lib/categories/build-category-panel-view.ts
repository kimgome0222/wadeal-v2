import type { CategorySlug } from "@/lib/categories";
import {
  dealMatchesDisplaySub,
  getCategoryDisplaySub,
} from "@/lib/categories/category-display-subcategories";
import type { Deal } from "@/lib/deals";
import { getDealReviewScoreLabel } from "@/lib/deals/card-display";
import { buildSellerProfilesFromDeals, getRecommendedSellers, getSpecialPriceDeals } from "@/lib/sellers/home-sellers";
import type { SellerProfile } from "@/lib/sellers/types";

export type CategoryPanelViewModel = {
  recommendedSellers: SellerProfile[];
  popularDeals: Deal[];
  specialPriceDeals: Deal[];
  newestDeals: Deal[];
  reviewDeals: Deal[];
  productCount: number;
  poolDeals: Deal[];
};

function categoryPool(catalog: Deal[], slug: CategorySlug): Deal[] {
  const matched = catalog.filter((deal) => deal.categoryTags.includes(slug));
  return matched.length > 0 ? matched : catalog;
}

function filterBySub(pool: Deal[], slug: CategorySlug, subSlug?: string | null): Deal[] {
  if (!subSlug) {
    return pool;
  }

  const sub = getCategoryDisplaySub(slug, subSlug);
  if (!sub) {
    return pool;
  }

  const subMatched = pool.filter((deal) => dealMatchesDisplaySub(deal, sub));
  return subMatched.length > 0 ? subMatched : pool;
}

function uniqueDeals(deals: Deal[], limit: number): Deal[] {
  const seen = new Set<string>();
  const result: Deal[] = [];

  for (const deal of deals) {
    if (seen.has(deal.slug) || result.length >= limit) {
      continue;
    }
    seen.add(deal.slug);
    result.push(deal);
  }

  return result;
}

function fillFromCatalog(target: Deal[], catalog: Deal[], limit: number): Deal[] {
  const result = [...target];
  const seen = new Set(result.map((deal) => deal.slug));

  for (const deal of catalog) {
    if (result.length >= limit) {
      break;
    }
    if (seen.has(deal.slug)) {
      continue;
    }
    seen.add(deal.slug);
    result.push(deal);
  }

  return result;
}

function getPopularDeals(pool: Deal[], catalog: Deal[], limit: number): Deal[] {
  const sorted = [...pool].sort(
    (a, b) => b.participants - a.participants || b.id - a.id,
  );
  return fillFromCatalog(uniqueDeals(sorted, limit), catalog, limit);
}

function getReviewDeals(pool: Deal[], catalog: Deal[], limit: number): Deal[] {
  const sorted = [...pool].sort(
    (a, b) =>
      getDealReviewScoreLabel(b).count - getDealReviewScoreLabel(a).count ||
      b.participants - a.participants,
  );
  return fillFromCatalog(uniqueDeals(sorted, limit), catalog, limit);
}

function getNewestDeals(pool: Deal[], catalog: Deal[], limit: number): Deal[] {
  const sorted = [...pool].sort((a, b) => b.id - a.id || b.participants - a.participants);
  return fillFromCatalog(uniqueDeals(sorted, limit), catalog, limit);
}

function getSpecialDeals(pool: Deal[], catalog: Deal[], limit: number): Deal[] {
  const fromPool = getSpecialPriceDeals(pool, limit);
  return fillFromCatalog(uniqueDeals(fromPool, limit), catalog, limit);
}

const MAIN_CATEGORY_GRID_MIN: Partial<Record<CategorySlug, number>> = {
  food: 16,
  living: 16,
  beauty: 12,
  fashion: 12,
  digital: 12,
  pet: 12,
};

/** 카테고리·하위카테고리별 그리드 최소 노출 개수 */
export function getCategoryGridMinimum(slug: CategorySlug, subSlug?: string | null): number {
  if (subSlug) {
    return 8;
  }

  return MAIN_CATEGORY_GRID_MIN[slug] ?? 12;
}

/** 그리드 최소 노출 — 카테고리 pool/catalog에서 minimum까지 보충 */
export function ensureMinimumCategoryGridDeals(
  deals: Deal[],
  pool: Deal[],
  catalog: Deal[],
  minimum = 12,
): Deal[] {
  if (deals.length >= minimum) {
    return deals;
  }

  const merged = [...deals];
  const seen = new Set(deals.map((deal) => deal.slug));

  for (const deal of [...pool, ...catalog]) {
    if (merged.length >= minimum) {
      break;
    }
    if (seen.has(deal.slug)) {
      continue;
    }
    seen.add(deal.slug);
    merged.push(deal);
  }

  return merged;
}

function getCategorySellers(
  catalog: Deal[],
  slug: CategorySlug,
  subSlug?: string | null,
  limit = 8,
): SellerProfile[] {
  const pool = filterBySub(categoryPool(catalog, slug), slug, subSlug);
  const fromPool = buildSellerProfilesFromDeals(pool)
    .sort((a, b) => b.totalSales - a.totalSales || b.rating - a.rating)
    .slice(0, limit);

  if (fromPool.length >= limit) {
    return fromPool;
  }

  const fallback = getRecommendedSellers(catalog, limit);
  const seen = new Set(fromPool.map((seller) => seller.id));
  return [
    ...fromPool,
    ...fallback.filter((seller) => !seen.has(seller.id)),
  ].slice(0, limit);
}

/** 카테고리 패널 우측 섹션용 view model */
export function buildCategoryPanelViewModel(
  catalog: Deal[],
  slug: CategorySlug,
  subSlug?: string | null,
): CategoryPanelViewModel {
  const pool = filterBySub(categoryPool(catalog, slug), slug, subSlug);

  return {
    recommendedSellers: getCategorySellers(catalog, slug, subSlug, 8),
    popularDeals: getPopularDeals(pool, catalog, 12),
    specialPriceDeals: getSpecialDeals(pool, catalog, 12),
    newestDeals: getNewestDeals(pool, catalog, 12),
    reviewDeals: getReviewDeals(pool, catalog, 12),
    productCount: pool.length > 0 ? pool.length : catalog.length,
    poolDeals: pool,
  };
}

/** 전체 카테고리(좌측 '전체') 패널용 */
export function buildAllCategoryPanelViewModel(catalog: Deal[]): CategoryPanelViewModel {
  return {
    recommendedSellers: getRecommendedSellers(catalog, 8),
    popularDeals: getPopularDeals(catalog, catalog, 12),
    specialPriceDeals: getSpecialDeals(catalog, catalog, 12),
    newestDeals: getNewestDeals(catalog, catalog, 12),
    reviewDeals: getReviewDeals(catalog, catalog, 12),
    productCount: catalog.length,
    poolDeals: catalog,
  };
}
