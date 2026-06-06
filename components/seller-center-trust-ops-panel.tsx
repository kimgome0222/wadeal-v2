import { ui } from "@/lib/ui";

const TRUST_METRICS = [
  { label: "내 판매자 평점", value: "4.8", todo: "seller_stats.avg_rating" },
  { label: "리뷰 수", value: "128", todo: "seller_stats.review_count" },
  { label: "문의 응답률", value: "96%", todo: "seller_stats.response_rate_30d" },
  { label: "재구매율", value: "42%", todo: "seller_stats.repurchase_rate" },
  { label: "인증 상태", value: "인증 완료", todo: "sellers.status" },
  { label: "고객 만족도", value: "4.7", todo: "seller_reviews 집계" },
] as const;

/**
 * 판매자센터 — 신뢰 지표 확인/관리 안내 (placeholder).
 * TODO(DB): getSellerTrustStats(sellerId) 연동.
 */
export function SellerCenterTrustOpsPanel() {
  return (
    <section className={`${ui.panel} space-y-4 border-wadeal-red/15 bg-wadeal-surface/40`}>
      <div>
        <p className="text-sm font-black text-wadeal-ink">판매자 신뢰 지표</p>
        <p className="mt-1 text-xs font-medium leading-relaxed text-wadeal-muted">
          좋은 판매자 정보는 고객의 구매 결정에 중요한 기준이 됩니다.
        </p>
        <p className="mt-2 text-[10px] font-semibold text-wadeal-coral">
          예시 데이터 · 실제 집계 연동 준비 중
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {TRUST_METRICS.map((item) => (
          <div className="rounded-xl border border-wadeal-line bg-white px-3 py-2.5" key={item.label}>
            <dt className="text-[10px] font-bold text-wadeal-muted">{item.label}</dt>
            <dd className="mt-1 text-sm font-black text-wadeal-ink">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
