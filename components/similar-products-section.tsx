import Link from "next/link";

import { DealProductGrid } from "@/components/deal-product-grid";
import type { Deal } from "@/lib/deals";
import { filterDealsInCatalog } from "@/lib/deals/catalog-validation";
import { getSameSellerDeals, getSimilarDeals } from "@/lib/deals/similar-products";
import { getSellerSearchHref } from "@/lib/sellers/routes";
import { resolveSellerProfileForDeal } from "@/lib/sellers/home-sellers";

type SimilarProductsSectionProps = {
  deal: Deal;
  catalog: Deal[];
  maxItems?: number;
};

export function SimilarProductsSection({
  deal,
  catalog,
  maxItems = 8,
}: SimilarProductsSectionProps) {
  const sameSeller = filterDealsInCatalog(
    getSameSellerDeals(deal, catalog, maxItems),
    catalog,
  );
  const similar = filterDealsInCatalog(getSimilarDeals(deal, catalog, maxItems), catalog);
  const seller = resolveSellerProfileForDeal(deal, catalog);

  if (sameSeller.length === 0 && similar.length === 0) {
    return null;
  }

  return (
    <div className="space-y-10 py-10">
      {sameSeller.length > 0 ?
        <section className="space-y-4" id="same-seller-products">
          <h2 className="text-[20px] font-bold text-[#111111]">이 판매자의 다른 상품</h2>
          <DealProductGrid deals={sameSeller} />
          <Link
            className="flex h-11 w-full items-center justify-center rounded-[14px] border border-[#E8ECEA] text-[14px] font-semibold text-[#111111]"
            href={getSellerSearchHref(seller)}
          >
            {seller.name} 상품 더보기
          </Link>
        </section>
      : null}

      {similar.length > 0 ?
        <section className="space-y-4" id="similar-products">
          <h2 className="text-[20px] font-bold text-[#111111]">함께 본 상품</h2>
          <DealProductGrid
            deals={similar}
            emptyDescription="다른 상품을 둘러보세요."
            emptyTitle="함께 본 상품을 준비 중이에요."
          />
        </section>
      : null}
    </div>
  );
}
