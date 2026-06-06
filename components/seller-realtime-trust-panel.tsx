import type { SellerTrustProfile } from "@/lib/sellers/seller-trust-profile";
import {
  buildSellerRealtimeTrustMetrics,
  formatRealtimeUpdatedAt,
} from "@/lib/sellers/realtime-trust-metrics";
import { ui } from "@/lib/ui";

type SellerRealtimeTrustPanelProps = {
  profile: SellerTrustProfile;
  className?: string;
};

/**
 * 최근 30일 신뢰 지표 UI 자리.
 * TODO(DB): seller_stats_daily 실시간 연동 후 `source: live` 반영.
 */
export function SellerRealtimeTrustPanel({
  profile,
  className = "",
}: SellerRealtimeTrustPanelProps) {
  const metrics = buildSellerRealtimeTrustMetrics(profile);

  return (
    <section className={`${ui.card} space-y-3 p-4 ${className}`} id="seller-realtime-trust">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-wadeal-ink">최근 30일 기준</h3>
        <span className="rounded-full bg-wadeal-cream px-2 py-0.5 text-[10px] font-bold text-wadeal-coral">
          {metrics.source === "mock" ? "예시 데이터" : "실시간"}
        </span>
      </div>
      <p className="text-[10px] font-semibold text-wadeal-muted">
        {formatRealtimeUpdatedAt(metrics.updatedAt)}
      </p>

      <dl className="grid grid-cols-2 gap-2 text-xs font-bold text-wadeal-muted sm:grid-cols-4">
        <div className="rounded-xl bg-gray-50 px-3 py-2.5">
          <dt>응답률</dt>
          <dd className="mt-0.5 font-black text-wadeal-ink">{metrics.responseRate30d}%</dd>
        </div>
        <div className="rounded-xl bg-gray-50 px-3 py-2.5">
          <dt>배송 만족도</dt>
          <dd className="mt-0.5 font-black text-wadeal-ink">
            {metrics.shippingSatisfaction30d.toFixed(1)}
          </dd>
        </div>
        <div className="rounded-xl bg-gray-50 px-3 py-2.5">
          <dt>리뷰 평점</dt>
          <dd className="mt-0.5 font-black text-wadeal-ink">
            {metrics.reviewRating30d.toFixed(1)}
          </dd>
        </div>
        <div className="rounded-xl bg-gray-50 px-3 py-2.5">
          <dt>판매량</dt>
          <dd className="mt-0.5 font-black text-wadeal-ink">
            {metrics.salesCount30d.toLocaleString("ko-KR")}
          </dd>
        </div>
      </dl>
    </section>
  );
}
