"use client";

import Link from "next/link";

import { ProductCardBadgeOverlay } from "@/components/product-card-badge-overlay";
import { ProductCardContent } from "@/components/product-card-content";
import { ProductCardImage } from "@/components/product-card-image";
import { CartQuantityControl } from "@/components/cart/cart-quantity-control";
import type { Deal } from "@/lib/deals";
import { getProductDetailHref } from "@/lib/deals/card-display";
import { resolveProductCardBadgeMeta } from "@/lib/product/card-badge-meta";
import { ds } from "@/lib/design-system";

type DealCardProps = {
  deal: Deal;
};

/** 카테고리·검색 2열 grid 상품 카드 */
export function DealCard({ deal }: DealCardProps) {
  const productHref = getProductDetailHref(deal);
  const badgeMeta = resolveProductCardBadgeMeta(deal);

  return (
    <article className={`${ds.productCard.grid} group relative w-full min-w-0`}>
      <Link
        aria-label={`${deal.title} 상품 상세`}
        className="absolute inset-0 z-0"
        href={productHref}
        tabIndex={-1}
      />
      <div className="relative z-10 flex flex-col overflow-visible">
        <div className="relative">
          <ProductCardImage deal={deal} sizes="(max-width: 430px) 50vw, 215px" />
          <ProductCardBadgeOverlay badgeMeta={badgeMeta} />
          <CartQuantityControl deal={deal} />
        </div>
        <div className="pointer-events-none">
          <ProductCardContent deal={deal} urgencyLabel={badgeMeta?.urgencyLabel} />
        </div>
      </div>
    </article>
  );
}
