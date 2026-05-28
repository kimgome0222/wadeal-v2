"use client";

import { useMemo, useState } from "react";
import { DealCard } from "@/components/deal-card";
import type { Deal, SortTab } from "@/lib/deals";
import { sortDeals } from "@/lib/deals";

const sortTabs: { id: SortTab; label: string }[] = [
  { id: "popular", label: "인기순" },
  { id: "closing", label: "마감임박" },
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
            className={`h-8 cursor-pointer rounded-full px-3.5 text-[13px] font-extrabold ${
              sort === tab.id ?
                "bg-wadeal-red text-white"
              : "bg-white text-wadeal-ink shadow-card"
            }`}
            key={tab.id}
            onClick={() => setSort(tab.id)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {sorted.map((deal) => (
          <DealCard deal={deal} key={deal.slug} />
        ))}
      </div>
      {sorted.length === 0 ?
        <p className="py-12 text-center text-sm font-bold text-wadeal-muted">
          상품이 없어요.
        </p>
      : null}
    </div>
  );
}
