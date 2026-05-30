"use client";

const TIER_OPTIONS = [
  { minQty: 2, discountLabel: "3%↓" },
  { minQty: 5, discountLabel: "7%↓" },
  { minQty: 10, discountLabel: "12%↓" },
] as const;

type ProductQuantityTierOptionsProps = {
  quantity: number;
  max: number;
  onSelectQuantity: (quantity: number) => void;
};

/** PDP 수량 구간별 혜택가 — chip 클릭 시 해당 최소 수량으로 설정 */
export function ProductQuantityTierOptions({
  quantity,
  max,
  onSelectQuantity,
}: ProductQuantityTierOptionsProps) {
  return (
    <div className="space-y-2">
      <p className="text-[14px] font-semibold text-[#111111]">수량 구간별 혜택가</p>
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-0.5">
        {TIER_OPTIONS.map((tier) => {
          const isActive = quantity >= tier.minQty;

          return (
            <button
              className={`h-9 shrink-0 cursor-pointer rounded-[14px] border px-3 text-[12px] font-semibold transition-colors active:scale-[0.99] ${
                isActive ?
                  "border-[#2E5E4E] bg-[#F5F7F6] text-[#2E5E4E]"
                : "border-[#E8ECEA] bg-white text-[#666666]"
              }`}
              key={tier.minQty}
              onClick={() => onSelectQuantity(Math.min(max, tier.minQty))}
              type="button"
            >
              {tier.minQty}개 이상 {tier.discountLabel}
            </button>
          );
        })}
      </div>
    </div>
  );
}
