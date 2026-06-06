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
        <span
          aria-label="품절"
          className="flex h-10 flex-1 cursor-not-allowed items-center justify-center rounded-xl bg-gray-100 text-[12px] font-medium text-wadeal-muted"
          role="status"
        >
          품절
        </span>
      : <>
          <Link
            aria-label={`${deal.title} 구매하기`}
            className={`${ui.btnPrimary} flex min-h-[50px] h-[52px] flex-1 items-center justify-center rounded-[14px] px-4 text-[14px] font-semibold`}
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
