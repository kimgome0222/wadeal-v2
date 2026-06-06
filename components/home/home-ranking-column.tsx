"use client";

import Link from "next/link";

import { CartQuantityControl } from "@/components/cart/cart-quantity-control";
import { DealCardPriceBlock } from "@/components/deal-card-price-block";
import type { Deal } from "@/lib/deals";
import { getProductDetailHref } from "@/lib/deals/card-display";
import { getProductCardReviewMeta, getProductCardSoldLabel } from "@/lib/product/card-badge-meta";

type HomeRankingColumnProps = {
  deals: Deal[];
  startRank: number;
};

/** B마트식 랭킹 column — 세로 3개 compact row, 한 화면에 1~3위 노출 */
export function HomeRankingColumn({ deals, startRank }: HomeRankingColumnProps) {
  return (
    <>
      {deals.map((deal, index) => {
        const rank = startRank + index;
        const review = getProductCardReviewMeta(deal);
        const soldLabel = getProductCardSoldLabel(deal);
        const href = getProductDetailHref(deal);

        return (
          <article
            className="relative flex min-h-[96px] max-h-[118px] items-center gap-2.5 rounded-[16px] border border-[#E8ECEA] bg-white px-2.5 py-2"
            key={deal.slug}
          >
            <span className="w-5 shrink-0 text-center text-[15px] font-bold tabular-nums text-[#2E5E4E]">
              {rank}
            </span>

            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#F5F7F6]">
              <Link
                aria-label={`${deal.title} 상세보기`}
                className="block h-full w-full cursor-pointer"
                href={href}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={deal.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  src={deal.imageUrl?.trim() || "/wadeal-wordmark.svg"}
                />
              </Link>
              <CartQuantityControl
                className="!bottom-0.5 !right-0.5"
                deal={deal}
                openSheetOnFirstAdd={false}
                size="compact"
              />
            </div>

            <Link
              className="min-w-0 flex-1 cursor-pointer"
              href={href}
            >
              <p className="line-clamp-2 text-[12px] font-semibold leading-[1.35] text-[#111111]">
                {deal.title}
              </p>
              <p className="mt-0.5 text-[10px] font-normal text-[#666666]">
                ★ {review.score} · 리뷰 {review.countLabel}
              </p>
              <div className="mt-0.5 min-w-0 scale-[0.92] origin-left">
                <DealCardPriceBlock deal={deal} priceVariant="rail" variant="card" />
              </div>
              <p className="mt-0.5 line-clamp-1 text-[10px] text-[#666666]">{soldLabel}</p>
            </Link>
          </article>
        );
      })}
    </>
  );
}
