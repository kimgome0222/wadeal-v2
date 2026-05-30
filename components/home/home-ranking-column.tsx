"use client";

import Link from "next/link";

import { CartQuantityControl } from "@/components/cart/cart-quantity-control";
import { ProductCardImage } from "@/components/product-card-image";
import { DealCardPriceBlock } from "@/components/deal-card-price-block";
import type { Deal } from "@/lib/deals";
import { getProductDetailHref } from "@/lib/deals/card-display";
import { getProductCardReviewMeta, getProductCardSoldLabel } from "@/lib/product/card-badge-meta";

type HomeRankingColumnProps = {
  deals: Deal[];
  startRank: number;
};

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
            className="relative flex flex-col rounded-[18px] border border-[#E8ECEA] bg-white p-3"
            key={deal.slug}
          >
            <span className="mb-2 text-[16px] font-bold text-[#2E5E4E]">{rank}</span>
            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#F5F7F6]">
              <Link
                aria-label={`${deal.title} 상세보기`}
                className="block h-full cursor-pointer"
                href={href}
              >
                <ProductCardImage
                  deal={deal}
                  imageAspect="square"
                  sizes="160px"
                  variant="grid"
                />
              </Link>
              <CartQuantityControl className="!bottom-2 !right-2" deal={deal} size="compact" />
            </div>
            <Link
              aria-hidden
              className="mt-2 flex min-w-0 flex-1 cursor-pointer flex-col"
              href={href}
              tabIndex={-1}
            >
              <p className="line-clamp-2 text-[13px] font-semibold leading-[1.35] text-[#111111]">
                {deal.title}
              </p>
              <p className="mt-1 text-[11px] font-normal leading-[1.2] text-[#666666]">
                ★ {review.score} · 리뷰 {review.countLabel}
              </p>
              <div className="mt-1.5 min-w-0">
                <DealCardPriceBlock deal={deal} priceVariant="rail" variant="card" />
              </div>
              <p className="mt-1 text-[11px] font-normal leading-[1.2] text-[#666666]">
                {soldLabel}
              </p>
            </Link>
          </article>
        );
      })}
    </>
  );
}
