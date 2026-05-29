"use client";

import Image from "next/image";
import Link from "next/link";

import { DealCardPriceBlock } from "@/components/deal-card-price-block";
import { DealCardSellerRow } from "@/components/deal-card-seller-row";
import { DealCardMeta } from "@/components/deal-card-meta";
import type { Deal } from "@/lib/deals";
import { isDealSoldOut } from "@/lib/deals";
import { getProductDetailHref } from "@/lib/deals/card-display";
import { getTierProgress } from "@/lib/pricing/tiers";
import { ds } from "@/lib/design-system";

type HomeRecommendedDealCardProps = {
  deal: Deal;
};

/** 홈 carousel 상품 카드 */
export function HomeRecommendedDealCard({ deal }: HomeRecommendedDealCardProps) {
  const soldOut = isDealSoldOut(deal);
  const productHref = getProductDetailHref(deal);
  const { applicablePrice } = getTierProgress(deal);
  const discount =
    deal.originalPrice > applicablePrice ?
      Math.round(((deal.originalPrice - applicablePrice) / deal.originalPrice) * 100)
    : 0;

  return (
    <article className={`${ds.productCard.rail} group relative flex h-full w-full flex-col`}>
      <Link
        aria-label={`${deal.title} 상품 상세`}
        className="absolute inset-0 z-0 rounded-xl"
        href={productHref}
        tabIndex={-1}
      />
      <div className="relative z-10 flex h-full flex-col pointer-events-none">
        <div className="home-rail-deal-card__image relative aspect-square w-full overflow-hidden rounded-xl bg-[#F8FAF8]">
          <Image
            alt={deal.title}
            className="deal-card-image h-full w-full object-cover transition-transform duration-300 ease-smooth group-hover:scale-[1.02]"
            fill
            loading="lazy"
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 38vw, 58vw"
            src={deal.imageUrl}
          />
          {discount > 0 ?
            <span className={`absolute left-2 top-2 ${ds.badge.base} bg-white/92 text-wadeal-muted backdrop-blur-[2px]`}>
              {discount}%
            </span>
          : null}
          {soldOut ?
            <span className={`absolute bottom-2 left-2 ${ds.badge.base} bg-gray-800/85 text-white`}>
              품절
            </span>
          : null}
        </div>
        <div className="home-rail-deal-card__body flex flex-1 flex-col gap-1 pt-2">
          <h3 className={`${ds.productCard.title} line-clamp-2 min-h-[2.25rem]`}>{deal.title}</h3>
          <div className="pointer-events-auto">
            <DealCardSellerRow compact deal={deal} showBadges={false} />
          </div>
          <DealCardMeta className="text-[10px]" compact deal={deal} />
          <div className="mt-auto pt-0.5">
            <DealCardPriceBlock compact deal={deal} />
          </div>
        </div>
      </div>
    </article>
  );
}
