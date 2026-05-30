"use client";

import Link from "next/link";

import { ProductCardContent } from "@/components/product-card-content";
import { ProductCardImage } from "@/components/product-card-image";
import type { Deal } from "@/lib/deals";
import { getProductDetailHref } from "@/lib/deals/card-display";
import { ds } from "@/lib/design-system";

type HomeRailDealCardProps = {
  deal: Deal;
};

/** 홈 carousel 공통 카드 (legacy alias 구조) */
export function HomeRailDealCard({ deal }: HomeRailDealCardProps) {
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
        <ProductCardImage deal={deal} sizes="190px" />
        <ProductCardContent deal={deal} rail />
      </div>
    </article>
  );
}
