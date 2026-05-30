"use client";

import { useEffect, useMemo, useState } from "react";

import { MypageProductRailSection } from "@/components/mypage/mypage-product-rail-section";
import type { Deal } from "@/lib/deals";
import {
  readRecentProducts,
  RECENT_PRODUCTS_EVENT,
  resolveRecentProductDeals,
} from "@/lib/personalization/recent-products";

type MypageRecentViewsSectionProps = {
  serverDeals: Deal[];
  catalog: Deal[];
};

/** 마이셀로 — DB recent views + localStorage fallback */
export function MypageRecentViewsSection({
  serverDeals,
  catalog,
}: MypageRecentViewsSectionProps) {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    function sync() {
      setVersion((value) => value + 1);
    }

    window.addEventListener(RECENT_PRODUCTS_EVENT, sync);
    return () => window.removeEventListener(RECENT_PRODUCTS_EVENT, sync);
  }, []);

  const deals = useMemo(() => {
    if (serverDeals.length > 0) {
      return serverDeals;
    }

    void version;
    return resolveRecentProductDeals(catalog, readRecentProducts(), 12);
  }, [catalog, serverDeals, version]);

  return (
    <MypageProductRailSection
      deals={deals}
      emptyMessage="최근 본 상품이 없어요"
      moreHref="/mypage/recent"
      title="최근 본 상품"
    />
  );
}
