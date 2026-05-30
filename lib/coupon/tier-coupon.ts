/** B마트식 금액 구간 자동 쿠폰 mock — 서버 쿠폰과 별도 UI 전용 */
export type TierCouponTier = {
  minSubtotal: number;
  discount: number;
};

export const TIER_COUPON_TIERS: readonly TierCouponTier[] = [
  { minSubtotal: 100_000, discount: 12_000 },
  { minSubtotal: 70_000, discount: 8_000 },
  { minSubtotal: 50_000, discount: 5_000 },
  { minSubtotal: 30_000, discount: 3_000 },
] as const;

export type TierCouponState = {
  subtotal: number;
  applied: TierCouponTier | null;
  next: TierCouponTier | null;
  remainingToNext: number;
  progressToNext: number;
};

export function getTierCouponState(subtotal: number): TierCouponState {
  const safeSubtotal = Math.max(0, subtotal);
  const sortedDesc = [...TIER_COUPON_TIERS].sort((a, b) => b.minSubtotal - a.minSubtotal);
  const applied = sortedDesc.find((tier) => safeSubtotal >= tier.minSubtotal) ?? null;
  const next =
    [...TIER_COUPON_TIERS]
      .filter((tier) => safeSubtotal < tier.minSubtotal)
      .sort((a, b) => a.minSubtotal - b.minSubtotal)[0] ?? null;

  const remainingToNext = next ? Math.max(0, next.minSubtotal - safeSubtotal) : 0;
  const progressToNext =
    next ?
      Math.min(1, safeSubtotal / next.minSubtotal)
    : applied ?
      1
    : 0;

  return {
    subtotal: safeSubtotal,
    applied,
    next,
    remainingToNext,
    progressToNext,
  };
}

export function getTierCouponDiscount(subtotal: number): number {
  return getTierCouponState(subtotal).applied?.discount ?? 0;
}

export function formatTierCouponDiscount(amount: number): string {
  return `${amount.toLocaleString("ko-KR")}원`;
}
