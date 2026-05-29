import type { SellerTrustMetrics } from "@/lib/sellers/trust-display";
import { SELLER_UI_COPY } from "@/lib/sellers/trust-copy";
import { ds } from "@/lib/design-system";

type SellerProfileTrustCardProps = {
  metrics: SellerTrustMetrics;
};

const metricCellClass = ds.seller.metricCell;

export function SellerProfileTrustCard({ metrics }: SellerProfileTrustCardProps) {
  const { seller } = metrics;

  return (
    <section
      aria-label="판매자 신뢰 지표"
      className="rounded-xl border border-[#DDE8E2] bg-white p-3.5"
    >
      <h2 className={`${ds.type.h3} font-semibold`}>판매자 신뢰 지표</h2>
      <dl className="mt-2.5 grid grid-cols-3 gap-1.5 sm:grid-cols-5">
        <div className={metricCellClass}>
          <dt className={ds.type.statLabel}>{SELLER_UI_COPY.rating}</dt>
          <dd className={`mt-0.5 ${ds.type.caption} font-medium text-wadeal-ink`}>
            ★ {metrics.rating}
          </dd>
        </div>
        <div className={metricCellClass}>
          <dt className={ds.type.statLabel}>리뷰</dt>
          <dd className={`mt-0.5 ${ds.type.caption} font-medium text-wadeal-ink`}>
            {metrics.reviewCount.toLocaleString("ko-KR")}
          </dd>
        </div>
        <div className={metricCellClass}>
          <dt className={ds.type.statLabel}>판매</dt>
          <dd className={`mt-0.5 ${ds.type.caption} font-medium text-wadeal-ink`}>
            {metrics.totalSales.toLocaleString("ko-KR")}
          </dd>
        </div>
        <div className={metricCellClass}>
          <dt className={ds.type.statLabel}>재구매</dt>
          <dd className={`mt-0.5 ${ds.type.caption} font-medium text-wadeal-ink`}>
            {seller.repurchaseRate}%
          </dd>
        </div>
        <div className={metricCellClass}>
          <dt className={ds.type.statLabel}>응답</dt>
          <dd className={`mt-0.5 ${ds.type.caption} font-medium text-wadeal-ink`}>
            {seller.inquiryResponseRate}%
          </dd>
        </div>
      </dl>
    </section>
  );
}
