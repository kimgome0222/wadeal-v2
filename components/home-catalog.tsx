"use client";

import { useEffect } from "react";

import { DealsEmptyState } from "@/components/deals-empty-state";
import { HomeHeroCarousel } from "@/components/home/hero-carousel";
import { HomeCommerceRailSection } from "@/components/home/home-commerce-rail-section";
import { HomeOnlyCellohSection } from "@/components/home/home-only-celloh-section";
import { HomeQuickMenu } from "@/components/home/home-quick-menu";
import { HomeRankingSection } from "@/components/home/home-ranking-section";
import { HomeSellerShowcaseSection } from "@/components/home/home-seller-showcase-section";
import { HomeSellerStoriesSection } from "@/components/home/home-seller-stories-section";
import type { HomeViewModel } from "@/lib/home/build-home-view";
import { getSeasonalSectionCopy as resolveSeasonalCopy } from "@/lib/home/build-home-view";
import {
  NEW_SELLER_SHOWCASE,
  POPULAR_SELLER_SHOWCASE,
} from "@/lib/home/seller-showcase-mock";
import type { Deal } from "@/lib/deals";
import { useAddToCartSheet } from "@/lib/cart/add-to-cart-sheet-context";
import {
  getMockCouponBadge,
  getMockPopularBadge,
} from "@/lib/growth/cart-growth-mock";

type HomeCatalogProps = HomeViewModel & {
  catalog: Deal[];
};

export function HomeCatalog({
  popularDeals,
  recommendedDeals,
  specialPriceDeals,
  couponDeals,
  endingSoonDeals,
  weekendDeals,
  frequentlyAddedDeals,
  seasonalDeals,
  lowestPriceDeals,
  onlyCellohDeals,
  topSellers,
  catalog,
}: HomeCatalogProps) {
  const { setCatalog } = useAddToCartSheet();
  const seasonalCopy = resolveSeasonalCopy();

  useEffect(() => {
    setCatalog(catalog);
  }, [catalog, setCatalog]);

  const hasContent =
    topSellers.length > 0 ||
    popularDeals.length > 0 ||
    recommendedDeals.length > 0;

  if (!hasContent) {
    return (
      <div className="bg-white px-6 pb-8 pt-6">
        <DealsEmptyState />
      </div>
    );
  }

  return (
    <div className="bg-white pb-8">
      <div className="px-6 pt-4">
        <HomeHeroCarousel />
      </div>

      <HomeQuickMenu />

      <HomeCommerceRailSection
        ariaLabel="오늘의 특가"
        className="pt-8"
        deals={specialPriceDeals}
        maxItems={12}
        sectionId="home-section-special"
        title="오늘의 특가"
      />

      <HomeCommerceRailSection
        ariaLabel="쿠폰 적용 상품"
        deals={couponDeals}
        maxItems={12}
        resolveBadge={getMockCouponBadge}
        sectionId="home-section-coupon"
        showCouponPrice
        title="쿠폰 적용 상품"
      />

      <HomeCommerceRailSection
        ariaLabel="마감세일"
        deals={endingSoonDeals}
        maxItems={12}
        sectionId="home-section-ending"
        title="마감세일"
      />

      <HomeCommerceRailSection
        ariaLabel="주말특가"
        deals={weekendDeals}
        maxItems={12}
        sectionId="home-section-weekend"
        title="주말특가"
      />

      <HomeCommerceRailSection
        ariaLabel="많이 담은 상품"
        deals={frequentlyAddedDeals}
        maxItems={12}
        resolveBadge={getMockPopularBadge}
        sectionId="home-section-frequent"
        title="많이 담은 상품"
      />

      <HomeCommerceRailSection
        ariaLabel="실시간 인기상품"
        deals={popularDeals}
        maxItems={12}
        moreHref="/category/popular"
        sectionId="home-section-popular"
        title="실시간 인기상품"
      />

      <HomeCommerceRailSection
        ariaLabel="추천상품"
        deals={recommendedDeals}
        maxItems={12}
        sectionId="home-section-recommended"
        title="추천상품"
      />

      <HomeCommerceRailSection
        ariaLabel={seasonalCopy.title}
        deals={seasonalDeals}
        maxItems={12}
        sectionId="home-section-seasonal"
        title={seasonalCopy.title}
      />

      <HomeRankingSection catalog={catalog} />

      <HomeCommerceRailSection
        ariaLabel="오늘의 최저가 상품"
        deals={lowestPriceDeals}
        maxItems={12}
        sectionId="home-section-lowest"
        title="오늘의 최저가 상품"
      />

      <HomeOnlyCellohSection deals={onlyCellohDeals} />

      <HomeSellerShowcaseSection
        ariaLabel="신규 입점 판매자"
        moreHref="/category/new-sellers"
        sectionId="home-section-new-sellers"
        sellers={NEW_SELLER_SHOWCASE}
        title="신규 입점 판매자"
      />

      <HomeSellerShowcaseSection
        ariaLabel="인기 판매자"
        sectionId="home-section-popular-sellers"
        sellers={POPULAR_SELLER_SHOWCASE}
        title="인기 판매자"
      />

      <HomeSellerStoriesSection />
    </div>
  );
}
