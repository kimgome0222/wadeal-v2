import type { ReviewSummary } from "@/lib/data/reviews";
import type { Deal } from "@/lib/deals";
import { getDealReviewScoreLabel } from "@/lib/deals/card-display";

import { resolveSellerProfileForDeal } from "./home-sellers";
import type { SellerProfile } from "./types";

/** 판매자명·정보 클릭 영역 공통 스타일 */
export const sellerInteractiveClass =
  "cursor-pointer transition-all duration-[250ms] ease-smooth hover:text-wadeal-red group-hover:text-wadeal-red/90";

export const sellerNameClass = `truncate font-medium text-wadeal-ink ${sellerInteractiveClass}`;

export type SellerTrustMetrics = {
  seller: SellerProfile;
  rating: string;
  reviewCount: number;
  totalSales: number;
  repurchaseRate: number;
  inquiryResponseRate: number;
  isVerified: boolean;
};

export function resolveSellerTrustMetrics(
  deal: Deal,
  reviewSummary?: Pick<ReviewSummary, "totalCount" | "averageRating"> | null,
): SellerTrustMetrics {
  const seller = resolveSellerProfileForDeal(deal);
  const review = getDealReviewScoreLabel(deal);
  const rating =
    reviewSummary && reviewSummary.totalCount > 0 ?
      reviewSummary.averageRating.toFixed(1)
    : review.score;

  return {
    seller,
    rating,
    reviewCount: Math.max(reviewSummary?.totalCount ?? 0, seller.reviewCount, review.count),
    totalSales: seller.totalSales,
    repurchaseRate: seller.repurchaseRate,
    inquiryResponseRate: seller.inquiryResponseRate,
    isVerified: seller.isVerified,
  };
}
