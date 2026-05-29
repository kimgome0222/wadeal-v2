import { ProductSummaryBuyBar } from "@/components/product-summary-buy-bar";
import type { ReviewSummary } from "@/lib/data/reviews";
import type { Deal } from "@/lib/deals";
import {
  currency,
  getDealBadgeLabel,
  isDealClosed,
  isDealSoldOut,
} from "@/lib/deals";
import { getDealPurchaseCountLabel, getDealReviewScoreLabel } from "@/lib/deals/card-display";
import { getTierProgress } from "@/lib/pricing/tiers";
import { ds } from "@/lib/design-system";
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
  return true;
}

function buildProductTrustMeta(deal: Deal, reviewSummary: ReviewSummary) {
  const fallback = getDealReviewScoreLabel(deal);
  const rating =
    reviewSummary.totalCount > 0 ?
      reviewSummary.averageRating.toFixed(1)
    : fallback.score;
  const reviewCount =
    reviewSummary.totalCount > 0 ? reviewSummary.totalCount : fallback.count;

  return {
    rating,
    reviewCount,
    purchaseLabel: getDealPurchaseCountLabel(deal),
  };
}

export function ProductSummaryPanel({
  deal,
  reviewSummary,
  initialSaved,
}: ProductSummaryPanelProps) {
  const badgeLabel = getDealBadgeLabel(deal);
  const showBadge = shouldShowSummaryBadge(badgeLabel);
  const closed = isDealClosed(deal);
  const soldOut = isDealSoldOut(deal);
  const { applicablePrice } = getTierProgress(deal);
  const discount = Math.round(
    ((deal.originalPrice - applicablePrice) / deal.originalPrice) * 100,
  );
  const trustMeta = buildProductTrustMeta(deal, reviewSummary);

  return (
    <section className="relative z-10 bg-white px-5 pb-3 pt-3">
      {(showBadge || closed || soldOut) ?
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          {showBadge ?
            <span className={badgeTone(badgeLabel)}>{badgeLabel}</span>
          : null}
          {closed ?
            <span className={`${ds.badge.base} bg-gray-100 text-wadeal-muted`}>판매 종료</span>
          : null}
          {soldOut && !closed ?
            <span className={`${ds.badge.base} bg-gray-800 text-white`}>품절</span>
          : null}
        </div>
      : null}

      <h1 className={ds.type.h1}>{deal.title}</h1>

      <p className={`mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 ${ds.type.caption}`}>
        <span className="whitespace-nowrap">
          <span className="text-wadeal-coral">★</span>{" "}
          <span className="font-medium text-wadeal-ink">{trustMeta.rating}</span>
        </span>
        <span aria-hidden className="text-wadeal-line">
          ·
        </span>
        <span className="whitespace-nowrap">
          리뷰 {trustMeta.reviewCount.toLocaleString("ko-KR")}
        </span>
        <span aria-hidden className="text-wadeal-line">
          ·
        </span>
        <span className="whitespace-nowrap">{trustMeta.purchaseLabel}</span>
      </p>

      <div className="mt-2 flex flex-wrap items-baseline gap-x-1.5 gap-y-0">
        {deal.originalPrice > applicablePrice ?
          <span className={`${ds.type.meta} line-through`}>
            {currency.format(deal.originalPrice)}원
          </span>
        : null}
        <span className={ds.type.priceSm}>{currency.format(applicablePrice)}원</span>
        {discount > 0 ?
          <span className={`${ds.type.meta} text-wadeal-coral`}>{discount}%</span>
        : null}
      </div>

      <div className="mt-3">
        <ProductSummaryBuyBar deal={deal} initialSaved={initialSaved} />
      </div>
    </section>
  );
}
