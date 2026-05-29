"use client";

import Link from "next/link";

import { AddToJoinCartButton } from "@/components/add-to-join-cart-button";
import { ProductShareButton } from "@/components/product-share-button";
import { SaveDealButton } from "@/components/save-deal-button";
import type { Deal } from "@/lib/deals";
import { currency, getDealDiscount, isDealSoldOut } from "@/lib/deals";
import { getSellerSearchHref } from "@/lib/sellers/routes";
import { resolveSellerTrustMetrics } from "@/lib/sellers/trust-display";
import { SELLER_UI_COPY } from "@/lib/sellers/trust-copy";
import type { ShareMessageContent } from "@/lib/share/types";
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
  const discount = getDealDiscount(deal);
  const soldOut = isDealSoldOut(deal);
  const metrics = resolveSellerTrustMetrics(deal);

  return (
    <>
      <div className="border-t border-wadeal-line bg-white px-4 py-2.5">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] font-bold">
          <Link className="text-wadeal-red active:opacity-80" href={getSellerSearchHref(metrics.seller)}>
            {SELLER_UI_COPY.moreProducts}
          </Link>
          <span aria-hidden className="text-wadeal-line">
            ·
          </span>
          <Link className="text-wadeal-muted active:opacity-80" href="#product-qna">
            문의하기
          </Link>
        </div>
      </div>

      <div className={`${ui.stickyFooter} flex items-center gap-2`}>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold text-wadeal-muted">판매가</p>
          <p className="flex items-baseline gap-1.5">
            {discount > 0 ?
              <span className="text-base font-black text-wadeal-coral">{discount}%</span>
            : null}
            <span className="truncate text-lg font-black text-wadeal-ink">
              {currency.format(deal.groupPrice)}원
            </span>
          </p>
        </div>

        {soldOut ?
          <span className="flex h-12 min-w-[9.5rem] shrink-0 cursor-not-allowed items-center justify-center rounded-lg bg-gray-200 px-5 text-[15px] font-bold text-wadeal-muted">
            품절
          </span>
        : <>
            <AddToJoinCartButton dealSlug={deal.slug} />
            <Link
              className={`${ui.btnPrimary} h-12 min-w-[7rem] shrink-0 px-2.5 text-[13px]`}
              href={`/join/${deal.slug}`}
            >
              구매하기
            </Link>
          </>}

        <SaveDealButton
          className="shrink-0"
          deal={deal}
          initialSaved={initialSaved}
          size="sm"
        />

        <ProductShareButton
          productSlug={deal.slug}
          referralCode={referralCode}
          shareContent={shareContent}
        />
      </div>
    </>
  );
}
