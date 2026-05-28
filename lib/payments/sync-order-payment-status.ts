import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  normalizePaymentRecordStatus,
  type PaymentRecordStatus,
} from "@/lib/payments/payment-status";

export type SyncOrderPaymentStatusResult = {
  success: boolean;
  paymentStatus?: PaymentRecordStatus;
  error?: "not_configured" | "not_found" | "save_failed";
};

/** Mirrors the latest payment record status onto orders.payment_status. */
export async function syncOrderPaymentStatus(
  orderId: string,
): Promise<SyncOrderPaymentStatusResult> {
  if (!isSupabaseConfigured()) {
    return { success: true, paymentStatus: "ready" };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "not_configured" };
  }

  const { data, error } = await supabase.rpc("sync_order_payment_status", {
    p_order_id: orderId,
  });

  if (error) {
    console.error("[payments] syncOrderPaymentStatus:", error.message);
    return { success: false, error: "save_failed" };
  }

  if (data == null) {
    return { success: false, error: "not_found" };
  }

  return {
    success: true,
    paymentStatus: normalizePaymentRecordStatus(data as string),
  };
}
