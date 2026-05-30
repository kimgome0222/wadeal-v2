"use client";

import { HomeHeroCarousel } from "@/components/home/hero-carousel";
import { HomeProductGridSection } from "@/components/home/home-product-grid-section";
import { HomeQuickMenu } from "@/components/home/home-quick-menu";
import { HomeSellerRailSection } from "@/components/home/home-seller-rail-section";
import { HomeSellerStoriesSection } from "@/components/home/home-seller-stories-section";
import { HomeSpecialPriceSection } from "@/components/home/home-special-price-section";
import { HomeTopSellersSection } from "@/components/home/home-top-sellers-section";
import { DealsEmptyState } from "@/components/deals-empty-state";
import { HomeAllProductsSection } from "@/components/home-all-products-section";
import type { HomeViewModel } from "@/lib/home/build-home-view";
import { ds } from "@/lib/design-system";

type HomeCatalogProps = HomeViewModel;

export function HomeCatalog({
  topSellers,
  recommendedSellers,
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

      <HomeTopSellersSection sellers={topSellers} />

      <HomeProductGridSection
        ariaLabel="실시간 인기 상품"
        className="pt-12"
        deals={popularDeals}
        moreHref="/category/popular"
        title="실시간 인기 상품"
      />

      <HomeSellerRailSection
        ariaLabel="추천 판매자"
        sellers={recommendedSellers}
        subtitle="celloh가 추천하는 판매자"
        title="추천 판매자"
      />

      <HomeProductGridSection
        ariaLabel="셀로 추천 상품"
        deals={recommendedDeals}
        moreHref="/category/recommended"
        title="셀로 추천 상품"
      />

      <HomeSellerRailSection
        ariaLabel="신규 판매자"
        sellers={newSellers}
        showNew
        title="새로 입점했어요"
      />

      <HomeProductGridSection
        ariaLabel="후기 좋은 상품"
        deals={reviewDeals}
        moreHref="/category/all?sort=reviews"
        title="후기 좋은 상품"
      />

      <HomeSpecialPriceSection deals={specialPriceDeals} />

      <HomeSellerStoriesSection stories={stories} />

      <HomeAllProductsSection
        deals={allProductsDeals}
        title="전체 상품"
      />
    </div>
  );
}
