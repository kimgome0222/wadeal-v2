import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";

import { AppBottomNavigation } from "@/components/app-bottom-navigation";
import { CategoryGrid } from "@/components/category-grid";
import { CategoryPopularSellers } from "@/components/category-popular-sellers";
import { CategorySubNav } from "@/components/category-sub-nav";
import { DealCatalogLoadMore, DealCatalogToolbar } from "@/components/deal-catalog-toolbar";
import { DealCatalogSortBar } from "@/components/deal-catalog-sort-bar";
import { DealProductGrid } from "@/components/deal-product-grid";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { categoryTitles, isCategorySlug, isThemeCategorySlug, themeCategoryDefaultSort } from "@/lib/categories";
import { searchDealsFromParams } from "@/lib/data/search";
import { getcellohDataSource, logPageDataSource } from "@/lib/data/source";
import { buildCategoryMetadata } from "@/lib/seo/site";
import { getCategoryPopularSellers } from "@/lib/sellers/search-sellers";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;

  if (!isCategorySlug(slug)) {
    return { title: "카테고리를 찾을 수 없어요" };
  }

  return buildCategoryMetadata(slug);
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const catalogParams = await searchParams;

  if (!isCategorySlug(slug)) {
    notFound();
  }

  const mergedParams = { ...catalogParams };

  if (!mergedParams.sort && themeCategoryDefaultSort[slug]) {
    mergedParams.sort = themeCategoryDefaultSort[slug]!;
  }

  const result = await searchDealsFromParams(mergedParams, { categorySlug: slug });
  const popularSellers = getCategoryPopularSellers(result.deals);
  logPageDataSource(`/category/${slug}`, getcellohDataSource() ?? "unconfigured");

  return (
    <PageShell withBottomNav>
      <div className="sticky top-0 z-30 bg-white">
        <SubHeader backHref="/" title={categoryTitles[slug]} />
        <CategoryGrid sticky />
        {isThemeCategorySlug(slug) ?
          null
        : <>
            <Suspense fallback={null}>
              <CategorySubNav categorySlug={slug} />
            </Suspense>
          </>}

        <Suspense fallback={null}>
          <DealCatalogSortBar />
        </Suspense>
      </div>
      <div className={`${ui.pageBody} space-y-4 bg-white`}>
        <Suspense fallback={null}>
          <DealCatalogToolbar
            queryLabel={categoryTitles[slug]}
            total={result.total}
          />
        </Suspense>

        {!isThemeCategorySlug(slug) ?
          <CategoryPopularSellers categoryLabel={categoryTitles[slug]} sellers={popularSellers} />
        : null}

        <DealProductGrid
          deals={result.deals}
          emptyDescription="다른 카테고리나 필터를 선택해 보세요."
          emptyTitle="이 카테고리에 상품이 없어요."
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
