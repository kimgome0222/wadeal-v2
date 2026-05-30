"use client";

import { Suspense } from "react";

import { CategorySubNav } from "@/components/category-sub-nav";
import { DealCatalogLoadMore, DealCatalogToolbar } from "@/components/deal-catalog-toolbar";
import { DealProductGrid } from "@/components/deal-product-grid";
import { HomeProductRailSection } from "@/components/home-product-rail-section";
import { PlpRecommendedSellers } from "@/components/plp/plp-recommended-sellers";
import type { CategoryPanelViewModel } from "@/lib/categories/build-category-panel-view";
import type { Deal } from "@/lib/deals";
import type { DealCatalogResult } from "@/lib/search/types";
import type { CategorySlug } from "@/lib/categories";
import { isThemeCategorySlug } from "@/lib/categories";

type CategoryPlpContentProps = {
  slug: CategorySlug;
  result: DealCatalogResult;
  gridDeals: Deal[];
  panel: CategoryPanelViewModel;
};

export function CategoryPlpContent({
  slug,
  result,
  gridDeals,
  panel,
}: CategoryPlpContentProps) {
  return (
    <div className="space-y-8 bg-white pb-[max(calc(env(safe-area-inset-bottom)+120px),120px)]">
      <div className="space-y-8 px-6">
        {!isThemeCategorySlug(slug) ?
          <Suspense fallback={null}>
            <CategorySubNav categorySlug={slug} />
          </Suspense>
        : null}

        <Suspense fallback={null}>
          <DealCatalogToolbar showCount={false} total={result.total} />
        </Suspense>
      </div>

      <HomeProductRailSection
        ariaLabel="오늘의 특가"
        className="pt-0"
        deals={panel.specialPriceDeals}
        maxItems={12}
        showMore={false}
        title="오늘의 특가"
      />

      <HomeProductRailSection
        ariaLabel="인기 상품"
        className="pt-0"
        deals={panel.popularDeals}
        maxItems={12}
        showMore={false}
        title="인기 상품"
      />

      <section aria-label="전체 상품" className="space-y-4 px-6">
        <h2 className="text-[20px] font-bold text-[#111111]">전체 상품</h2>
        <DealProductGrid
          compactEmpty
          deals={gridDeals}
          emptyDescription="다른 필터를 선택해 보세요."
          emptyTitle="조건에 맞는 상품이 없어요"
        />
        <Suspense fallback={null}>
          <DealCatalogLoadMore hasMore={result.hasMore} nextPage={result.page + 1} />
        </Suspense>
      </section>

      <div className="px-6">
        <PlpRecommendedSellers className="pt-2" sellers={panel.recommendedSellers} />
      </div>
    </div>
  );
}
