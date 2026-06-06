import Link from "next/link";

import { SellerFeaturedProductsRail } from "@/components/seller-featured-products-rail";
import type { Deal } from "@/lib/deals";
import { getSellerOtherProducts } from "@/lib/sellers/seller-other-products";
import {
  getSellerPublicProfileHref,
  getSellerSearchHref,
  isSellerPublicProfileEnabled,
} from "@/lib/sellers/routes";
import { resolveSellerProfileForDeal } from "@/lib/sellers/home-sellers";
import { SELLER_UI_COPY } from "@/lib/sellers/trust-copy";
import { ds } from "@/lib/design-system";
import { ui } from "@/lib/ui";

type SellerOtherProductsSectionProps = {
  deal: Deal;
};

export function SellerOtherProductsSection({ deal }: SellerOtherProductsSectionProps) {
  const products = getSellerOtherProducts(deal, 6);

  if (products.length === 0) {
    return null;
  }

  const seller = resolveSellerProfileForDeal(deal);
  const sellerHref =
    isSellerPublicProfileEnabled() ?
      getSellerPublicProfileHref(seller)
    : getSellerSearchHref(seller);
  const sellerLinkLabel =
    isSellerPublicProfileEnabled() ? "판매자 프로필 보기" : SELLER_UI_COPY.moreProducts;

  return (
    <section className="scroll-mt-28 space-y-3 rounded-xl border border-[#DDE8E2] bg-white p-4" id="seller-other-products">
      <h2 className={`${ds.type.h2} font-semibold`}>{SELLER_UI_COPY.otherProducts}</h2>

      <SellerFeaturedProductsRail maxItems={6} minItems={3} products={products} title="" />

      <Link className={`${ui.btnOutline} h-10 w-full text-[13px]`} href={sellerHref}>
        {sellerLinkLabel}
      </Link>
    </section>
  );
}
