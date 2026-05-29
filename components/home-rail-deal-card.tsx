"use client";

import Image from "next/image";
import Link from "next/link";

import { DealCardMeta } from "@/components/deal-card-meta";
import { SaveDealButton } from "@/components/save-deal-button";
import { SellerVerifiedChip } from "@/components/seller-verified-chip";
import type { Deal } from "@/lib/deals";
import { currency, isDealSoldOut } from "@/lib/deals";
import { getProductDetailHref } from "@/lib/deals/card-display";
import { ds } from "@/lib/design-system";
import { resolveSellerProfileForDeal } from "@/lib/sellers/home-sellers";
import { SELLER_UI_COPY } from "@/lib/sellers/trust-copy";
import { getTierProgress } from "@/lib/pricing/tiers";

type HomeRailDealCardProps = {
  deal: Deal;
};

/** 홈 carousel 공통 카드 — 사진 중심, 차분한 메타·가격 */
export function HomeRailDealCard({ deal }: HomeRailDealCardProps) {
  const soldOut = isDealSoldOut(deal);
  const productHref = getProductDetailHref(deal);
  const seller = resolveSellerProfileForDeal(deal);
  const { applicablePrice } = getTierProgress(deal);
  const discount =
    deal.originalPrice > applicablePrice ?
      Math.round(((deal.originalPrice - applicablePrice) / deal.originalPrice) * 100)
    : 0;

  return (
    <article className={ds.productCard.rail}>
      <Link
        aria-label={`${deal.title} 상세보기`}
        className="absolute inset-0 z-0 rounded-xl"
        href={productHref}
      />

      <div className="relative z-10 flex flex-1 flex-col pointer-events-none">
        <div className={ds.productCard.imageRail}>
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
          <div className="absolute right-2 top-2 z-20 pointer-events-auto">
            <SaveDealButton deal={deal} size="sm" variant="overlay" />
          </div>
        </div>

        <div className={`${ds.productCard.bodyRail} space-y-1`}>
          <h3 className={`${ds.productCard.title} line-clamp-1`}>{deal.title}</h3>

          <div className="flex min-w-0 items-center gap-1">
            <span className={`truncate ${ds.type.sellerName}`}>{seller.name}</span>
            {seller.isVerified ?
              <SellerVerifiedChip
                className="!px-1 !py-0 !text-[8px]"
                label={SELLER_UI_COPY.verifiedBadge}
              />
            : null}
          </div>

          <DealCardMeta className="text-[10px]" deal={deal} />

          <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0 pt-0.5">
            {deal.originalPrice > applicablePrice ?
              <span className="text-[10px] font-normal text-gray-400 line-through">
                {currency.format(deal.originalPrice)}원
              </span>
            : null}
            <span className={ds.type.priceRail}>{currency.format(applicablePrice)}원</span>
          </div>
        </div>
      </div>
    </article>
  );
}
