import type { Deal } from "@/lib/deals";
import { currency } from "@/lib/deals";
import { getTierProgress } from "@/lib/pricing/tiers";
import { ds } from "@/lib/design-system";

type DealCardPriceBlockProps = {
  deal: Deal;
  compact?: boolean;
  showOriginalPrice?: boolean;
  className?: string;
  large?: boolean;
};

export function DealCardPriceBlock({
  deal,
  compact = false,
  showOriginalPrice = true,
  className = "",
  large = false,
}: DealCardPriceBlockProps) {
  const { applicablePrice } = getTierProgress(deal);
  const discount = Math.round(
    ((deal.originalPrice - applicablePrice) / deal.originalPrice) * 100,
  );

  const priceClass =
    large ? ds.type.priceLg
    : compact ? ds.type.priceSm
    : ds.type.price;

  return (
    <div
      className={`flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-0 leading-tight ${compact ? "overflow-hidden" : ""} ${className}`.trim()}
    >
      <span className={priceClass}>{currency.format(applicablePrice)}원</span>
      {discount > 0 ?
        <span className={ds.type.discount}>{discount}%</span>
      : null}
      {showOriginalPrice && deal.originalPrice > applicablePrice ?
        <span className={`${ds.type.meta} line-through`}>
          {currency.format(deal.originalPrice)}원
        </span>
      : null}
    </div>
  );
}
