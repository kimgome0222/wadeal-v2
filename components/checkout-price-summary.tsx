import type { Deal } from "@/lib/deals";
import { currency } from "@/lib/deals";

type CheckoutPriceSummaryProps = {
  deal: Deal;
};

export function CheckoutPriceSummary({ deal }: CheckoutPriceSummaryProps) {
  return (
    <div className="panel space-y-3 p-4">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-extrabold text-wadeal-muted">현재 예상 결제가</span>
        <span className="text-xl font-black text-wadeal-ink">
          {currency.format(deal.groupPrice)}원
        </span>
      </div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-extrabold text-wadeal-muted">
          추가 구매 시 가능한 혜택가
        </span>
        <span className="text-lg font-black text-wadeal-ink">
          {currency.format(deal.lowestPrice)}원
        </span>
      </div>
      <p className="rounded-lg bg-wadeal-surface px-3 py-2.5 text-xs font-bold leading-relaxed text-wadeal-muted">
        판매 종료 시 최종 구매 수량 기준으로 가격이 확정됩니다.
      </p>
    </div>
  );
}
