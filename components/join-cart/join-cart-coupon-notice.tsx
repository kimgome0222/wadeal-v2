"use client";

import Link from "next/link";

import { getCommerceGoalState } from "@/lib/coupon/commerce-goals";
import { CELLOH_CART_COPY } from "@/lib/copy/ux-writing";
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
      CELLOH_CART_COPY.couponApplied(currency.format(coupon.applied.discount))
    : coupon.next ?
      CELLOH_CART_COPY.couponNextHint(currency.format(coupon.next.discount))
    : CELLOH_CART_COPY.couponMoreBenefit;

  return (
    <div className="rounded-[16px] bg-[#FFF4E8] px-4 py-3" role="status">
      <p className="text-[13px] font-semibold text-[#E28A3B]">{primaryMessage}</p>

      {coupon.next && coupon.remainingToNext > 0 ?
        <>
          <p className="mt-1 text-[13px] font-medium text-[#E28A3B]/90">
            {CELLOH_CART_COPY.couponRemaining(
              currency.format(coupon.next.discount),
              currency.format(coupon.remainingToNext),
            )}
          </p>
          <GoalProgressBar progress={coupon.progressToNext} />
        </>
      : null}

      {state.hasFreeShipping ?
        <p className="mt-2.5 text-[13px] font-semibold text-[#E28A3B]">
          {CELLOH_CART_COPY.freeShippingApplied}
        </p>
      : <>
          <p className="mt-2.5 text-[13px] font-medium text-[#E28A3B]/90">
            {CELLOH_CART_COPY.freeShippingRemaining(currency.format(state.remainingToFreeShipping))}
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
