import type { Deal } from "@/lib/deals";
import { currency } from "@/lib/deals";
import {
  getCurrentTierIndex,
  getCurrentTierPrice,
  getNextTierInfo,
  resolveDealPriceTiers,
  type PriceTierEntry,
} from "@/lib/pricing/tiers";
import type { PriceTier } from "@/lib/types";

export type PriceTierStepsProps = {
  deal: Deal;
  tiers?: PriceTier[];
  variant?: "compact" | "full";
  className?: string;
};

type TierStatus = "achieved" | "current" | "upcoming";

function CheckIcon() {
  return (
    <svg
      aria-hidden
      className="h-3 w-3 text-wadeal-red"
      fill="none"
      viewBox="0 0 12 12"
    >
      <path
        d="M2.5 6l2.5 2.5 4.5-5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function getTierStatus(index: number, currentIndex: number): TierStatus {
  if (index < currentIndex) {
    return "achieved";
  }
  if (index === currentIndex) {
    return "current";
  }
  return "upcoming";
}

export function PriceTierSteps({
  deal,
  tiers,
  variant = "full",
  className = "",
}: PriceTierStepsProps) {
  const priceTiers = resolveDealPriceTiers(deal, tiers);
  const currentIndex = getCurrentTierIndex(priceTiers, deal.participants);
  const { nextTier, remainingQty } = getNextTierInfo(priceTiers, deal.participants);
  const currentPrice = getCurrentTierPrice(priceTiers, deal.participants);
  const allAchieved = currentIndex === priceTiers.length - 1;
  const isCompact = variant === "compact";
  const lowestPrice = Math.min(...priceTiers.map((tier) => tier.price));

  return (
    <div
      className={`rounded-xl border border-wadeal-line bg-white ${isCompact ? "p-3" : "p-4"} ${className}`.trim()}
    >
      <div className={isCompact ? "mb-3" : "mb-4"}>
        <p className="text-sm font-black text-wadeal-ink">수량 구간별 혜택가</p>
        <p
          className={`mt-1 font-bold leading-relaxed text-wadeal-muted ${isCompact ? "text-[11px]" : "text-xs"}`}
        >
          {allAchieved ?
            `현재 ${deal.participants}개 구매 · 최대 혜택 적용`
          : nextTier ?
            <>
              현재{" "}
              <span className="text-wadeal-ink">{deal.participants}개</span> 구매 · 예상 혜택가{" "}
              <span className="text-wadeal-ink">{currency.format(currentPrice)}원</span>
              {" · "}
              다음 혜택까지{" "}
              <span className="text-wadeal-coral">{remainingQty}개</span>
            </>
          : `현재 ${deal.participants}개 구매 중`}
        </p>
      </div>

      <ol className="relative space-y-0">
        {priceTiers.map((tier: PriceTierEntry, index) => {
          const status = getTierStatus(index, currentIndex);
          const isLast = index === priceTiers.length - 1;
          const isLowest = tier.price === lowestPrice;

          return (
            <li className="relative flex gap-3" key={`${tier.minQty}-${tier.price}`}>
              <div aria-hidden className="flex w-4 shrink-0 flex-col items-center">
                <span
                  className={`mt-[18px] flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border-2 ${
                    status === "current" ?
                      "border-wadeal-red bg-wadeal-red"
                    : status === "achieved" ?
                      "border-wadeal-red bg-white"
                    : "border-gray-200 bg-white"
                  }`}
                >
                  {status === "achieved" ?
                    <span className="h-1.5 w-1.5 rounded-full bg-wadeal-red" />
                  : null}
                </span>
                {!isLast ?
                  <span
                    className={`my-0.5 w-px flex-1 min-h-[12px] ${
                      status === "achieved" ? "bg-wadeal-red/30" : "bg-gray-200"
                    }`}
                  />
                : null}
              </div>

              <div
                className={`mb-2 flex flex-1 items-center justify-between gap-2 rounded-lg border px-3 ${
                  isCompact ? "py-2" : "py-2.5"
                } ${
                  status === "current" ?
                    "border-wadeal-red bg-[#F5F8F4]"
                  : status === "achieved" ?
                    "border-wadeal-line bg-wadeal-surface"
                  : "border-transparent bg-gray-50"
                }`}
              >
                <div className="flex min-w-0 items-center gap-1.5">
                  <span
                    className={`font-black ${isCompact ? "text-xs" : "text-sm"} ${
                      status === "upcoming" ? "text-wadeal-muted" : "text-wadeal-ink"
                    }`}
                  >
                    {tier.minQty}개 이상
                  </span>
                  {status === "achieved" ?
                    <CheckIcon />
                  : null}
                  {status === "current" ?
                    <span className="shrink-0 rounded bg-wadeal-red px-1.5 py-0.5 text-[10px] font-black text-white">
                      현재 구간
                    </span>
                  : null}
                  {isLowest ?
                    <span
                      className={`shrink-0 rounded px-1.5 py-0.5 font-black ${
                        isCompact ? "text-[9px]" : "text-[10px]"
                      } ${
                        status === "current" || status === "achieved" ?
                          "bg-wadeal-red text-white"
                        : "bg-[#F5F8F4] text-wadeal-red"
                      }`}
                    >
                      최대 혜택
                    </span>
                  : null}
                </div>
                <span
                  className={`shrink-0 font-black ${isCompact ? "text-xs" : "text-sm"} ${
                    isLowest && status !== "upcoming" ?
                      "text-wadeal-red"
                    : status === "upcoming" ?
                      "text-gray-400"
                    : "text-wadeal-ink"
                  }`}
                >
                  {currency.format(tier.price)}원
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
