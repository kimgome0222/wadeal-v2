import type { Deal } from "@/lib/deals";
import { getSpecialPriceDeals } from "@/lib/sellers/home-sellers";
import { getTierProgress } from "@/lib/pricing/tiers";

export type HomeRankingCategory = {
  id: string;
  label: string;
  moreHref: string;
};

export const HOME_RANKING_CATEGORIES: HomeRankingCategory[] = [
  { id: "ready-meal", label: "간편식 TOP20", moreHref: "/category/food?sub=food-processed" },
  { id: "fresh", label: "신선식품 TOP20", moreHref: "/category/food" },
  { id: "snack", label: "간식 TOP20", moreHref: "/category/food" },
  { id: "bakery", label: "베이커리 TOP20", moreHref: "/category/food" },
  { id: "side", label: "반찬 TOP20", moreHref: "/category/food" },
];

export const HOME_SWIPE_TABS = [
  { id: "best", label: "베스트", sectionId: "home-section-popular" },
  { id: "sale", label: "세일", sectionId: "home-section-today-special" },
  { id: "deal", label: "특가", sectionId: "home-section-coupon-sale" },
  { id: "ranking", label: "랭킹", sectionId: "home-section-ranking" },
  { id: "new", label: "신상품", sectionId: "home-section-new" },
  { id: "coupon", label: "쿠폰", sectionId: "home-section-coupon-sale" },
  { id: "only", label: "Only Celloh", sectionId: "home-section-only-celloh" },
] as const;

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
  return uniqueDeals([...target, ...catalog], limit);
}

export function getEndingSoonDeals(catalog: Deal[], limit = 12): Deal[] {
  const sorted = [...catalog]
    .filter((deal) => deal.endsInMinutes > 0)
    .sort((a, b) => a.endsInMinutes - b.endsInMinutes || b.participants - a.participants);
  return fillFromCatalog(sorted, catalog, limit);
}

export function getWeekendDeals(catalog: Deal[], limit = 12): Deal[] {
  const sorted = [...catalog].sort(
    (a, b) => b.participants - a.participants || b.id - a.id,
  );
  return fillFromCatalog(sorted.slice(3), catalog, limit);
}

export function getSeasonalDeals(catalog: Deal[], limit = 12): Deal[] {
  const month = new Date().getMonth() + 1;
  let tag: Deal["categoryTags"][number] = "food";

  if (month >= 6 && month <= 8) {
    tag = "food";
  } else if (month >= 12 || month <= 2) {
    tag = "living";
  } else if (month >= 3 && month <= 5) {
    tag = "beauty";
  }

  const matched = catalog.filter((deal) => deal.categoryTags.includes(tag));
  return fillFromCatalog(matched, catalog, limit);
}

export function getLowestPriceDeals(catalog: Deal[], limit = 12): Deal[] {
  const sorted = [...catalog].sort((a, b) => {
    const priceA = getTierProgress(a).applicablePrice;
    const priceB = getTierProgress(b).applicablePrice;
    return priceA - priceB || b.participants - a.participants;
  });
  return fillFromCatalog(sorted, catalog, limit);
}

export function getOnlyCellohDeals(catalog: Deal[], limit = 8): Deal[] {
  const picked = catalog.filter((_, index) => index % 7 === 0);
  return fillFromCatalog(picked, catalog, limit);
}

export function getRankingDealsForCategory(
  catalog: Deal[],
  categoryId: string,
  limit = 20,
): Deal[] {
  const offset = HOME_RANKING_CATEGORIES.findIndex((item) => item.id === categoryId);
  const sorted = [...catalog].sort(
    (a, b) => b.participants - a.participants || b.id - a.id,
  );
  const rotated =
    offset > 0 ?
      [...sorted.slice(offset), ...sorted.slice(0, offset)]
    : sorted;
  return fillFromCatalog(rotated, catalog, limit);
}

export function getSpecialPriceDealsForHome(catalog: Deal[], limit = 12): Deal[] {
  return fillFromCatalog(getSpecialPriceDeals(catalog, limit), catalog, limit);
}
