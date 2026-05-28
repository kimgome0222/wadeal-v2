import type { Deal } from "@/lib/deals";
import type { PriceTier } from "@/lib/types";
import { PriceTierSteps } from "@/components/price-tier-steps";

type TierPricingProps = {
  deal: Deal;
  tiers?: PriceTier[];
  variant?: "compact" | "full";
};

export function TierPricing({ deal, tiers, variant = "full" }: TierPricingProps) {
  return <PriceTierSteps deal={deal} tiers={tiers} variant={variant} />;
}
