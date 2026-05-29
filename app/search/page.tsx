import type { Metadata } from "next";
import { Suspense } from "react";

import { AppBottomNavigation } from "@/components/app-bottom-navigation";
import {
  DealCatalogLoadMore,
  DealCatalogToolbar,
  PopularSearchTerms,
} from "@/components/deal-catalog-toolbar";
import { DealCatalogSortBar } from "@/components/deal-catalog-sort-bar";
import { DealProductGrid } from "@/components/deal-product-grid";
import { PageShell } from "@/components/page-shell";
import { SearchCategoryNav } from "@/components/search-category-nav";
import { SearchHeader } from "@/components/search-header";
import { SearchSellerResults } from "@/components/search-seller-results";
import { SearchSubNav } from "@/components/search-sub-nav";
import { SearchEmptyResults } from "@/components/search/search-empty-results";
import { FeaturedSearchTerms } from "@/components/search/featured-search-terms";
import { SearchQueryTracker } from "@/components/search/search-query-tracker";
import { SearchResultsSummary } from "@/components/search/search-results-summary";
import { isCategorySlug } from "@/lib/categories";
import { getAllActiveDeals } from "@/lib/data";
import {
  getFeaturedSearchTerms,
  getPopularSearchTerms,
  logSearchQuery,
  searchDeals,
  searchDealsFromParams,
} from "@/lib/data/search";
import { getcellohDataSource, logPageDataSource } from "@/lib/data/source";
import { ds } from "@/lib/design-system";
import { parseDealCatalogSearchParams } from "@/lib/search/params";
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

  const [result, popularTerms, featuredTerms, sellerPool] = await Promise.all([
    searchDealsFromParams(params),
    query ? Promise.resolve([]) : getPopularSearchTerms(),
    getFeaturedSearchTerms(),
    query ? getAllActiveDeals() : Promise.resolve([]),
  ]);

  const matchedSellers = query ? searchSellersFromDeals(sellerPool, query) : [];
  const similarDeals =
    query && result.total === 0 ?
      (await searchDeals({ sort: "popular", page: 1, pageSize: 8 })).deals
    : [];

  if (query) {
    await logSearchQuery({ query, resultCount: result.total });
  }

  logPageDataSource("/search", getcellohDataSource() ?? "unconfigured");

  return (
    <PageShell withBottomNav>
      {query ?
        <SearchQueryTracker query={query} />
      : null}
      <div className="sticky top-0 z-30 bg-white">
        <SearchHeader backHref="/" initialQuery={query} popularTerms={featuredTerms} />
        <Suspense fallback={null}>
          <SearchCategoryNav />
        </Suspense>
        {categorySlug && categorySlug !== "all" && categorySlug !== "closing-soon" ?
          <Suspense fallback={null}>
            <SearchSubNav categorySlug={categorySlug} />
          </Suspense>
        : null}
        <Suspense fallback={null}>
          <DealCatalogSortBar />
        </Suspense>
      </div>
      <div className={`${ui.pageBody} space-y-5 bg-white`}>
        {query ?
          <SearchResultsSummary
            productTotal={result.total}
            query={query}
            sellerTotal={matchedSellers.length}
          />
        : null}

        <Suspense fallback={null}>
          <DealCatalogToolbar
            queryLabel={query ? undefined : "전체 상품"}
            total={result.total}
          />
        </Suspense>

        {!query && featuredTerms.length > 0 ?
          <FeaturedSearchTerms terms={featuredTerms} />
        : null}

        {!query && popularTerms.length > 0 ?
          <PopularSearchTerms terms={popularTerms} />
        : null}

        {query ?
          <SearchSellerResults query={query} sellers={matchedSellers} />
        : null}

        {query && result.deals.length > 0 ?
          <div>
            <h2 className={ds.type.h2}>상품</h2>
            <p className={`mt-0.5 ${ds.type.caption}`}>
              {result.total.toLocaleString("ko-KR")}개의 상품을 찾았어요.
            </p>
          </div>
        : null}

        {query && result.deals.length === 0 ?
          <SearchEmptyResults query={query} similarDeals={similarDeals} />
        : <DealProductGrid deals={result.deals} />}
        <Suspense fallback={null}>
          <DealCatalogLoadMore
            hasMore={result.hasMore}
            nextPage={result.page + 1}
          />
        </Suspense>
      </div>
      <AppBottomNavigation />
    </PageShell>
  );
}
