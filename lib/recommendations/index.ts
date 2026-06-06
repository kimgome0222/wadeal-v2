export { getCartRecommendations } from "@/lib/recommendations/cart-recommendations";
export type {
  CartRecommendationInput,
  CartRecommendationSection,
  CartRecommendationsResult,
} from "@/lib/recommendations/cart-recommendations";
export { getRepurchaseRateDeals, getMockRepurchaseRate } from "@/lib/recommendations/repurchase-deals";
export {
  addRecentProduct,
  dealToRecentProductSnapshot,
  readRecentProducts,
  readRecentProductSlugs,
  resolveRecentProductDeals,
  RECENT_PRODUCTS_KEY,
  MAX_RECENT_PRODUCTS,
} from "@/lib/personalization/recent-products";
