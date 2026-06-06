export {
  finalizeDeal,
  finalizeDealByProductId,
  finalizeDueDeals,
  type FinalizeDealError,
  type FinalizeDealOptions,
  type FinalizeDealResult,
} from "@/lib/orders/finalize-deal";

/** @deprecated Use finalizeDeal from @/lib/orders/finalize-deal */
export { finalizeDeal as finalizeOrdersForDeal } from "@/lib/orders/finalize-deal";
