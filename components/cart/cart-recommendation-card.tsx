"use client";

import Image from "next/image";
import Link from "next/link";

import { CartQuantityControl } from "@/components/cart/cart-quantity-control";
import { getProductDetailHref } from "@/lib/deals/card-display";
import type { Deal } from "@/lib/deals";
import { currency } from "@/lib/deals";
import {
  formatCartRecommendationReviewCount,
  type CartRecommendationItem,
} from "@/lib/mock/cart-recommendations";

const PLACEHOLDER = "/wadeal-wordmark.svg";

type CartRecommendationCardProps = {
  item: CartRecommendationItem;
  deal?: Deal;
};

/** Bottom sheet 추천 rail compact 카드 */
export function CartRecommendationCard({ item, deal }: CartRecommendationCardProps) {
  const href = deal ? getProductDetailHref(deal) : `/product/${item.id}`;
  const reviewLabel =
    item.reviewCount && item.rating ?
      `★ ${item.rating} 리뷰 ${formatCartRecommendationReviewCount(item.reviewCount)}`
    : null;

  return (
    <article className="relative flex h-full min-w-0 flex-col">
      <Link
        aria-label={`${item.name} 상품 상세`}
        className="absolute inset-0 z-0"
        href={href}
        tabIndex={-1}
      />
      <div className="relative z-10 flex min-w-0 flex-col">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[18px] bg-[#F5F7F6]">
          <Image
            alt=""
            className="object-cover"
            fill
            sizes="(max-width: 430px) calc((100vw - 72px) / 2.5), 160px"
            src={item.image || PLACEHOLDER}
          />
          {deal ?
            <CartQuantityControl deal={deal} openSheetOnFirstAdd={false} size="rail" />
          : null}
        </div>
        <h4 className="mt-2 line-clamp-2 text-[13px] font-semibold leading-snug text-[#111111]">
          {item.name}
        </h4>
        {reviewLabel ?
          <p className="mt-1 line-clamp-1 text-[11px] text-[#666666]">{reviewLabel}</p>
        : null}
        <div className="mt-2 min-w-0">
          {item.discountRate ?
            <span className="mr-1 text-[13px] font-bold text-[#E28A3B]">
              {item.discountRate}%
            </span>
          : null}
          <span className="text-[15px] font-bold tabular-nums text-[#111111]">
            {currency.format(item.price)}원
          </span>
        </div>
      </div>
    </article>
  );
}
