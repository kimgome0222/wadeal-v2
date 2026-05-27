export {
  createParticipation,
  createPriceAlert,
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

export { buildAlertOptions, mapAlertOptionToInput } from "@/lib/data/alert-options";
export type { AlertOption, AlertOptionKey } from "@/lib/data/alert-options";

export type {
  CreateParticipationInput,
  CreatePriceAlertInput,
  PriceTier,
} from "@/lib/database/types";

export { PROTOTYPE_USER_ID } from "@/lib/database/types";
