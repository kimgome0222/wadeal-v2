import type { Deal } from "@/lib/deals";
import { deals as mockDeals } from "@/lib/deals";

function resolveSellerName(deal: Deal): string {
  return deal.brandName?.trim() || "celloh 셀러";
}

export type SellerOtherProduct = {
  id: number;
  slug: string;
  title: string;
  imageUrl: string;
  groupPrice: number;
  rating: string;
};

/** 같은 판매자의 다른 상품 (mock catalog, UI only). */
export function getSellerOtherProducts(deal: Deal, limit = 6): SellerOtherProduct[] {
  const sellerName = resolveSellerName(deal);

  return mockDeals
    .filter((item) => resolveSellerName(item) === sellerName && item.slug !== deal.slug)
    .sort((a, b) => b.participants - a.participants)
    .slice(0, limit)
    .map((item) => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      imageUrl: item.imageUrl,
      groupPrice: item.groupPrice,
      rating: Math.min(5, 4 + item.participants / 120).toFixed(1),
    }));
}
