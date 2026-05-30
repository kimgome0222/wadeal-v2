"use client";

import { getCommerceGoalState } from "@/lib/coupon/commerce-goals";
import { currency } from "@/lib/deals";

type CommerceGoalBannerProps = {
  subtotal: number;
  className?: string;
  /** 홈 상단 — cart 0일 때도 목표 표시 */
  showWhenEmpty?: boolean;
  compact?: boolean;
};

function GoalProgressBar({ progress }: { progress: number }) {
  return (
    <div aria-hidden className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#F5F7F6]">
      <div
        className="h-full rounded-full bg-[#2E5E4E] transition-all duration-[100ms]"
        style={{ width: `${Math.round(Math.min(1, progress) * 100)}%` }}
      />
    </div>
  );
}

/** B마트식 쿠폰·무료배송·최소주문 목표 배너 */
export function CommerceGoalBanner({
  subtotal,
  className = "",
  showWhenEmpty = false,
  compact = false,
}: CommerceGoalBannerProps) {
  if (subtotal <= 0 && !showWhenEmpty) {
    return null;
  }

  const state = getCommerceGoalState(subtotal);
  const { coupon } = state;

  const primaryMessage =
    coupon.applied ?
      `${currency.format(coupon.applied.discount)} 쿠폰이 자동 적용됐어요`
    : coupon.next ?
      `조금만 더 담으면 ${currency.format(coupon.next.discount)} 쿠폰 적용`
    : `${currency.format(30_000)} 이상 담으면 ${currency.format(3_000)} 쿠폰을 받을 수 있어요`;

  return (
    <div
      className={`rounded-2xl border border-[#E8ECEA] bg-[#FAFBFA] px-4 py-3.5 ${compact ? "py-3" : ""} ${className}`.trim()}
      role="status"
    >
      <p className="text-[14px] font-bold text-[#2E5E4E]">{primaryMessage}</p>

      {coupon.next && coupon.remainingToNext > 0 ?
        <>
          <p className="mt-1 text-[13px] font-medium text-[#666666]">
            {currency.format(coupon.next.discount)} 쿠폰까지{" "}
            {currency.format(coupon.remainingToNext)}원 남았어요
          </p>
          <GoalProgressBar progress={coupon.progressToNext} />
        </>
      : coupon.applied ?
        <p className="mt-1 text-[13px] font-medium text-[#666666]">
          현재 구간에서 가장 큰 쿠폰이 적용됐어요
        </p>
      : null}

      {!state.hasFreeShipping ?
        <>
          <p className="mt-2.5 text-[13px] font-medium text-[#666666]">
            무료배송까지 {currency.format(state.remainingToFreeShipping)}원 남았어요
          </p>
          <GoalProgressBar progress={state.freeShippingProgress} />
        </>
      : <p className="mt-2.5 text-[13px] font-semibold text-[#2E5E4E]">무료배송 적용</p>}

      {!state.hasMinOrder && subtotal > 0 ?
        <p className="mt-2 text-[12px] text-[#999999]">
          최소 주문 {currency.format(state.minOrderAmount)}원까지{" "}
          {currency.format(state.remainingToMinOrder)}원 남음
        </p>
      : null}
    </div>
  );
}
