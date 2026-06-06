import {
  formatKpiCount,
  formatKpiPercent,
} from "@/lib/analytics/format-kpi";
import { getMockProductMetrics } from "@/lib/analytics/mock-product-metrics";

type ProductMetricsMockRowProps = {
  productKey: string;
  className?: string;
};

/** 상품 mock 지표 한 줄 — admin/seller product lists */
export function ProductMetricsMockRow({ productKey, className = "" }: ProductMetricsMockRowProps) {
  const m = getMockProductMetrics(productKey);

  return (
    <div
      className={`rounded-xl border border-[#E8ECEA] bg-[#FAFBFA] px-3 py-2 ${className}`.trim()}
    >
      <p className="text-[10px] font-bold uppercase tracking-wide text-[#666666]">
        상품 지표 (mock)
      </p>
      <p className="mt-1 text-[11px] font-medium leading-relaxed text-[#666666]">
        조회 {formatKpiCount(m.views)} · 장바구니 {formatKpiCount(m.addToCart)} · 구매{" "}
        {formatKpiCount(m.purchases)} · 리뷰 {formatKpiCount(m.reviewCount)} · ★ {m.avgRating} ·
        재구매 {formatKpiPercent(m.repurchaseRate)} · 전환 {formatKpiPercent(m.conversionRate)}
      </p>
    </div>
  );
}
