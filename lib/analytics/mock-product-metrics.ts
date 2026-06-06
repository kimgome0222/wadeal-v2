import {
  formatKpiCount,
  formatKpiPercent,
} from "@/lib/analytics/format-kpi";

/** 상품별 mock 지표 — 실제 analytics/DB 집계 없음 */
export type MockProductMetrics = {
  productKey: string;
  views: number;
  addToCart: number;
  purchases: number;
  reviewCount: number;
  avgRating: number;
  repurchaseRate: number;
  discountRate: number;
  conversionRate: number;
};

function hashSeed(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function seededMetric(seed: number, min: number, max: number): number {
  const span = max - min + 1;
  return min + (seed % span);
}

export function getMockProductMetrics(productKey: string): MockProductMetrics {
  const seed = hashSeed(productKey || "default");
  const views = seededMetric(seed, 120, 4800);
  const addToCart = Math.max(8, Math.round(views * 0.08));
  const purchases = Math.max(2, Math.round(addToCart * 0.35));
  const reviewCount = Math.max(0, Math.round(purchases * 0.4));
  const avgRating = Number((3.8 + (seed % 12) / 10).toFixed(1));
  const repurchaseRate = seededMetric(seed + 3, 8, 42);
  const discountRate = seededMetric(seed + 5, 5, 35);
  const conversionRate = views > 0 ? Number(((purchases / views) * 100).toFixed(1)) : 0;

  return {
    productKey,
    views,
    addToCart,
    purchases,
    reviewCount,
    avgRating,
    repurchaseRate,
    discountRate,
    conversionRate,
  };
}

export function formatMockProductMetricsSummary(metrics: MockProductMetrics): string {
  return `조회 ${formatKpiCount(metrics.views)} · 담기 ${formatKpiCount(metrics.addToCart)} · 구매 ${formatKpiCount(metrics.purchases)} · 전환 ${formatKpiPercent(metrics.conversionRate)} (mock)`;
}
