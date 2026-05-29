import type { Deal } from "@/lib/deals";

import { buildSellerProfilesFromDeals } from "./home-sellers";
import type { SellerProfile } from "./types";

/** 검색어와 매칭되는 판매자 프로필 (mock 집계, UI 전용). */
export function searchSellersFromDeals(deals: Deal[], query: string, limit = 6): SellerProfile[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    return [];
  }

  return buildSellerProfilesFromDeals(deals)
    .filter((seller) => {
      const haystack = [seller.name, seller.tagline, seller.featuredProductTitle]
        .join(" ")
        .toLowerCase();
      return trimmed.split(/\s+/).every((term) => haystack.includes(term));
    })
    .slice(0, limit);
}

/** 카테고리 상품 목록에서 인기 판매자 (mock 집계). */
export function getCategoryPopularSellers(deals: Deal[], limit = 4): SellerProfile[] {
  return buildSellerProfilesFromDeals(deals)
    .sort((a, b) => b.totalSales - a.totalSales || b.rating - a.rating)
    .slice(0, limit);
}
