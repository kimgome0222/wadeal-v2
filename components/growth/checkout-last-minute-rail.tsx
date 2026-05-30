"use client";

import { GrowthProductRailSection } from "@/components/growth/growth-product-rail-section";
import type { Deal } from "@/lib/deals";

type CheckoutLastMinuteRailProps = {
  deals: Deal[];
};

/** 결제 직전 마지막 추가 추천 — compact rail */
export function CheckoutLastMinuteRail({ deals }: CheckoutLastMinuteRailProps) {
  if (deals.length === 0) {
    return null;
  }

  return (
    <GrowthProductRailSection
      ariaLabel="마지막으로 같이 담아보세요"
      className="border-t border-[#E8ECEA] pt-8"
      deals={deals}
      maxItems={8}
      subtitle="결제 전에 함께 담기 좋은 상품이에요"
      title="마지막으로 같이 담아보세요"
    />
  );
}
