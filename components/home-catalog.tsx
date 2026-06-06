"use client";

import { useEffect, useMemo } from "react";

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
import { RecommendationBasisHint } from "@/components/recommendations/recommendation-basis-hint";
import { HOME_SECTION_COPY } from "@/lib/copy/home-section-copy";
import {
  getMockCouponBadge,
  getMockPopularBadge,
} from "@/lib/growth/cart-growth-mock";
import { SEASONAL_MOCK_DISCLAIMER } from "@/lib/personalization/recommendation-copy";

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
  const newProductDeals = useMemo(
    () => [...catalog].sort((a, b) => b.id - a.id),
    [catalog],
  );

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
        ariaLabel={HOME_SECTION_COPY["today-special"].title}
        className="pt-8"
        deals={specialPriceDeals}
        maxItems={12}
        moreHref={HOME_SECTION_COPY["today-special"].moreHref}
        moreLabel={HOME_SECTION_COPY["today-special"].moreLabel}
        sectionId="home-section-today-special"
        subtitle={HOME_SECTION_COPY["today-special"].subtitle}
        title={HOME_SECTION_COPY["today-special"].title}
      />

      <HomeCommerceRailSection
        ariaLabel={HOME_SECTION_COPY.recommended.title}
        deals={recommendedDeals}
        maxItems={12}
        moreHref={HOME_SECTION_COPY.recommended.moreHref}
        moreLabel={HOME_SECTION_COPY.recommended.moreLabel}
        sectionId="home-section-recommended"
        subtitle={HOME_SECTION_COPY.recommended.subtitle}
        title={HOME_SECTION_COPY.recommended.title}
      />
      <div className="-mt-6 px-6">
        <RecommendationBasisHint />
      </div>

      <HomeCommerceRailSection
        ariaLabel={HOME_SECTION_COPY["ending-sale"].title}
        deals={endingSoonDeals}
        maxItems={12}
        moreHref={HOME_SECTION_COPY["ending-sale"].moreHref}
        moreLabel={HOME_SECTION_COPY["ending-sale"].moreLabel}
        sectionId="home-section-ending-sale"
        subtitle={HOME_SECTION_COPY["ending-sale"].subtitle}
        title={HOME_SECTION_COPY["ending-sale"].title}
      />

      <HomeSellerShowcaseSection
        ariaLabel={HOME_SECTION_COPY["popular-sellers"].title}
        moreHref={HOME_SECTION_COPY["popular-sellers"].moreHref}
        sectionId="home-section-popular-sellers"
        sellers={POPULAR_SELLER_SHOWCASE}
        subtitle={HOME_SECTION_COPY["popular-sellers"].subtitle}
        title={HOME_SECTION_COPY["popular-sellers"].title}
      />

      <HomeCommerceRailSection
        ariaLabel={HOME_SECTION_COPY.popular.title}
        deals={popularDeals}
        maxItems={12}
        moreHref={HOME_SECTION_COPY.popular.moreHref}
        moreLabel={HOME_SECTION_COPY.popular.moreLabel}
        sectionId="home-section-popular"
        subtitle={HOME_SECTION_COPY.popular.subtitle}
        title={HOME_SECTION_COPY.popular.title}
      />

      <HomeCommerceRailSection
        ariaLabel={HOME_SECTION_COPY["weekend-special"].title}
        deals={weekendDeals}
        maxItems={12}
        moreHref={HOME_SECTION_COPY["weekend-special"].moreHref}
        moreLabel={HOME_SECTION_COPY["weekend-special"].moreLabel}
        sectionId="home-section-weekend-special"
        subtitle={HOME_SECTION_COPY["weekend-special"].subtitle}
        title={HOME_SECTION_COPY["weekend-special"].title}
      />

      <HomeRankingSection catalog={catalog} />

      <HomeCommerceRailSection
        ariaLabel={HOME_SECTION_COPY.lowest.title}
        deals={lowestPriceDeals}
        maxItems={12}
        moreHref={HOME_SECTION_COPY.lowest.moreHref}
        moreLabel={HOME_SECTION_COPY.lowest.moreLabel}
        sectionId="home-section-lowest"
        subtitle={HOME_SECTION_COPY.lowest.subtitle}
        title={HOME_SECTION_COPY.lowest.title}
      />

      <HomeOnlyCellohSection deals={onlyCellohDeals} />

      <HomeCommerceRailSection
        ariaLabel={HOME_SECTION_COPY["coupon-sale"].title}
        deals={couponDeals}
        maxItems={12}
        moreHref={HOME_SECTION_COPY["coupon-sale"].moreHref}
        moreLabel={HOME_SECTION_COPY["coupon-sale"].moreLabel}
        resolveBadge={getMockCouponBadge}
        sectionId="home-section-coupon-sale"
        showCouponPrice
        subtitle={HOME_SECTION_COPY["coupon-sale"].subtitle}
        title={HOME_SECTION_COPY["coupon-sale"].title}
      />

      <HomeCommerceRailSection
        ariaLabel={HOME_SECTION_COPY.frequent.title}
        deals={frequentlyAddedDeals}
        maxItems={12}
        moreHref={HOME_SECTION_COPY.frequent.moreHref}
        moreLabel={HOME_SECTION_COPY.frequent.moreLabel}
        resolveBadge={getMockPopularBadge}
        sectionId="home-section-frequent"
        subtitle={HOME_SECTION_COPY.frequent.subtitle}
        title={HOME_SECTION_COPY.frequent.title}
      />

      <HomeCommerceRailSection
        ariaLabel={HOME_SECTION_COPY.seasonal.title}
        deals={seasonalDeals}
        maxItems={12}
        moreHref={HOME_SECTION_COPY.seasonal.moreHref}
        moreLabel={HOME_SECTION_COPY.seasonal.moreLabel}
        sectionId="home-section-seasonal"
        subtitle={`${seasonalCopy.subtitle} · ${SEASONAL_MOCK_DISCLAIMER}`}
        title={seasonalCopy.title}
      />

      <HomeCommerceRailSection
        ariaLabel={HOME_SECTION_COPY.new.title}
        deals={newProductDeals}
        maxItems={12}
        moreHref={HOME_SECTION_COPY.new.moreHref}
        moreLabel={HOME_SECTION_COPY.new.moreLabel}
        sectionId="home-section-new"
        subtitle={HOME_SECTION_COPY.new.subtitle}
        title={HOME_SECTION_COPY.new.title}
      />

      <HomeSellerShowcaseSection
        ariaLabel={HOME_SECTION_COPY["new-sellers"].title}
        moreHref={HOME_SECTION_COPY["new-sellers"].moreHref}
        sectionId="home-section-new-sellers"
        sellers={NEW_SELLER_SHOWCASE}
        subtitle={HOME_SECTION_COPY["new-sellers"].subtitle}
        title={HOME_SECTION_COPY["new-sellers"].title}
      />

      <HomeSellerStoriesSection />
    </div>
  );
}
