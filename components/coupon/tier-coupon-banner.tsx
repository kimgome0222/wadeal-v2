"use client";

import { CommerceGoalBanner } from "@/components/coupon/commerce-goal-banner";

type TierCouponBannerProps = {
  subtotal: number;
  className?: string;
};

/** @deprecated alias — {@link CommerceGoalBanner} */
export function TierCouponBanner({ subtotal, className = "" }: TierCouponBannerProps) {
  return <CommerceGoalBanner className={className} subtotal={subtotal} />;
}
