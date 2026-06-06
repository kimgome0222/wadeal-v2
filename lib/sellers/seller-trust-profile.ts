/**
 * celloh 판매자 신뢰 프로필 (운영 단계 연동용 canonical type).
 *
 * DB 연동 전: mock/placeholder 값 사용.
 * TODO(DB): sellers, seller_stats, seller_public_profiles 테이블 연동.
 */
import type { ReviewSummary } from "@/lib/data/reviews";
import type { Deal } from "@/lib/deals";

import { buildSellerSatisfaction } from "./satisfaction";
import { resolveSellerProfileForDeal } from "./home-sellers";
import type { SellerBadgeId } from "./types";
import { resolveSellerTrustMetrics } from "./trust-display";
import { computeSellerTrustScore } from "./trust-score";

export type SellerTrustFieldSource = "mock" | "partial" | "db";

export type SellerTrustProfile = {
  sellerId: string;
  /** TODO(DB): sellers.company_name + products.created_by 조인 */
  sellerName: string;
  /** TODO(DB): sellers.logo_url */
  sellerLogoUrl: string | null;
  /** TODO(DB): sellers.tagline | seller_public_profiles.bio */
  sellerBio: string;
  /** TODO(DB): sellers.status=approved + 공개 read */
  isVerified: boolean;
  /** TODO(DB): seller_stats.avg_rating */
  rating: number;
  /** TODO(DB): seller_stats.review_count */
  reviewCount: number;
  /** TODO(DB): SUM(orders) / seller_stats.total_sales */
  totalSales: number;
  /** TODO(DB): seller_stats.repurchase_rate */
  repurchaseRate: number;
  /** TODO(DB): support_tickets 집계 → seller_stats.response_rate */
  responseRate: number;
  /** TODO(DB): seller_reviews 집계 */
  shippingSatisfaction: number;
  /** TODO(DB): seller_reviews 집계 */
  descriptionMatchScore: number;
  /** TODO(DB): seller_stats.trust_score (현재 mock 계산) */
  trustScore: number;
  badges: SellerBadgeId[];
  /** 필드별 데이터 출처 (UI mock 표시용) */
  sources: {
    sellerName: SellerTrustFieldSource;
    sellerLogoUrl: SellerTrustFieldSource;
    sellerBio: SellerTrustFieldSource;
    isVerified: SellerTrustFieldSource;
    rating: SellerTrustFieldSource;
    reviewCount: SellerTrustFieldSource;
    totalSales: SellerTrustFieldSource;
    repurchaseRate: SellerTrustFieldSource;
    responseRate: SellerTrustFieldSource;
    shippingSatisfaction: SellerTrustFieldSource;
    descriptionMatchScore: SellerTrustFieldSource;
    trustScore: SellerTrustFieldSource;
  };
};

export function buildSellerTrustProfile(
  deal: Deal,
  reviewSummary?: Pick<ReviewSummary, "totalCount" | "averageRating"> | null,
): SellerTrustProfile {
  const metrics = resolveSellerTrustMetrics(deal, reviewSummary);
  const seller = resolveSellerProfileForDeal(deal);
  const satisfaction = buildSellerSatisfaction(seller);
  const trust = computeSellerTrustScore(metrics);
  const hasProductReviews = (reviewSummary?.totalCount ?? 0) > 0;

  return {
    sellerId: seller.id,
    sellerName: seller.name,
    sellerLogoUrl: null,
    sellerBio: seller.tagline,
    isVerified: metrics.isVerified,
    rating: Number(metrics.rating),
    reviewCount: metrics.reviewCount,
    totalSales: metrics.totalSales,
    repurchaseRate: seller.repurchaseRate,
    responseRate: seller.inquiryResponseRate,
    shippingSatisfaction: satisfaction.shippingSatisfaction,
    descriptionMatchScore: satisfaction.descriptionAccuracy,
    trustScore: trust.score,
    badges: seller.badges,
    sources: {
      sellerName: "partial",
      sellerLogoUrl: "mock",
      sellerBio: "mock",
      isVerified: "mock",
      rating: hasProductReviews ? "partial" : "mock",
      reviewCount: hasProductReviews ? "partial" : "mock",
      totalSales: "mock",
      repurchaseRate: "mock",
      responseRate: "mock",
      shippingSatisfaction: "mock",
      descriptionMatchScore: "mock",
      trustScore: "mock",
    },
  };
}
