import { categoryTitles } from "@/lib/categories";
import type { Deal } from "@/lib/deals";
import { deals as mockDeals } from "@/lib/deals";

import { resolveSellerProfileForDeal } from "./home-sellers";

function resolveSellerName(deal: Deal): string {
  return deal.brandName?.trim() || "celloh 셀러";
}

export type SellerFeaturedProduct = {
  slug: string;
  title: string;
  imageUrl: string;
  groupPrice: number;
};

export function buildSellerDetailExtras(deal: Deal): {
  categories: string[];
  featuredProducts: SellerFeaturedProduct[];
} {
  const sellerName = resolveSellerName(deal);
  const pool = mockDeals.filter((item) => resolveSellerName(item) === sellerName);
  const related = pool.length > 0 ? pool : [deal];

  const categorySlugs = [
    ...new Set(
      related.flatMap((item) => item.categoryTags.filter((tag) => tag !== "all")),
    ),
  ].slice(0, 3);

  const categories =
    categorySlugs.length > 0 ?
      categorySlugs.map((slug) => categoryTitles[slug as keyof typeof categoryTitles] ?? slug)
    : ["식품", "생활", "리빙"].slice(0, 2 + (resolveSellerProfileForDeal(deal).name.length % 2));

  const featuredProducts = [...related]
    .sort((a, b) => b.participants - a.participants)
    .slice(0, 6)
    .map((item) => ({
      slug: item.slug,
      title: item.title,
      imageUrl: item.imageUrl,
      groupPrice: item.groupPrice,
    }));

  if (featuredProducts.length === 0) {
    featuredProducts.push({
      slug: deal.slug,
      title: deal.title,
      imageUrl: deal.imageUrl,
      groupPrice: deal.groupPrice,
    });
  }

  return { categories, featuredProducts };
}
