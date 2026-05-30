"use client";

import { useMemo } from "react";

import { GrowthProductRailSection } from "@/components/growth/growth-product-rail-section";
import { HomeProductRailItem, HomeProductRailTrack } from "@/components/home-product-rail-track";
import { HomeRecommendedDealCard } from "@/components/home-recommended-deal-card";
import type { Deal } from "@/lib/deals";
import {
  FREE_SHIPPING_THRESHOLD,
  getCartUpsellDeals,
  getCouponApplicableDeals,
  getFreeShippingFillDeals,
  getFreeShippingRemaining,
  getMockCouponBadge,
} from "@/lib/growth/cart-growth-mock";

type CartGrowthRecommendationsProps = {
  catalog: Deal[];
  cartSlugs: string[];
  cartSubtotal: number;
};

/** 장바구니 B마트식 추천 — 같이 사면 좋아요 · 무료배송 · 쿠폰 */
export function CartGrowthRecommendations({
  catalog,
  cartSlugs,
  cartSubtotal,
}: CartGrowthRecommendationsProps) {
  const upsellDeals = useMemo(
    () => getCartUpsellDeals(catalog, cartSlugs, 12),
    [catalog, cartSlugs],
  );
  const couponDeals = useMemo(() => getCouponApplicableDeals(catalog, 10), [catalog]);
  const fillDeals = useMemo(() => getFreeShippingFillDeals(catalog, 10), [catalog]);
  const remaining = getFreeShippingRemaining(cartSubtotal);
  const showFreeShipping =
    cartSubtotal > 0 && remaining > 0 && remaining < FREE_SHIPPING_THRESHOLD;

  if (catalog.length === 0) {
    return null;
  }

  return (
    <div className="space-y-10 border-t border-[#E8ECEA] pt-8">
      <GrowthProductRailSection
        ariaLabel="같이 사면 좋아요"
        className="pt-0"
        deals={upsellDeals}
        maxItems={12}
        subtitle="함께 담으면 좋은 상품이에요"
        title="같이 사면 좋아요"
      />

      {showFreeShipping ?
        <section aria-label="무료배송 채우기" className="overflow-visible">
          <div className="px-6">
            <h2 className="text-[20px] font-bold text-[#111111]">무료배송 채우기</h2>
            <p className="mt-1 text-[13px] text-[#666666]">
              무료배송까지 {remaining.toLocaleString("ko-KR")}원 남았어요
            </p>
            <div
              aria-hidden
              className="mt-3 h-2 overflow-hidden rounded-full bg-[#E8ECEA]"
            >
              <div
                className="h-full rounded-full bg-[#2E5E4E] transition-all duration-[100ms]"
                style={{
                  width: `${Math.min(100, (cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100)}%`,
                }}
              />
            </div>
          </div>
          <HomeProductRailTrack ariaLabel="무료배송 채우기" className="mt-4">
            {fillDeals.slice(0, 10).map((deal) => (
              <HomeProductRailItem key={deal.slug}>
                <HomeRecommendedDealCard deal={deal} />
              </HomeProductRailItem>
            ))}
          </HomeProductRailTrack>
        </section>
      : null}

      <GrowthProductRailSection
        ariaLabel="쿠폰 적용 가능 상품"
        deals={couponDeals}
        maxItems={10}
        resolveBadge={getMockCouponBadge}
        showCouponPrice
        subtitle="쿠폰으로 더 저렴하게 살 수 있어요"
        title="쿠폰 적용 가능 상품"
      />
    </div>
  );
}
