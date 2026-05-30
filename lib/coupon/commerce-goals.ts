import { getTierCouponState, type TierCouponState } from "@/lib/coupon/tier-coupon";

/** B마트식 mock — 실제 정책 연동 전 UI 전용 */
export const MOCK_MIN_ORDER_AMOUNT = 20_000;
export const MOCK_FREE_SHIPPING_THRESHOLD = 30_000;

export type CommerceGoalState = {
  subtotal: number;
  coupon: TierCouponState;
  minOrderAmount: number;
  remainingToMinOrder: number;
  minOrderProgress: number;
  hasMinOrder: boolean;
  freeShippingThreshold: number;
  remainingToFreeShipping: number;
  freeShippingProgress: number;
  hasFreeShipping: boolean;
};

export function getCommerceGoalState(subtotal: number): CommerceGoalState {
  const safeSubtotal = Math.max(0, subtotal);
  const coupon = getTierCouponState(safeSubtotal);

  const remainingToMinOrder = Math.max(0, MOCK_MIN_ORDER_AMOUNT - safeSubtotal);
  const minOrderProgress = Math.min(1, safeSubtotal / MOCK_MIN_ORDER_AMOUNT);
  const hasMinOrder = safeSubtotal >= MOCK_MIN_ORDER_AMOUNT;

  const remainingToFreeShipping = Math.max(
    0,
    MOCK_FREE_SHIPPING_THRESHOLD - safeSubtotal,
  );
  const freeShippingProgress = Math.min(
    1,
    safeSubtotal / MOCK_FREE_SHIPPING_THRESHOLD,
  );
  const hasFreeShipping = safeSubtotal >= MOCK_FREE_SHIPPING_THRESHOLD;

  return {
    subtotal: safeSubtotal,
    coupon,
    minOrderAmount: MOCK_MIN_ORDER_AMOUNT,
    remainingToMinOrder,
    minOrderProgress,
    hasMinOrder,
    freeShippingThreshold: MOCK_FREE_SHIPPING_THRESHOLD,
    remainingToFreeShipping,
    freeShippingProgress,
    hasFreeShipping,
  };
}
