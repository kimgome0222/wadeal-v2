import { DealProductGrid } from "@/components/deal-product-grid";
import type { Deal } from "@/lib/deals";
import { getSimilarDeals } from "@/lib/deals/similar-products";
import { ds } from "@/lib/design-system";

type SimilarProductsSectionProps = {
  deal: Deal;
  catalog: Deal[];
  maxItems?: number;
};

export function SimilarProductsSection({
  deal,
  catalog,
  maxItems = 6,
}: SimilarProductsSectionProps) {
  const similar = getSimilarDeals(deal, catalog, maxItems);

  if (similar.length === 0) {
    return null;
  }

  return (
    <section className={`${ds.card.padded} space-y-4`} id="similar-products">
      <div>
        <h2 className={ds.type.h2}>비슷한 상품</h2>
        <p className={`mt-1.5 ${ds.type.caption}`}>
          같은 카테고리에서 함께 본 상품이에요.
        </p>
      </div>
      <DealProductGrid
        deals={similar}
        emptyDescription="다른 상품을 둘러보세요."
        emptyTitle="비슷한 상품을 준비 중이에요."
      />
    </section>
  );
}
