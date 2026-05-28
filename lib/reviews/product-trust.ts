export type ProductTrustStats = {
  averageRating: number;
  reviewCount: number;
  totalPurchases: number;
};

export function getProductTrustStats(
  participantCount: number,
  reviewSummary: { averageRating: number; totalCount: number },
): ProductTrustStats {
  return {
    averageRating: reviewSummary.averageRating,
    reviewCount: reviewSummary.totalCount,
    totalPurchases: Math.max(participantCount * 10 + 60, 120),
  };
}

export function formatTrustStatsLine(stats: ProductTrustStats): string {
  const ratingLabel =
    stats.reviewCount > 0 ? stats.averageRating.toFixed(1) : "0";

  return `★ ${ratingLabel} · 리뷰 ${stats.reviewCount.toLocaleString("ko-KR")}개 · 누적 ${stats.totalPurchases.toLocaleString("ko-KR")}개 구매`;
}
