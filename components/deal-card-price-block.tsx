import type { Deal } from "@/lib/deals";
import { currency } from "@/lib/deals";
import { getTierProgress } from "@/lib/pricing/tiers";

type DealCardPriceBlockProps = {
  deal: Deal;
  compact?: boolean;
  showOriginalPrice?: boolean;
};

export function DealCardPriceBlock({
  deal,
  compact = false,
  showOriginalPrice = true,
}: DealCardPriceBlockProps) {
  const { applicablePrice } = getTierProgress(deal);
  const discount = Math.round(
    ((deal.originalPrice - applicablePrice) / deal.originalPrice) * 100,
  );
  const discountSize = compact ? "text-[11px]" : "text-[15px]";
  const priceSize = compact ? "text-[14px]" : "text-[15px]";
  const originalSize = compact ? "text-[10px]" : "text-[10px]";

  return (
    <div className="flex flex-wrap items-baseline gap-x-1 gap-y-0.5">
      {discount > 0 ?
        <span className={`font-black text-wadeal-coral ${discountSize}`}>{discount}%</span>
      : null}
      <span className={`font-black tracking-tight text-wadeal-ink ${priceSize}`}>
        {currency.format(applicablePrice)}
        <span className={`font-bold ${compact ? "text-[10px]" : "text-[11px]"}`}>원</span>
      </span>
      {showOriginalPrice && deal.originalPrice > applicablePrice ?
        <span className={`w-full font-medium text-gray-400 line-through ${originalSize}`}>
          {currency.format(deal.originalPrice)}원
        </span>
      : null}
    </div>
  );
}
