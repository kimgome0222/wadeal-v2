import Link from "next/link";

import type { ReviewSummary } from "@/lib/data/reviews";
import type { Deal } from "@/lib/deals";
import { currency, getDealBadgeLabel, isDealClosed, isDealSoldOut } from "@/lib/deals";
import { getDealReviewScoreLabel } from "@/lib/deals/card-display";
import { getTierProgress } from "@/lib/pricing/tiers";
import { resolveSellerProfileForDeal } from "@/lib/sellers/home-sellers";
import { getSellerPublicProfileHref, isSellerPublicProfileEnabled } from "@/lib/sellers/routes";
import { badgeTone } from "@/lib/ui";

type ProductSummaryPanelProps = {
  deal: Deal;
  reviewSummary: ReviewSummary;
  initialSaved?: boolean;
};

function shouldShowSummaryBadge(label: string): boolean {
  if (label === "셀러 상품" || label === "판매 중") {
    return false;
  }
  if (label.includes("혜택") || label.includes("공구") || label.includes("공동")) {
    return false;
  }
  return label === "품절" || label === "인기" || label === "신규";
}

function buildProductTrustMeta(deal: Deal, reviewSummary: ReviewSummary) {
  const fallback = getDealReviewScoreLabel(deal);
  const rating =
    reviewSummary.totalCount > 0 ?
      reviewSummary.averageRating.toFixed(1)
    : fallback.score;
  const reviewCount =
    reviewSummary.totalCount > 0 ? reviewSummary.totalCount : fallback.count;

  return { rating, reviewCount };
}

export function ProductSummaryPanel({ deal, reviewSummary }: ProductSummaryPanelProps) {
  const badgeLabel = getDealBadgeLabel(deal);
  const showBadge = shouldShowSummaryBadge(badgeLabel);
  const closed = isDealClosed(deal);
  const soldOut = isDealSoldOut(deal);
  const { applicablePrice } = getTierProgress(deal);
  const trustMeta = buildProductTrustMeta(deal, reviewSummary);
  const seller = resolveSellerProfileForDeal(deal);
  const sellerHref =
    isSellerPublicProfileEnabled() ? getSellerPublicProfileHref(seller) : null;
  const discount =
    deal.originalPrice > applicablePrice ?
      Math.round(((deal.originalPrice - applicablePrice) / deal.originalPrice) * 100)
    : 0;

  return (
    <section className="relative z-10 bg-white px-6 pb-2 pt-6">
      {(showBadge || closed || soldOut) ?
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          {showBadge ?
            <span className={badgeTone(badgeLabel)}>{badgeLabel}</span>
          : null}
          {closed ?
            <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">
              판매 종료
            </span>
          : null}
          {soldOut && !closed ?
            <span className="rounded-md bg-gray-800 px-2 py-0.5 text-[11px] font-medium text-white">
              품절
            </span>
          : null}
        </div>
      : null}

      {sellerHref ?
        <Link
          className="mb-2 block truncate text-[12px] font-medium text-[#666666]"
          href={sellerHref}
        >
          {seller.name}
        </Link>
      : <p className="mb-2 truncate text-[12px] font-medium text-[#666666]">{seller.name}</p>}

      <h1 className="line-clamp-2 text-[24px] font-bold leading-[1.35] text-[#111111]">
        {deal.title}
      </h1>

      <Link
        className="mt-3 inline-flex items-center gap-1 text-[14px] text-[#666666]"
        href="#product-reviews"
      >
        <span>⭐ {trustMeta.rating}</span>
        <span>({trustMeta.reviewCount.toLocaleString("ko-KR")})</span>
      </Link>

      <div className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        {discount > 0 ?
          <span className="text-[16px] font-bold tabular-nums text-[#E28A3B]">
            {discount}%
          </span>
        : null}
        <span className="text-[28px] font-bold tabular-nums text-[#111111]">
          {currency.format(applicablePrice)}원
        </span>
        {deal.originalPrice > applicablePrice ?
          <span className="text-[14px] text-[#999999] line-through">
            {currency.format(deal.originalPrice)}원
          </span>
        : null}
      </div>
    </section>
  );
}
