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

const RAIL_IMAGE_SIZES = "(max-width: 430px) calc((100vw - 72px) / 2.5), 160px";

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
          <ProductCardImage
            deal={deal}
            imageAspect={imageAspect}
            sizes={RAIL_IMAGE_SIZES}
            variant="rail"
          />
          <ProductCardBadgeOverlay badgeMeta={badgeMeta} promoBadge={promoBadge} />
          <CartQuantityControl deal={deal} size="rail" />
        </div>
        <div className="pointer-events-none">
          <ProductCardContent
            deal={deal}
            promoBadge={promoBadge}
            showCouponPrice={showCouponPrice}
            urgencyLabel={badgeMeta?.urgencyLabel}
            variant="rail"
          />
        </div>
      </div>
    </article>
  );
}
