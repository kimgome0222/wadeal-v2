"use client";

import Image from "next/image";
import Link from "next/link";

import { DealDeadline } from "@/components/deal-deadline";
import { DealCardMeta } from "@/components/deal-card-meta";
import { DealCardPriceBlock } from "@/components/deal-card-price-block";
import { DealCardSellerRow } from "@/components/deal-card-seller-row";
import { GroupBuyProgress } from "@/components/group-buy-progress";
import { SaveDealButton } from "@/components/save-deal-button";
import { TierPriceSummary } from "@/components/tier-price-summary";
import type { Deal } from "@/lib/deals";
import { currency, getDealBadgeLabel, isDealSoldOut } from "@/lib/deals";
import { getDealRemainingLabel } from "@/lib/deals/card-display";
import { getTierProgress } from "@/lib/pricing/tiers";
import { badgeTone } from "@/lib/ui";

type DealCardFeaturedProps = {
  deal: Deal;
};

export function DealCardFeatured({ deal }: DealCardFeaturedProps) {
  const badgeLabel = getDealBadgeLabel(deal);
  const soldOut = isDealSoldOut(deal);
  const { applicablePrice, lowestPrice } = getTierProgress(deal);

  return (
    <article className="deal-card group relative block">
      <Link
        aria-label={`${deal.title} 상품 상세`}
        className="absolute inset-0 z-0 rounded-xl"
        href={`/product/${deal.slug}`}
        tabIndex={-1}
      />
      <div className="relative z-10">
        <div className="relative m-2 mb-0 aspect-[16/10] overflow-hidden rounded-lg bg-gray-50">
          <Image
            alt={deal.title}
            className="deal-card-image object-cover transition-transform duration-300 ease-smooth group-active:scale-[0.98]"
            fill
            priority
            sizes="480px"
            src={deal.imageUrl}
          />
          <span
            className={`absolute left-2 top-2 rounded px-2 py-0.5 text-[10px] font-semibold ${badgeTone(badgeLabel)}`}
          >
            {badgeLabel}
          </span>
          {soldOut ?
            <span className="absolute bottom-2 left-2 rounded bg-gray-800/80 px-2 py-0.5 text-[10px] font-semibold text-white">
              품절
            </span>
          : null}
          <SaveDealButton className="relative z-10" deal={deal} size="sm" />
        </div>
        <div className="space-y-2 p-3 pt-2">
          {deal.brandName ?
            <p className="truncate text-[11px] font-bold text-wadeal-muted">{deal.brandName}</p>
          : null}
          <h3 className="deal-card-title line-clamp-2 break-words text-[15px] font-semibold leading-snug text-wadeal-ink">
            {deal.title}
          </h3>
          <div className="deal-card-seller relative z-10">
            <DealCardSellerRow deal={deal} />
          </div>
          <DealCardPriceBlock deal={deal} />
          <DealCardMeta deal={deal} showReview={false} />
          <DealDeadline deal={deal} variant="card" />
          <TierPriceSummary deal={deal} variant="card" />
          <GroupBuyProgress deal={deal} showUrgency variant="default" />
          {getDealRemainingLabel(deal) ?
            <p className="text-[11px] font-extrabold text-wadeal-muted">{getDealRemainingLabel(deal)}</p>
          : null}
          {lowestPrice < applicablePrice ?
            <p className="text-[11px] font-extrabold text-wadeal-muted">
              최저 {currency.format(lowestPrice)}원까지 가능
            </p>
          : null}
        </div>
      </div>
    </article>
  );
}
