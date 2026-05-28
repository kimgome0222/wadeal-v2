"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { EmptyState } from "@/components/empty-state";
import {
  SavedProductCard,
  SavedProductsEmptyState,
  type SavedProductCardItem,
} from "@/components/saved-product-card";
import { getRecentDeals, LOCAL_DATA_EVENTS, type DealSnapshot } from "@/lib/storage/local-user-data";
import { ui } from "@/lib/ui";

type RecentViewsContentProps = {
  serverItems: SavedProductCardItem[];
  initialLoggedIn: boolean;
};

export function RecentViewsContent({
  serverItems,
  initialLoggedIn,
}: RecentViewsContentProps) {
  const [localItems, setLocalItems] = useState<DealSnapshot[]>([]);

  useEffect(() => {
    setLocalItems(getRecentDeals());

    function syncRecent() {
      setLocalItems(getRecentDeals());
    }

    window.addEventListener(LOCAL_DATA_EVENTS.recent, syncRecent);
    return () => {
      window.removeEventListener(LOCAL_DATA_EVENTS.recent, syncRecent);
    };
  }, []);

  const items =
    initialLoggedIn && serverItems.length > 0 ?
      serverItems
    : localItems.map((item) => ({
        id: item.slug,
        slug: item.slug,
        productName: item.productName,
        currentPrice: item.originalPrice,
        groupPrice: item.groupPrice,
        status: item.status,
      }));

  if (!initialLoggedIn && items.length === 0) {
    return (
      <div className="space-y-3">
        <div className="rounded-xl border border-wadeal-line bg-white p-4">
          <p className="text-sm font-black text-wadeal-ink">최근 본 상품</p>
          <p className="mt-1 text-xs font-bold text-wadeal-muted">
            로그인하면 기기 간에 최근 본 상품을 저장할 수 있어요.
          </p>
          <Link className={`${ui.btnOutline} mt-4 cursor-pointer`} href="/login?next=/mypage/recent">
            로그인하기
          </Link>
        </div>
        <SavedProductsEmptyState />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        actionHref="/"
        actionLabel="상품 둘러보기"
        description="상품을 둘러보면 여기에 표시돼요."
        title="최근 본 상품이 없어요."
      />
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <SavedProductCard item={item} key={item.id} />
      ))}
    </div>
  );
}
