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
import { SearchSubNav } from "@/components/search-sub-nav";
import { isCategorySlug } from "@/lib/categories";
import {
  getPopularSearchTerms,
  logSearchQuery,
  searchDealsFromParams,
} from "@/lib/data/search";
import { getWadealDataSource, logPageDataSource } from "@/lib/data/source";
import { parseDealCatalogSearchParams } from "@/lib/search/params";
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

  const [result, popularTerms] = await Promise.all([
    searchDealsFromParams(params),
    query ? Promise.resolve([]) : getPopularSearchTerms(),
  ]);

  if (query) {
    await logSearchQuery({ query, resultCount: result.total });
  }

  logPageDataSource("/search", getWadealDataSource() ?? "unconfigured");

  return (
    <PageShell withBottomNav>
      <div className="sticky top-0 z-30 bg-white">
        <SearchHeader backHref="/" initialQuery={query} />
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
      <div className={`${ui.pageBody} space-y-4 bg-wadeal-surface`}>
        <Suspense fallback={null}>
          <DealCatalogToolbar
            queryLabel={query ? `'${query}' 검색 결과` : "전체 상품"}
            total={result.total}
          />
        </Suspense>

        {!query && popularTerms.length > 0 ?
          <PopularSearchTerms terms={popularTerms} />
        : null}

        <DealProductGrid
          deals={result.deals}
          emptyDescription={
            query ?
              "다른 키워드로 다시 검색해 보세요."
            : "조건을 변경해 다시 찾아보세요."
          }
          emptyTitle={query ? "검색 결과가 없어요." : "상품이 없어요."}
        />

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
