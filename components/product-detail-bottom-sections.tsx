import { SimilarProductsSection } from "@/components/similar-products-section";
import { ProductRecentlyViewedSection } from "@/components/product-recently-viewed-section";
import type { Deal } from "@/lib/deals";

type ProductDetailBottomSectionsProps = {
  deal: Deal;
  catalog: Deal[];
};

/** 하단: 추천 상품 (같은 판매자 · 함께 본) */
export function ProductDetailBottomSections({
  deal,
  catalog,
}: ProductDetailBottomSectionsProps) {
  return (
    <div className="pb-2">
      <SimilarProductsSection catalog={catalog} deal={deal} maxItems={8} />

      <ProductRecentlyViewedSection
        catalog={catalog}
        excludeSlug={deal.slug}
        maxItems={8}
      />
    </div>
  );
}
