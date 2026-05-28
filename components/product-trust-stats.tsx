import {
  formatTrustStatsLine,
  getProductTrustStats,
} from "@/lib/reviews/product-trust";
import type { ReviewSummary } from "@/lib/data/reviews";

type ProductTrustStatsProps = {
  participantCount: number;
  reviewSummary: ReviewSummary;
};

export function ProductTrustStats({
  participantCount,
  reviewSummary,
}: ProductTrustStatsProps) {
  const stats = getProductTrustStats(participantCount, reviewSummary);

  return (
    <p className="text-xs font-bold text-wadeal-muted">{formatTrustStatsLine(stats)}</p>
  );
}
