import type { OrderRow } from "@/lib/database/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type CreatePendingPaymentInput = Pick<
  OrderRow,
  "id" | "user_id" | "deal_id" | "product_id" | "joined_price" | "quantity"
> & {
  paymentMethod?: string | null;
};

export type CreatePendingPaymentResult = {
  success: boolean;
  paymentId?: string;
  error?: "not_configured" | "save_failed";
};

/**
 * Creates a ready-state payment record when a user joins a group buy.
 * Amounts are derived server-side from the order (joined_price × quantity).
 */
export async function createPendingPayment(
  order: CreatePendingPaymentInput,
): Promise<CreatePendingPaymentResult> {
  if (!isSupabaseConfigured()) {
    return { success: true, paymentId: `mock-payment-${order.id}` };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "not_configured" };
  }

  const { data, error } = await supabase.rpc("create_pending_payment_for_order", {
    p_order_id: order.id,
    p_method: order.paymentMethod ?? null,
  });

  if (error) {
    console.error("[payments] createPendingPayment:", error.message);
    return { success: false, error: "save_failed" };
  }

  return { success: true, paymentId: data as string };
}
