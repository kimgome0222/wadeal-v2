"use client";

import { useEffect, useMemo, useState } from "react";

import { GrowthProductRailSection } from "@/components/growth/growth-product-rail-section";
import { HomeCommerceRailItem, HomeCommerceRailTrack } from "@/components/home/home-commerce-rail-track";
import { HomeRecommendedDealCard } from "@/components/home-recommended-deal-card";
import type { Deal } from "@/lib/deals";
import {
  FREE_SHIPPING_THRESHOLD,
  getFreeShippingFillDeals,
  getFreeShippingRemaining,
  getSimilarToRecentDeals,
} from "@/lib/growth/cart-growth-mock";
import {
  GUEST_CART_CHANGED_EVENT,
  readGuestJoinCartItems,
} from "@/lib/join-cart/guest-cart-storage";
import { LOCAL_DATA_EVENTS, getRecentDeals } from "@/lib/storage/local-user-data";

type HomeGrowthClientSectionsProps = {
  catalog: Deal[];
  similarFallbackDeals: Deal[];
  freeShippingFillDeals: Deal[];
};

/** 홈 client-only growth — 최근본 유사 + 무료배송 채우기 */
export function HomeGrowthClientSections({
  catalog,
  similarFallbackDeals,
  freeShippingFillDeals,
}: HomeGrowthClientSectionsProps) {
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);
  const [cartSubtotal, setCartSubtotal] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    function sync() {
      setRecentSlugs(getRecentDeals().map((item) => item.slug));
      const items = readGuestJoinCartItems();
      setCartSubtotal(items.reduce((sum, item) => sum + item.estimatedLineTotal, 0));
      setReady(true);
    }

    sync();
    window.addEventListener(LOCAL_DATA_EVENTS.recent, sync);
    window.addEventListener(GUEST_CART_CHANGED_EVENT, sync);
    return () => {
      window.removeEventListener(LOCAL_DATA_EVENTS.recent, sync);
      window.removeEventListener(GUEST_CART_CHANGED_EVENT, sync);
    };
  }, []);

  const similarDeals = useMemo(() => {
    if (!ready) {
      return similarFallbackDeals;
    }
    const fromRecent = getSimilarToRecentDeals(catalog, recentSlugs, 12);
    return fromRecent.length > 0 ? fromRecent : similarFallbackDeals;
  }, [catalog, recentSlugs, similarFallbackDeals, ready]);

  const remaining = getFreeShippingRemaining(cartSubtotal);
  const showFreeShipping =
    ready && cartSubtotal > 0 && remaining > 0 && remaining < FREE_SHIPPING_THRESHOLD;

  const fillDeals =
    freeShippingFillDeals.length > 0 ?
      freeShippingFillDeals
    : getFreeShippingFillDeals(catalog, 10);

  return (
    <>
      <GrowthProductRailSection
        ariaLabel="방금 본 상품과 비슷해요"
        deals={similarDeals}
        maxItems={12}
        subtitle="최근 본 상품을 기준으로 추천해요"
        title="방금 본 상품과 비슷해요"
      />

      {showFreeShipping ?
        <section aria-label="무료배송 채우기" className="overflow-visible pt-10">
          <div className="px-6">
            <h2 className="text-[20px] font-bold text-[#111111]">무료배송까지 조금 남았어요</h2>
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
          <HomeCommerceRailTrack ariaLabel="무료배송 채우기 추천" className="mt-4">
            {fillDeals.slice(0, 10).map((deal) => (
              <HomeCommerceRailItem key={deal.slug}>
                <HomeRecommendedDealCard deal={deal} />
              </HomeCommerceRailItem>
            ))}
          </HomeCommerceRailTrack>
        </section>
      : null}
    </>
  );
}
