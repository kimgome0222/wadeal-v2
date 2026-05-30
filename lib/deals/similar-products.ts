import type { Deal } from "@/lib/deals";

function resolveSellerName(deal: Deal): string {
  return deal.brandName?.trim() || "celloh 셀러";
}

/** 같은 판매자의 다른 상품 */
export function getSameSellerDeals(deal: Deal, catalog: Deal[], limit = 4): Deal[] {
  const sellerName = resolveSellerName(deal);

  return catalog
    .filter(
      (item) => item.slug !== deal.slug && resolveSellerName(item) === sellerName,
    )
    .sort((a, b) => b.participants - a.participants)
    .slice(0, limit);
}

/** 같은 카테고리·유사 태그 상품 (동일 판매자 제외) */
export function getSimilarDeals(deal: Deal, catalog: Deal[], limit = 4): Deal[] {
  const sellerName = resolveSellerName(deal);
  const tags = new Set(deal.categoryTags);

  const scored = catalog
    .filter(
      (item) =>
        item.slug !== deal.slug && resolveSellerName(item) !== sellerName,
    )
    .map((item) => {
      const overlap = item.categoryTags.filter((tag) => tags.has(tag)).length;
      return { item, score: overlap * 3 + item.participants / 1000 };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.item.participants - a.item.participants);

  if (scored.length >= limit) {
    return scored.slice(0, limit).map(({ item }) => item);
  }

  const seen = new Set(scored.map(({ item }) => item.slug));
  const fallback = catalog
    .filter(
      (item) =>
        item.slug !== deal.slug &&
        resolveSellerName(item) !== sellerName &&
        !seen.has(item.slug),
    )
    .sort((a, b) => b.participants - a.participants);

  return [...scored.map(({ item }) => item), ...fallback].slice(0, limit);
}

/** @deprecated {@link filterDealsInCatalog} from `@/lib/deals/catalog-validation` */
export { filterDealsInCatalog } from "@/lib/deals/catalog-validation";
