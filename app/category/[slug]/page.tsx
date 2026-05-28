import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";

import { AppBottomNavigation } from "@/components/app-bottom-navigation";
import { CategoryGrid } from "@/components/category-grid";
import { DealCatalogLoadMore, DealCatalogToolbar } from "@/components/deal-catalog-toolbar";
import { DealProductGrid } from "@/components/deal-product-grid";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { categoryTitles, isCategorySlug } from "@/lib/categories";
import { searchDealsFromParams } from "@/lib/data/search";
import { getWadealDataSource, logPageDataSource } from "@/lib/data/source";
import { buildCategoryMetadata } from "@/lib/seo/site";
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

  const result = await searchDealsFromParams(catalogParams, { categorySlug: slug });
  logPageDataSource(`/category/${slug}`, getWadealDataSource() ?? "unconfigured");

  return (
    <PageShell withBottomNav>
      <div className="sticky top-0 z-30 bg-white">
        <SubHeader backHref="/" title={categoryTitles[slug]} />
        <CategoryGrid sticky />
      </div>
      <div className={`${ui.pageBody} space-y-4 bg-wadeal-surface`}>
        <Suspense fallback={null}>
          <DealCatalogToolbar
            queryLabel={categoryTitles[slug]}
            total={result.total}
          />
        </Suspense>

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
