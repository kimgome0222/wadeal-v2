import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isNormalProduct } from "@/lib/products/product-type";
import type { InventoryValidationError } from "@/lib/products/inventory";

export type ReserveInventoryResult =
  | { success: true }
  | { success: false; error: InventoryValidationError | "product_not_found" | "deal_not_found" | "save_failed" };

export async function getUserOrderedQuantityForProduct(
  userId: string,
  productSlug: string,
): Promise<number> {
  if (!isSupabaseConfigured()) {
    return 0;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return 0;
  }

  const { data, error } = await supabase
    .from("orders")
    .select("quantity, order_status")
    .eq("user_id", userId)
    .eq("product_id", productSlug);

  if (error || !data) {
    return 0;
  }

  return (data as Array<{ quantity: number | null; order_status: string | null }>)
    .filter((row) => {
      const status = row.order_status ?? "joined";
      return status !== "cancelled" && status !== "refunded";
    })
    .reduce((sum, row) => sum + (row.quantity ?? 1), 0);
}

function mapRpcError(error: string | undefined): ReserveInventoryResult {
  switch (error) {
    case "sold_out":
      return { success: false, error: "sold_out" };
    case "insufficient_stock":
      return { success: false, error: "insufficient_stock" };
    case "insufficient_capacity":
      return { success: false, error: "insufficient_capacity" };
    case "quantity_out_of_range":
      return { success: false, error: "quantity_out_of_range" };
    case "per_user_limit_exceeded":
      return { success: false, error: "per_user_limit_exceeded" };
    case "invalid_quantity":
      return { success: false, error: "invalid_quantity" };
    case "product_not_found":
      return { success: false, error: "product_not_found" };
    case "deal_not_found":
      return { success: false, error: "deal_not_found" };
    default:
      return { success: false, error: "save_failed" };
  }
}

export async function reserveProductInventory(input: {
  productSlug: string;
  dealId: string | null;
  userId: string;
  quantity: number;
  productType: string;
}): Promise<ReserveInventoryResult> {
  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "save_failed" };
  }

  if (isNormalProduct(input.productType)) {
    const { data, error } = await supabase.rpc("reserve_stock", {
      p_product_slug: input.productSlug,
      p_quantity: input.quantity,
      p_user_id: input.userId,
    });

    if (error) {
      console.error("[inventory] reserve_stock:", error.message);
      return { success: false, error: "save_failed" };
    }

    const result = data as { success?: boolean; error?: string } | null;
    if (!result?.success) {
      return mapRpcError(result?.error);
    }

    return { success: true };
  }

  if (!input.dealId) {
    return { success: false, error: "deal_not_found" };
  }

  const { data, error } = await supabase.rpc("reserve_groupbuy_quantity", {
    p_deal_id: input.dealId,
    p_product_slug: input.productSlug,
    p_quantity: input.quantity,
    p_user_id: input.userId,
  });

  if (error) {
    console.error("[inventory] reserve_groupbuy_quantity:", error.message);
    return { success: false, error: "save_failed" };
  }

  const result = data as { success?: boolean; error?: string } | null;
  if (!result?.success) {
    return mapRpcError(result?.error);
  }

  return { success: true };
}

export async function releaseProductInventory(input: {
  productSlug: string;
  dealId: string | null;
  quantity: number;
  productType: string;
}): Promise<{ success: boolean }> {
  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false };
  }

  if (isNormalProduct(input.productType)) {
    const { data, error } = await supabase.rpc("release_stock", {
      p_product_slug: input.productSlug,
      p_quantity: input.quantity,
    });

    if (error) {
      console.error("[inventory] release_stock:", error.message);
      return { success: false };
    }

    return { success: !!(data as { success?: boolean } | null)?.success };
  }

  if (!input.dealId) {
    return { success: false };
  }

  const { data, error } = await supabase.rpc("release_groupbuy_quantity", {
    p_deal_id: input.dealId,
    p_product_slug: input.productSlug,
    p_quantity: input.quantity,
  });

  if (error) {
    console.error("[inventory] release_groupbuy_quantity:", error.message);
    return { success: false };
  }

  return { success: !!(data as { success?: boolean } | null)?.success };
}
