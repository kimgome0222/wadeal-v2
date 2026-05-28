"use server";

import { revalidatePath } from "next/cache";

import {
  getAuthDisplayName,
  getServerAuthUser,
} from "@/lib/auth/server-session";
import { getDealById } from "@/lib/data";
import { createParticipation } from "@/lib/data/deals";
import {
  getAdminOrderById,
  processAdminOrderClaim,
  updateAdminOrder,
  type AdminOrderClaimType,
  type AdminOrderDetail,
  type UpdateAdminOrderInput,
} from "@/lib/data/admin-orders";
import { createOrder, confirmPurchaseForUser, userHasOrderForProduct } from "@/lib/data/orders";
import { logError } from "@/lib/monitoring/error-log";
import { validateOrdererInfoForUser } from "@/lib/data/users";
import {
  getDefaultAddressForUser,
  hasDefaultAddressForUser,
  saveDefaultAddressForUser,
} from "@/lib/data/user-address";
import { userHasAnyAddress, validateAddressOwnership } from "@/lib/data/addresses";
import {
  getDefaultPaymentForUser,
  hasDefaultPaymentForUser,
  saveDefaultPaymentForUser,
} from "@/lib/data/user-payment";
import { removeJoinCartItemByProductSlug } from "@/lib/data/join-cart";
import { toggleSavedDealForUser } from "@/lib/data/saved-deals";
import { hasRequiredConsents as userHasRequiredConsents } from "@/lib/data/user-consents";
import { createReview, deleteReview, updateReview } from "@/lib/data/reviews";
import { createReviewReport } from "@/lib/data/review-reports";
import { toggleReviewLikeForUser } from "@/lib/data/review-likes";
import { createUserAlert } from "@/lib/data/alerts";
import { createPriceAlert } from "@/lib/data/price-alerts";
import { isReviewReportReason } from "@/lib/reviews/review-report-reasons";
import type {
  CreateOrderInput,
  CreateParticipationInput,
  CreatePriceAlertInput,
  CreateReviewInput,
  CreateReviewReportInput,
  CreateUserAlertInput,
  DeleteReviewInput,
  UpdateReviewInput,
} from "@/lib/database/types";
import { isAdminUser } from "@/lib/auth/admin-access";
import {
  ADMIN_ACTIONS,
  ADMIN_TARGET_TYPES,
} from "@/lib/admin/activity-log";
import { logAdminAction } from "@/lib/admin/log-admin-action";
import type { SavedAddressData, SavedPaymentData } from "@/lib/mock-storage";
import { syncAuthUserToPublicProfile } from "@/lib/auth/sync-user-profile";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getDealUuidById } from "@/lib/services/deals";
import { computeJoinedPriceForDealSlug } from "@/lib/pricing/compute-joined-price";
import { isDealClosed, isDealSoldOut } from "@/lib/deals";
import { getSavedPaymentMethodForUser } from "@/lib/data/saved-payment-methods";
import { getUserOrderedQuantityForProduct } from "@/lib/data/inventory";
import { isPaymentMethod } from "@/lib/payments/payment-methods";
import { normalizePaymentFlow } from "@/lib/payments/payment-flow";
import { isNormalProduct } from "@/lib/products/product-type";
import {
  inventoryFromDeal,
  validateOrderQuantity,
} from "@/lib/products/inventory";
import {
  isValidOrderQuantity,
  normalizeOrderQuantity,
} from "@/lib/security/order-quantity";

async function ensurePublicUserProfile(user: NonNullable<Awaited<ReturnType<typeof getServerAuthUser>>>) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return;
  }

  await syncAuthUserToPublicProfile(user, supabase);
}

export async function submitPriceAlertAction(input: CreatePriceAlertInput) {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false, error: "login_required" as const };
  }

  if (
    input.targetPrice != null &&
    (!Number.isFinite(input.targetPrice) || input.targetPrice <= 0)
  ) {
    return { success: false, error: "invalid_target_price" as const };
  }

  await ensurePublicUserProfile(user);

  const result = await createPriceAlert({
    ...input,
    userId: user.id,
  });

  if (result.success) {
    revalidatePath("/mypage/alerts");
  }

  return result;
}

export async function submitUserAlertAction(input: CreateUserAlertInput) {
  const user = await getServerAuthUser();

  if (!user) {
    return { success: false, error: "login_required" as const };
  }

  if (!Number.isFinite(input.targetPrice) || input.targetPrice <= 0) {
    return { success: false, error: "invalid_target_price" as const };
  }

  await ensurePublicUserProfile(user);

  const result = await createUserAlert(user.id, input);

  if (result.success) {
    revalidatePath("/mypage/alerts");
  }

  return result;
}

export async function submitParticipationAction(input: CreateParticipationInput) {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false, error: "login_required" as const };
  }

  return createParticipation({
    ...input,
    userId: user.id,
  });
}

export async function submitGroupBuyOrderAction(input: CreateOrderInput) {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false, error: "login_required" as const };
  }

  if (!isPaymentMethod(input.paymentMethod)) {
    return { success: false, error: "invalid_payment_method" as const };
  }

  const paymentFlow = normalizePaymentFlow(input.paymentFlow);
  if (paymentFlow === "post_deadline_auto") {
    if (input.paymentMethod !== "card") {
      return { success: false, error: "invalid_payment_method" as const };
    }

    if (!input.savedPaymentMethodId) {
      return { success: false, error: "auto_pay_card_required" as const };
    }

    const savedMethod = await getSavedPaymentMethodForUser(user.id, input.savedPaymentMethodId);
    if (!savedMethod || savedMethod.status !== "active") {
      return { success: false, error: "auto_pay_card_required" as const };
    }
  }

  await ensurePublicUserProfile(user);

  const deal = await getDealById(input.productSlug);
  if (!deal) {
    return { success: false, error: "deal_not_found" as const };
  }

  if (isNormalProduct(deal.productType)) {
    return { success: false, error: "invalid_product_type" as const };
  }

  if (isDealClosed(deal)) {
    return { success: false, error: "deal_closed" as const };
  }

  if (isDealSoldOut(deal)) {
    return { success: false, error: "sold_out" as const };
  }

  const [hasAddress, alreadyOrdered] = await Promise.all([
    userHasAnyAddress(user.id),
    userHasOrderForProduct(user.id, deal.slug),
  ]);

  if (!hasAddress) {
    return { success: false, error: "profile_incomplete" as const };
  }

  if (!input.addressId || !(await validateAddressOwnership(input.addressId, user.id))) {
    return { success: false, error: "profile_incomplete" as const };
  }

  const ordererCheck = await validateOrdererInfoForUser(user.id, { hasAddress: true });
  if (!ordererCheck.ok) {
    return { success: false, error: "orderer_incomplete" as const };
  }

  if (alreadyOrdered) {
    return { success: false, error: "already_ordered" as const };
  }

  const hasConsents = await userHasRequiredConsents(user.id);
  if (!hasConsents) {
    return { success: false, error: "consent_required" as const };
  }

  const priced = await computeJoinedPriceForDealSlug(deal.slug);
  if (!priced) {
    return { success: false, error: "deal_not_found" as const };
  }

  if (input.quantity != null && !isValidOrderQuantity(input.quantity)) {
    return { success: false, error: "invalid_quantity" as const };
  }

  const quantity = normalizeOrderQuantity(input.quantity);
  const inventory = inventoryFromDeal(deal);
  const userExistingQty = await getUserOrderedQuantityForProduct(user.id, deal.slug);
  const qtyValidation = validateOrderQuantity(inventory, quantity, userExistingQty);

  if (!qtyValidation.ok) {
    if (qtyValidation.error === "sold_out") {
      return { success: false, error: "sold_out" as const };
    }
    if (
      qtyValidation.error === "insufficient_stock" ||
      qtyValidation.error === "insufficient_capacity"
    ) {
      return { success: false, error: "insufficient_stock" as const };
    }
    if (qtyValidation.error === "per_user_limit_exceeded") {
      return { success: false, error: "quantity_limit_exceeded" as const };
    }
    return { success: false, error: "invalid_quantity" as const };
  }

  const result = await createOrder(user.id, {
    productSlug: deal.slug,
    productName: priced.dealTitle,
    joinedPrice: priced.price,
    currentMembers: deal.participants,
    targetMembers: deal.targetParticipants,
    quantity,
    dealId: await getDealUuidById(deal.slug),
    paymentMethod: input.paymentMethod,
    paymentFlow,
    savedPaymentMethodId: input.savedPaymentMethodId,
    productType: deal.productType,
    addressId: input.addressId,
    deliveryMemo: input.deliveryMemo,
    couponCode: input.couponCode,
    pointAmount: input.pointAmount,
  });

  if (result.success) {
    await createParticipation({
      dealId: deal.slug,
      userId: user.id,
    });
    await removeJoinCartItemByProductSlug(user.id, deal.slug);
    revalidatePath("/mypage/orders");
    revalidatePath("/join-cart");
    revalidatePath(`/checkout/${deal.slug}`);
  } else if (result.error === "save_failed") {
    void logError({
      level: "error",
      source: "checkout",
      message: "Group buy checkout failed",
      userId: user.id,
      productId: deal.slug,
      metadata: { error: result.error },
    });
  } else if (result.error === "invalid_coupon") {
    return { success: false, error: "invalid_coupon" as const };
  } else if (result.error === "insufficient_points") {
    return { success: false, error: "insufficient_points" as const };
  }

  return result;
}

export async function submitNormalOrderAction(input: CreateOrderInput) {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false, error: "login_required" as const };
  }

  if (!isPaymentMethod(input.paymentMethod)) {
    return { success: false, error: "invalid_payment_method" as const };
  }

  await ensurePublicUserProfile(user);

  const deal = await getDealById(input.productSlug);
  if (!deal) {
    return { success: false, error: "deal_not_found" as const };
  }

  if (!isNormalProduct(deal.productType)) {
    return { success: false, error: "invalid_product_type" as const };
  }

  if (isDealClosed(deal)) {
    return { success: false, error: "deal_closed" as const };
  }

  if (isDealSoldOut(deal)) {
    return { success: false, error: "sold_out" as const };
  }

  const [hasAddress, alreadyOrdered] = await Promise.all([
    userHasAnyAddress(user.id),
    userHasOrderForProduct(user.id, deal.slug),
  ]);

  if (!hasAddress) {
    return { success: false, error: "profile_incomplete" as const };
  }

  if (!input.addressId || !(await validateAddressOwnership(input.addressId, user.id))) {
    return { success: false, error: "profile_incomplete" as const };
  }

  const ordererCheck = await validateOrdererInfoForUser(user.id, { hasAddress: true });
  if (!ordererCheck.ok) {
    return { success: false, error: "orderer_incomplete" as const };
  }

  if (alreadyOrdered) {
    return { success: false, error: "already_ordered" as const };
  }

  const hasConsents = await userHasRequiredConsents(user.id);
  if (!hasConsents) {
    return { success: false, error: "consent_required" as const };
  }

  if (input.quantity != null && !isValidOrderQuantity(input.quantity)) {
    return { success: false, error: "invalid_quantity" as const };
  }

  const quantity = normalizeOrderQuantity(input.quantity);
  const inventory = inventoryFromDeal(deal);
  const userExistingQty = await getUserOrderedQuantityForProduct(user.id, deal.slug);
  const qtyValidation = validateOrderQuantity(inventory, quantity, userExistingQty);

  if (!qtyValidation.ok) {
    if (qtyValidation.error === "sold_out") {
      return { success: false, error: "sold_out" as const };
    }
    if (
      qtyValidation.error === "insufficient_stock" ||
      qtyValidation.error === "insufficient_capacity"
    ) {
      return { success: false, error: "insufficient_stock" as const };
    }
    if (qtyValidation.error === "per_user_limit_exceeded") {
      return { success: false, error: "quantity_limit_exceeded" as const };
    }
    return { success: false, error: "invalid_quantity" as const };
  }

  const result = await createOrder(user.id, {
    productSlug: deal.slug,
    productName: deal.title,
    joinedPrice: deal.groupPrice,
    currentMembers: deal.participants,
    targetMembers: deal.targetParticipants,
    quantity,
    dealId: await getDealUuidById(deal.slug),
    paymentMethod: input.paymentMethod,
    productType: deal.productType,
    addressId: input.addressId,
    deliveryMemo: input.deliveryMemo,
    couponCode: input.couponCode,
    pointAmount: input.pointAmount,
  });

  if (result.success) {
    revalidatePath("/mypage/orders");
    revalidatePath(`/checkout/${deal.slug}`);
  } else if (result.error === "save_failed") {
    void logError({
      level: "error",
      source: "checkout",
      message: "Normal product checkout failed",
      userId: user.id,
      productId: deal.slug,
      metadata: { error: result.error },
    });
  }

  return result;
}

export async function toggleSavedDealAction(dealSlug: string) {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false, error: "login_required" as const, saved: false };
  }

  await ensurePublicUserProfile(user);

  const result = await toggleSavedDealForUser(user.id, dealSlug);

  if (result.success) {
    revalidatePath("/saved");
  }

  return result;
}

export async function submitReviewAction(input: CreateReviewInput) {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false, error: "login_required" as const };
  }

  await ensurePublicUserProfile(user);

  const result = await createReview(user.id, input);

  if (result.success) {
    revalidatePath(`/product/${input.productId}`);
    revalidatePath("/mypage/reviews");
  }

  return result;
}

export async function submitReviewUpdateAction(input: UpdateReviewInput) {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false, error: "login_required" as const };
  }

  const result = await updateReview(user.id, input);

  if (result.success) {
    revalidatePath(`/product/${input.productId}`);
    revalidatePath("/mypage/reviews");
  }

  return result;
}

export async function submitReviewDeleteAction(input: DeleteReviewInput) {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false, error: "login_required" as const };
  }

  const result = await deleteReview(user.id, input);

  if (result.success) {
    revalidatePath(`/product/${input.productId}`);
    revalidatePath("/mypage/reviews");
  }

  return result;
}

export async function submitReviewReportAction(input: CreateReviewReportInput) {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false, error: "login_required" as const };
  }

  await ensurePublicUserProfile(user);

  if (!isReviewReportReason(input.reason)) {
    return { success: false, error: "invalid_reason" as const };
  }

  const result = await createReviewReport(user.id, {
    reviewId: input.reviewId,
    reason: input.reason,
  });

  return result;
}

export async function updateAdminOrderAction(input: UpdateAdminOrderInput) {
  const user = await getServerAuthUser();
  if (!user || !(await isAdminUser(user))) {
    return { success: false, error: "forbidden" as const };
  }

  const before = await getAdminOrderById(input.orderId);
  const result = await updateAdminOrder(input);

  if (result.success && before) {
    const after = await getAdminOrderById(input.orderId);

    const orderSnapshot = (order: typeof before | null) =>
      order
        ? {
            orderId: order.id,
            orderStatus: order.orderStatus,
            paymentStatus: order.paymentStatus,
            shippingStatus: order.shippingStatus,
            courierCompany: order.courierCompany,
            trackingNumber: order.trackingNumber,
            adminMemo: order.adminMemo,
          }
        : null;

    const beforeSnapshot = orderSnapshot(before);
    const afterSnapshot = after ? orderSnapshot(after) : null;

    if (before.orderStatus !== after?.orderStatus) {
      await logAdminAction({
        adminUserId: user.id,
        action: ADMIN_ACTIONS.ORDER_STATUS_UPDATE,
        targetType: ADMIN_TARGET_TYPES.ORDER,
        targetId: input.orderId,
        beforeData: beforeSnapshot,
        afterData: afterSnapshot,
      });
    }

    const paymentStatusChanged = before.paymentStatus !== after?.paymentStatus;
    const becameRefunded =
      after?.paymentStatus === "refunded" || after?.orderStatus === "refunded";

    if (paymentStatusChanged) {
      await logAdminAction({
        adminUserId: user.id,
        action: becameRefunded ? ADMIN_ACTIONS.REFUND_UPDATE : ADMIN_ACTIONS.PAYMENT_STATUS_UPDATE,
        targetType: ADMIN_TARGET_TYPES.ORDER,
        targetId: input.orderId,
        beforeData: beforeSnapshot,
        afterData: afterSnapshot,
      });
    } else if (before.orderStatus !== after?.orderStatus && after?.orderStatus === "refunded") {
      await logAdminAction({
        adminUserId: user.id,
        action: ADMIN_ACTIONS.REFUND_UPDATE,
        targetType: ADMIN_TARGET_TYPES.ORDER,
        targetId: input.orderId,
        beforeData: beforeSnapshot,
        afterData: afterSnapshot,
      });
    }

    if (
      before.shippingStatus !== after?.shippingStatus ||
      before.courierCompany !== after?.courierCompany ||
      before.trackingNumber !== after?.trackingNumber
    ) {
      await logAdminAction({
        adminUserId: user.id,
        action: ADMIN_ACTIONS.SHIPPING_UPDATE,
        targetType: ADMIN_TARGET_TYPES.ORDER,
        targetId: input.orderId,
        beforeData: beforeSnapshot,
        afterData: afterSnapshot,
      });
    }
  }

  if (!result.success && result.error === "save_failed") {
    void logError({
      level: "error",
      source:
        input.orderStatus === "refunded" || input.paymentStatus === "refunded"
          ? "payment"
          : "shipping",
      message: "Admin order update failed",
      orderId: input.orderId,
      metadata: {
        orderStatus: input.orderStatus,
        paymentStatus: input.paymentStatus,
        shippingStatus: input.shippingStatus,
      },
    });
  }

  if (result.success) {
    revalidatePath("/admin/orders");
    revalidatePath("/admin/refunds");
    revalidatePath("/mypage/orders");
    revalidatePath("/notifications");
  }

  return result;
}

export async function adminProcessOrderClaimAction(input: {
  orderId: string;
  claimType: AdminOrderClaimType;
  reason: string;
  partialAmount?: number | null;
}) {
  const user = await getServerAuthUser();
  if (!user || !(await isAdminUser(user))) {
    return { success: false, error: "forbidden" as const };
  }

  const before = await getAdminOrderById(input.orderId);
  const result = await processAdminOrderClaim(input);

  if (result.success && before) {
    await logAdminAction({
      adminUserId: user.id,
      action:
        input.claimType === "cancel" ?
          ADMIN_ACTIONS.ORDER_STATUS_UPDATE
        : ADMIN_ACTIONS.REFUND_UPDATE,
      targetType: ADMIN_TARGET_TYPES.ORDER,
      targetId: input.orderId,
      beforeData: { orderId: before.id, orderStatus: before.orderStatus },
      afterData: {
        orderId: input.orderId,
        claimType: input.claimType,
        reason: input.reason.trim(),
        partialAmount: input.partialAmount ?? null,
      },
    });
    revalidatePath("/admin/orders");
    revalidatePath("/admin/refunds");
    revalidatePath("/mypage/orders");
    revalidatePath("/notifications");
  }

  return result;
}

export async function confirmPurchaseAction(orderId: string) {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false, error: "login_required" as const };
  }

  const result = await confirmPurchaseForUser(user.id, orderId);

  if (result.success) {
    revalidatePath("/mypage/orders");
    revalidatePath("/mypage/reviews");
    revalidatePath("/notifications");
    revalidatePath("/product/[id]", "page");
  }

  return result;
}

export async function toggleReviewLikeAction(reviewId: string) {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false, error: "login_required" as const };
  }

  await ensurePublicUserProfile(user);

  const result = await toggleReviewLikeForUser(user.id, reviewId);

  if (result.success) {
    revalidatePath("/product/[id]", "page");
  }

  return result;
}

export async function saveAddressAction(input: SavedAddressData) {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false, error: "login_required" as const };
  }

  await ensurePublicUserProfile(user);

  return saveDefaultAddressForUser(user.id, input);
}

export async function savePaymentAction(input: SavedPaymentData) {
  const user = await getServerAuthUser();
  if (!user) {
    return { success: false, error: "login_required" as const };
  }

  await ensurePublicUserProfile(user);

  return saveDefaultPaymentForUser(user.id, input);
}
