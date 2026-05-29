"use client";

import Image from "next/image";
import Link from "next/link";
import { DealDeadline } from "@/components/deal-deadline";
import { DealCardMeta } from "@/components/deal-card-meta";
import { GroupBuyProgress } from "@/components/group-buy-progress";
import { SaveDealButton } from "@/components/save-deal-button";
import { TierPriceSummary } from "@/components/tier-price-summary";
import type { Deal } from "@/lib/deals";
import { currency, getDealBadgeLabel, isDealGroupBuySucceeded, isDealSoldOut } from "@/lib/deals";
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
  const discount = Math.round(
    ((deal.originalPrice - applicablePrice) / deal.originalPrice) * 100,
  );

  return (
    <Link className="deal-card group" href={`/product/${deal.slug}`}>
      <article className="flex h-full flex-col">
        <div className="relative m-2 mb-0 aspect-square overflow-hidden rounded-lg bg-gray-50">
          <Image
            alt={deal.title}
            className="object-cover transition-transform duration-200 group-active:scale-[0.98]"
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
          <SaveDealButton className="absolute right-2 top-2" deal={deal} size="sm" />
        </div>
        <div className="flex flex-1 flex-col space-y-1.5 p-2.5 pt-2">
          <h3 className="line-clamp-2 min-h-[2.35rem] text-[13px] font-semibold leading-[1.35] text-wadeal-ink">
            {deal.title}
          </h3>
          <DealCardMeta compact deal={deal} />
          <div className="flex flex-wrap items-baseline gap-x-1 gap-y-0.5">
            <span className="text-[15px] font-black text-wadeal-red">{discount}%</span>
            <span className="text-[15px] font-black tracking-tight text-wadeal-ink">
              {currency.format(applicablePrice)}
              <span className="text-[11px] font-bold">원</span>
            </span>
            <span className="w-full text-[10px] font-medium text-gray-400 line-through">
              {currency.format(deal.originalPrice)}원
            </span>
          </div>
          <TierPriceSummary deal={deal} variant="card" />
          <DealDeadline deal={deal} variant="card" />
          <GroupBuyProgress deal={deal} variant="compact" />
          {getDealRemainingLabel(deal) ?
            <p className="text-[10px] font-extrabold text-wadeal-red">{getDealRemainingLabel(deal)}</p>
          : null}
          {succeeded && lowestPrice < applicablePrice ?
            <p className="text-[10px] font-extrabold text-green-700">목표 달성 · 최저가 적용</p>
          : null}
        </div>
      </article>
    </Link>
  );
}
