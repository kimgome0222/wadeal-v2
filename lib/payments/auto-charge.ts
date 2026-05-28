import { notifyPaymentFailed, notifyPaymentReady } from "@/lib/notifications/order-events";
import { logError } from "@/lib/monitoring/error-log";
import { normalizePaymentFlow } from "@/lib/payments/payment-flow";
import { chargeWithBillingKey } from "@/lib/payments/toss/billing";
import { updatePaymentStatus } from "@/lib/payments/update-payment-status";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type AutoChargeResult = {
  success: boolean;
  skipped?: boolean;
  error?: "not_configured" | "not_eligible" | "already_paid" | "already_attempted" | "charge_failed" | "save_failed";
  message?: string;
};

type OrderChargeContext = {
  id: string;
  user_id: string;
  product_id: string;
  product_name: string;
  payment_flow: string;
  saved_payment_method_id: string | null;
  final_price: number | null;
  payment_amount: number | null;
  final_payment_amount: number | null;
  quantity: number;
};

type PaymentChargeContext = {
  id: string;
  status: string;
  auto_charge_attempted_at: string | null;
};

/**
 * Attempt auto-charge for a single order after deal finalization.
 * Idempotent: skips if already paid or auto-charge was already attempted.
 */
export async function processAutoChargeForOrder(orderId: string): Promise<AutoChargeResult> {
  if (!isSupabaseConfigured()) {
    return { success: true, skipped: true, message: "Supabase not configured" };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "not_configured" };
  }

  const { data: orderRow, error: orderError } = await supabase
    .from("orders")
    .select(
      "id, user_id, product_id, product_name, payment_flow, saved_payment_method_id, final_price, payment_amount, final_payment_amount, quantity",
    )
    .eq("id", orderId)
    .maybeSingle();

  if (orderError || !orderRow) {
    console.error("[auto-charge] load order:", orderError?.message);
    return { success: false, error: "save_failed" };
  }

  const order = orderRow as unknown as OrderChargeContext;
  const paymentFlow = normalizePaymentFlow(order.payment_flow);

  if (paymentFlow !== "post_deadline_auto") {
    return { success: true, skipped: true, message: "Not an auto-pay order" };
  }

  if (!order.saved_payment_method_id) {
    return { success: false, error: "not_eligible", message: "No saved payment method" };
  }

  const finalAmount =
    order.final_payment_amount ??
    order.payment_amount ??
    order.final_price ??
    0;

  if (!Number.isFinite(finalAmount) || finalAmount <= 0) {
    return { success: false, error: "not_eligible", message: "Final amount not set" };
  }

  const { data: paymentRow, error: paymentError } = await supabase
    .from("payments")
    .select("id, status, auto_charge_attempted_at")
    .eq("order_id", orderId)
    .maybeSingle();

  if (paymentError || !paymentRow) {
    console.error("[auto-charge] load payment:", paymentError?.message);
    return { success: false, error: "save_failed" };
  }

  const payment = paymentRow as unknown as PaymentChargeContext;

  if (payment.status === "paid") {
    return { success: true, skipped: true, error: "already_paid" };
  }

  if (payment.auto_charge_attempted_at) {
    return { success: true, skipped: true, error: "already_attempted" };
  }

  const attemptedAt = new Date().toISOString();
  const { error: markAttemptError } = await supabase
    .from("payments")
    .update({ auto_charge_attempted_at: attemptedAt, updated_at: attemptedAt })
    .eq("id", payment.id)
    .is("auto_charge_attempted_at", null);

  if (markAttemptError) {
    console.error("[auto-charge] mark attempt:", markAttemptError.message);
    return { success: false, error: "save_failed" };
  }

  const { data: billingRows, error: billingError } = await supabase.rpc(
    "get_saved_payment_billing_key",
    { p_method_id: order.saved_payment_method_id },
  );

  if (billingError || !billingRows || !Array.isArray(billingRows) || billingRows.length === 0) {
    console.error("[auto-charge] billing key:", billingError?.message);
    await handleAutoChargeFailure({
      orderId,
      paymentId: payment.id,
      userId: order.user_id,
      productName: order.product_name,
      productSlug: order.product_id,
      amount: finalAmount,
    });
    return { success: false, error: "charge_failed", message: "Billing key not found" };
  }

  const billing = billingRows[0] as {
    billing_key: string;
    provider: string;
    method: string;
    user_id: string;
  };

  const chargeResult = await chargeWithBillingKey({
    billingKey: billing.billing_key,
    customerKey: billing.user_id,
    orderId,
    orderName: order.product_name,
    amount: finalAmount,
  });

  if (!chargeResult.success) {
    await handleAutoChargeFailure({
      orderId,
      paymentId: payment.id,
      userId: order.user_id,
      productName: order.product_name,
      productSlug: order.product_id,
      amount: finalAmount,
      failureReason: chargeResult.error,
    });
    return {
      success: false,
      error: "charge_failed",
      message: chargeResult.error ?? "Auto charge failed",
    };
  }

  const updateResult = await updatePaymentStatus({
    paymentId: payment.id,
    status: "paid",
    method: "card",
    confirmedAmount: finalAmount,
    paymentProvider: billing.provider ?? "toss",
    paymentKey: chargeResult.paymentKey ?? null,
    rawResponse: {
      source: "billing_auto_charge",
      approvedAt: chargeResult.approvedAt ?? null,
    },
  });

  if (!updateResult.success) {
    return { success: false, error: "save_failed" };
  }

  await supabase
    .from("orders")
    .update({
      payment_status: "paid",
      payment_method: "card",
      paid_at: chargeResult.approvedAt ?? new Date().toISOString(),
    })
    .eq("id", orderId);

  return { success: true, message: "Auto charge succeeded" };
}

async function handleAutoChargeFailure(input: {
  orderId: string;
  paymentId: string;
  userId: string;
  productName: string;
  productSlug: string;
  amount: number;
  failureReason?: string;
}): Promise<void> {
  void logError({
    level: "error",
    source: "payment",
    message: `Auto charge failed: ${input.failureReason ?? "unknown"}`,
    userId: input.userId,
    orderId: input.orderId,
    paymentId: input.paymentId,
    productId: input.productSlug,
    metadata: { amount: input.amount, flow: "post_deadline_auto" },
  });

  await updatePaymentStatus({
    paymentId: input.paymentId,
    status: "failed",
    method: "card",
    rawResponse: {
      source: "billing_auto_charge",
      failureReason: input.failureReason ?? null,
    },
  });

  const supabase = await createServerSupabaseClient();
  if (supabase) {
    await supabase
      .from("orders")
      .update({ payment_status: "failed" })
      .eq("id", input.orderId);
  }

  await notifyPaymentFailed({
    userId: input.userId,
    productName: input.productName,
    amount: input.amount,
    checkoutSlug: input.productSlug,
  });

  await notifyPaymentReady({
    userId: input.userId,
    productName: input.productName,
    amount: input.amount,
    orderId: input.orderId,
  });
}

/**
 * Process auto-charge for all auto-pay orders on a deal after finalization.
 */
export async function processAutoChargesForDeal(dealId: string): Promise<{
  processed: number;
  succeeded: number;
  failed: number;
  skipped: number;
}> {
  if (!isSupabaseConfigured()) {
    return { processed: 0, succeeded: 0, failed: 0, skipped: 0 };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { processed: 0, succeeded: 0, failed: 0, skipped: 0 };
  }

  const { data: orders, error } = await supabase
    .from("orders")
    .select("id")
    .eq("deal_id", dealId)
    .eq("payment_flow", "post_deadline_auto")
    .not("order_status", "in", '("cancelled","refunded")');

  if (error || !orders) {
    console.error("[auto-charge] load deal orders:", error?.message);
    return { processed: 0, succeeded: 0, failed: 0, skipped: 0 };
  }

  let succeeded = 0;
  let failed = 0;
  let skipped = 0;

  for (const row of orders) {
    const result = await processAutoChargeForOrder(row.id as string);
    if (result.skipped) {
      skipped += 1;
    } else if (result.success) {
      succeeded += 1;
    } else {
      failed += 1;
    }
  }

  return {
    processed: orders.length,
    succeeded,
    failed,
    skipped,
  };
}
