import { getDealById, getPriceTiersByDealId } from "@/lib/data/deals";
import type { Deal } from "@/lib/deals";
import { isDealClosed } from "@/lib/deals";
import { shouldUseMockData } from "@/lib/env/runtime";
import { computeJoinedPriceForDealSlug } from "@/lib/pricing/compute-joined-price";
import { getTierProgress } from "@/lib/pricing/tiers";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isMissingTableError, logDataQueryFallback } from "@/lib/supabase/query-fallback";
import { PUBLIC_PRODUCT_APPROVAL_STATUS } from "@/lib/products/public-visibility";

export type JoinCartItem = {
  id: string;
  productSlug: string;
  productName: string;
  quantity: number;
  estimatedUnitPrice: number;
  estimatedLineTotal: number;
  qtyUntilNextTier: number;
  participants: number;
  badge: string;
  closed: boolean;
  sellerName: string;
  imageUrl: string;
};

type JoinCartRow = {
  id: string;
  quantity: number;
  estimated_unit_price: number;
  products: { slug: string };
};

function isJoinCartUnavailable(message: string | undefined): boolean {
  return isMissingTableError(message);
}

function handleJoinCartQueryError(context: string, message: string | undefined): boolean {
  if (isJoinCartUnavailable(message)) {
    return true;
  }

  logDataQueryFallback(context, message);
  return false;
}

async function resolveProductId(productSlug: string): Promise<string | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("products")
    .select("id")
    .eq("slug", productSlug)
    .eq("is_active", true)
    .eq("approval_status", PUBLIC_PRODUCT_APPROVAL_STATUS)
    .maybeSingle();

  if (error || !data) {
    handleJoinCartQueryError("[data] join-cart resolveProductId", error?.message);
    return null;
  }

  return (data as { id: string }).id;
}

async function fetchJoinCartRows(userId: string): Promise<JoinCartRow[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("join_cart")
    .select("id, quantity, estimated_unit_price, products!inner(slug)")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) {
    handleJoinCartQueryError("[data] fetchJoinCartRows", error.message);
    return [];
  }

  return (data ?? []) as unknown as JoinCartRow[];
}

async function enrichCartItem(
  row: JoinCartRow,
): Promise<JoinCartItem | null> {
  const productSlug = row.products.slug;
  const deal = await getDealById(productSlug);
  if (!deal) {
    return null;
  }

  const tiers = await getPriceTiersByDealId(productSlug);
  const { qtyUntilNextTier } = getTierProgress(deal, tiers);
  const priced = await computeJoinedPriceForDealSlug(productSlug);
  const estimatedUnitPrice = priced?.price ?? row.estimated_unit_price;

  return {
    id: row.id,
    productSlug,
    productName: deal.title,
    quantity: row.quantity,
    estimatedUnitPrice,
    estimatedLineTotal: estimatedUnitPrice * row.quantity,
    qtyUntilNextTier,
    participants: deal.participants,
    badge: deal.badge,
    closed: isDealClosed(deal),
    sellerName: deal.brandName?.trim() || "celloh 셀러",
    imageUrl: deal.imageUrl,
  };
}

export async function getJoinCartForUser(userId: string): Promise<JoinCartItem[]> {
  const rows = await fetchJoinCartRows(userId);
  if (rows.length === 0) {
    return [];
  }

  const items = await Promise.all(rows.map((row) => enrichCartItem(row)));
  return items.filter((item): item is JoinCartItem => item != null);
}

export async function getJoinCartCountForUser(userId: string): Promise<number> {
  const items = await getJoinCartForUser(userId);
  return items.length;
}

export async function addToJoinCartForUser(
  userId: string,
  productSlug: string,
  quantity = 1,
): Promise<{ success: boolean; error?: "deal_not_found" | "deal_closed" | "save_failed" }> {
  if (!Number.isFinite(quantity) || quantity < 1 || quantity > 99) {
    return { success: false, error: "save_failed" };
  }

  const deal = await getDealById(productSlug);
  if (!deal) {
    return { success: false, error: "deal_not_found" };
  }

  if (isDealClosed(deal)) {
    return { success: false, error: "deal_closed" };
  }

  const priced = await computeJoinedPriceForDealSlug(productSlug);
  if (!priced) {
    return { success: false, error: "deal_not_found" };
  }

  if (!isSupabaseConfigured()) {
    return { success: shouldUseMockData() };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "save_failed" };
  }

  const productId = await resolveProductId(productSlug);
  if (!productId) {
    return { success: false, error: "deal_not_found" };
  }

  const { data: existing, error: fetchError } = await supabase
    .from("join_cart")
    .select("id, quantity")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .maybeSingle();

  if (fetchError && isJoinCartUnavailable(fetchError.message)) {
    return { success: true };
  }

  if (existing) {
    const nextQty = Math.min(99, (existing as { quantity: number }).quantity + quantity);
    const { error } = await supabase
      .from("join_cart")
      .update({
        quantity: nextQty,
        estimated_unit_price: priced.price,
      })
      .eq("id", (existing as { id: string }).id);

    if (error) {
      if (isJoinCartUnavailable(error.message)) {
        return { success: true };
      }
      logDataQueryFallback("[data] addToJoinCartForUser update", error.message);
      return { success: false, error: "save_failed" };
    }

    return { success: true };
  }

  const { error } = await supabase.from("join_cart").insert({
    user_id: userId,
    product_id: productId,
    quantity,
    estimated_unit_price: priced.price,
  });

  if (error) {
    if (isJoinCartUnavailable(error.message)) {
      return { success: true };
    }
    logDataQueryFallback("[data] addToJoinCartForUser insert", error.message);
    return { success: false, error: "save_failed" };
  }

  return { success: true };
}

export async function updateJoinCartQuantityForUser(
  userId: string,
  cartItemId: string,
  quantity: number,
): Promise<{ success: boolean; error?: "not_found" | "save_failed" }> {
  if (!Number.isFinite(quantity) || quantity < 1 || quantity > 99) {
    return { success: false, error: "save_failed" };
  }

  if (!isSupabaseConfigured()) {
    return { success: shouldUseMockData() };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "save_failed" };
  }

  const { data: row, error: fetchError } = await supabase
    .from("join_cart")
    .select("id, products!inner(slug)")
    .eq("id", cartItemId)
    .eq("user_id", userId)
    .maybeSingle();

  if (fetchError) {
    if (isJoinCartUnavailable(fetchError.message)) {
      return { success: true };
    }
    return { success: false, error: "not_found" };
  }

  if (!row) {
    return { success: false, error: "not_found" };
  }

  const productSlug = (row as unknown as { products: { slug: string } }).products.slug;
  const priced = await computeJoinedPriceForDealSlug(productSlug);

  const { error } = await supabase
    .from("join_cart")
    .update({
      quantity,
      estimated_unit_price: priced?.price ?? 0,
    })
    .eq("id", cartItemId)
    .eq("user_id", userId);

  if (error) {
    if (isJoinCartUnavailable(error.message)) {
      return { success: true };
    }
    logDataQueryFallback("[data] updateJoinCartQuantityForUser", error.message);
    return { success: false, error: "save_failed" };
  }

  return { success: true };
}

export async function removeFromJoinCartForUser(
  userId: string,
  cartItemId: string,
): Promise<{ success: boolean }> {
  if (!isSupabaseConfigured()) {
    return { success: shouldUseMockData() };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false };
  }

  const { error } = await supabase
    .from("join_cart")
    .delete()
    .eq("id", cartItemId)
    .eq("user_id", userId);

  if (error) {
    if (isJoinCartUnavailable(error.message)) {
      return { success: true };
    }
    logDataQueryFallback("[data] removeFromJoinCartForUser", error.message);
    return { success: false };
  }

  return { success: true };
}

export async function removeJoinCartItemByProductSlug(
  userId: string,
  productSlug: string,
): Promise<void> {
  if (!isSupabaseConfigured()) {
    return;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return;
  }

  const productId = await resolveProductId(productSlug);
  if (!productId) {
    return;
  }

  await supabase
    .from("join_cart")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);
}
