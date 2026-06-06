import { detectProhibitedKeywords } from "@/lib/content/prohibited-keywords";
import {
  notifyAdminNewProductRequest,
  notifyAdminProhibitedKeywordDetected,
} from "@/lib/notifications/admin-events";
import { getProductReviewChecklistStatus } from "@/lib/data/product-review-checklist";
import {
  notifySellerProductApproved,
  notifySellerProductChangesRequested,
  notifySellerProductRejected,
} from "@/lib/notifications/seller-events";
import type { ProductApprovalStatus } from "@/lib/products/approval-status";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type ProductApprovalMutationResult = {
  success: boolean;
  error?:
    | "not_found"
    | "invalid_state"
    | "invalid_input"
    | "forbidden"
    | "save_failed"
    | "checklist_incomplete";
};

type ProductApprovalRow = {
  id: string;
  slug: string;
  name: string;
  approval_status: ProductApprovalStatus;
  created_by: string | null;
  supplier_id: string | null;
};

async function fetchProductForApproval(
  productId: string,
): Promise<ProductApprovalRow | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("products")
    .select("id, slug, name, approval_status, created_by, supplier_id")
    .eq("id", productId)
    .maybeSingle();

  if (error || !data) {
    console.error("[product-approval] fetchProductForApproval:", error?.message);
    return null;
  }

  return data as ProductApprovalRow;
}

async function resolveNotifyUserId(product: ProductApprovalRow): Promise<string | null> {
  return product.created_by;
}

async function notifyProductCreator(
  product: ProductApprovalRow,
  type: "product_approved" | "product_rejected",
  message: string,
): Promise<void> {
  const userId = await resolveNotifyUserId(product);
  if (!userId) {
    return;
  }

  if (type === "product_approved") {
    await notifySellerProductApproved({
      sellerUserId: userId,
      productName: product.name,
      productId: product.id,
    });
    return;
  }

  await notifySellerProductRejected({
    sellerUserId: userId,
    productName: product.name,
    reason: message.replace(/^.*?사유:\s*/, ""),
  });
}

export async function approveProduct(
  productId: string,
  adminUserId: string,
  options?: { forceApprove?: boolean },
): Promise<ProductApprovalMutationResult> {
  const product = await fetchProductForApproval(productId);
  if (!product) {
    return { success: false, error: "not_found" };
  }

  if (product.approval_status !== "pending_review") {
    return { success: false, error: "invalid_state" };
  }

  if (!options?.forceApprove) {
    const checklist = await getProductReviewChecklistStatus(productId);
    if (!checklist.isComplete) {
      return { success: false, error: "checklist_incomplete" };
    }
  }

  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "save_failed" };
  }

  const now = new Date().toISOString();

  const { error: productError } = await supabase
    .from("products")
    .update({
      approval_status: "approved",
      rejected_reason: null,
      approved_at: now,
      approved_by: adminUserId,
      is_active: true,
    })
    .eq("id", productId);

  if (productError) {
    console.error("[product-approval] approveProduct:", productError.message);
    return { success: false, error: "save_failed" };
  }

  const { error: dealError } = await supabase
    .from("group_buy_deals")
    .update({ status: "active" })
    .eq("product_id", productId);

  if (dealError) {
    console.error("[product-approval] approveProduct deal:", dealError.message);
    return { success: false, error: "save_failed" };
  }

  await notifyProductCreator(
    product,
    "product_approved",
    "상품이 승인되어 노출됩니다.",
  );

  return { success: true };
}

export async function rejectProduct(
  productId: string,
  reason: string,
): Promise<ProductApprovalMutationResult> {
  const trimmedReason = reason.trim();
  if (!trimmedReason) {
    return { success: false, error: "invalid_input" };
  }

  const product = await fetchProductForApproval(productId);
  if (!product) {
    return { success: false, error: "not_found" };
  }

  if (product.approval_status !== "pending_review") {
    return { success: false, error: "invalid_state" };
  }

  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "save_failed" };
  }

  const { error } = await supabase
    .from("products")
    .update({
      approval_status: "rejected",
      rejected_reason: trimmedReason,
      approved_at: null,
      approved_by: null,
      is_active: false,
    })
    .eq("id", productId);

  if (error) {
    console.error("[product-approval] rejectProduct:", error.message);
    return { success: false, error: "save_failed" };
  }

  await notifyProductCreator(
    product,
    "product_rejected",
    `상품 검수가 반려되었습니다. 사유: ${trimmedReason}`,
  );

  return { success: true };
}

export async function requestProductChanges(
  productId: string,
  reason: string,
): Promise<ProductApprovalMutationResult> {
  const trimmedReason = reason.trim();
  if (!trimmedReason) {
    return { success: false, error: "invalid_input" };
  }

  const product = await fetchProductForApproval(productId);
  if (!product) {
    return { success: false, error: "not_found" };
  }

  if (product.approval_status !== "pending_review" && product.approval_status !== "approved") {
    return { success: false, error: "invalid_state" };
  }

  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "save_failed" };
  }

  const { error } = await supabase
    .from("products")
    .update({
      approval_status: "rejected",
      rejected_reason: trimmedReason,
      approved_at: null,
      approved_by: null,
      is_active: false,
    })
    .eq("id", productId);

  if (error) {
    console.error("[product-approval] requestProductChanges:", error.message);
    return { success: false, error: "save_failed" };
  }

  const userId = await resolveNotifyUserId(product);
  if (userId) {
    await notifySellerProductChangesRequested({
      sellerUserId: userId,
      productName: product.name,
      reason: trimmedReason,
    });
  }

  return { success: true };
}

export async function resubmitProductForReview(
  productId: string,
): Promise<ProductApprovalMutationResult> {
  const product = await fetchProductForApproval(productId);
  if (!product) {
    return { success: false, error: "not_found" };
  }

  if (product.approval_status !== "rejected" && product.approval_status !== "draft") {
    return { success: false, error: "invalid_state" };
  }

  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "save_failed" };
  }

  const { error } = await supabase
    .from("products")
    .update({
      approval_status: "pending_review",
      rejected_reason: null,
      approved_at: null,
      approved_by: null,
    })
    .eq("id", productId);

  if (error) {
    console.error("[product-approval] resubmitProductForReview:", error.message);
    return { success: false, error: "save_failed" };
  }

  await notifyAdminNewProductRequest({
    productName: product.name,
    productId: product.id,
  });

  const matchedKeywords = detectProhibitedKeywords(product.name);
  if (matchedKeywords.length > 0) {
    await notifyAdminProhibitedKeywordDetected({
      source: "product_resubmit",
      matchedKeywords,
      excerpt: product.name,
      linkUrl: `/admin/products/${product.id}/edit`,
    });
  }

  return { success: true };
}

export async function submitProductForReview(
  productId: string,
): Promise<ProductApprovalMutationResult> {
  return resubmitProductForReview(productId);
}
