"use client";

import Link from "next/link";

import { ProductCardContent } from "@/components/product-card-content";
import { ProductCardImage } from "@/components/product-card-image";
import type { Deal } from "@/lib/deals";
import { getProductDetailHref } from "@/lib/deals/card-display";
import { ds } from "@/lib/design-system";

const RAIL_IMAGE_SIZES = "(max-width: 430px) calc((100vw - 60px) / 2), 185px";

type HomeRecommendedDealCardProps = {
  deal: Deal;
};

/** 홈 carousel 상품 카드 */
export function HomeRecommendedDealCard({ deal }: HomeRecommendedDealCardProps) {
  const productHref = getProductDetailHref(deal);

  return (
    <article className={`${ds.productCard.rail} group relative min-w-0`}>
      <Link
        aria-label={`${deal.title} 상품 상세`}
        className="absolute inset-0 z-0"
        href={productHref}
        tabIndex={-1}
      />
      <div className="relative z-10 flex flex-col overflow-visible pointer-events-none">
        <ProductCardImage deal={deal} sizes={RAIL_IMAGE_SIZES} variant="rail" />
        <ProductCardContent deal={deal} variant="rail" />
      </div>
    </article>
  );
}
