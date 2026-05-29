import type { Deal } from "@/lib/deals";

/** 같은 카테고리·유사 태그 상품 (UI 추천용) */
export function getSimilarDeals(deal: Deal, catalog: Deal[], limit = 6): Deal[] {
  const tags = new Set(deal.categoryTags);

  const scored = catalog
    .filter((item) => item.slug !== deal.slug)
    .map((item) => {
      const overlap = item.categoryTags.filter((tag) => tags.has(tag)).length;
      const sameBrand =
        deal.brandName && item.brandName && deal.brandName === item.brandName ? 2 : 0;
      return { item, score: overlap * 3 + sameBrand + item.participants / 1000 };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.item.participants - a.item.participants);

  if (scored.length >= limit) {
    return scored.slice(0, limit).map(({ item }) => item);
  }

  const seen = new Set(scored.map(({ item }) => item.slug));
  const fallback = catalog
    .filter((item) => item.slug !== deal.slug && !seen.has(item.slug))
    .sort((a, b) => b.participants - a.participants);

  return [...scored.map(({ item }) => item), ...fallback].slice(0, limit);
}
