import { ProductSummaryBuyBar } from "@/components/product-summary-buy-bar";
import { DealCardPriceBlock } from "@/components/deal-card-price-block";
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
import { resolveSellerTrustMetrics } from "@/lib/sellers/trust-display";
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

function buildLiveTrustSignals(deal: Deal) {
  const metrics = resolveSellerTrustMetrics(deal);
  let seed = 0;
  for (let i = 0; i < deal.slug.length; i += 1) {
    seed = (seed * 31 + deal.slug.charCodeAt(i)) | 0;
  }
  seed = Math.abs(seed);

  const viewersToday = 12 + (seed % 38);
  const sales7d = Math.max(8, Math.round(deal.participants / 12) + (seed % 24));

  return {
    viewersToday,
    sales7d,
    repurchaseRate: metrics.repurchaseRate,
  };
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
  const trustMeta = buildProductTrustMeta(deal, reviewSummary);
  const liveTrust = buildLiveTrustSignals(deal);

  return (
    <section className="relative z-10 bg-white px-4 pb-3 pt-3">
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
          <span className={ds.type.star}>★</span>{" "}
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
          <span className={`${ds.type.caption} text-[#9CA3AF] line-through`}>
            {currency.format(deal.originalPrice)}원
          </span>
        : null}
        <DealCardPriceBlock deal={deal} large showOriginalPrice={false} />
      </div>

      <p className={`mt-2 flex flex-wrap gap-x-2 gap-y-1 ${ds.type.caption}`}>
        <span className="whitespace-nowrap text-wadeal-muted">
          오늘 {liveTrust.viewersToday}명이 보고 있어요
        </span>
        <span aria-hidden className="text-wadeal-line">
          ·
        </span>
        <span className="whitespace-nowrap text-wadeal-muted">
          최근 7일 {liveTrust.sales7d}개 판매
        </span>
        <span aria-hidden className="text-wadeal-line">
          ·
        </span>
        <span className="whitespace-nowrap text-wadeal-muted">
          재구매율 {liveTrust.repurchaseRate}%
        </span>
      </p>

      <div className="mt-3">
        <ProductSummaryBuyBar deal={deal} initialSaved={initialSaved} />
      </div>
    </section>
  );
}
