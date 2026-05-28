import { getDealById, getPriceTiersByDealId } from "@/lib/data";
import { getTierProgress } from "@/lib/pricing/tiers";

export type JoinedPriceQuote = {
  price: number;
  dealTitle: string;
  participants: number;
  qtyUntilNextTier: number;
  lowestPrice: number;
};

/** Server-side joined price from current participants + price_tiers (never trust client). */
export async function computeJoinedPriceForDealSlug(
  productSlug: string,
): Promise<JoinedPriceQuote | null> {
  const deal = await getDealById(productSlug);
  if (!deal) {
    return null;
  }

  const legacyTiers = await getPriceTiersByDealId(productSlug);
  const { applicablePrice, qtyUntilNextTier, lowestPrice } = getTierProgress(deal, legacyTiers);

  if (!Number.isFinite(applicablePrice) || applicablePrice < 0) {
    return null;
  }

  return {
    price: Math.round(applicablePrice),
    dealTitle: deal.title,
    participants: deal.participants,
    qtyUntilNextTier,
    lowestPrice,
  };
}

export type NormalPriceQuote = {
  unitPrice: number;
  totalPrice: number;
  dealTitle: string;
};

/** Server-side fixed price for normal (non-groupbuy) products. */
export async function computeNormalPriceForDealSlug(
  productSlug: string,
  quantity = 1,
): Promise<NormalPriceQuote | null> {
  const deal = await getDealById(productSlug);
  if (!deal) {
    return null;
  }

  const safeQuantity = Math.max(1, Math.min(99, Math.round(quantity)));
  const unitPrice = Math.round(deal.groupPrice);

  if (!Number.isFinite(unitPrice) || unitPrice < 0) {
    return null;
  }

  return {
    unitPrice,
    totalPrice: unitPrice * safeQuantity,
    dealTitle: deal.title,
  };
}
