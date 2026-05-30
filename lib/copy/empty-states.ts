/**
 * 홈·카탈로그 빈 상태 copy — see lib/copy/ux-writing.ts for source of truth.
 */
import { CELLOH_EMPTY } from "@/lib/copy/ux-writing";

export const CELLOH_EMPTY_STATES = {
  recommendedSellerProducts: CELLOH_EMPTY.recommendedSellerProducts,
  popularSellerProducts: CELLOH_EMPTY.popularSellerProducts,
  specialPriceProducts: CELLOH_EMPTY.specialPriceProducts,
  newSellerProducts: CELLOH_EMPTY.newSellerProducts,
  sellerReviews: CELLOH_EMPTY.sellerReviews,
  followedSellers: CELLOH_EMPTY.followedSellers,
  orders: CELLOH_EMPTY.orders,
  savedDeals: CELLOH_EMPTY.savedDeals,
  recentViews: CELLOH_EMPTY.recentViews,
  sellerProducts: CELLOH_EMPTY.sellerProducts,
} as const;

export { CELLOH_AUTH_COPY } from "@/lib/copy/ux-writing";
