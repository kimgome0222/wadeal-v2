"use client";

import Link from "next/link";

import { CartQuantityControl } from "@/components/cart/cart-quantity-control";
import { ProductCardContent } from "@/components/product-card-content";
import { ProductCardImage } from "@/components/product-card-image";
import type { Deal } from "@/lib/deals";
import { getProductDetailHref } from "@/lib/deals/card-display";
import { ds } from "@/lib/design-system";

const RAIL_IMAGE_SIZES = "(max-width: 430px) 143px, 143px";

type HomeRailDealCardProps = {
  deal: Deal;
};

/** 홈 carousel 공통 카드 (legacy alias 구조) */
export function HomeRailDealCard({ deal }: HomeRailDealCardProps) {
  const productHref = getProductDetailHref(deal);

  return (
    <article className={`${ds.productCard.rail} group relative min-w-0 w-full`}>
      <Link
        aria-label={`${deal.title} 상세보기`}
        className="group block min-w-0 cursor-pointer"
        href={productHref}
      >
        <ProductCardImage deal={deal} sizes={RAIL_IMAGE_SIZES} variant="rail" />
        <ProductCardContent deal={deal} variant="rail" />
      </Link>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-20 aspect-[4/5] overflow-visible"
      >
        <CartQuantityControl className="pointer-events-auto" deal={deal} />
      </div>
    </article>
  );
}
