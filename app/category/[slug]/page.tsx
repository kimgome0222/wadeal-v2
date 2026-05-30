import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";

import { AppBuyerLayout } from "@/components/app-buyer-layout";
import { CategorySubNav } from "@/components/category-sub-nav";
import { DealCatalogLoadMore, DealCatalogToolbar } from "@/components/deal-catalog-toolbar";
import { DealProductGrid } from "@/components/deal-product-grid";
import { PlpRecommendedSellers } from "@/components/plp/plp-recommended-sellers";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { categoryTitles, isCategorySlug, isThemeCategorySlug, themeCategoryDefaultSort } from "@/lib/categories";
import { buildCategoryPanelViewModel } from "@/lib/categories/build-category-panel-view";
import { getUnreadCountForUser } from "@/lib/data/notifications";
import { getAllActiveDeals } from "@/lib/data";
import { searchDealsFromParams } from "@/lib/data/search";
import { getcellohDataSource, logPageDataSource } from "@/lib/data/source";
import { buildCategoryMetadata } from "@/lib/seo/site";
import { getRecommendedSellers } from "@/lib/sellers/home-sellers";
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

  const user = await getServerAuthUser();
  const unreadNotificationCount = user ? await getUnreadCountForUser(user.id) : 0;

  const [result, catalog] = await Promise.all([
    searchDealsFromParams(mergedParams, { categorySlug: slug }),
    getAllActiveDeals(),
  ]);
  const subSlug = typeof mergedParams.sub === "string" ? mergedParams.sub : null;
  const recommendedSellers =
    isThemeCategorySlug(slug) ?
      getRecommendedSellers(catalog, 8)
    : buildCategoryPanelViewModel(catalog, slug, subSlug).recommendedSellers;
  logPageDataSource(`/category/${slug}`, getcellohDataSource() ?? "unconfigured");

  return (
    <AppBuyerLayout unreadNotificationCount={unreadNotificationCount}>
      <div className={`${ui.appPageBody} ${ui.appSectionStack} bg-white pb-[max(calc(env(safe-area-inset-bottom)+120px),120px)]`}>
        {!isThemeCategorySlug(slug) ?
          <Suspense fallback={null}>
            <CategorySubNav categorySlug={slug} />
          </Suspense>
        : null}

        <Suspense fallback={null}>
          <DealCatalogToolbar title={categoryTitles[slug]} total={result.total} />
        </Suspense>

        {!isThemeCategorySlug(slug) ?
          <PlpRecommendedSellers sellers={recommendedSellers} />
        : null}

        <DealProductGrid
          deals={result.deals}
          emptyDescription="다른 카테고리나 필터를 선택해 보세요."
          emptyTitle="이 카테고리에 상품이 없어요."
        />

        <Suspense fallback={null}>
          <DealCatalogLoadMore hasMore={result.hasMore} nextPage={result.page + 1} />
        </Suspense>
      </div>
    </AppBuyerLayout>
  );
}
