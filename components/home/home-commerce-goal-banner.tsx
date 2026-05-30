"use client";

import { CommerceGoalBanner } from "@/components/coupon/commerce-goal-banner";
import { useCartTotalPrice } from "@/hooks/use-cart";

/** 홈 상단 — 쿠폰·무료배송 목표 (cart subtotal 연동) */
export function HomeCommerceGoalBanner() {
  const subtotal = useCartTotalPrice();

  return (
    <div className="px-6 pt-6">
      <CommerceGoalBanner showWhenEmpty subtotal={subtotal} />
    </div>
  );
}
