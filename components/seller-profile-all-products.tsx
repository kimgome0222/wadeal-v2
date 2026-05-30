"use client";

import { useMemo, useState } from "react";

import { DealProductGrid } from "@/components/deal-product-grid";
import { EmptyState } from "@/components/empty-state";
import type { Deal, SortTab } from "@/lib/deals";
import { sortDeals } from "@/lib/deals";
import { ui } from "@/lib/ui";

const sortTabs: { id: SortTab; label: string }[] = [
  { id: "popular", label: "인기순" },
  { id: "closing", label: "최신순" },
  { id: "discount", label: "할인율순" },
];

const INITIAL_VISIBLE = 24;

type SellerProfileAllProductsProps = {
  deals: Deal[];
};

export function SellerProfileAllProducts({ deals }: SellerProfileAllProductsProps) {
  const [sort, setSort] = useState<SortTab>("popular");
  const [expanded, setExpanded] = useState(false);
  const sorted = useMemo(() => sortDeals(deals, sort), [deals, sort]);
  const visibleDeals = expanded ? sorted : sorted.slice(0, INITIAL_VISIBLE);
  const hasMore = sorted.length > INITIAL_VISIBLE;

  return (
    <section className="scroll-mt-28 space-y-4 px-6 pt-10" id="seller-products">
      <div className="flex items-end justify-between gap-3">
        <h2 className="text-[20px] font-bold text-[#111111]">전체 상품</h2>
        <span className="text-[13px] text-[#666666]">
          {deals.length.toLocaleString("ko-KR")}개
        </span>
      </div>

      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-0.5">
        {sortTabs.map((tab) => (
          <button
            className={`h-9 shrink-0 cursor-pointer rounded-[14px] px-3.5 text-[13px] font-semibold transition-colors ${
              sort === tab.id ?
                "bg-[#2E5E4E] text-white"
              : "border border-[#E8ECEA] bg-white text-[#666666]"
            }`}
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
      : <>
          <DealProductGrid deals={visibleDeals} />

          {hasMore && !expanded ?
            <button
              className={`${ui.btnOutline} min-h-[48px] w-full cursor-pointer rounded-2xl text-[14px] font-medium`}
              onClick={() => setExpanded(true)}
              type="button"
            >
              상품 더보기 ({sorted.length - INITIAL_VISIBLE}개)
            </button>
          : null}
        </>
      }
    </section>
  );
}
