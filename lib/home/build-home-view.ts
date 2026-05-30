import { getDealReviewScoreLabel } from "@/lib/deals/card-display";
import type { Deal } from "@/lib/deals";
import { getHomeAllProductsDeals } from "@/lib/deals";
import {
  buildSellerProfilesFromDeals,
  ensureMinimumHomeRailDeals,
  ensureMinimumSpecialPriceDeals,
  getNewSellers,
  getRecommendedSellers,
  getSpecialPriceDeals,
} from "@/lib/sellers/home-sellers";
import { sortDealsByRecommendation } from "@/lib/sellers/recommendation";
import type { SellerProfile } from "@/lib/sellers/types";

import { buildHomeSellerStories, type HomeSellerStory } from "@/lib/home/seller-stories";

export type HomeSellerWithCover = SellerProfile & {
  coverImageUrl: string;
};

export type HomeViewModel = {
  topSellers: HomeSellerWithCover[];
  recommendedSellers: SellerProfile[];
  newSellers: SellerProfile[];
  popularDeals: Deal[];
  recommendedDeals: Deal[];
  reviewDeals: Deal[];
  specialPriceDeals: Deal[];
  stories: HomeSellerStory[];
  allProductsDeals: Deal[];
};

function resolveCoverImage(seller: SellerProfile, catalog: Deal[]): string {
  const featured = catalog.find((deal) => deal.slug === seller.featuredProductSlug);
  if (featured?.imageUrl) {
    return featured.imageUrl;
  }

  const byBrand = catalog.find(
    (deal) => (deal.brandName?.trim() || "celloh 셀러") === seller.name,
  );
  return byBrand?.imageUrl ?? catalog[0]?.imageUrl ?? "";
}

function withCover(sellers: SellerProfile[], catalog: Deal[]): HomeSellerWithCover[] {
  return sellers.map((seller) => ({
    ...seller,
    coverImageUrl: resolveCoverImage(seller, catalog),
  }));
}

function getRealtimePopularDeals(catalog: Deal[], limit = 12): Deal[] {
  return [...catalog]
    .sort((a, b) => b.participants - a.participants || b.id - a.id)
    .slice(0, limit);
}

function getReviewGoodDeals(catalog: Deal[], limit = 12): Deal[] {
  return [...catalog]
    .sort(
      (a, b) =>
        getDealReviewScoreLabel(b).count - getDealReviewScoreLabel(a).count ||
        b.participants - a.participants,
    )
    .slice(0, limit);
}

function getCellohRecommendedDeals(catalog: Deal[], limit = 12): Deal[] {
  return sortDealsByRecommendation(catalog).slice(0, limit);
}

function ensureMinimumDeals(deals: Deal[], catalog: Deal[], minimum: number): Deal[] {
  return ensureMinimumHomeRailDeals(deals, catalog, minimum);
}

/** 홈 섹션용 view model — catalog/mock 재사용, DB 변경 없음 */
export function buildHomeViewModel(catalog: Deal[]): HomeViewModel {
  const profiles = buildSellerProfilesFromDeals(catalog);

  const topSellers = withCover(profiles.slice(0, 10), catalog);
  const recommendedSellers = getRecommendedSellers(catalog, 8);
  const newSellers = getNewSellers(catalog, 8);

  const popularDeals = ensureMinimumDeals(getRealtimePopularDeals(catalog, 12), catalog, 6);
  const recommendedDeals = ensureMinimumDeals(getCellohRecommendedDeals(catalog, 12), catalog, 6);
  const reviewDeals = ensureMinimumDeals(getReviewGoodDeals(catalog, 12), catalog, 6);
  const specialPriceDeals = ensureMinimumSpecialPriceDeals(
    getSpecialPriceDeals(catalog, 6),
    catalog,
    6,
  );

  const storySellers =
    topSellers.length > 0 ? topSellers : profiles.slice(0, 6).map((seller) => ({
      ...seller,
      coverImageUrl: resolveCoverImage(seller, catalog),
    }));

  const stories = buildHomeSellerStories(storySellers, catalog, 6);
  const allProductsDeals = getHomeAllProductsDeals(catalog);

  // cover fallback for empty catalog edge case
  if (catalog.length === 0) {
    return {
      topSellers: [],
      recommendedSellers: [],
      newSellers: [],
      popularDeals: [],
      recommendedDeals: [],
      reviewDeals: [],
      specialPriceDeals: [],
      stories: [],
      allProductsDeals: [],
    };
  }

  return {
    topSellers,
    recommendedSellers,
    newSellers,
    popularDeals,
    recommendedDeals,
    reviewDeals,
    specialPriceDeals,
    stories,
    allProductsDeals,
  };
}
