import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type PreparePaymentAfterFinalizeResult = {
  success: boolean;
  error?: "not_configured" | "save_failed";
};

/**
 * After deal close, set payment requested_amount to the confirmed final_price
 * while keeping status ready until PG capture.
 */
export async function preparePaymentAfterFinalize(
  orderId: string,
  finalAmount: number,
): Promise<PreparePaymentAfterFinalizeResult> {
  if (!Number.isFinite(finalAmount) || finalAmount < 0) {
    return { success: false, error: "save_failed" };
  }

  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "not_configured" };
  }

  const { error } = await supabase.rpc("prepare_payment_after_finalize", {
    p_order_id: orderId,
    p_final_amount: Math.round(finalAmount),
  });

  if (error) {
    console.error("[payments] preparePaymentAfterFinalize:", error.message);
    return { success: false, error: "save_failed" };
  }

  return { success: true };
}
