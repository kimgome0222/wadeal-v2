import { createAdminProduct } from "@/lib/data/admin-products";
import { approveProduct } from "@/lib/data/product-approval";
import {
  type SellerProductRequestStatus,
} from "@/lib/seller-product-request-labels";
import { notifySellerProductApproved, notifySellerProductRejected } from "@/lib/notifications/seller-events";
import { DEFAULT_SHIPPING } from "@/lib/data/product-shipping";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isMissingTableError } from "@/lib/supabase/query-fallback";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type AdminSellerProductRequestItem = {
  id: string;
  sellerId: string;
  requestedBy: string;
  productName: string;
  categoryId: string | null;
  description: string | null;
  imageUrls: string[];
  originalPrice: number | null;
  groupPrice: number | null;
  targetParticipants: number | null;
  endsAt: string | null;
  status: SellerProductRequestStatus;
  rejectedReason: string | null;
  createdAt: string;
  sellerCompanyName: string | null;
  sellerUserId: string | null;
};

function mapAdminRow(row: Record<string, unknown>): AdminSellerProductRequestItem {
  const sellers = row.sellers as { company_name?: string; user_id?: string } | null;

  return {
    id: row.id as string,
    sellerId: row.seller_id as string,
    requestedBy: row.requested_by as string,
    productName: row.product_name as string,
    categoryId: (row.category_id as string | null) ?? null,
    description: (row.description as string | null) ?? null,
    imageUrls: (row.image_urls as string[] | null) ?? [],
    originalPrice: (row.original_price as number | null) ?? null,
    groupPrice: (row.group_price as number | null) ?? null,
    targetParticipants: (row.target_participants as number | null) ?? null,
    endsAt: (row.ends_at as string | null) ?? null,
    status: row.status as SellerProductRequestStatus,
    rejectedReason: (row.rejected_reason as string | null) ?? null,
    createdAt: row.created_at as string,
    sellerCompanyName: sellers?.company_name ?? null,
    sellerUserId: sellers?.user_id ?? null,
  };
}

function generateProductSlug(productName: string): string {
  const ascii = productName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
  const stem = ascii.length >= 2 ? ascii : "item";
  return `wd-${stem}-${Math.random().toString(36).slice(2, 6)}`;
}

export async function getAdminSellerProductRequests(options?: {
  status?: SellerProductRequestStatus | "pending_queue";
}): Promise<AdminSellerProductRequestItem[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return [];
  }

  let query = supabase
    .from("seller_product_requests")
    .select("*, sellers(company_name, user_id)")
    .order("created_at", { ascending: false });

  if (options?.status === "pending_queue") {
    query = query.in("status", ["pending", "under_review"]);
  } else if (options?.status) {
    query = query.eq("status", options.status);
  }

  const { data, error } = await query;

  if (error) {
    if (!isMissingTableError(error.message)) {
      console.error("[admin-seller-product-requests] list:", error.message);
    }
    return [];
  }

  return (data ?? []).map((row) => mapAdminRow(row as Record<string, unknown>));
}

export async function getAdminSellerProductRequestById(
  requestId: string,
): Promise<AdminSellerProductRequestItem | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("seller_product_requests")
    .select("*, sellers(company_name, user_id)")
    .eq("id", requestId)
    .maybeSingle();

  if (error || !data) {
    if (error) {
      console.error("[admin-seller-product-requests] getById:", error.message);
    }
    return null;
  }

  return mapAdminRow(data as Record<string, unknown>);
}

export async function approveAdminSellerProductRequest(
  requestId: string,
  adminUserId: string,
): Promise<{ success: boolean; error?: string; productId?: string }> {
  const request = await getAdminSellerProductRequestById(requestId);
  if (!request) {
    return { success: false, error: "not_found" };
  }

  if (request.status !== "pending" && request.status !== "under_review") {
    return { success: false, error: "invalid_state" };
  }

  if (!request.groupPrice || request.groupPrice <= 0) {
    return { success: false, error: "invalid_input" };
  }

  const sellerUserId = request.sellerUserId;
  if (!sellerUserId) {
    return { success: false, error: "seller_not_found" };
  }

  if (!isSupabaseConfigured()) {
    return { success: false, error: "not_configured" };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "save_failed" };
  }

  const originalPrice = request.originalPrice ?? request.groupPrice;
  const targetParticipants = request.targetParticipants ?? 100;
  const endsAt =
    request.endsAt ??
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
  const slug = generateProductSlug(request.productName);
  const imageUrl = request.imageUrls[0] ?? "";

  const createResult = await createAdminProduct(
    {
      name: request.productName.trim(),
      slug,
      groupPrice: request.groupPrice,
      originalPrice,
      imageUrl,
      detailImageUrls: request.imageUrls.slice(1),
      targetParticipants,
      currentParticipants: 0,
      endsAt,
      status: "active",
      priceTiers: [],
      submitIntent: "submit_review",
      stockQuantity: null,
      minOrderQuantity: 1,
      maxOrderQuantity: 99,
      perUserLimit: null,
      maxQuantity: targetParticipants,
      shippingFee: DEFAULT_SHIPPING.shippingFee,
      freeShippingThreshold: DEFAULT_SHIPPING.freeShippingThreshold,
      shippingType: DEFAULT_SHIPPING.shippingType,
      isFreeShipping: DEFAULT_SHIPPING.isFreeShipping,
      remoteAreaExtraFee: DEFAULT_SHIPPING.remoteAreaExtraFee,
    },
    sellerUserId,
  );

  if (!createResult.success || !createResult.productId) {
    return {
      success: false,
      error: createResult.error === "slug_taken" ? "save_failed" : (createResult.error ?? "save_failed"),
    };
  }

  const productId = createResult.productId;

  const approveResult = await approveProduct(productId, adminUserId, { forceApprove: true });
  if (!approveResult.success) {
    await supabase.from("group_buy_deals").delete().eq("product_id", productId);
    await supabase.from("products").delete().eq("id", productId);
    return { success: false, error: approveResult.error ?? "approve_failed" };
  }

  const { data: dealRow } = await supabase
    .from("group_buy_deals")
    .select("id")
    .eq("product_id", productId)
    .maybeSingle();

  const dealId = (dealRow as { id: string } | null)?.id ?? null;
  const now = new Date().toISOString();

  const { error: requestError } = await supabase
    .from("seller_product_requests")
    .update({
      status: "approved",
      rejected_reason: null,
      approved_product_id: productId,
      approved_deal_id: dealId,
      reviewed_by: adminUserId,
      reviewed_at: now,
    })
    .eq("id", requestId);

  if (requestError) {
    console.error("[admin-seller-product-requests] approve request update:", requestError.message);
    return { success: false, error: "save_failed" };
  }

  await notifySellerProductApproved({
    sellerUserId,
    productName: request.productName,
    productId,
  });

  return { success: true, productId };
}

export async function rejectAdminSellerProductRequest(
  requestId: string,
  adminUserId: string,
  reason: string,
): Promise<{ success: boolean; error?: string }> {
  const trimmedReason = reason.trim();
  if (!trimmedReason) {
    return { success: false, error: "invalid_input" };
  }

  const request = await getAdminSellerProductRequestById(requestId);
  if (!request) {
    return { success: false, error: "not_found" };
  }

  if (request.status !== "pending" && request.status !== "under_review") {
    return { success: false, error: "invalid_state" };
  }

  if (!isSupabaseConfigured()) {
    return { success: false, error: "not_configured" };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "save_failed" };
  }

  const now = new Date().toISOString();

  const { error } = await supabase
    .from("seller_product_requests")
    .update({
      status: "rejected",
      rejected_reason: trimmedReason,
      reviewed_by: adminUserId,
      reviewed_at: now,
    })
    .eq("id", requestId);

  if (error) {
    console.error("[admin-seller-product-requests] reject:", error.message);
    return { success: false, error: "save_failed" };
  }

  if (request.sellerUserId) {
    await notifySellerProductRejected({
      sellerUserId: request.sellerUserId,
      productName: request.productName,
      reason: trimmedReason,
    });
  }

  return { success: true };
}
