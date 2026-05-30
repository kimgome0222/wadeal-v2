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

  if (compact) {
    return (
      <div className={`min-w-0 space-y-0.5 ${className}`.trim()}>
        <div className="flex min-w-0 items-baseline gap-x-1.5 leading-tight">
          <span className={priceClass}>{currency.format(applicablePrice)}원</span>
          {discount > 0 ?
            <span className={ds.type.discount}>{discount}%</span>
          : null}
        </div>
        {showOriginalPrice && deal.originalPrice > applicablePrice ?
          <p className={`${ds.type.meta} line-through`}>
            {currency.format(deal.originalPrice)}원
          </p>
        : null}
      </div>
    );
  }

  return (
    <div
      className={`flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-0 leading-tight ${className}`.trim()}
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
