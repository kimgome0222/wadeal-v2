import type { Deal } from "@/lib/deals";
import { currency } from "@/lib/deals";
import { getTierProgress } from "@/lib/pricing/tiers";
import { ds } from "@/lib/design-system";

type DealCardPriceBlockProps = {
  deal: Deal;
  compact?: boolean;
  showOriginalPrice?: boolean;
  className?: string;
};

export function DealCardPriceBlock({
  deal,
  compact = false,
  showOriginalPrice = true,
  className = "",
}: DealCardPriceBlockProps) {
  const { applicablePrice } = getTierProgress(deal);
  const discount = Math.round(
    ((deal.originalPrice - applicablePrice) / deal.originalPrice) * 100,
  );

  return (
    <div
      className={`flex flex-wrap items-baseline gap-x-1 gap-y-0 leading-tight ${className}`.trim()}
    >
      {discount > 0 ?
        <span className={`${compact ? "text-[10px]" : "text-[11px]"} font-medium text-wadeal-coral`}>
          {discount}%
        </span>
      : null}
      <span className={compact ? ds.type.priceSm : ds.type.price}>
        {currency.format(applicablePrice)}원
      </span>
      {showOriginalPrice && deal.originalPrice > applicablePrice ?
        <span className={`${ds.type.meta} line-through`}>
          {currency.format(deal.originalPrice)}원
        </span>
      : null}
    </div>
  );
}
