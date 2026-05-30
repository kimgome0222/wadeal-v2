"use client";

import { HomeHeroCarousel } from "@/components/home/hero-carousel";
import { HomeQuickMenu } from "@/components/home/home-quick-menu";
import { HomeSellerRailSection } from "@/components/home/home-seller-rail-section";
import { HomeSellerStoriesSection } from "@/components/home/home-seller-stories-section";
import { HomeTopSellersSection } from "@/components/home/home-top-sellers-section";
import { DealsEmptyState } from "@/components/deals-empty-state";
import { HomeAllProductsSection } from "@/components/home-all-products-section";
import { HomeProductRailSection } from "@/components/home-product-rail-section";
import type { HomeViewModel } from "@/lib/home/build-home-view";
import { ds } from "@/lib/design-system";

type HomeCatalogProps = HomeViewModel;

export function HomeCatalog({
  topSellers,
  newSellers,
  popularDeals,
  recommendedDeals,
  reviewDeals,
  specialPriceDeals,
  stories,
  allProductsDeals,
}: HomeCatalogProps) {
  const hasContent =
    topSellers.length > 0 ||
    popularDeals.length > 0 ||
    allProductsDeals.length > 0;

  if (!hasContent) {
    return (
      <div className={`${ds.page.gutter} bg-white pb-8 pt-6`}>
        <DealsEmptyState />
      </div>
    );
  }

  return (
    <div className={`bg-white pb-8 ${ds.page.gutter}`}>
      <div className="pt-6">
        <HomeHeroCarousel />
      </div>

      <div className="mt-8">
        <HomeQuickMenu />
      </div>

      <HomeProductRailSection
        ariaLabel="실시간 인기 상품"
        className="pt-10"
        deals={popularDeals}
        maxItems={12}
        moreHref="/category/popular"
        title="실시간 인기 상품"
      />

      <HomeProductRailSection
        ariaLabel="오늘의 특가"
        deals={specialPriceDeals}
        maxItems={12}
        title="오늘의 특가"
      />

      <HomeProductRailSection
        ariaLabel="셀로 추천 상품"
        deals={recommendedDeals}
        maxItems={12}
        moreHref="/category/recommended"
        title="셀로 추천 상품"
      />

      <HomeProductRailSection
        ariaLabel="후기 좋은 상품"
        deals={reviewDeals}
        maxItems={12}
        moreHref="/category/all?sort=reviews"
        title="후기 좋은 상품"
      />

      <HomeTopSellersSection sellers={topSellers} />

      <HomeSellerRailSection
        ariaLabel="신규 판매자"
        sellers={newSellers}
        showNew
        title="새로 입점했어요"
      />

      <HomeSellerStoriesSection stories={stories} />

      <HomeAllProductsSection deals={allProductsDeals} title="전체 상품" />
    </div>
  );
}
