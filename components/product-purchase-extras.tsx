"use client";

import { useState } from "react";

import { DealDeadline } from "@/components/deal-deadline";
import { GroupBuyProgress } from "@/components/group-buy-progress";
import { TierPriceSummary } from "@/components/tier-price-summary";
import type { Deal } from "@/lib/deals";
import {
  getDealRemaining,
  isDealGroupBuySucceeded,
  isDealSoldOut,
} from "@/lib/deals";
import {
  formatRemainingStockLabel,
  inventoryFromDeal,
} from "@/lib/products/inventory";

type ProductPurchaseExtrasProps = {
  deal: Deal;
};

export function ProductPurchaseExtras({ deal }: ProductPurchaseExtrasProps) {
  const [open, setOpen] = useState(false);
  const succeeded = isDealGroupBuySucceeded(deal);
  const remaining = getDealRemaining(deal);
  const soldOut = isDealSoldOut(deal);
  const inventory = inventoryFromDeal(deal);
  const remainingStockLabel = formatRemainingStockLabel(inventory);

  return (
    <section className="overflow-hidden rounded-2xl border border-[#DDE8E2] bg-white">
      <button
        className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3.5 text-left"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <span className="text-sm font-bold text-wadeal-ink">판매 현황 · 수량 안내</span>
        <span className="text-xs font-bold text-[#2E5E4E]">{open ? "접기" : "펼치기"}</span>
      </button>

      {open ?
        <div className="space-y-3 border-t border-[#DDE8E2] px-4 pb-4 pt-3">
          <div className="space-y-2 rounded-xl bg-[#F5F8F4]/60 p-3">
            <p className="text-xs font-bold text-wadeal-muted">
              {deal.participants.toLocaleString("ko-KR")}명이 구매했어요
            </p>
            <GroupBuyProgress deal={deal} showEndsIn variant="compact" />
            {!succeeded && remaining > 0 ?
              <p className="text-center text-[11px] font-medium text-wadeal-muted">
                판매 정보를 확인하고 구매해 보세요
              </p>
            : null}
          </div>

          <TierPriceSummary deal={deal} variant="inline" />
          <DealDeadline deal={deal} variant="detail" />

          <dl className="space-y-2 rounded-xl bg-[#F5F8F4]/60 p-3 text-xs font-bold text-wadeal-muted">
            {remainingStockLabel ?
              <div className="flex justify-between gap-3">
                <dt>남은 수량</dt>
                <dd className={`font-black ${soldOut ? "text-wadeal-muted" : "text-wadeal-ink"}`}>
                  {remainingStockLabel}
                </dd>
              </div>
            : null}
            <div className="flex justify-between gap-3">
              <dt>최소 주문</dt>
              <dd className="font-black text-wadeal-ink">{inventory.minOrderQuantity}개</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>최대 주문</dt>
              <dd className="font-black text-wadeal-ink">{inventory.maxOrderQuantity}개</dd>
            </div>
            {inventory.perUserLimit != null ?
              <div className="flex justify-between gap-3">
                <dt>1인 구매 한도</dt>
                <dd className="font-black text-wadeal-ink">{inventory.perUserLimit}개</dd>
              </div>
            : null}
          </dl>
        </div>
      : null}
    </section>
  );
}
