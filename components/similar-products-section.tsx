import Link from "next/link";

import { ProductDetailDealRail } from "@/components/product/product-detail-deal-rail";
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
  maxItems = 12,
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
    <div className="pb-2">
      {sameSeller.length > 0 ?
        <>
          <ProductDetailDealRail
            deals={sameSeller}
            sectionId="same-seller-products"
            title="판매자의 다른 상품"
          />
          <Link
            className="mx-6 mb-4 flex h-11 w-[calc(100%-3rem)] items-center justify-center rounded-[14px] border border-[#E8ECEA] text-[14px] font-semibold text-[#111111]"
            href={getSellerSearchHref(seller)}
          >
            {seller.name} 상품 더보기
          </Link>
        </>
      : null}

      <ProductDetailDealRail
        deals={similar}
        sectionId="similar-products"
        subtitle="함께 보면 좋은 상품이에요"
        title="관련 추천상품"
      />
    </div>
  );
}
