"use client";

import { useMemo, useState } from "react";

import { DealCard } from "@/components/deal-card";
import { EmptyState } from "@/components/empty-state";
import type { Deal, SortTab } from "@/lib/deals";
import { sortDeals } from "@/lib/deals";
import { ds } from "@/lib/design-system";

const sortTabs: { id: SortTab; label: string }[] = [
  { id: "popular", label: "인기순" },
  { id: "closing", label: "최신순" },
  { id: "discount", label: "할인율순" },
];

type CategoryProductListProps = {
  deals: Deal[];
};

export function CategoryProductList({ deals }: CategoryProductListProps) {
  const [sort, setSort] = useState<SortTab>("popular");
  const sorted = useMemo(() => sortDeals(deals, sort), [deals, sort]);

  return (
    <div className="space-y-3">
      <div className="flex gap-1.5">
        {sortTabs.map((tab) => (
          <button
            className={`${ds.chip.base} ${sort === tab.id ? ds.chip.active : ds.chip.idle}`}
            key={tab.id}
            onClick={() => setSort(tab.id)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2.5">
        {sorted.map((deal) => (
          <DealCard deal={deal} key={deal.slug} />
        ))}
      </div>
      {sorted.length === 0 ?
        <p className={`py-12 text-center ${ds.type.bodySm}`}>상품이 없어요.</p>
      : null}
    </div>
  );
}
