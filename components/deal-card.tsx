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
        aria-label={`${deal.title} 상세보기`}
        className="group block min-w-0 cursor-pointer"
        href={productHref}
      >
        <ProductCardImage deal={deal} sizes="(max-width: 430px) 50vw, 215px" />
        <ProductCardBadgeOverlay badgeMeta={badgeMeta} />
        <ProductCardContent deal={deal} urgencyLabel={badgeMeta?.urgencyLabel} />
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
