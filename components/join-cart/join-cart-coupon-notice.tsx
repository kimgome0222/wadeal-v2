"use client";

import Link from "next/link";

import { getCommerceGoalState } from "@/lib/coupon/commerce-goals";
import { currency } from "@/lib/deals";

type JoinCartCouponNoticeProps = {
  subtotal: number;
};

function GoalProgressBar({ progress }: { progress: number }) {
  return (
    <div aria-hidden className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-[#F5ECEA]/80">
      <div
        className="h-full rounded-full bg-[#E28A3B] transition-all duration-[100ms]"
        style={{ width: `${Math.round(Math.min(1, progress) * 100)}%` }}
      />
    </div>
  );
}

/** 장바구니 — 총 결제금액 아래 쿠폰·무료배송 혜택 안내 */
export function JoinCartCouponNotice({ subtotal }: JoinCartCouponNoticeProps) {
  if (subtotal <= 0) {
    return null;
  }

  const state = getCommerceGoalState(subtotal);
  const { coupon } = state;

  const primaryMessage =
    coupon.applied ?
      `${currency.format(coupon.applied.discount)} 쿠폰이 자동 적용됐어요`
    : coupon.next ?
      `조금만 더 담으면 ${currency.format(coupon.next.discount)} 쿠폰을 쓸 수 있어요`
    : `조금만 더 담으면 ${currency.format(3_000)} 쿠폰을 쓸 수 있어요`;

  return (
    <div className="rounded-[16px] bg-[#FFF4E8] px-4 py-3" role="status">
      <p className="text-[13px] font-semibold text-[#E28A3B]">{primaryMessage}</p>

      {coupon.next && coupon.remainingToNext > 0 ?
        <>
          <p className="mt-1 text-[13px] font-medium text-[#E28A3B]/90">
            {currency.format(coupon.next.discount)} 쿠폰까지{" "}
            {currency.format(coupon.remainingToNext)}원 남았어요
          </p>
          <GoalProgressBar progress={coupon.progressToNext} />
        </>
      : null}

      {state.hasFreeShipping ?
        <p className="mt-2.5 text-[13px] font-semibold text-[#E28A3B]">무료배송이 적용됐어요</p>
      : <>
          <p className="mt-2.5 text-[13px] font-medium text-[#E28A3B]/90">
            무료배송까지 {currency.format(state.remainingToFreeShipping)}원 남았어요
          </p>
          <GoalProgressBar progress={state.freeShippingProgress} />
        </>}
      <Link
        className="mt-2.5 inline-block text-[12px] font-semibold text-[#2E5E4E] underline"
        href="/mypage/coupons"
      >
        내 쿠폰함 보기 (mock)
      </Link>
      <Link
        className="mt-1.5 block text-[12px] font-semibold text-[#2E5E4E] underline"
        href="/support/coupons"
      >
        쿠폰·tier 할인 안내 보기
      </Link>
    </div>
  );
}
