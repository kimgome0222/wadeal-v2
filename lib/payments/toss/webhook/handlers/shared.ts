import type { Json } from "@/lib/database/types";
import {
  notifySellerOnOrderPaid,
} from "@/lib/notifications/seller-events";
import { notifyAdminPaymentWebhookFailed } from "@/lib/notifications/admin-events";
import {
  notifyDepositCompleted,
  notifyPaymentApproved,
  notifyPaymentFailed,
  notifyRefundCompleted,
} from "@/lib/notifications/webhook-events";
import type { PaymentRecordStatus } from "@/lib/payments/payment-status";
import { normalizePaymentRecordStatus } from "@/lib/payments/payment-status";
import { isNormalProduct } from "@/lib/products/product-type";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/service-role";
import type { PaymentLookupResult } from "@/lib/payments/toss/webhook/webhook-logs";

export type WebhookHandlerResult =
  | { outcome: "processed" }
  | { outcome: "skipped"; reason: string }
  | { outcome: "failed"; error: string };

type ApplyPaymentStatusInput = {
  lookup: PaymentLookupResult;
  status: PaymentRecordStatus;
  confirmedAmount?: number | null;
  paymentKey?: string | null;
  method?: string | null;
  rawResponse?: Json | null;
  setShippingPreparing?: boolean;
  notification?: "deposit" | "paid" | "failed" | "refund" | "none";
};

async function applyPaymentStatusChange(
  input: ApplyPaymentStatusInput,
): Promise<WebhookHandlerResult> {
  const supabase = createServiceRoleSupabaseClient();
  if (!supabase) {
    return { outcome: "failed", error: "service_role_not_configured" };
  }

  const currentStatus = normalizePaymentRecordStatus(input.lookup.payment.status);

  if (input.status === "paid" && currentStatus === "paid") {
    return { outcome: "skipped", reason: "payment_already_paid" };
  }

  const { data: updated, error } = await supabase.rpc("update_payment_status", {
    p_payment_id: input.lookup.payment.id,
    p_status: input.status,
    p_confirmed_amount: input.confirmedAmount ?? null,
    p_payment_provider: "toss",
    p_payment_key: input.paymentKey ?? input.lookup.payment.payment_key,
    p_method: input.method ?? input.lookup.payment.method,
    p_raw_response: input.rawResponse ?? null,
  });

  if (error) {
    console.error("[webhook] update_payment_status:", error.message);
    await notifyAdminPaymentWebhookFailed({
      detail: `결제 상태 업데이트 실패: ${error.message}`,
    });
    return { outcome: "failed", error: error.message };
  }

  if (updated !== true) {
    return { outcome: "failed", error: "payment_not_found" };
  }

  const now = new Date().toISOString();

  if (input.status === "paid") {
    const paidPatch: {
      paid_at: string;
      order_status: string;
      shipping_status?: string;
    } = {
      paid_at: now,
      order_status: "confirmed",
    };

    if (
      input.setShippingPreparing &&
      isNormalProduct(input.lookup.order.product_type) &&
      input.lookup.order.shipping_status === "none"
    ) {
      paidPatch.shipping_status = "preparing";
    }

    const { error: orderError } = await supabase
      .from("orders")
      .update(paidPatch)
      .eq("id", input.lookup.order.id);

    if (orderError) {
      console.error("[webhook] order patch:", orderError.message);
    }
  } else if (input.status === "waiting_deposit") {
    const { error: orderError } = await supabase
      .from("orders")
      .update({ order_status: "confirmed" })
      .eq("id", input.lookup.order.id);

    if (orderError) {
      console.error("[webhook] order patch:", orderError.message);
    }
  }

  const amount =
    input.confirmedAmount ??
    input.lookup.payment.confirmed_amount ??
    input.lookup.payment.requested_amount;

  if (input.notification === "deposit") {
    await notifyDepositCompleted({
      userId: input.lookup.order.user_id,
      productName: input.lookup.order.product_name,
      amount,
    });
    await notifySellerOnOrderPaid({
      orderId: input.lookup.order.id,
      productId: input.lookup.payment.product_id,
      productName: input.lookup.order.product_name,
      shippingPreparing: input.setShippingPreparing,
    });
  } else if (input.notification === "paid") {
    await notifyPaymentApproved({
      userId: input.lookup.order.user_id,
      productName: input.lookup.order.product_name,
      amount,
    });
    await notifySellerOnOrderPaid({
      orderId: input.lookup.order.id,
      productId: input.lookup.payment.product_id,
      productName: input.lookup.order.product_name,
      shippingPreparing: input.setShippingPreparing,
    });
  } else if (input.notification === "failed") {
    await notifyPaymentFailed({
      userId: input.lookup.order.user_id,
      productName: input.lookup.order.product_name,
    });
  } else if (input.notification === "refund") {
    await notifyRefundCompleted({
      userId: input.lookup.order.user_id,
      productName: input.lookup.order.product_name,
      amount,
    });
  }

  return { outcome: "processed" };
}

export async function handleDepositCompleted(input: {
  lookup: PaymentLookupResult;
  paymentKey?: string | null;
  confirmedAmount?: number | null;
  method?: string | null;
  rawResponse?: Json | null;
}): Promise<WebhookHandlerResult> {
  return applyPaymentStatusChange({
    lookup: input.lookup,
    status: "paid",
    confirmedAmount: input.confirmedAmount,
    paymentKey: input.paymentKey,
    method: input.method ?? "virtual_account",
    rawResponse: input.rawResponse,
    setShippingPreparing: true,
    notification: "deposit",
  });
}

export async function handlePaymentApproved(input: {
  lookup: PaymentLookupResult;
  paymentKey?: string | null;
  confirmedAmount?: number | null;
  method?: string | null;
  rawResponse?: Json | null;
}): Promise<WebhookHandlerResult> {
  return applyPaymentStatusChange({
    lookup: input.lookup,
    status: "paid",
    confirmedAmount: input.confirmedAmount,
    paymentKey: input.paymentKey,
    method: input.method,
    rawResponse: input.rawResponse,
    setShippingPreparing: true,
    notification: "paid",
  });
}

export async function handlePaymentCancelled(input: {
  lookup: PaymentLookupResult;
  rawResponse?: Json | null;
}): Promise<WebhookHandlerResult> {
  return applyPaymentStatusChange({
    lookup: input.lookup,
    status: "cancelled",
    rawResponse: input.rawResponse,
    notification: "none",
  });
}

export async function handlePaymentFailed(input: {
  lookup: PaymentLookupResult;
  rawResponse?: Json | null;
}): Promise<WebhookHandlerResult> {
  return applyPaymentStatusChange({
    lookup: input.lookup,
    status: "failed",
    rawResponse: input.rawResponse,
    notification: "failed",
  });
}

export async function handleRefundCompleted(input: {
  lookup: PaymentLookupResult;
  confirmedAmount?: number | null;
  rawResponse?: Json | null;
}): Promise<WebhookHandlerResult> {
  return applyPaymentStatusChange({
    lookup: input.lookup,
    status: "refunded",
    confirmedAmount: input.confirmedAmount,
    rawResponse: input.rawResponse,
    notification: "refund",
  });
}
