import type { Deal } from "@/lib/deals";
import { currency, getDealRemaining } from "@/lib/deals";
import type { PriceTier } from "@/lib/database/types";

type TierPricingProps = {
  deal: Deal;
  tiers?: PriceTier[];
};

function buildDisplayTiers(deal: Deal, tiers?: PriceTier[]) {
  if (tiers && tiers.length > 0) {
    return [...tiers]
      .sort((a, b) => a.order - b.order)
      .map((tier, index, list) => ({
        label: `${tier.order}단계`,
        price: tier.price,
        highlight: index === Math.min(1, list.length - 1),
        strikethrough: index === 0,
      }));
  }

  return [
    { label: "1단계", price: deal.originalPrice, highlight: false, strikethrough: true },
    { label: "현재", price: deal.groupPrice, highlight: true, strikethrough: false },
    { label: "최저가", price: deal.lowestPrice, highlight: false, strikethrough: false },
  ];
}

export function TierPricing({ deal, tiers }: TierPricingProps) {
  const remaining = getDealRemaining(deal);
  const progress = Math.min(
    100,
    Math.round((deal.participants / deal.targetParticipants) * 100),
  );
  const displayTiers = buildDisplayTiers(deal, tiers);
  const midPrice = Math.round((deal.groupPrice + deal.lowestPrice) / 2);

  return (
    <div className="panel space-y-3">
      <div className="flex items-center justify-between text-xs font-extrabold">
        <span className="text-wadeal-muted">
          {deal.participants}명 참여 · {deal.endsIn} 남음
        </span>
        <span className="text-wadeal-red">최저가까지 {remaining}명</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-wadeal-red transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="grid grid-cols-3 gap-1 text-center">
        {displayTiers.map((tier) => (
          <div
            className={
              tier.highlight ?
                "rounded-lg border-2 border-wadeal-red bg-red-50 py-2"
              : "rounded-lg bg-gray-50 py-2"
            }
            key={`${tier.label}-${tier.price}`}
          >
            <p
              className={`text-[10px] font-bold ${tier.highlight ? "font-black text-wadeal-red" : "text-wadeal-muted"}`}
            >
              {tier.label}
            </p>
            <p
              className={`mt-0.5 font-black ${tier.highlight ? "text-sm text-wadeal-red" : tier.strikethrough ? "text-xs text-wadeal-ink line-through opacity-60" : "text-sm text-wadeal-ink"}`}
            >
              {currency.format(tier.price)}
            </p>
          </div>
        ))}
      </div>
      <p className="text-center text-[11px] font-bold text-wadeal-muted">
        {remaining}명 더 모이면 {currency.format(midPrice)}원 →{" "}
        {currency.format(deal.lowestPrice)}원
      </p>
    </div>
  );
}
