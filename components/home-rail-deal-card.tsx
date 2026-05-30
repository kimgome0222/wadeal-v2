"use client";

import Link from "next/link";

import { CartQuantityControl } from "@/components/cart/cart-quantity-control";
import { ProductCardContent } from "@/components/product-card-content";
import { ProductCardImage } from "@/components/product-card-image";
import type { Deal } from "@/lib/deals";
import { getProductDetailHref } from "@/lib/deals/card-display";
import { ds } from "@/lib/design-system";

const RAIL_IMAGE_SIZES = "(max-width: 430px) calc((100vw - 64px) / 2), 185px";

type HomeRailDealCardProps = {
  deal: Deal;
};

/** 홈 carousel 공통 카드 (legacy alias 구조) */
export function HomeRailDealCard({ deal }: HomeRailDealCardProps) {
  const productHref = getProductDetailHref(deal);

  return (
    <article className={`${ds.productCard.rail} group relative min-w-0 w-full`}>
      <Link
        aria-label={`${deal.title} 상품 상세`}
        className="absolute inset-0 z-0"
        href={productHref}
        tabIndex={-1}
      />
      <div className="relative z-10 flex flex-col overflow-visible">
        <div className="relative">
          <ProductCardImage deal={deal} sizes={RAIL_IMAGE_SIZES} variant="rail" />
          <CartQuantityControl deal={deal} />
        </div>
        <div className="pointer-events-none">
          <ProductCardContent deal={deal} variant="rail" />
        </div>
      </div>
    </article>
  );
}
