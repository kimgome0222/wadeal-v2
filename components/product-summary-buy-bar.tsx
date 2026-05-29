"use client";

import Link from "next/link";

import { SaveDealButton } from "@/components/save-deal-button";
import type { Deal } from "@/lib/deals";
import { isDealSoldOut } from "@/lib/deals";
import { ui } from "@/lib/ui";

type ProductSummaryBuyBarProps = {
  deal: Deal;
  initialSaved?: boolean;
};

export function ProductSummaryBuyBar({ deal, initialSaved }: ProductSummaryBuyBarProps) {
  const soldOut = isDealSoldOut(deal);

  return (
    <div className="flex gap-2">
      {soldOut ?
        <span className="flex h-10 flex-1 cursor-not-allowed items-center justify-center rounded-xl bg-gray-100 text-[12px] font-medium text-wadeal-muted">
          품절
        </span>
      : <>
          <Link
            className={`${ui.btnPrimary} flex min-h-[44px] flex-1 items-center justify-center px-4 text-[13px] font-medium`}
            href={`/join/${deal.slug}`}
          >
            구매하기
          </Link>
          <SaveDealButton
            deal={deal}
            initialSaved={initialSaved}
            labeled
            size="sm"
            variant="labeled"
          />
        </>}
    </div>
  );
}
