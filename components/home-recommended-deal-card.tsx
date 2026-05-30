"use client";

import Link from "next/link";

import { CartQuantityControl } from "@/components/cart/cart-quantity-control";
import { ProductCardBadgeOverlay } from "@/components/product-card-badge-overlay";
import { ProductCardContent } from "@/components/product-card-content";
import { ProductCardImage } from "@/components/product-card-image";
import type { Deal } from "@/lib/deals";
import { getProductDetailHref } from "@/lib/deals/card-display";
import { ds } from "@/lib/design-system";
import type { ProductCardPromoBadge } from "@/lib/growth/cart-growth-mock";
import { resolveProductCardBadgeMeta } from "@/lib/product/card-badge-meta";

const RAIL_IMAGE_SIZES = "(max-width: 430px) 143px, 143px";

type HomeRecommendedDealCardProps = {
  deal: Deal;
  imageAspect?: "portrait" | "square";
  promoBadge?: ProductCardPromoBadge | null;
  showCouponPrice?: boolean;
};

/** 홈 commerce rail 상품 카드 */
export function HomeRecommendedDealCard({
  deal,
  imageAspect = "square",
  promoBadge = null,
  showCouponPrice = false,
}: HomeRecommendedDealCardProps) {
  const productHref = getProductDetailHref(deal);
  const badgeMeta = resolveProductCardBadgeMeta(deal);
  const overlayAspect = imageAspect === "square" ? "aspect-square" : "aspect-[4/5]";

  return (
    <article className={`${ds.productCard.rail} group relative min-w-0 w-full`}>
      <Link
        aria-label={`${deal.title} 상세보기`}
        className="group block min-w-0 cursor-pointer"
        href={productHref}
      >
        <ProductCardImage
          deal={deal}
          imageAspect={imageAspect}
          sizes={RAIL_IMAGE_SIZES}
          variant="rail"
        />
        <ProductCardBadgeOverlay badgeMeta={badgeMeta} promoBadge={promoBadge} />
        <ProductCardContent
          deal={deal}
          promoBadge={promoBadge}
          showCouponPrice={showCouponPrice}
          urgencyLabel={badgeMeta?.urgencyLabel}
          variant="rail"
        />
      </Link>
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 top-0 z-20 overflow-visible ${overlayAspect}`}
      >
        <CartQuantityControl className="pointer-events-auto" deal={deal} />
      </div>
    </article>
  );
}
