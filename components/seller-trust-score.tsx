import type { SellerTrustMetrics } from "@/lib/sellers/trust-display";
import { SellerTrustScoreCard } from "@/components/seller-trust-score-card";

type SellerTrustScoreProps = {
  metrics: SellerTrustMetrics;
};

/** @deprecated Prefer SellerTrustScoreCard — thin wrapper for existing imports */
export function SellerTrustScore({ metrics }: SellerTrustScoreProps) {
  return <SellerTrustScoreCard metrics={metrics} />;
}
