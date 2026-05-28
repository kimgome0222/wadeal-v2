import type { Deal } from "@/lib/deals";
import { shouldUseMockData } from "@/lib/env/runtime";
import type { PriceTier } from "@/lib/types";

export type PriceTierEntry = {
  minQty: number;
  price: number;
};

export function normalizePriceTierEntries(
  priceTiers: PriceTierEntry[] | null | undefined,
): PriceTierEntry[] {
  if (!priceTiers || priceTiers.length === 0) {
    return [];
  }

  return [...priceTiers]
    .filter(
      (tier) =>
        Number.isFinite(tier.minQty) &&
        tier.minQty > 0 &&
        Number.isFinite(tier.price) &&
        tier.price >= 0,
    )
    .sort((a, b) => a.minQty - b.minQty);
}

export function fromLegacyPriceTiers(tiers: PriceTier[]): PriceTierEntry[] {
  return normalizePriceTierEntries(
    tiers.map((tier) => ({
      minQty: tier.requiredParticipants,
      price: tier.price,
    })),
  );
}

export function parsePriceTiersJson(value: unknown): PriceTierEntry[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return normalizePriceTierEntries(
    value.map((item) => {
      const row = item as { minQty?: number; price?: number };
      return {
        minQty: Number(row.minQty),
        price: Number(row.price),
      };
    }),
  );
}

export function getCurrentTierPrice(
  priceTiers: PriceTierEntry[],
  currentQty: number,
): number {
  const sorted = normalizePriceTierEntries(priceTiers);
  if (sorted.length === 0) {
    return 0;
  }

  let applicable = sorted[0];
  for (const tier of sorted) {
    if (currentQty >= tier.minQty) {
      applicable = tier;
    }
  }

  return applicable.price;
}

export type NextTierInfo = {
  nextTier: PriceTierEntry | null;
  remainingQty: number;
};

export function getNextTierInfo(
  priceTiers: PriceTierEntry[],
  currentQty: number,
): NextTierInfo {
  const sorted = normalizePriceTierEntries(priceTiers);
  const nextTier = sorted.find((tier) => currentQty < tier.minQty) ?? null;

  return {
    nextTier,
    remainingQty: nextTier ? Math.max(0, nextTier.minQty - currentQty) : 0,
  };
}

export function getLowestTierPrice(priceTiers: PriceTierEntry[]): number {
  const sorted = normalizePriceTierEntries(priceTiers);
  if (sorted.length === 0) {
    return 0;
  }

  return Math.min(...sorted.map((tier) => tier.price));
}

export function getCurrentTierIndex(
  priceTiers: PriceTierEntry[],
  currentQty: number,
): number {
  const sorted = normalizePriceTierEntries(priceTiers);
  let index = -1;

  for (let i = 0; i < sorted.length; i += 1) {
    if (currentQty >= sorted[i].minQty) {
      index = i;
    }
  }

  return index;
}

export function buildFallbackPriceTiers(input: {
  originalPrice: number;
  groupPrice: number;
  lowestPrice: number;
  targetParticipants: number;
}): PriceTierEntry[] {
  const { originalPrice, groupPrice, lowestPrice } = input;
  const step10 = Math.max(
    lowestPrice,
    Math.round(originalPrice * 0.45 + groupPrice * 0.55),
  );
  const step30 = groupPrice;

  return normalizePriceTierEntries([
    { minQty: 1, price: originalPrice },
    { minQty: 10, price: step10 },
    { minQty: 30, price: step30 },
    { minQty: 50, price: lowestPrice },
  ]);
}

export function resolveDealPriceTiers(
  deal: Pick<
    Deal,
    | "priceTiers"
    | "originalPrice"
    | "groupPrice"
    | "lowestPrice"
    | "targetParticipants"
  >,
  legacyTiers?: PriceTier[],
): PriceTierEntry[] {
  if (deal.priceTiers && deal.priceTiers.length > 0) {
    return normalizePriceTierEntries(deal.priceTiers);
  }

  if (legacyTiers && legacyTiers.length > 0) {
    return fromLegacyPriceTiers(legacyTiers);
  }

  if (shouldUseMockData()) {
    return buildFallbackPriceTiers({
      originalPrice: deal.originalPrice,
      groupPrice: deal.groupPrice,
      lowestPrice: deal.lowestPrice,
      targetParticipants: deal.targetParticipants,
    });
  }

  return normalizePriceTierEntries([{ minQty: 1, price: deal.groupPrice }]);
}

export function buildDefaultTiers(
  deal: Pick<
    Deal,
    | "priceTiers"
    | "originalPrice"
    | "groupPrice"
    | "lowestPrice"
    | "targetParticipants"
  >,
  legacyTiers?: PriceTier[],
): PriceTierEntry[] {
  return resolveDealPriceTiers(deal, legacyTiers);
}

export type TierProgress = {
  priceTiers: PriceTierEntry[];
  applicablePrice: number;
  lowestPrice: number;
  nextTier: PriceTierEntry | null;
  qtyUntilNextTier: number;
  allTiersAchieved: boolean;
  currentTierIndex: number;
};

export function getTierProgress(deal: Deal, legacyTiers?: PriceTier[]): TierProgress {
  const priceTiers = resolveDealPriceTiers(deal, legacyTiers);
  const applicablePrice = getCurrentTierPrice(priceTiers, deal.participants);
  const lowestPrice = getLowestTierPrice(priceTiers);
  const { nextTier, remainingQty } = getNextTierInfo(priceTiers, deal.participants);
  const currentTierIndex = getCurrentTierIndex(priceTiers, deal.participants);

  return {
    priceTiers,
    applicablePrice,
    lowestPrice,
    nextTier,
    qtyUntilNextTier: remainingQty,
    allTiersAchieved: currentTierIndex === priceTiers.length - 1,
    currentTierIndex,
  };
}

export function formatTierQtyLabel(minQty: number): string {
  return `${minQty}+`;
}
