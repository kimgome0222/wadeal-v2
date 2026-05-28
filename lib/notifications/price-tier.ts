import {
  getCurrentTierIndex,
  getCurrentTierPrice,
  getNextTierInfo,
  parsePriceTiersJson,
  resolveDealPriceTiers,
} from "@/lib/pricing/tiers";
import type { PriceTier } from "@/lib/types";
import { notifyDealParticipants } from "@/lib/notifications/create";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const NEXT_TIER_SOON_THRESHOLD = 5;

type DealNotificationContext = {
  dealId: string;
  productSlug: string;
  productName: string;
  participantCount: number;
  priceTiers: ReturnType<typeof resolveDealPriceTiers>;
};

async function loadDealNotificationContext(dealId: string): Promise<DealNotificationContext | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data: dealRow, error } = await supabase
    .from("group_buy_deals")
    .select("id, current_participants, price_tiers, product_id")
    .eq("id", dealId)
    .maybeSingle();

  if (error || !dealRow) {
    return null;
  }

  const { data: productRow } = await supabase
    .from("products")
    .select("slug, name")
    .eq("id", dealRow.product_id as string)
    .maybeSingle();

  if (!productRow) {
    return null;
  }

  const parsedTiers = parsePriceTiersJson(dealRow.price_tiers);

  const { data: legacyRows } = await supabase
    .from("price_tiers")
    .select("*")
    .eq("deal_id", dealId)
    .order("tier_order", { ascending: true });

  const legacyTiers: PriceTier[] = (legacyRows ?? []).map((row) => ({
    id: row.id as string,
    order: row.tier_order as number,
    requiredParticipants: row.required_participants as number,
    price: row.price as number,
  }));

  const { data: orderRows } = await supabase
    .from("orders")
    .select("quantity")
    .eq("deal_id", dealId)
    .not("order_status", "in", '("cancelled","refunded")');

  const participantCount = Math.max(
    (orderRows ?? []).reduce(
      (sum, row) => sum + Math.max(1, (row.quantity as number) ?? 1),
      0,
    ),
    (dealRow.current_participants as number) ?? 0,
  );

  const priceTiers = resolveDealPriceTiers(
    {
      priceTiers: parsedTiers,
      originalPrice: 0,
      groupPrice: 0,
      lowestPrice: 0,
      targetParticipants: participantCount,
    },
    legacyTiers,
  );

  return {
    dealId,
    productSlug: productRow.slug as string,
    productName: productRow.name as string,
    participantCount,
    priceTiers,
  };
}

function productLink(slug: string): string {
  return `/product/${slug}`;
}

/**
 * Notify participants when cumulative quantity reaches a new price tier.
 * Callable after order join or from admin/cron.
 */
export async function notifyPriceTierReached(dealId: string): Promise<{ success: boolean }> {
  const context = await loadDealNotificationContext(dealId);
  if (!context || context.priceTiers.length === 0) {
    return { success: false };
  }

  const tierIndex = getCurrentTierIndex(context.priceTiers, context.participantCount);
  if (tierIndex < 0) {
    return { success: true };
  }

  const tier = context.priceTiers[tierIndex];
  const tierPrice = getCurrentTierPrice(context.priceTiers, context.participantCount);
  const linkUrl = productLink(context.productSlug);

  await notifyDealParticipants(dealId, "price_tier_reached", {
    title: "새 가격 단계 달성",
    message: `${context.productName} · ${tier.minQty}명 이상 ${tierPrice.toLocaleString("ko-KR")}원`,
    linkUrl,
  });

  return { success: true };
}

/**
 * Notify participants when the next tier is within threshold quantity.
 */
export async function notifyNextTierSoon(dealId: string): Promise<{ success: boolean }> {
  const context = await loadDealNotificationContext(dealId);
  if (!context || context.priceTiers.length === 0) {
    return { success: false };
  }

  const { nextTier, remainingQty } = getNextTierInfo(
    context.priceTiers,
    context.participantCount,
  );

  if (!nextTier || remainingQty <= 0 || remainingQty > NEXT_TIER_SOON_THRESHOLD) {
    return { success: true };
  }

  await notifyDealParticipants(dealId, "next_tier_soon", {
    title: "다음 가격 단계 임박",
    message: `${context.productName} · ${remainingQty}명 더 모이면 ${nextTier.price.toLocaleString("ko-KR")}원`,
    linkUrl: productLink(context.productSlug),
  });

  return { success: true };
}

/** Run tier-related notifications after a new join (idempotent via dedupe). */
export async function checkDealPriceTierNotifications(dealId: string): Promise<void> {
  await notifyPriceTierReached(dealId);
  await notifyNextTierSoon(dealId);
}
