import type { Deal } from "@/lib/deals";
import type { CartRecommendationItem } from "@/lib/mock/cart-recommendations";

/** mock recommendation → catalog Deal lookup */
export function catalogDealFromRecommendation(
  catalog: Deal[],
  item: CartRecommendationItem,
): Deal | undefined {
  return catalog.find((deal) => deal.slug === item.slug);
}
