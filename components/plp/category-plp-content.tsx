"use client";

import { Suspense } from "react";

import { CategorySubNav } from "@/components/category-sub-nav";
import { DealCatalogLoadMore, DealCatalogToolbar } from "@/components/deal-catalog-toolbar";
import { DealProductGrid } from "@/components/deal-product-grid";
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

/** 카테고리 PLP — 하위 chip + 정렬/필터 + 2열 grid + full-width 추천 */
export function CategoryPlpContent({
  slug,
  result,
  gridDeals,
  panel,
}: CategoryPlpContentProps) {
  return (
    <div className="overflow-visible bg-white pb-[max(calc(env(safe-area-inset-bottom)+120px),120px)]">
      <div className="relative z-[10] px-6">
        {!isThemeCategorySlug(slug) ?
          <Suspense fallback={null}>
            <CategorySubNav categorySlug={slug} key={slug} />
          </Suspense>
        : null}

        <Suspense fallback={null}>
          <DealCatalogToolbar showCount={false} total={result.total} />
        </Suspense>
      </div>

      <section aria-label="전체 상품" className="relative z-0 space-y-4 px-6 pt-6">
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

      <div className="-mx-0 w-full space-y-10 border-t border-[#E8ECEA]/80 px-6 pt-8">
        <PlpRecommendedSellers sellers={panel.recommendedSellers} />

        {panel.popularDeals.length > 0 ?
          <section aria-label="인기 상품" className="space-y-4">
            <h2 className="text-[20px] font-bold text-[#111111]">인기 상품</h2>
            <DealProductGrid deals={panel.popularDeals.slice(0, 12)} />
          </section>
        : null}

        {panel.reviewDeals.length > 0 ?
          <section aria-label="후기 좋은 상품" className="space-y-4">
            <h2 className="text-[20px] font-bold text-[#111111]">후기 좋은 상품</h2>
            <DealProductGrid deals={panel.reviewDeals.slice(0, 12)} />
          </section>
        : null}
      </div>
    </div>
  );
}
