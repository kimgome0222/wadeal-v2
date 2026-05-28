import type { PaymentMethod } from "@/lib/payments/payment-methods";
import { isVirtualAccountMethod } from "@/lib/payments/payment-methods";
import type { PaymentStatus } from "@/lib/orders/order-status";
import { updatePaymentStatus } from "@/lib/payments/update-payment-status";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type ProcessInstantPaymentResult = {
  success: boolean;
  paymentStatus?: PaymentStatus;
  error?: "save_failed";
};

/**
 * Stub PG capture for normal-product checkout.
 * Virtual account stays in waiting_deposit until deposit confirmation.
 */
export async function processInstantPayment(input: {
  orderId: string;
  paymentId: string;
  paymentMethod: PaymentMethod;
  amount: number;
}): Promise<ProcessInstantPaymentResult> {
  const amount = Math.round(input.amount);

  if (isVirtualAccountMethod(input.paymentMethod)) {
    if (!isSupabaseConfigured()) {
      return { success: true, paymentStatus: "waiting_deposit" };
    }

    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return { success: false, error: "save_failed" };
    }

    const { error: paymentError } = await supabase
      .from("payments")
      .update({
        status: "waiting_deposit",
        method: input.paymentMethod,
        requested_amount: amount,
        amount,
        updated_at: new Date().toISOString(),
      })
      .eq("id", input.paymentId);

    if (paymentError) {
      console.error("[payments] processInstantPayment virtual_account:", paymentError.message);
      return { success: false, error: "save_failed" };
    }

    const { error: orderError } = await supabase
      .from("orders")
      .update({
        payment_status: "waiting_deposit",
        payment_method: input.paymentMethod,
      })
      .eq("id", input.orderId);

    if (orderError) {
      console.error("[payments] processInstantPayment order:", orderError.message);
      return { success: false, error: "save_failed" };
    }

    return { success: true, paymentStatus: "waiting_deposit" };
  }

  const updateResult = await updatePaymentStatus({
    paymentId: input.paymentId,
    status: "paid",
    method: input.paymentMethod,
    confirmedAmount: amount,
    paymentProvider: "stub",
  });

  if (!updateResult.success) {
    return { success: false, error: "save_failed" };
  }

  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      await supabase
        .from("orders")
        .update({
          payment_status: "paid",
          payment_method: input.paymentMethod,
          paid_at: new Date().toISOString(),
        })
        .eq("id", input.orderId);
    }
  }

  return { success: true, paymentStatus: "paid" };
}

/**
 * Group-buy virtual accounts are issued after deal finalize (PG integration pending).
 */
export async function prepareGroupBuyVirtualAccountAfterFinalize(input: {
  orderId: string;
  paymentId: string;
  amount: number;
}): Promise<ProcessInstantPaymentResult> {
  if (!isSupabaseConfigured()) {
    return { success: true, paymentStatus: "waiting_deposit" };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "save_failed" };
  }

  const amount = Math.round(input.amount);
  const { error } = await supabase
    .from("payments")
    .update({
      status: "waiting_deposit",
      requested_amount: amount,
      amount,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.paymentId);

  if (error) {
    console.error("[payments] prepareGroupBuyVirtualAccountAfterFinalize:", error.message);
    return { success: false, error: "save_failed" };
  }

  await supabase
    .from("orders")
    .update({ payment_status: "waiting_deposit" })
    .eq("id", input.orderId);

  return { success: true, paymentStatus: "waiting_deposit" };
}
