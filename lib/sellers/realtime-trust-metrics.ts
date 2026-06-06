/**
 * 최근 30일 판매자 신뢰 지표 (실시간 연동 placeholder).
 * TODO(DB): seller_stats_daily 또는 materialized view 연동.
 */
import type { SellerTrustProfile } from "./seller-trust-profile";

export type SellerRealtimeTrustMetrics = {
  /** TODO(DB): seller_stats_daily.response_rate_30d */
  responseRate30d: number;
  /** TODO(DB): seller_stats_daily.shipping_satisfaction_30d (0~5) */
  shippingSatisfaction30d: number;
  /** TODO(DB): seller_stats_daily.avg_rating_30d */
  reviewRating30d: number;
  /** TODO(DB): seller_stats_daily.sales_count_30d */
  salesCount30d: number;
  /** TODO(DB): seller_stats_daily.updated_at */
  updatedAt: string;
  /** mock | partial | live */
  source: "mock" | "partial" | "live";
};

function hashSeed(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/** UI placeholder — 실시간/30일 집계 API 연동 전 mock. */
export function buildSellerRealtimeTrustMetrics(
  profile: Pick<
    SellerTrustProfile,
    | "sellerId"
    | "sellerName"
    | "rating"
    | "responseRate"
    | "shippingSatisfaction"
    | "totalSales"
  >,
): SellerRealtimeTrustMetrics {
  const seed = hashSeed(profile.sellerId);

  return {
    responseRate30d: Math.min(99, profile.responseRate + (seed % 3)),
    shippingSatisfaction30d: Math.min(
      5,
      Number((profile.shippingSatisfaction / 20).toFixed(1)),
    ),
    reviewRating30d: Math.min(5, profile.rating + (seed % 2) * 0.1),
    salesCount30d: Math.max(12, Math.round(profile.totalSales / 30) + (seed % 40)),
    updatedAt: new Date(Date.now() - (seed % 120) * 60_000).toISOString(),
    source: "mock",
  };
}

export function formatRealtimeUpdatedAt(iso: string): string {
  const date = new Date(iso);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `오늘 ${hours}:${minutes} 기준`;
}
