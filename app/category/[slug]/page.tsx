import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";

import { AppBuyerLayout } from "@/components/app-buyer-layout";
import { CartSheetCatalogSync } from "@/components/cart/cart-sheet-catalog-sync";
import { CategoryPlpContent } from "@/components/plp/category-plp-content";
import { getServerAuthUser } from "@/lib/auth/server-session";
import {
  categoryTitles,
  isCategorySlug,
  isThemeCategorySlug,
  themeCategoryDefaultSort,
} from "@/lib/categories";
import {
  buildCategoryPanelViewModel,
  ensureMinimumCategoryGridDeals,
  getCategoryGridMinimum,
} from "@/lib/categories/build-category-panel-view";
import { getUnreadCountForUser } from "@/lib/data/notifications";
import { getAllActiveDeals } from "@/lib/data";
import { searchDealsFromParams } from "@/lib/data/search";
import { getcellohDataSource, logPageDataSource } from "@/lib/data/source";
import { buildCategoryMetadata } from "@/lib/seo/site";

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
  const panel = buildCategoryPanelViewModel(catalog, slug, subSlug);
  const gridMinimum = getCategoryGridMinimum(slug, subSlug);
  const gridDeals = ensureMinimumCategoryGridDeals(
    result.deals,
    panel.poolDeals,
    catalog,
    gridMinimum,
  );

  logPageDataSource(`/category/${slug}`, getcellohDataSource() ?? "unconfigured");

  return (
    <AppBuyerLayout unreadNotificationCount={unreadNotificationCount}>
      <CartSheetCatalogSync catalog={catalog} />
      <div className="px-6 pb-3 pt-6">
        <h1 className="text-[22px] font-bold text-[#111111]">
          {categoryTitles[slug]}
        </h1>
        {!isThemeCategorySlug(slug) ?
          <p className="mt-1 text-[13px] text-[#666666]">
            상품 {Math.max(result.total, gridDeals.length).toLocaleString("ko-KR")}개
          </p>
        : null}
      </div>

      <Suspense fallback={null}>
        <CategoryPlpContent
          gridDeals={gridDeals}
          panel={panel}
          result={result}
          slug={slug}
        />
      </Suspense>
    </AppBuyerLayout>
  );
}
