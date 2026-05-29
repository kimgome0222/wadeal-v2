"use client";

import Image from "next/image";
import Link from "next/link";
import { DealCardPriceBlock } from "@/components/deal-card-price-block";
import { DealCardSellerRow } from "@/components/deal-card-seller-row";
import { DealDeadline } from "@/components/deal-deadline";
import { DealCardMeta } from "@/components/deal-card-meta";
import { GroupBuyProgress } from "@/components/group-buy-progress";
import { SaveDealButton } from "@/components/save-deal-button";
import { TierPriceSummary } from "@/components/tier-price-summary";
import type { Deal } from "@/lib/deals";
import { getDealBadgeLabel, isDealGroupBuySucceeded, isDealSoldOut } from "@/lib/deals";
import { getDealRemainingLabel } from "@/lib/deals/card-display";
import { getTierProgress } from "@/lib/pricing/tiers";
import { badgeTone } from "@/lib/ui";

type DealCardProps = {
  deal: Deal;
};

export function DealCard({ deal }: DealCardProps) {
  const badgeLabel = getDealBadgeLabel(deal);
  const soldOut = isDealSoldOut(deal);
  const succeeded = isDealGroupBuySucceeded(deal);
  const { applicablePrice, lowestPrice } = getTierProgress(deal);

  return (
    <article className="deal-card group relative flex h-full flex-col">
      <Link
        aria-label={`${deal.title} 상품 상세`}
        className="absolute inset-0 z-0 rounded-xl"
        href={`/product/${deal.slug}`}
        tabIndex={-1}
      />
      <div className="relative z-10 flex h-full flex-col">
        <div className="relative m-2 mb-0 aspect-square overflow-hidden rounded-lg bg-gray-50">
          <Image
            alt={deal.title}
            className="deal-card-image object-cover transition-transform duration-300 ease-smooth group-active:scale-[0.98]"
            fill
            loading="lazy"
            sizes="(max-width: 480px) 50vw, 240px"
            src={deal.imageUrl}
          />
          <span
            className={`absolute left-2 top-2 rounded px-1.5 py-0.5 text-[10px] font-semibold ${badgeTone(badgeLabel)}`}
          >
            {badgeLabel}
          </span>
          {soldOut ?
            <span className="absolute bottom-2 left-2 rounded bg-gray-800/80 px-1.5 py-0.5 text-[10px] font-bold text-white">
              품절
            </span>
          : null}
          <SaveDealButton className="relative z-10" deal={deal} size="sm" />
        </div>
        <div className="deal-card-body flex flex-1 flex-col space-y-1.5 p-2.5 pt-2">
          <h3 className="deal-card-title line-clamp-2 min-h-[2.35rem] break-words text-[13px] font-semibold leading-[1.35] text-wadeal-ink">
            {deal.title}
          </h3>
          <div className="deal-card-seller relative z-10">
            <DealCardSellerRow compact deal={deal} />
          </div>
          <DealCardPriceBlock deal={deal} />
          <DealCardMeta compact deal={deal} />
          <TierPriceSummary deal={deal} variant="card" />
          <DealDeadline deal={deal} variant="card" />
          <GroupBuyProgress deal={deal} variant="compact" />
          {getDealRemainingLabel(deal) ?
            <p className="text-[10px] font-extrabold text-wadeal-muted">{getDealRemainingLabel(deal)}</p>
          : null}
          {succeeded && lowestPrice < applicablePrice ?
            <p className="text-[10px] font-extrabold text-wadeal-coral">혜택가 적용</p>
          : null}
        </div>
      </div>
    </article>
  );
}
