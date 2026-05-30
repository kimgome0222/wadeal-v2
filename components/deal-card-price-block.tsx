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
  /** card: 상품카드 전용 — 할인율+가격 */
  variant?: "default" | "card";
  /** rail: 할인율 16px · card: 할인율 18px */
  priceVariant?: "rail" | "card";
};

export function DealCardPriceBlock({
  deal,
  compact = false,
  showOriginalPrice = true,
  className = "",
  large = false,
  variant = "default",
  priceVariant = "card",
}: DealCardPriceBlockProps) {
  const { applicablePrice } = getTierProgress(deal);
  const discount = Math.round(
    ((deal.originalPrice - applicablePrice) / deal.originalPrice) * 100,
  );

  if (variant === "card") {
    const discountSize = priceVariant === "rail" ? "text-[16px]" : "text-[16px]";

    return (
      <div
        className={`flex min-w-0 flex-col gap-0.5 pt-0 leading-[1.5] ${className}`.trim()}
      >
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-0">
          {discount > 0 ?
            <span className={`shrink-0 font-bold tabular-nums text-[#E28A3B] ${discountSize}`}>
              {discount}%
            </span>
          : null}
          <span className="text-[18px] font-bold tabular-nums text-[#111111]">
            {currency.format(applicablePrice)}원
          </span>
        </div>
        {showOriginalPrice && deal.originalPrice > applicablePrice ?
          <span className="text-[12px] font-normal tabular-nums text-[#999999] line-through">
            {currency.format(deal.originalPrice)}원
          </span>
        : null}
      </div>
    );
  }

  const priceClass =
    large ? ds.type.priceLg
    : compact ? ds.type.priceSm
    : ds.type.price;

  if (compact) {
    return (
      <div className={`min-w-0 space-y-1.5 pb-0.5 ${className}`.trim()}>
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-1.5 leading-normal">
          <span className={priceClass}>{currency.format(applicablePrice)}원</span>
          {discount > 0 ?
            <span className={ds.type.discount}>{discount}%</span>
          : null}
        </div>
        {showOriginalPrice && deal.originalPrice > applicablePrice ?
          <p className={`${ds.type.meta} text-[11px] leading-[1.5] line-through`}>
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
