import Link from "next/link";

import { SellerFeaturedProductsRail } from "@/components/seller-featured-products-rail";
import type { Deal } from "@/lib/deals";
import { getSellerOtherProducts } from "@/lib/sellers/seller-other-products";
import { SELLER_UI_COPY } from "@/lib/sellers/trust-copy";
import { ui } from "@/lib/ui";

type SellerOtherProductsSectionProps = {
  deal: Deal;
};

export function SellerOtherProductsSection({ deal }: SellerOtherProductsSectionProps) {
  const products = getSellerOtherProducts(deal, 6);

  if (products.length === 0) {
    return null;
  }

  const railProducts = products.map((product) => ({
    slug: product.slug,
    title: product.title,
    imageUrl: product.imageUrl,
    groupPrice: product.groupPrice,
  }));

  return (
    <section className={`${ui.card} space-y-3 p-4`} id="seller-other-products">
      <div>
        <h2 className="text-base font-black text-wadeal-ink">{SELLER_UI_COPY.otherProducts}</h2>
        <p className="mt-1 text-xs font-medium text-wadeal-muted">
          같은 판매자가 준비한 다른 상품도 확인해 보세요.
        </p>
      </div>

      <SellerFeaturedProductsRail maxItems={6} products={railProducts} title="" />

      <Link
        className={`${ui.btnOutline} h-10 w-full text-[13px]`}
        href={`/search?q=${encodeURIComponent(deal.brandName ?? "")}`}
      >
        {SELLER_UI_COPY.moreProducts}
      </Link>
    </section>
  );
}
