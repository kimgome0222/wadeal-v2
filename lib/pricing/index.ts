export {
  buildDefaultTiers,
  buildFallbackPriceTiers,
  formatTierQtyLabel,
  fromLegacyPriceTiers,
  getCurrentTierIndex,
  getCurrentTierPrice,
  getLowestTierPrice,
  getNextTierInfo,
  getTierProgress,
  normalizePriceTierEntries,
  parsePriceTiersJson,
  resolveDealPriceTiers,
  type NextTierInfo,
  type PriceTierEntry,
  type TierProgress,
} from "@/lib/pricing/tiers";

export { computeJoinedPriceForDealSlug } from "@/lib/pricing/compute-joined-price";
