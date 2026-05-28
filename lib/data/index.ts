export {
  createParticipation,
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

export type {
  CreateParticipationInput,
  CreatePriceAlertInput,
  PriceTier,
} from "@/lib/database/types";

export { PROTOTYPE_USER_ID } from "@/lib/database/types";
