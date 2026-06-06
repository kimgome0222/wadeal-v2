import { SellerTrustBadges } from "@/components/seller-trust-badges";
import type { SellerTrustMetrics } from "@/lib/sellers/trust-display";
import { pickSellerBadgesForCard } from "@/lib/sellers/badge-priority";
import { computeSellerTrustScore } from "@/lib/sellers/trust-score";
import { ui } from "@/lib/ui";

type SellerTrustScoreCardProps = {
  metrics: SellerTrustMetrics;
  className?: string;
};

/**
 * 판매자 신뢰 점수 + 핵심 배지 요약.
 * TODO(DB): seller_stats.trust_score 연동 후 mock 계산 교체.
 */
export function SellerTrustScoreCard({ metrics, className = "" }: SellerTrustScoreCardProps) {
  const trust = computeSellerTrustScore(metrics);
  const highlightBadges = pickSellerBadgesForCard(metrics.seller.badges, 3);

  return (
    <div className={`${ui.card} mt-4 space-y-3 bg-wadeal-surface/50 p-4 ${className}`}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold text-wadeal-muted">신뢰 점수</p>
          <p className="mt-0.5 text-3xl font-black tabular-nums text-wadeal-red">
            {trust.score}
          </p>
        </div>
        <p className="text-right text-[11px] font-bold text-wadeal-muted">
          ★ {metrics.rating}
          <span className="mx-1">·</span>
          리뷰 {metrics.reviewCount.toLocaleString("ko-KR")}
        </p>
      </div>

      <SellerTrustBadges badges={highlightBadges} cardPriority limit={3} />

      <div className="flex flex-wrap gap-1.5 text-[10px] font-bold text-wadeal-muted">
        {trust.verified ?
          <span className="rounded-full border border-wadeal-red/20 bg-wadeal-red/10 px-2.5 py-1 text-wadeal-red">
            인증 판매자
          </span>
        : null}
        <span className="rounded-full border border-wadeal-line bg-white px-2.5 py-1">
          응답률 {trust.responseRate}%
        </span>
        <span className="rounded-full border border-wadeal-line bg-white px-2.5 py-1">
          재구매율 {trust.repurchaseRate}%
        </span>
      </div>
    </div>
  );
}
