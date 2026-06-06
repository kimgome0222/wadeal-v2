"use client";

import { useEffect, useMemo, useState } from "react";

import { GrowthProductRailSection } from "@/components/growth/growth-product-rail-section";
import type { Deal } from "@/lib/deals";
import {
  readRecentProducts,
  RECENT_PRODUCTS_EVENT,
  resolveRecentProductDeals,
} from "@/lib/personalization/recent-products";

type JoinCartRecentViewsRailProps = {
  catalog: Deal[];
  excludeSlugs?: string[];
  maxItems?: number;
};

/** join-cart — localStorage 최근 본 상품 rail */
export function JoinCartRecentViewsRail({
  catalog,
  excludeSlugs = [],
  maxItems = 12,
}: JoinCartRecentViewsRailProps) {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    function sync() {
      setVersion((value) => value + 1);
    }

    window.addEventListener(RECENT_PRODUCTS_EVENT, sync);
    return () => window.removeEventListener(RECENT_PRODUCTS_EVENT, sync);
  }, []);

  const deals = useMemo(() => {
    void version;
    const snapshots = readRecentProducts();
    return resolveRecentProductDeals(catalog, snapshots, maxItems).filter(
      (deal) => !excludeSlugs.includes(deal.slug),
    );
  }, [catalog, excludeSlugs, maxItems, version]);

  if (deals.length === 0) {
    return null;
  }

  return (
    <GrowthProductRailSection
      ariaLabel="최근 본 상품"
      className="pt-0"
      deals={deals}
      maxItems={maxItems}
      subtitle="최근에 본 상품이에요"
      title="최근 본 상품"
    />
  );
}
