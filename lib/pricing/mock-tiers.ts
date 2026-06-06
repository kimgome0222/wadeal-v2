import type { Deal } from "@/lib/deals";
import { buildFallbackPriceTiers } from "@/lib/pricing/tiers";
import type { PriceTier } from "@/lib/types";

/** Mock `price_tiers` rows for catalog deals when Supabase is unavailable. */
export function getMockPriceTiersForDeal(deal: Deal): PriceTier[] {
  return buildFallbackPriceTiers({
    originalPrice: deal.originalPrice,
    groupPrice: deal.groupPrice,
    lowestPrice: deal.lowestPrice,
    targetParticipants: deal.targetParticipants,
  }).map((tier, index) => ({
    id: `mock-tier-${deal.slug}-${index}`,
    order: index + 1,
    requiredParticipants: tier.minQty,
    price: tier.price,
  }));
}

export function getMockPriceTiersByDealSlug(slug: string, deal?: Deal): PriceTier[] {
  if (!deal) {
    return [];
  }
  if (deal.slug !== slug) {
    return [];
  }
  return getMockPriceTiersForDeal(deal);
}
