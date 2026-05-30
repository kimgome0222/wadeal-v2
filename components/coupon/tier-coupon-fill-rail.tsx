"use client";

import { useMemo } from "react";

import { GrowthProductRailSection } from "@/components/growth/growth-product-rail-section";
import { getCommerceGoalState } from "@/lib/coupon/commerce-goals";
import { getTierCouponState } from "@/lib/coupon/tier-coupon";
import type { Deal } from "@/lib/deals";
import { getTierProgress } from "@/lib/pricing/tiers";
import { currency } from "@/lib/deals";

type TierCouponFillRailProps = {
  catalog: Deal[];
  subtotal: number;
  excludeSlugs?: string[];
  className?: string;
};

function getCouponTierFillDeals(
  catalog: Deal[],
  remaining: number,
  excludeSlugs: string[],
  limit = 10,
): Deal[] {
  if (remaining <= 0) {
    return [];
  }

  const minPrice = Math.max(1_000, Math.floor(remaining * 0.7));
  const maxPrice = Math.ceil(remaining * 1.4);

  const pool = catalog.filter((deal) => {
    if (excludeSlugs.includes(deal.slug)) {
      return false;
    }
    const price = getTierProgress(deal).applicablePrice;
    return price >= minPrice && price <= maxPrice;
  });

  const sorted = [...pool].sort((a, b) => {
    const priceA = getTierProgress(a).applicablePrice;
    const priceB = getTierProgress(b).applicablePrice;
    const diffA = Math.abs(priceA - remaining);
    const diffB = Math.abs(priceB - remaining);
    return diffA - diffB || b.participants - a.participants;
  });

  if (sorted.length >= limit) {
    return sorted.slice(0, limit);
  }

  const fallback = catalog
    .filter((deal) => !excludeSlugs.includes(deal.slug))
    .filter((deal) => getTierProgress(deal).applicablePrice <= 10_000)
    .sort((a, b) => getTierProgress(a).applicablePrice - getTierProgress(b).applicablePrice);

  const seen = new Set<string>();
  const merged: Deal[] = [];
  for (const deal of [...sorted, ...fallback]) {
    if (seen.has(deal.slug) || merged.length >= limit) {
      continue;
    }
    seen.add(deal.slug);
    merged.push(deal);
  }

  return merged;
}

/** 쿠폰 티어까지 부족한 금액 맞추기 추천 rail */
export function TierCouponFillRail({
  catalog,
  subtotal,
  excludeSlugs = [],
  className = "",
}: TierCouponFillRailProps) {
  const state = getTierCouponState(subtotal);
  const goals = getCommerceGoalState(subtotal);

  const deals = useMemo(
    () =>
      state.remainingToNext > 0 ?
        getCouponTierFillDeals(catalog, state.remainingToNext, excludeSlugs, 10)
      : [],
    [catalog, excludeSlugs, state.remainingToNext],
  );

  if (deals.length === 0 || state.remainingToNext <= 0) {
    return null;
  }

  const subtitle =
    state.remainingToNext > 0 ?
      `조금만 더 담으면 ${currency.format(state.next?.discount ?? 0)} 쿠폰 적용 · ${currency.format(state.remainingToNext)}원 남음`
    : goals.remainingToFreeShipping > 0 ?
      `무료배송까지 ${currency.format(goals.remainingToFreeShipping)}원 남았어요`
    : "";

  return (
    <GrowthProductRailSection
      ariaLabel="쿠폰 금액 맞추기 추천"
      className={className}
      deals={deals}
      maxItems={10}
      subtitle={subtitle}
      title="쿠폰·무료배송 맞추기 추천"
    />
  );
}

export { getCouponTierFillDeals };
