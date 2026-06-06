import { ProductRecentlyViewedSection } from "@/components/product-recently-viewed-section";
import type { Deal } from "@/lib/deals";

type ProductDetailBottomSectionsProps = {
  deal: Deal;
  catalog: Deal[];
};

/** 하단: 최근 본 상품 */
export function ProductDetailBottomSections({
  deal,
  catalog,
}: ProductDetailBottomSectionsProps) {
  return (
    <div className="pb-2">
      <ProductRecentlyViewedSection
        catalog={catalog}
        excludeSlug={deal.slug}
        maxItems={8}
      />
    </div>
  );
}
