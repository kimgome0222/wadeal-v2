"use client";

import Link from "next/link";

import { AddToJoinCartButton } from "@/components/add-to-join-cart-button";
import { ProductShareButton } from "@/components/product-share-button";
import { SaveDealButton } from "@/components/save-deal-button";
import type { Deal } from "@/lib/deals";
import { currency, isDealSoldOut } from "@/lib/deals";
import { getTierProgress } from "@/lib/pricing/tiers";
import type { ShareMessageContent } from "@/lib/share/types";
import { ds } from "@/lib/design-system";
import { ui } from "@/lib/ui";

type ProductDetailCTAProps = {
  deal: Deal;
  shareContent: ShareMessageContent;
  referralCode: string | null;
  initialSaved?: boolean;
};

export function ProductDetailCTA({
  deal,
  shareContent,
  referralCode,
  initialSaved,
}: ProductDetailCTAProps) {
  const soldOut = isDealSoldOut(deal);
  const { applicablePrice } = getTierProgress(deal);
  const discount =
    deal.originalPrice > applicablePrice ?
      Math.round(((deal.originalPrice - applicablePrice) / deal.originalPrice) * 100)
    : 0;

  return (
    <div
      className={`${ui.stickyFooter} flex h-[50px] min-h-[48px] max-h-[52px] items-center gap-1.5`}
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-semibold tabular-nums text-wadeal-ink">
          {currency.format(applicablePrice)}원
          {discount > 0 ?
            <span className={`ml-1 ${ds.type.discount}`}>{discount}%</span>
          : null}
        </p>
      </div>

      {soldOut ?
        <span className={`${ds.btn.outline} h-10 min-w-0 flex-1 cursor-not-allowed px-2 text-[12px] opacity-60 sm:min-w-[7rem] sm:flex-none`}>
          품절
        </span>
      : <>
          <AddToJoinCartButton
            className="h-10 min-w-0 flex-1 px-2 text-[12px] sm:flex-none"
            dealSlug={deal.slug}
          />
          <Link
            className={`${ui.btnPrimary} !h-10 min-w-0 flex-1 !rounded-[14px] px-2.5 text-[12px] sm:min-w-[5rem] sm:flex-none`}
            href={`/join/${deal.slug}`}
          >
            구매하기
          </Link>
        </>}

      <div className="flex shrink-0 items-center gap-1">
        <SaveDealButton deal={deal} initialSaved={initialSaved} size="sm" />
        <ProductShareButton
          productSlug={deal.slug}
          referralCode={referralCode}
          shareContent={shareContent}
        />
      </div>
    </div>
  );
}
