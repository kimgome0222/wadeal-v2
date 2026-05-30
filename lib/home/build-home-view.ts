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
import {
  getCouponApplicableDeals,
  getFrequentlyAddedDeals,
} from "@/lib/growth/cart-growth-mock";
import { getRepurchaseRateDeals } from "@/lib/recommendations/repurchase-deals";
import {
  getEndingSoonDeals,
  getLowestPriceDeals,
  getOnlyCellohDeals,
  getSeasonalDeals,
  getWeekendDeals,
} from "@/lib/home/mock-home-commerce-data";

import { buildHomeSellerStories, type HomeSellerStory } from "@/lib/home/seller-stories";

/** 홈 rail 섹션 — 최소 10, 최대 12 */
const HOME_RAIL_MIN = 10;
const HOME_RAIL_LIMIT = 12;
/** 홈 전체 상품 미리보기 grid */
const HOME_PREVIEW_LIMIT = 8;

export type HomeSellerWithCover = SellerProfile & {
  coverImageUrl: string;
};

export type HomeViewModel = {
  topSellers: HomeSellerWithCover[];
  recommendedSellers: SellerProfile[];
  newSellers: SellerProfile[];
  popularDeals: Deal[];
  recommendedDeals: Deal[];
  specialPriceDeals: Deal[];
  couponDeals: Deal[];
  endingSoonDeals: Deal[];
  weekendDeals: Deal[];
  frequentlyAddedDeals: Deal[];
  repurchaseDeals: Deal[];
  seasonalDeals: Deal[];
  lowestPriceDeals: Deal[];
  onlyCellohDeals: Deal[];
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

  const popularDeals = ensureMinimumDeals(
    getRealtimePopularDeals(catalog, HOME_RAIL_LIMIT),
    catalog,
    HOME_RAIL_MIN,
  );
  const recommendedDeals = ensureMinimumDeals(
    getCellohRecommendedDeals(catalog, HOME_RAIL_LIMIT),
    catalog,
    HOME_RAIL_MIN,
  );
  const specialPriceDeals = ensureMinimumSpecialPriceDeals(
    getSpecialPriceDeals(catalog, HOME_RAIL_LIMIT),
    catalog,
    HOME_RAIL_MIN,
  );
  const couponDeals = ensureMinimumDeals(
    getCouponApplicableDeals(catalog, HOME_RAIL_LIMIT),
    catalog,
    HOME_RAIL_MIN,
  );
  const endingSoonDeals = ensureMinimumDeals(
    getEndingSoonDeals(catalog, HOME_RAIL_LIMIT),
    catalog,
    HOME_RAIL_MIN,
  );
  const weekendDeals = ensureMinimumDeals(
    getWeekendDeals(catalog, HOME_RAIL_LIMIT),
    catalog,
    HOME_RAIL_MIN,
  );
  const frequentlyAddedDeals = ensureMinimumDeals(
    getFrequentlyAddedDeals(catalog, HOME_RAIL_LIMIT),
    catalog,
    HOME_RAIL_MIN,
  );
  const repurchaseDeals = ensureMinimumDeals(
    getRepurchaseRateDeals(catalog, HOME_RAIL_LIMIT),
    catalog,
    HOME_RAIL_MIN,
  );
  const seasonalDeals = ensureMinimumDeals(
    getSeasonalDeals(catalog, HOME_RAIL_LIMIT),
    catalog,
    HOME_RAIL_MIN,
  );
  const lowestPriceDeals = ensureMinimumDeals(
    getLowestPriceDeals(catalog, HOME_RAIL_LIMIT),
    catalog,
    HOME_RAIL_MIN,
  );
  const onlyCellohDeals = ensureMinimumDeals(
    getOnlyCellohDeals(catalog, 8),
    catalog,
    Math.min(HOME_RAIL_MIN, 8),
  );

  const storySellers =
    topSellers.length > 0 ? topSellers : profiles.slice(0, 6).map((seller) => ({
      ...seller,
      coverImageUrl: resolveCoverImage(seller, catalog),
    }));

  const stories = buildHomeSellerStories(storySellers, catalog, 6);
  const allProductsDeals = ensureMinimumDeals(
    getHomeAllProductsDeals(catalog).slice(0, HOME_PREVIEW_LIMIT),
    catalog,
    HOME_PREVIEW_LIMIT,
  );

  if (catalog.length === 0) {
    return {
      topSellers: [],
      recommendedSellers: [],
      newSellers: [],
      popularDeals: [],
      recommendedDeals: [],
      specialPriceDeals: [],
      couponDeals: [],
      endingSoonDeals: [],
      weekendDeals: [],
      frequentlyAddedDeals: [],
      repurchaseDeals: [],
      seasonalDeals: [],
      lowestPriceDeals: [],
      onlyCellohDeals: [],
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
    specialPriceDeals,
    couponDeals,
    endingSoonDeals,
    weekendDeals,
    frequentlyAddedDeals,
    repurchaseDeals,
    seasonalDeals,
    lowestPriceDeals,
    onlyCellohDeals,
    stories,
    allProductsDeals,
  };
}

export function getSeasonalSectionCopy(): { title: string; subtitle: string } {
  const month = new Date().getMonth() + 1;

  if (month >= 6 && month <= 8) {
    return {
      title: "AI기반 계절상품",
      subtitle: "여름: 음료 · 선케어 · 냉감 · 간편식",
    };
  }

  if (month >= 12 || month <= 2) {
    return {
      title: "AI기반 계절상품",
      subtitle: "겨울: 난방 · 보습 · 간편식",
    };
  }

  if (month >= 3 && month <= 5) {
    return {
      title: "AI기반 계절상품",
      subtitle: "봄: 피크닉 · 뷰티 · 간편식",
    };
  }

  return {
    title: "AI기반 계절상품",
    subtitle: "가을: 간식 · 홈카페",
  };
}
