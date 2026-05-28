"use server";

import { revalidatePath } from "next/cache";

import {
  ADMIN_ACTIONS,
  ADMIN_TARGET_TYPES,
} from "@/lib/admin/activity-log";
import { logAdminAction } from "@/lib/admin/log-admin-action";
import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getPaymentById, getPaymentByOrderId } from "@/lib/data/payments";
import {
  syncOrderPaymentStatus,
  updatePaymentStatus,
  type PaymentRecordStatus,
} from "@/lib/payments";
import { isPaymentRecordStatus } from "@/lib/payments/payment-status";

export type UpdatePaymentStatusActionResult = {
  success: boolean;
  error?: "login_required" | "forbidden" | "invalid_input" | "not_found" | "save_failed";
};

export type SyncOrderPaymentStatusActionResult = {
  success: boolean;
  paymentStatus?: PaymentRecordStatus;
  error?: "login_required" | "forbidden" | "not_found" | "save_failed";
};

async function ensureAdminUser() {
  const user = await getServerAuthUser();
  if (!user) {
    return { ok: false as const, error: "login_required" as const };
  }

  if (!(await isAdminUser(user))) {
    return { ok: false as const, error: "forbidden" as const };
  }

  return { ok: true as const, user };
}

function mapPaymentActionError(
  error: "not_configured" | "save_failed" | "invalid_input" | "not_found" | undefined,
): "save_failed" | "invalid_input" | "not_found" {
  if (error === "invalid_input" || error === "not_found") {
    return error;
  }

  return "save_failed";
}

function mapSyncPaymentActionError(
  error: "not_configured" | "save_failed" | "not_found" | undefined,
): "save_failed" | "not_found" {
  return error === "not_found" ? "not_found" : "save_failed";
}

function paymentLogSnapshot(payment: Awaited<ReturnType<typeof getPaymentById>>) {
  if (!payment) {
    return null;
  }

  return {
    paymentId: payment.id,
    orderId: payment.orderId,
    status: payment.status,
    requestedAmount: payment.requestedAmount,
    confirmedAmount: payment.confirmedAmount,
    method: payment.method,
  };
}

export async function updatePaymentStatusAction(input: {
  paymentId: string;
  status: string;
  confirmedAmount?: number | null;
  paymentProvider?: string | null;
  paymentKey?: string | null;
  method?: string | null;
}): Promise<UpdatePaymentStatusActionResult> {
  const auth = await ensureAdminUser();
  if (!auth.ok) {
    return { success: false, error: auth.error };
  }

  if (!isPaymentRecordStatus(input.status)) {
    return { success: false, error: "invalid_input" };
  }

  const before = await getPaymentById(input.paymentId);
  const result = await updatePaymentStatus({
    paymentId: input.paymentId,
    status: input.status,
    confirmedAmount: input.confirmedAmount,
    paymentProvider: input.paymentProvider,
    paymentKey: input.paymentKey,
    method: input.method,
  });

  if (!result.success) {
    return { success: false, error: mapPaymentActionError(result.error) };
  }

  const after = await getPaymentById(input.paymentId);
  const action = input.status === "refunded" ? ADMIN_ACTIONS.REFUND_UPDATE : ADMIN_ACTIONS.PAYMENT_STATUS_UPDATE;

  await logAdminAction({
    adminUserId: auth.user.id,
    action,
    targetType: ADMIN_TARGET_TYPES.PAYMENT,
    targetId: input.paymentId,
    beforeData: paymentLogSnapshot(before),
    afterData: paymentLogSnapshot(after),
  });

  revalidatePath("/admin/orders");
  revalidatePath("/admin/payments");
  revalidatePath("/mypage/orders");

  return { success: true };
}

export async function syncOrderPaymentStatusAction(
  orderId: string,
): Promise<SyncOrderPaymentStatusActionResult> {
  const auth = await ensureAdminUser();
  if (!auth.ok) {
    return { success: false, error: auth.error };
  }

  const payment = await getPaymentByOrderId(orderId);
  if (!payment) {
    return { success: false, error: "not_found" };
  }

  const before = paymentLogSnapshot(payment);
  const result = await syncOrderPaymentStatus(orderId);
  if (!result.success) {
    return { success: false, error: mapSyncPaymentActionError(result.error) };
  }

  const afterPayment = await getPaymentByOrderId(orderId);
  await logAdminAction({
    adminUserId: auth.user.id,
    action: ADMIN_ACTIONS.PAYMENT_STATUS_UPDATE,
    targetType: ADMIN_TARGET_TYPES.PAYMENT,
    targetId: afterPayment?.id ?? payment.id,
    beforeData: before,
    afterData: paymentLogSnapshot(afterPayment),
  });

  revalidatePath("/admin/orders");
  revalidatePath("/admin/payments");
  revalidatePath("/mypage/orders");

  return { success: true, paymentStatus: result.paymentStatus };
}
