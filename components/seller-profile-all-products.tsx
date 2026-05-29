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

type SellerProfileAllProductsProps = {
  deals: Deal[];
};

export function SellerProfileAllProducts({ deals }: SellerProfileAllProductsProps) {
  const [sort, setSort] = useState<SortTab>("popular");
  const sorted = useMemo(() => sortDeals(deals, sort), [deals, sort]);

  return (
    <section
      className="scroll-mt-28 space-y-3 rounded-xl border border-[#DDE8E2] bg-white p-4"
      id="seller-products"
    >
      <div className="flex items-end justify-between gap-3">
        <h2 className={`${ds.type.h2} font-semibold`}>전체 상품</h2>
        <span className={ds.type.caption}>{deals.length.toLocaleString("ko-KR")}개</span>
      </div>

      <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-0.5">
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

      {sorted.length === 0 ?
        <EmptyState
          description="판매자의 첫 상품을 준비 중이에요."
          title="등록된 상품이 아직 없어요."
        />
      : <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2.5">
          {sorted.map((deal) => (
            <DealCard deal={deal} key={deal.slug} />
          ))}
        </div>
      }
    </section>
  );
}
