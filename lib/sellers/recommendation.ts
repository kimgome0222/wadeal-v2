import type { Deal } from "@/lib/deals";
import { getDealReviewScoreLabel } from "@/lib/deals/card-display";

import { resolveSellerProfileForDeal } from "./home-sellers";
import { resolveSellerTrustMetrics } from "./trust-display";
import { computeSellerTrustScore } from "./trust-score";

/**
 * 추천 판매자 상품 정렬 기준 (운영 알고리즘 자리).
 *
 * TODO(DB/API): seller_stats + 추천 서비스 연동 시 아래 가중치를 설정값으로 분리.
 *
 * 우선순위 (주석):
 * 1. 인증 판매자 우선
 * 2. 평점 높은 판매자 우선
 * 3. 리뷰 많은 판매자 우선
 * 4. 재구매율 높은 판매자 우선
 * 5. 응답률 높은 판매자 우선
 * 6. 최근 등록 상품 반영 (deal.id / created_at)
 */
export const RECOMMENDATION_WEIGHTS = {
  verified: 50,
  rating: 40,
  reviewCount: 3,
  repurchaseRate: 2,
  responseRate: 1.5,
  participants: 2,
  recency: 0.5,
} as const;

export function scoreDealForRecommendation(deal: Deal): number {
  const seller = resolveSellerProfileForDeal(deal);
  const review = getDealReviewScoreLabel(deal);
  const metrics = resolveSellerTrustMetrics(deal);
  const trust = computeSellerTrustScore(metrics);

  return (
    deal.participants * RECOMMENDATION_WEIGHTS.participants +
    Number(review.score) * RECOMMENDATION_WEIGHTS.rating +
    review.count * RECOMMENDATION_WEIGHTS.reviewCount +
    seller.repurchaseRate * RECOMMENDATION_WEIGHTS.repurchaseRate +
    seller.inquiryResponseRate * RECOMMENDATION_WEIGHTS.responseRate +
    seller.rating * RECOMMENDATION_WEIGHTS.rating +
    trust.score * 0.4 +
    (seller.isVerified ? RECOMMENDATION_WEIGHTS.verified : 0) +
    deal.id * RECOMMENDATION_WEIGHTS.recency
  );
}

export function sortDealsByRecommendation(deals: Deal[]): Deal[] {
  return [...deals].sort(
    (a, b) => scoreDealForRecommendation(b) - scoreDealForRecommendation(a),
  );
}

/** TODO(DB): seller_stats.trust_score 기준 정렬로 교체 */
export function sortDealsBySellerTrustScore(deals: Deal[]): Deal[] {
  return [...deals].sort((a, b) => {
    const scoreA = computeSellerTrustScore(resolveSellerTrustMetrics(a)).score;
    const scoreB = computeSellerTrustScore(resolveSellerTrustMetrics(b)).score;
    return scoreB - scoreA;
  });
}
