"use client";

import { Suspense } from "react";

import { DealCatalogLoadMore } from "@/components/deal-catalog-toolbar";
import { DealProductGrid } from "@/components/deal-product-grid";
import { PlpRecommendedSellers } from "@/components/plp/plp-recommended-sellers";
import { SearchEmptyResults } from "@/components/search/search-empty-results";
import { SearchProductSortBar } from "@/components/search/search-product-sort-bar";
import { SearchResultsTabs, useSearchResultsTab } from "@/components/search/search-results-tabs";
import { SearchSellerResultList } from "@/components/search/search-seller-result-list";
import type { Deal } from "@/lib/deals";
import { getPopularDeals } from "@/lib/deals";
import { RECOMMENDED_SEARCH_TERMS } from "@/lib/search/search-data";
import type { SellerProfile } from "@/lib/sellers/types";

type SearchResultsViewProps = {
  query: string;
  productDeals: Deal[];
  productTotal: number;
  sellers: SellerProfile[];
  recommendedSellers: SellerProfile[];
  catalog: Deal[];
  hasMore: boolean;
  nextPage: number;
};

function SearchResultsContent({
  query,
  productDeals,
  productTotal,
  sellers,
  recommendedSellers,
  catalog,
  hasMore,
  nextPage,
}: SearchResultsViewProps) {
  const activeTab = useSearchResultsTab();
  const recommendedDeals = getPopularDeals(catalog, 12);

  return (
    <div className="space-y-6">
      <SearchResultsTabs productCount={productTotal} sellerCount={sellers.length} />

      {activeTab === "products" ?
        <>
          <SearchProductSortBar />

          {productDeals.length > 0 ?
            <div className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-[20px] font-bold text-[#111111]">상품 결과</h2>
                <p className="text-[13px] text-[#666666]">
                  {productTotal.toLocaleString("ko-KR")}개의 상품
                </p>
              </div>
              <DealProductGrid deals={productDeals} />
              <Suspense fallback={null}>
                <DealCatalogLoadMore hasMore={hasMore} nextPage={nextPage} />
              </Suspense>
            </div>
          : <SearchEmptyResults
              query={query}
              recommendedDeals={recommendedDeals}
              recommendedSellers={recommendedSellers}
              recommendedTerms={RECOMMENDED_SEARCH_TERMS}
            />}
        </>
      : <SearchSellerResultList catalog={catalog} query={query} sellers={sellers} />}
    </div>
  );
}

export function SearchResultsView(props: SearchResultsViewProps) {
  return (
    <Suspense fallback={null}>
      <SearchResultsContent {...props} />
    </Suspense>
  );
}
