"use client";

import Image from "next/image";
import Link from "next/link";

import { CartQuantityControl } from "@/components/cart/cart-quantity-control";
import type { Deal } from "@/lib/deals";
import { getProductDetailHref } from "@/lib/deals/card-display";
import { getProductCardReviewMeta } from "@/lib/product/card-badge-meta";
import { getTierProgress } from "@/lib/pricing/tiers";
import { currency } from "@/lib/deals";

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
        const { applicablePrice } = getTierProgress(deal);
        const href = getProductDetailHref(deal);

        return (
          <article
            className="relative flex h-[88px] gap-2.5 rounded-2xl border border-[#E8ECEA] bg-white p-2"
            key={deal.slug}
          >
            <span className="w-6 shrink-0 text-[20px] font-bold text-[#2E5E4E]">{rank}</span>
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#F5F7F6]">
              <Link
                aria-label={`${deal.title} 상세보기`}
                className="block h-full cursor-pointer"
                href={href}
              >
                {deal.imageUrl ?
                  <Image alt="" className="object-cover" fill sizes="64px" src={deal.imageUrl} />
                : null}
              </Link>
              <CartQuantityControl className="!bottom-1 !right-1" deal={deal} size="compact" />
            </div>
            <Link
              aria-hidden
              className="flex min-w-0 flex-1 cursor-pointer flex-col justify-between py-0.5"
              href={href}
              tabIndex={-1}
            >
              <p className="line-clamp-2 text-[13px] font-semibold leading-snug text-[#111111]">
                {deal.title}
              </p>
              <div className="min-w-0">
                {review ?
                  <p className="text-[12px] text-[#666666]">
                    ★ {review.score} 리뷰 {review.countLabel}
                  </p>
                : null}
                <p className="text-[15px] font-bold text-[#111111]">
                  {currency.format(applicablePrice)}원
                </p>
              </div>
            </Link>
          </article>
        );
      })}
    </>
  );
}
