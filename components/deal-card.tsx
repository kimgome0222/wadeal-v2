"use client";

import Link from "next/link";

import { ProductCardContent } from "@/components/product-card-content";
import { ProductCardImage } from "@/components/product-card-image";
import type { Deal } from "@/lib/deals";
import { getProductDetailHref } from "@/lib/deals/card-display";
import { ds } from "@/lib/design-system";

type DealCardProps = {
  deal: Deal;
};

/** 홈·검색·카테고리 2열 그리드 상품 카드 */
export function DealCard({ deal }: DealCardProps) {
  const productHref = getProductDetailHref(deal);

  return (
    <article className={`${ds.productCard.grid} group relative w-full min-w-0`}>
      <Link
        aria-label={`${deal.title} 상품 상세`}
        className="absolute inset-0 z-0"
        href={productHref}
        tabIndex={-1}
      />
      <div className="relative z-10 flex flex-col overflow-visible pointer-events-none">
        <ProductCardImage deal={deal} sizes="(max-width: 430px) 50vw, 215px" />
        <ProductCardContent deal={deal} />
      </div>
    </article>
  );
}
