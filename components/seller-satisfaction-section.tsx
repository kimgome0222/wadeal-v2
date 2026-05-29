import type { SellerSatisfactionMetrics } from "@/lib/sellers/satisfaction";
import { ds } from "@/lib/design-system";
import { SELLER_UI_COPY } from "@/lib/sellers/trust-copy";

type SellerSatisfactionSectionProps = {
  sellerName: string;
  sellerRating: string;
  satisfaction: SellerSatisfactionMetrics;
};

export function SellerSatisfactionSection({
  sellerName,
  sellerRating,
  satisfaction,
}: SellerSatisfactionSectionProps) {
  return (
    <section
      className="scroll-mt-28 space-y-3 rounded-xl border border-[#DDE8E2] bg-white p-4"
      id="seller-satisfaction"
    >
      <div>
        <h2 className={`${ds.type.h2} font-semibold`}>{SELLER_UI_COPY.satisfactionTitle}</h2>
        <p className={`mt-1 ${ds.type.caption}`}>{sellerName} 판매자 만족도</p>
      </div>

      <dl className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        <div className={ds.seller.metricCell}>
          <dt className={ds.type.statLabel}>{SELLER_UI_COPY.rating}</dt>
          <dd className={`mt-0.5 ${ds.type.caption} font-medium text-wadeal-ink`}>
            ★ {sellerRating}
          </dd>
        </div>
        <div className={ds.seller.metricCell}>
          <dt className={ds.type.statLabel}>응답 만족도</dt>
          <dd className={`mt-0.5 ${ds.type.caption} font-medium text-wadeal-ink`}>
            {satisfaction.responseSatisfaction}%
          </dd>
        </div>
        <div className={ds.seller.metricCell}>
          <dt className={ds.type.statLabel}>배송 만족도</dt>
          <dd className={`mt-0.5 ${ds.type.caption} font-medium text-wadeal-ink`}>
            {satisfaction.shippingSatisfaction}%
          </dd>
        </div>
        <div className={ds.seller.metricCell}>
          <dt className={ds.type.statLabel}>설명 일치도</dt>
          <dd className={`mt-0.5 ${ds.type.caption} font-medium text-wadeal-ink`}>
            {satisfaction.descriptionAccuracy}%
          </dd>
        </div>
      </dl>
    </section>
  );
}
