/** 장바구니 보유 쿠폰 mock — DB 저장 없음, local state only */
export type MockOwnedCoupon = {
  id: string;
  label: string;
  discount: number;
  minSubtotal: number;
  badge?: string;
};

export const MOCK_OWNED_COUPONS: readonly MockOwnedCoupon[] = [
  { id: "coupon-20k", label: "2,000원 할인", discount: 2_000, minSubtotal: 20_000 },
  { id: "coupon-40k", label: "4,000원 할인", discount: 4_000, minSubtotal: 40_000 },
  { id: "coupon-70k", label: "8,000원 할인", discount: 8_000, minSubtotal: 70_000 },
  { id: "coupon-100k", label: "12,000원 할인", discount: 12_000, minSubtotal: 100_000 },
  {
    id: "coupon-first",
    label: "첫구매 쿠폰",
    discount: 3_000,
    minSubtotal: 30_000,
    badge: "첫구매",
  },
  {
    id: "coupon-celloh",
    label: "셀로쿠폰",
    discount: 5_000,
    minSubtotal: 50_000,
    badge: "셀로쿠폰",
  },
] as const;

export type MockCouponSelection = "auto" | "none" | string;

export function getApplicableOwnedCoupons(subtotal: number): MockOwnedCoupon[] {
  const safe = Math.max(0, subtotal);
  return MOCK_OWNED_COUPONS.filter((coupon) => safe >= coupon.minSubtotal);
}

export function getRecommendedOwnedCouponId(subtotal: number): string | null {
  const applicable = getApplicableOwnedCoupons(subtotal);
  if (applicable.length === 0) {
    return null;
  }

  return applicable.reduce((best, coupon) =>
    coupon.discount > best.discount ? coupon : best,
  ).id;
}

export function getOwnedCouponDiscount(
  couponId: string | null,
  subtotal: number,
): number {
  if (!couponId) {
    return 0;
  }

  const coupon = MOCK_OWNED_COUPONS.find((item) => item.id === couponId);
  if (!coupon || subtotal < coupon.minSubtotal) {
    return 0;
  }

  return coupon.discount;
}

export function resolveOwnedCouponDiscount(
  subtotal: number,
  selection: MockCouponSelection,
): { discount: number; effectiveCouponId: string | null; recommendedId: string | null } {
  const recommendedId = getRecommendedOwnedCouponId(subtotal);
  const effectiveCouponId =
    selection === "none" ? null
    : selection === "auto" ? recommendedId
    : selection;

  return {
    discount: getOwnedCouponDiscount(effectiveCouponId, subtotal),
    effectiveCouponId,
    recommendedId,
  };
}
