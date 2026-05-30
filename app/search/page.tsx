import type { Metadata } from "next";
import { Suspense } from "react";

import { AppBuyerLayout } from "@/components/app-buyer-layout";
import { SearchIdleHub } from "@/components/search/search-idle-hub";
import { SearchQueryTracker } from "@/components/search/search-query-tracker";
import { SearchResultsView } from "@/components/search/search-results-view";
import { SearchSubNav } from "@/components/search-sub-nav";
import { isCategorySlug } from "@/lib/categories";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getAllActiveDeals } from "@/lib/data";
import { getUnreadCountForUser } from "@/lib/data/notifications";
import { logSearchQuery, searchDealsFromParams } from "@/lib/data/search";
import { getcellohDataSource, logPageDataSource } from "@/lib/data/source";
import { filterDealsInCatalog } from "@/lib/deals/catalog-validation";
import { parseDealCatalogSearchParams } from "@/lib/search/params";
import { getRecommendedSellers } from "@/lib/sellers/home-sellers";
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

  const [result, catalog] = await Promise.all([
    searchDealsFromParams(params),
    getAllActiveDeals(),
  ]);

  const validResultDeals = filterDealsInCatalog(result.deals, catalog);
  const recommendedSellers = getRecommendedSellers(catalog, 8);
  const matchedSellers = query ? searchSellersFromDeals(catalog, query, 20) : [];

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
      <div
        className={`${ui.appPageBody} bg-white ${
          query ?
            "space-y-6 pb-[max(calc(env(safe-area-inset-bottom)+120px),120px)] pt-6"
          : "pt-0"
        }`}
      >
        {query && categorySlug && categorySlug !== "all" && categorySlug !== "closing-soon" ?
          <Suspense fallback={null}>
            <SearchSubNav categorySlug={categorySlug} />
          </Suspense>
        : null}
        {query ?
          <Suspense fallback={null}>
            <SearchResultsView
              catalog={catalog}
              hasMore={result.hasMore}
              nextPage={result.page + 1}
              productDeals={validResultDeals}
              productTotal={result.total}
              query={query}
              recommendedSellers={recommendedSellers}
              sellers={matchedSellers}
            />
          </Suspense>
        : <SearchIdleHub recommendedSellers={recommendedSellers} />}
      </div>
    </AppBuyerLayout>
  );
}
