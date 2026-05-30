/** @deprecated lib/coupon/tier-coupon.ts 사용 — spec alias */
export {
  TIER_COUPON_TIERS,
  getTierCouponDiscount,
  getTierCouponState,
  type TierCouponState,
  type TierCouponTier,
} from "@/lib/coupon/tier-coupon";

import { getTierCouponState, type TierCouponTier } from "@/lib/coupon/tier-coupon";

export function getAppliedCoupon(subtotal: number): TierCouponTier | null {
  return getTierCouponState(subtotal).applied;
}

export function getNextCouponTarget(subtotal: number): TierCouponTier | null {
  return getTierCouponState(subtotal).next;
}

export function getRemainingForNextCoupon(subtotal: number): number {
  return getTierCouponState(subtotal).remainingToNext;
}
