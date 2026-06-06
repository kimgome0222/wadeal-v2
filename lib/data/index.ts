export {
  createParticipation,
  getAllActiveDeals,
  getDealById,
  getDealsByCategory,
  getDealsBySection,
  getFeaturedDeals,
  getParticipatingDealSlugs,
  getPriceTiersByDeal,
  getPriceTiersByDealId,
  getProductDetailById,
  getProductsByCategory,
  getSavedDeals,
} from "@/lib/data/deals";

export { getCategories, getCategoryBySlug, getCategoryDisplayName } from "@/lib/data/categories";
export type { CategoryRecord } from "@/lib/data/categories";
export {
  getPopularSearchTerms,
  logSearchQuery,
  searchDeals,
  searchDealsFromParams,
} from "@/lib/data/search";

export {
  buildAlertOptions,
  formatPriceAlertCondition,
  getDropTargetPrice,
  mapAlertOptionToInput,
  parseCustomTargetPrice,
  resolveAlertTargetPrice,
} from "@/lib/data/alert-options";
export type { AlertOption, AlertOptionKey } from "@/lib/data/alert-options";
export { getPriceAlertsForUser, createPriceAlert } from "@/lib/data/price-alerts";
export type { PriceAlertListItem } from "@/lib/data/price-alerts";
export { createUserAlert, getAlertsForUser } from "@/lib/data/alerts";
export type { CreateUserAlertResult } from "@/lib/data/alerts";
export { createOrder, getOrdersForUser } from "@/lib/data/orders";
export type { CreateOrderResult } from "@/lib/data/orders";
export {
  createReviewReport,
  getAllReviewReports,
  getUserReportedReviewIds,
  resolveReviewReport,
  countPendingReviewReportsForAdmin,
} from "@/lib/data/review-reports";
export type {
  CreateReviewReportInput,
  CreateReviewReportResult,
  ResolveReviewReportResult,
  ReviewReportFilter,
  ReviewReportListItem,
} from "@/lib/data/review-reports";
export { getReviewLikeSnapshot, toggleReviewLikeForUser } from "@/lib/data/review-likes";
export type { ReviewLikeSnapshot } from "@/lib/data/review-likes";
export { getDefaultAddressForUser, saveDefaultAddressForUser } from "@/lib/data/user-address";
export {
  createAddress,
  deleteAddress,
  getAddressById,
  getDefaultAddress,
  getUserAddresses,
  resolveOrderShippingSnapshot,
  setDefaultAddress,
  updateAddress,
  userHasAnyAddress,
  validateAddressOwnership,
} from "@/lib/data/addresses";
export type { UserAddress, AddressFormInput } from "@/lib/addresses/types";
export { getDefaultPaymentForUser, saveDefaultPaymentForUser } from "@/lib/data/user-payment";
export {
  getJoinCartCountForUser,
  getJoinCartForUser,
  type JoinCartItem,
} from "@/lib/data/join-cart";
export { getRecentViewsForUser } from "@/lib/data/recent-views";
export {
  isDealSavedByUser,
  toggleSavedDealForUser,
} from "@/lib/data/saved-deals";
export {
  createReview,
  deleteReview,
  getReviewSummaryByProductId,
  getReviewsByProductId,
  getUserReviewedOrderIds,
  getUserReviewedProductIds,
  updateReview,
  userHasReviewForProduct,
} from "@/lib/data/reviews";
export type {
  CreateReviewInput,
  CreateReviewResult,
  DeleteReviewInput,
  MutateReviewResult,
  ProductReviewItem,
  ReviewRatingBar,
  ReviewSummary,
  UpdateReviewInput,
} from "@/lib/data/reviews";

export type {
  CreateOrderInput,
  CreateParticipationInput,
  CreatePriceAlertInput,
  CreateUserAlertInput,
  PriceTier,
} from "@/lib/database/types";

export { PROTOTYPE_USER_ID } from "@/lib/database/types";
