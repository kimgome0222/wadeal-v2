import { notFound } from "next/navigation";
import { BottomNavigation } from "@/components/bottom-navigation";
import { CategoryProductList } from "@/components/category-product-list";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { categoryTitles, isCategorySlug } from "@/lib/categories";
import { getDealsByCategorySlug } from "@/lib/deals";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  if (!isCategorySlug(slug)) {
    notFound();
  }

  const deals = getDealsByCategorySlug(slug);

  return (
    <PageShell withBottomNav>
      <SubHeader backHref="/" title={categoryTitles[slug]} />
      <div className="space-y-4 px-4 py-4">
        <p className="text-sm font-bold text-wadeal-muted">
          {deals.length}개의 공동구매를 모았어요
        </p>
        <CategoryProductList deals={deals} />
      </div>
      <BottomNavigation />
    </PageShell>
  );
}
