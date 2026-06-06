"use client";

import Link from "next/link";

import { AddToJoinCartButton } from "@/components/add-to-join-cart-button";
import { SaveDealButton } from "@/components/save-deal-button";
import type { Deal } from "@/lib/deals";
import { isDealSoldOut } from "@/lib/deals";
import type { ShareMessageContent } from "@/lib/share/types";

type ProductDetailCTAProps = {
  deal: Deal;
  shareContent: ShareMessageContent;
  referralCode: string | null;
  initialSaved?: boolean;
};

export function ProductDetailCTA({
  deal,
  initialSaved,
}: ProductDetailCTAProps) {
  const soldOut = isDealSoldOut(deal);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 mx-auto flex h-[72px] max-w-[430px] items-center gap-2 border-t border-[#E8ECEA] bg-white px-6 pb-[max(env(safe-area-inset-bottom),8px)] pt-2 shadow-[0_-2px_12px_rgba(17,17,17,0.04)]">
      <SaveDealButton
        className="!h-12 !w-12 shrink-0 !rounded-[14px]"
        deal={deal}
        initialSaved={initialSaved}
        size="md"
      />

      {soldOut ?
        <span className="flex h-14 flex-1 cursor-not-allowed items-center justify-center rounded-[14px] bg-gray-100 text-[14px] font-semibold text-gray-500">
          품절
        </span>
      : <>
          <AddToJoinCartButton
            className="!h-14 !w-[120px] !min-w-[120px] shrink-0 !rounded-[14px] !border-[#E8ECEA] !bg-white !px-2 !text-[14px] !font-semibold !text-[#111111]"
            deal={deal}
          />
          <Link
            className="flex h-14 min-w-0 flex-1 items-center justify-center rounded-[14px] bg-[#2E5E4E] text-[15px] font-semibold text-white active:scale-[0.99]"
            href={`/checkout/${deal.slug}`}
          >
            구매하기
          </Link>
        </>}
    </div>
  );
}
