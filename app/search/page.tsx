import type { Metadata } from "next";
import { Suspense } from "react";

import { AppBuyerLayout } from "@/components/app-buyer-layout";
import {
  DealCatalogLoadMore,
  DealCatalogToolbar,
} from "@/components/deal-catalog-toolbar";
import { DealProductGrid } from "@/components/deal-product-grid";
import { SearchSellerResults } from "@/components/search-seller-results";
import { SearchSubNav } from "@/components/search-sub-nav";
import { SearchEmptyResults } from "@/components/search/search-empty-results";
import { SearchIdleHub } from "@/components/search/search-idle-hub";
import { SearchQueryTracker } from "@/components/search/search-query-tracker";
import { PlpRecommendedSellers } from "@/components/plp/plp-recommended-sellers";
import { isCategorySlug } from "@/lib/categories";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getAllActiveDeals } from "@/lib/data";
import { getUnreadCountForUser } from "@/lib/data/notifications";
import {
  getFeaturedSearchTerms,
  getPopularSearchTerms,
  logSearchQuery,
  searchDeals,
  searchDealsFromParams,
} from "@/lib/data/search";
import { getcellohDataSource, logPageDataSource } from "@/lib/data/source";
import { filterDealsInCatalog } from "@/lib/deals/catalog-validation";
import { withSearchTermFallback } from "@/lib/search/fallback-terms";
import { parseDealCatalogSearchParams } from "@/lib/search/params";
import { getRecommendedSellers } from "@/lib/sellers/home-sellers";
import { sortDealsByRecommendation } from "@/lib/sellers/recommendation";
import { searchSellersFromDeals } from "@/lib/sellers/search-sellers";
import { buildSearchMetadata } from "@/lib/seo/site";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

type SearchPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const parsed = parseDealCatalogSearchParams(params);
  return buildSearchMetadata(parsed.q ?? "");
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const parsed = parseDealCatalogSearchParams(params);
  const query = parsed.q ?? "";
  const categorySlug =
    parsed.categorySlug && isCategorySlug(parsed.categorySlug) ?
      parsed.categorySlug
    : null;

  const user = await getServerAuthUser();
  const unreadNotificationCount = user ? await getUnreadCountForUser(user.id) : 0;

  const [result, popularTermsRaw, featuredTermsRaw, catalog] = await Promise.all([
    searchDealsFromParams(params),
    query ? Promise.resolve([]) : getPopularSearchTerms(),
    getFeaturedSearchTerms(),
    getAllActiveDeals(),
  ]);

  const popularTerms = withSearchTermFallback(popularTermsRaw);
  const featuredTerms = withSearchTermFallback(featuredTermsRaw);
  const validResultDeals = filterDealsInCatalog(result.deals, catalog);
  const recommendedDeals = filterDealsInCatalog(
    sortDealsByRecommendation(catalog).slice(0, 8),
    catalog,
  );
  const recommendedSellers = getRecommendedSellers(catalog, 6);

  const matchedSellers = query ? searchSellersFromDeals(catalog, query) : [];
  const fallbackDealsRaw =
    query && validResultDeals.length === 0 ?
      (await searchDeals({ sort: "popular", page: 1, pageSize: 8 })).deals
    : [];
  const fallbackDeals = filterDealsInCatalog(fallbackDealsRaw, catalog);

  if (query) {
    await logSearchQuery({ query, resultCount: result.total });
  }

  logPageDataSource("/search", getcellohDataSource() ?? "unconfigured");

  return (
    <AppBuyerLayout
      initialSearchQuery={query}
      unreadNotificationCount={unreadNotificationCount}
    >
      {query ?
        <SearchQueryTracker query={query} />
      : null}
      <div className={`${ui.appPageBody} bg-white ${query ? `${ui.sectionStack} pb-[max(calc(env(safe-area-inset-bottom)+120px),120px)]` : ""}`}>
        {query && categorySlug && categorySlug !== "all" && categorySlug !== "closing-soon" ?
          <Suspense fallback={null}>
            <SearchSubNav categorySlug={categorySlug} />
          </Suspense>
        : null}
        {query ?
          <>
            {matchedSellers.length > 0 ?
              <p className="text-[13px] text-[#666666]">
                판매자 {matchedSellers.length.toLocaleString("ko-KR")}명
              </p>
            : null}

            <Suspense fallback={null}>
              <DealCatalogToolbar
                title={`'${query}' 검색 결과`}
                total={result.total}
              />
            </Suspense>

            <SearchSellerResults query={query} sellers={matchedSellers} />

            {validResultDeals.length > 0 ?
              <PlpRecommendedSellers sellers={recommendedSellers} />
            : null}

            {validResultDeals.length === 0 ?
              <SearchEmptyResults
                query={query}
                recommendedSellers={recommendedSellers}
                similarDeals={fallbackDeals}
              />
            : <DealProductGrid deals={validResultDeals} />}
            <Suspense fallback={null}>
              <DealCatalogLoadMore
                hasMore={result.hasMore}
                nextPage={result.page + 1}
              />
            </Suspense>
          </>
        : <SearchIdleHub
            featuredTerms={featuredTerms}
            popularTerms={popularTerms}
            recommendedDeals={recommendedDeals}
            recommendedSellers={recommendedSellers}
          />}
      </div>
    </AppBuyerLayout>
  );
}
