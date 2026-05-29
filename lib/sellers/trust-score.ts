import type { SellerTrustMetrics } from "@/lib/sellers/trust-display";

export type SellerTrustScoreBreakdown = {
  score: number;
  starLabel: string;
  verified: boolean;
  responseRate: number;
  repurchaseRate: number;
};

function hashSeed(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/** UI placeholder — DB seller_stats 연동 전 mock 신뢰 점수.
 *
 * TODO(DB): seller_stats.trust_score 또는 아래 가중치를 서버 설정으로 분리.
 * 추천/정렬 기준: 평점, 리뷰 수, 누적 판매, 재구매율, 응답률, 인증 여부.
 */
export function computeSellerTrustScore(metrics: SellerTrustMetrics): SellerTrustScoreBreakdown {
  const seed = hashSeed(metrics.seller.name);
  const ratingPart = Number(metrics.rating) * 16;
  const reviewPart = Math.min(12, metrics.reviewCount / 40);
  const verifiedPart = metrics.isVerified ? 8 : 0;
  const responsePart = metrics.inquiryResponseRate * 0.08;
  const repurchasePart = metrics.seller.repurchaseRate * 0.06;
  const jitter = (seed % 5) - 2;

  const score = Math.min(
    99,
    Math.max(
      72,
      Math.round(ratingPart + reviewPart + verifiedPart + responsePart + repurchasePart + jitter),
    ),
  );

  const ratingNum = Number(metrics.rating);
  const fullStars = Math.floor(ratingNum);
  const starLabel = "★".repeat(fullStars) + "☆".repeat(Math.max(0, 5 - fullStars));

  return {
    score,
    starLabel,
    verified: metrics.isVerified,
    responseRate: metrics.inquiryResponseRate,
    repurchaseRate: metrics.seller.repurchaseRate,
  };
}
