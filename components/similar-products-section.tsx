import Link from "next/link";

import { ProductDetailDealRail } from "@/components/product/product-detail-deal-rail";
import { PolicyCriteriaLink } from "@/components/product/policy-criteria-link";
import { CELLOH_PRODUCT_DETAIL } from "@/lib/copy/ux-writing";
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
            title={CELLOH_PRODUCT_DETAIL.sameSellerTitle}
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
        subtitle={CELLOH_PRODUCT_DETAIL.relatedSubtitle}
        title={CELLOH_PRODUCT_DETAIL.relatedTitle}
      />
      <div className="px-6 pb-2">
        <PolicyCriteriaLink href="/info/ranking-policy" label="추천 기준 안내" />
      </div>
    </div>
  );
}
