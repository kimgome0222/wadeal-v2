import { notFound } from "next/navigation";
import { BottomNavigation } from "@/components/bottom-navigation";
import { CategoryGrid } from "@/components/category-grid";
import { CategoryProductList } from "@/components/category-product-list";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { categoryTitles, isCategorySlug } from "@/lib/categories";
import { getProductsByCategory } from "@/lib/data";
import { ui } from "@/lib/ui";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  if (!isCategorySlug(slug)) {
    notFound();
  }

  const deals = await getProductsByCategory(slug);

  return (
    <PageShell withBottomNav>
      <div className="sticky top-0 z-30 bg-white">
        <SubHeader backHref="/" title={categoryTitles[slug]} />
        <CategoryGrid sticky />
      </div>
      <div className={`${ui.pageBody} bg-wadeal-surface`}>
        <CategoryProductList deals={deals} />
      </div>
      <BottomNavigation />
    </PageShell>
  );
}
