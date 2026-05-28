"use server";

import { revalidatePath } from "next/cache";

import {
  ADMIN_ACTIONS,
  ADMIN_TARGET_TYPES,
} from "@/lib/admin/activity-log";
import { logAdminAction } from "@/lib/admin/log-admin-action";
import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import {
  createAdminProduct,
  getAdminProductById,
  parseAdminProductForm,
  updateAdminProduct,
  type AdminProductFormInput,
} from "@/lib/data/admin-products";
import {
  approveProduct,
  rejectProduct,
  resubmitProductForReview,
} from "@/lib/data/product-approval";
import { logAdminActionFailure } from "@/lib/monitoring/log-admin-failure";

type AdminActionResult = {
  success: boolean;
  productId?: string;
  error?:
    | "login_required"
    | "forbidden"
    | "invalid_input"
    | "invalid_state"
    | "slug_taken"
    | "not_found"
    | "save_failed";
};

async function ensureAdmin(): Promise<
  | { ok: true; userId: string }
  | { ok: false; error: AdminActionResult["error"] }
> {
  const user = await getServerAuthUser();
  if (!user) {
    return { ok: false, error: "login_required" };
  }

  if (!(await isAdminUser(user))) {
    return { ok: false, error: "forbidden" };
  }

  return { ok: true, userId: user.id };
}

function revalidateAdminProductPaths(productId?: string) {
  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/product/[id]", "page");
  revalidatePath("/search");
  revalidatePath("/category/[slug]", "page");

  if (productId) {
    revalidatePath(`/admin/products/${productId}/edit`);
  }
}

function productLogSnapshot(
  product: Awaited<ReturnType<typeof getAdminProductById>>,
) {
  if (!product) {
    return null;
  }

  return {
    productId: product.productId,
    name: product.name,
    slug: product.slug,
    status: product.status,
    approvalStatus: product.approvalStatus,
    rejectedReason: product.rejectedReason,
    groupPrice: product.groupPrice,
    originalPrice: product.originalPrice,
  };
}

export async function createAdminProductAction(
  raw: Parameters<typeof parseAdminProductForm>[0],
): Promise<AdminActionResult> {
  const auth = await ensureAdmin();
  if (!auth.ok) {
    return { success: false, error: auth.error };
  }

  const input = parseAdminProductForm(raw);
  const result = await createAdminProduct(input, auth.userId);

  if (result.success && result.productId) {
    const created = await getAdminProductById(result.productId);
    await logAdminAction({
      adminUserId: auth.userId,
      action: ADMIN_ACTIONS.PRODUCT_CREATE,
      targetType: ADMIN_TARGET_TYPES.PRODUCT,
      targetId: result.productId,
      afterData: productLogSnapshot(created),
    });
    revalidateAdminProductPaths(result.productId);
  } else if (!result.success && result.error === "save_failed") {
    void logAdminActionFailure({
      message: "Admin product create failed",
      action: "product_create",
      targetType: "product",
    });
  }

  return result;
}

export async function updateAdminProductAction(
  productId: string,
  raw: Parameters<typeof parseAdminProductForm>[0],
): Promise<AdminActionResult> {
  const auth = await ensureAdmin();
  if (!auth.ok) {
    return { success: false, error: auth.error };
  }

  const before = await getAdminProductById(productId);
  const input = parseAdminProductForm(raw);
  const result = await updateAdminProduct(productId, input);

  if (result.success) {
    const after = await getAdminProductById(productId);
    await logAdminAction({
      adminUserId: auth.userId,
      action: ADMIN_ACTIONS.PRODUCT_UPDATE,
      targetType: ADMIN_TARGET_TYPES.PRODUCT,
      targetId: productId,
      beforeData: productLogSnapshot(before),
      afterData: productLogSnapshot(after),
    });
    revalidateAdminProductPaths(productId);
  }

  return result;
}

export async function approveAdminProductAction(
  productId: string,
): Promise<AdminActionResult> {
  const auth = await ensureAdmin();
  if (!auth.ok) {
    return { success: false, error: auth.error };
  }

  const before = await getAdminProductById(productId);
  const result = await approveProduct(productId, auth.userId);

  if (result.success) {
    const after = await getAdminProductById(productId);
    await logAdminAction({
      adminUserId: auth.userId,
      action: ADMIN_ACTIONS.PRODUCT_APPROVE,
      targetType: ADMIN_TARGET_TYPES.PRODUCT,
      targetId: productId,
      beforeData: productLogSnapshot(before),
      afterData: productLogSnapshot(after),
    });
    revalidateAdminProductPaths(productId);
  }

  return result;
}

export async function rejectAdminProductAction(input: {
  productId: string;
  reason: string;
}): Promise<AdminActionResult> {
  const auth = await ensureAdmin();
  if (!auth.ok) {
    return { success: false, error: auth.error };
  }

  const before = await getAdminProductById(input.productId);
  const result = await rejectProduct(input.productId, input.reason);

  if (result.success) {
    const after = await getAdminProductById(input.productId);
    await logAdminAction({
      adminUserId: auth.userId,
      action: ADMIN_ACTIONS.PRODUCT_REJECT,
      targetType: ADMIN_TARGET_TYPES.PRODUCT,
      targetId: input.productId,
      beforeData: productLogSnapshot(before),
      afterData: productLogSnapshot(after),
    });
    revalidateAdminProductPaths(input.productId);
  }

  return result;
}

export async function resubmitAdminProductReviewAction(
  productId: string,
): Promise<AdminActionResult> {
  const auth = await ensureAdmin();
  if (!auth.ok) {
    return { success: false, error: auth.error };
  }

  const result = await resubmitProductForReview(productId);

  if (result.success) {
    revalidateAdminProductPaths(productId);
  }

  return result;
}

export type { AdminProductFormInput };
