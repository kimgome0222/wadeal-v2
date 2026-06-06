"use client";

import { CommerceGoalBanner } from "@/components/coupon/commerce-goal-banner";
import { useCartTotalPrice } from "@/hooks/use-cart";

/** 홈 — cart subtotal > 0일 때만 쿠폰·무료배송 목표 배너 */
export function HomeCommerceGoalBanner() {
  const subtotal = useCartTotalPrice();

  if (subtotal <= 0) {
    return null;
  }

  return (
    <div className="px-6 pt-4">
      <CommerceGoalBanner subtotal={subtotal} />
    </div>
  );
}
