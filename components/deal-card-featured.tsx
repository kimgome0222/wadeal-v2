"use client";

import Image from "next/image";
import Link from "next/link";

import { DealDeadline } from "@/components/deal-deadline";
import { DealCardMeta } from "@/components/deal-card-meta";
import { GroupBuyProgress } from "@/components/group-buy-progress";
import { TierPriceSummary } from "@/components/tier-price-summary";
import type { Deal } from "@/lib/deals";
import { currency, getDealBadgeLabel, isDealClosed, isDealSoldOut } from "@/lib/deals";
import { getDealRemainingLabel } from "@/lib/deals/card-display";
import { getTierProgress } from "@/lib/pricing/tiers";
import { badgeTone } from "@/lib/ui";

type DealCardFeaturedProps = {
  deal: Deal;
};

export function DealCardFeatured({ deal }: DealCardFeaturedProps) {
  const badgeLabel = getDealBadgeLabel(deal);
  const closed = isDealClosed(deal);
  const soldOut = isDealSoldOut(deal);
  const { applicablePrice, lowestPrice } = getTierProgress(deal);
  const discount = Math.round(
    ((deal.originalPrice - applicablePrice) / deal.originalPrice) * 100,
  );

  return (
    <Link className="deal-card group block" href={`/product/${deal.slug}`}>
      <article>
        <div className="relative m-2 mb-0 aspect-[16/10] overflow-hidden rounded-lg bg-gray-50">
          <Image
            alt={deal.title}
            className="object-cover transition-transform duration-200 group-active:scale-[0.98]"
            fill
            priority
            sizes="480px"
            src={deal.imageUrl}
          />
          <span
            className={`absolute left-2 top-2 rounded px-2 py-1 text-[11px] font-black ${badgeTone(badgeLabel)}`}
          >
            {badgeLabel}
          </span>
          {closed && !soldOut ?
            <span className="absolute bottom-2 left-2 rounded bg-gray-800/80 px-2 py-1 text-[11px] font-black text-white">
              마감됨
            </span>
          : null}
        </div>
        <div className="space-y-2 p-3 pt-2">
          <h3 className="line-clamp-2 text-base font-black leading-snug text-wadeal-ink">
            {deal.title}
          </h3>
          <DealCardMeta deal={deal} />
          <DealDeadline deal={deal} variant="card" />
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold text-gray-400 line-through">
              {currency.format(deal.originalPrice)}원
            </span>
            <span className="text-xl font-black text-wadeal-red">{discount}%</span>
          </div>
          <TierPriceSummary deal={deal} variant="card" />
          <GroupBuyProgress deal={deal} showUrgency variant="default" />
          {getDealRemainingLabel(deal) ?
            <p className="text-[11px] font-extrabold text-wadeal-red">{getDealRemainingLabel(deal)}</p>
          : null}
          {lowestPrice < applicablePrice ?
            <p className="text-[11px] font-extrabold text-wadeal-red">
              최저 {currency.format(lowestPrice)}원까지 가능
            </p>
          : null}
        </div>
      </article>
    </Link>
  );
}
