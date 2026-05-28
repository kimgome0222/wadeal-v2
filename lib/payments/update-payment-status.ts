import type { Json } from "@/lib/database/types";
import {
  notifyPaymentPaid,
} from "@/lib/notifications";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  isPaymentRecordStatus,
  type PaymentRecordStatus,
} from "@/lib/payments/payment-status";

export type UpdatePaymentStatusInput = {
  paymentId: string;
  status: PaymentRecordStatus;
  confirmedAmount?: number | null;
  paymentProvider?: string | null;
  paymentKey?: string | null;
  method?: string | null;
  rawResponse?: Json | null;
};

export type UpdatePaymentStatusResult = {
  success: boolean;
  error?: "not_configured" | "invalid_input" | "not_found" | "save_failed";
};

export async function updatePaymentStatus(
  input: UpdatePaymentStatusInput,
): Promise<UpdatePaymentStatusResult> {
  if (!isPaymentRecordStatus(input.status)) {
    return { success: false, error: "invalid_input" };
  }

  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "not_configured" };
  }

  const { data, error } = await supabase.rpc("update_payment_status", {
    p_payment_id: input.paymentId,
    p_status: input.status,
    p_confirmed_amount: input.confirmedAmount ?? null,
    p_payment_provider: input.paymentProvider ?? null,
    p_payment_key: input.paymentKey ?? null,
    p_method: input.method ?? null,
    p_raw_response: input.rawResponse ?? null,
  });

  if (error) {
    console.error("[payments] updatePaymentStatus:", error.message);
    return { success: false, error: "save_failed" };
  }

  if (data !== true) {
    return { success: false, error: "not_found" };
  }

  if (input.status === "paid") {
    const { data: paymentRow } = await supabase
      .from("payments")
      .select("user_id, requested_amount, confirmed_amount, order_id")
      .eq("id", input.paymentId)
      .maybeSingle();

    if (paymentRow) {
      const { data: orderRow } = await supabase
        .from("orders")
        .select("product_name")
        .eq("id", paymentRow.order_id as string)
        .maybeSingle();

      if (orderRow) {
        await notifyPaymentPaid({
          userId: paymentRow.user_id as string,
          productName: orderRow.product_name as string,
          amount:
            (paymentRow.confirmed_amount as number | null) ??
            (paymentRow.requested_amount as number),
        });
      }
    }
  }

  return { success: true };
}
