import type { Deal } from "@/lib/deals";
import { currency, getDealRemaining } from "@/lib/deals";

type TierPricingProps = {
  deal: Deal;
};

export function TierPricing({ deal }: TierPricingProps) {
  const remaining = getDealRemaining(deal);
  const progress = Math.min(
    100,
    Math.round((deal.participants / deal.targetParticipants) * 100),
  );
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
        <div className="rounded-lg bg-gray-50 py-2">
          <p className="text-[10px] font-bold text-wadeal-muted">1단계</p>
          <p className="mt-0.5 text-xs font-black text-wadeal-ink line-through opacity-60">
            {currency.format(deal.originalPrice)}
          </p>
        </div>
        <div className="rounded-lg border-2 border-wadeal-red bg-red-50 py-2">
          <p className="text-[10px] font-black text-wadeal-red">현재</p>
          <p className="mt-0.5 text-sm font-black text-wadeal-red">
            {currency.format(deal.groupPrice)}
          </p>
        </div>
        <div className="rounded-lg bg-gray-50 py-2">
          <p className="text-[10px] font-bold text-wadeal-muted">최저가</p>
          <p className="mt-0.5 text-sm font-black text-wadeal-ink">
            {currency.format(deal.lowestPrice)}
          </p>
        </div>
      </div>
      <p className="text-center text-[11px] font-bold text-wadeal-muted">
        {remaining}명 더 모이면 {currency.format(midPrice)}원 →{" "}
        {currency.format(deal.lowestPrice)}원
      </p>
    </div>
  );
}
