"use client";

import Link from "next/link";

import { AddToJoinCartButton } from "@/components/add-to-join-cart-button";
import { ProductShareButton } from "@/components/product-share-button";
import { SaveDealButton } from "@/components/save-deal-button";
import type { Deal } from "@/lib/deals";
import { currency, isDealSoldOut } from "@/lib/deals";
import { getTierProgress } from "@/lib/pricing/tiers";
import { getSellerSearchHref } from "@/lib/sellers/routes";
import { resolveSellerTrustMetrics } from "@/lib/sellers/trust-display";
import { SELLER_UI_COPY } from "@/lib/sellers/trust-copy";
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
  const metrics = resolveSellerTrustMetrics(deal);

  return (
    <>
      <div className="border-t border-wadeal-line/60 bg-white px-5 py-2">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <Link className={`${ds.type.caption} hover:text-wadeal-ink`} href={getSellerSearchHref(metrics.seller)}>
            {SELLER_UI_COPY.moreProducts}
          </Link>
          <span aria-hidden className="text-wadeal-line">
            ·
          </span>
          <Link className={`${ds.type.caption} hover:text-wadeal-ink`} href="#product-qna">
            문의하기
          </Link>
        </div>
      </div>

      <div className={`${ui.stickyFooter} flex min-h-[56px] items-center gap-2`}>
        <div className="min-w-0 flex-1">
          <p className={`truncate ${ds.type.priceSm}`}>
            {currency.format(applicablePrice)}원
            {discount > 0 ?
              <span className={`ml-1.5 ${ds.type.caption}`}>{discount}%</span>
            : null}
          </p>
        </div>

        {soldOut ?
          <span className={`${ds.btn.outline} min-h-[44px] min-w-0 flex-1 cursor-not-allowed opacity-60 sm:min-w-[9.5rem] sm:flex-none`}>
            품절
          </span>
        : <>
            <AddToJoinCartButton className="min-h-[44px] min-w-0 flex-1 sm:flex-none" dealSlug={deal.slug} />
            <Link
              className={`${ui.btnPrimary} min-h-[44px] min-w-0 flex-1 px-3 text-[13px] sm:min-w-[6.5rem] sm:flex-none`}
              href={`/join/${deal.slug}`}
            >
              구매하기
            </Link>
          </>}

        <div className="flex shrink-0 items-center gap-2">
          <SaveDealButton deal={deal} initialSaved={initialSaved} size="sm" />
          <ProductShareButton
            productSlug={deal.slug}
            referralCode={referralCode}
            shareContent={shareContent}
          />
        </div>
      </div>
    </>
  );
}
