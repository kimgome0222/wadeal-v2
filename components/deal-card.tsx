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

type DealCardProps = {
  deal: Deal;
};

/** 홈·검색 그리드 상품 카드 */
export function DealCard({ deal }: DealCardProps) {
  const soldOut = isDealSoldOut(deal);
  const productHref = getProductDetailHref(deal);
  const { applicablePrice } = getTierProgress(deal);
  const discount =
    deal.originalPrice > applicablePrice ?
      Math.round(((deal.originalPrice - applicablePrice) / deal.originalPrice) * 100)
    : 0;

  return (
    <article className={`${ds.productCard.grid} group relative flex h-full min-w-0 w-full flex-col`}>
      <Link
        aria-label={`${deal.title} 상품 상세`}
        className="absolute inset-0 z-0 rounded-xl"
        href={productHref}
        tabIndex={-1}
      />
      <div className="relative z-10 flex h-full flex-col pointer-events-none">
        <div className="deal-card__image relative aspect-square w-full overflow-hidden bg-[#F8FAF8]">
          <Image
            alt={deal.title}
            className="deal-card-image h-full w-full object-cover transition-transform duration-300 ease-smooth group-hover:scale-[1.02]"
            fill
            loading="lazy"
            sizes="(max-width: 430px) 50vw, 215px"
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
        <div className="deal-card-body flex min-w-0 flex-1 flex-col gap-1 p-0 pt-2.5">
          <h3 className={`${ds.productCard.titleGrid} pointer-events-none`}>{deal.title}</h3>
          <div className="pointer-events-auto mt-1.5">
            <DealCardSellerRow compact deal={deal} showBadges={false} />
          </div>
          <DealCardMeta className="text-[11px]" compact deal={deal} />
          <DealCardPriceBlock compact deal={deal} />
        </div>
      </div>
    </article>
  );
}
