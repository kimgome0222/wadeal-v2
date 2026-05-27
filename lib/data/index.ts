export {
  createParticipation,
  createPriceAlert,
  getDealsBySection,
  getFeaturedDeals,
  getParticipatingDealSlugs,
  getPriceTiersByDeal,
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
