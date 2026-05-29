import type { SellerSatisfactionMetrics } from "@/lib/sellers/satisfaction";
import { SELLER_UI_COPY } from "@/lib/sellers/trust-copy";
import { ui } from "@/lib/ui";

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
    <section className={`${ui.card} space-y-4 p-4`} id="seller-satisfaction">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className={ui.sectionTitleAccent}>{SELLER_UI_COPY.satisfactionTitle}</h2>
          <span className="rounded-full bg-wadeal-cream px-2 py-0.5 text-[10px] font-bold text-wadeal-coral">
            예시 데이터
          </span>
        </div>
        <p className="mt-1 text-xs font-medium text-wadeal-muted">
          {sellerName} 판매자에 대한 응답·배송·설명 일치도와 신뢰도입니다.
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-3 text-xs font-bold text-wadeal-muted sm:grid-cols-5">
        <div className="rounded-xl bg-gray-50 px-3 py-2.5">
          <dt>{SELLER_UI_COPY.rating}</dt>
          <dd className="mt-1 font-black text-wadeal-ink">★ {sellerRating}</dd>
        </div>
        <div className="rounded-xl bg-gray-50 px-3 py-2.5">
          <dt>응답 만족도</dt>
          <dd className="mt-1 font-black text-wadeal-ink">
            {satisfaction.responseSatisfaction}%
          </dd>
        </div>
        <div className="rounded-xl bg-gray-50 px-3 py-2.5">
          <dt>배송 만족도</dt>
          <dd className="mt-1 font-black text-wadeal-ink">
            {satisfaction.shippingSatisfaction}%
          </dd>
        </div>
        <div className="rounded-xl bg-gray-50 px-3 py-2.5">
          <dt>상품 설명 일치도</dt>
          <dd className="mt-1 font-black text-wadeal-ink">
            {satisfaction.descriptionAccuracy}%
          </dd>
        </div>
        <div className="rounded-xl bg-gray-50 px-3 py-2.5 sm:col-span-1 col-span-2">
          <dt>판매자 신뢰도</dt>
          <dd className="mt-1 font-black text-wadeal-ink">
            {Math.round(
              (satisfaction.responseSatisfaction +
                satisfaction.shippingSatisfaction +
                satisfaction.descriptionAccuracy) /
                3,
            )}
            /100
          </dd>
        </div>
      </dl>
    </section>
  );
}
