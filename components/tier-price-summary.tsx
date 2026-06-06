import type { Deal } from "@/lib/deals";
import { currency } from "@/lib/deals";
import { getTierProgress } from "@/lib/pricing/tiers";

type TierPriceSummaryProps = {
  deal: Deal;
  variant?: "card" | "inline";
  className?: string;
};

export function TierPriceSummary({
  deal,
  variant = "card",
  className = "",
}: TierPriceSummaryProps) {
  const {
    applicablePrice,
    lowestPrice,
    qtyUntilNextTier,
    nextTier,
    allTiersAchieved,
  } = getTierProgress(deal);

  const isCard = variant === "card";

  return (
    <div className={`space-y-1 ${className}`.trim()}>
      <div className="flex items-center justify-between gap-2">
        <span
          className={`font-extrabold text-wadeal-muted ${
            isCard ? "text-[10px]" : "text-[11px]"
          }`}
        >
          {deal.participants}개 구매 중
        </span>
        {!allTiersAchieved && nextTier ?
          <span
            className={`truncate font-extrabold text-wadeal-muted ${
              isCard ? "text-[10px]" : "text-[11px]"
            }`}
          >
            {qtyUntilNextTier}개 더 구매 시 혜택 {formatTierPrice(nextTier.price)}원
          </span>
        : <span className="text-[10px] font-extrabold text-wadeal-coral">최대 혜택 적용</span>}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div className="flex items-baseline gap-1">
          <span
            className={`font-black text-wadeal-ink ${
              isCard ? "text-[17px]" : "text-[20px]"
            }`}
          >
            {formatTierPrice(applicablePrice)}
          </span>
          <span className="text-[11px] font-extrabold text-wadeal-ink">원</span>
          <span className="text-[10px] font-bold text-wadeal-muted">예상가</span>
        </div>
        {lowestPrice < applicablePrice ?
          <span className="text-[10px] font-bold text-wadeal-muted">
            혜택가{" "}
            <span className="font-black text-wadeal-ink">
              {formatTierPrice(lowestPrice)}원
            </span>
          </span>
        : null}
      </div>
    </div>
  );
}

function formatTierPrice(price: number): string {
  return currency.format(price);
}
