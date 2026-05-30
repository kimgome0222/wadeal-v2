import Link from "next/link";

import { DealProductGrid } from "@/components/deal-product-grid";
import type { Deal } from "@/lib/deals";
import { filterDealsInCatalog } from "@/lib/deals/catalog-validation";
import { getSameSellerDeals, getSimilarDeals } from "@/lib/deals/similar-products";
import { getSellerSearchHref } from "@/lib/sellers/routes";
import { resolveSellerProfileForDeal } from "@/lib/sellers/home-sellers";
import { ds } from "@/lib/design-system";
import { ui } from "@/lib/ui";

type SimilarProductsSectionProps = {
  deal: Deal;
  catalog: Deal[];
  maxItems?: number;
};

export function SimilarProductsSection({
  deal,
  catalog,
  maxItems = 4,
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
    <div className="mt-6 space-y-6">
      {sameSeller.length > 0 ?
        <section className={`${ds.card.padded} space-y-4`} id="same-seller-products">
          <div>
            <h2 className={ds.type.h2}>같은 판매자 상품</h2>
            <p className={`mt-1.5 ${ds.type.caption}`}>
              {seller.name}의 다른 상품이에요.
            </p>
          </div>
          <DealProductGrid deals={sameSeller} />
          <Link
            className={`${ui.btnOutline} h-10 w-full text-[13px]`}
            href={getSellerSearchHref(seller)}
          >
            {seller.name} 상품 더보기
          </Link>
        </section>
      : null}

      {similar.length > 0 ?
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
          <Link className={`${ds.type.link} block py-1 text-center`} href="/category/all">
            비슷한 상품 더보기
          </Link>
        </section>
      : null}
    </div>
  );
}
