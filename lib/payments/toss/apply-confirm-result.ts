import { commitDiscounts } from "@/lib/discounts/points";
import type { Json, OrderRow } from "@/lib/database/types";
import { appendOrderTimeline } from "@/lib/data/order-timelines";
import { notifyPaymentPaid } from "@/lib/notifications/order-events";
import type { PaymentRecordStatus } from "@/lib/payments/payment-status";
import { mapTossMethodToWadeal } from "@/lib/payments/toss/map-method";
import type { TossPaymentWebhookData } from "@/lib/payments/toss/types";
import { updatePaymentStatus } from "@/lib/payments/update-payment-status";
import { isNormalProduct } from "@/lib/products/product-type";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type ApplyConfirmResult =
  | {
      success: true;
      paymentStatus: PaymentRecordStatus;
      alreadyProcessed?: boolean;
    }
  | {
      success: false;
      error:
        | "not_configured"
        | "payment_not_found"
        | "amount_mismatch"
        | "save_failed";
    };

function resolvePaymentStatusFromToss(
  tossPayment: TossPaymentWebhookData,
  wadealMethod: string | null,
): PaymentRecordStatus {
  const tossStatus = tossPayment.status?.toUpperCase();

  if (
    tossStatus === "WAITING_FOR_DEPOSIT" ||
    wadealMethod === "virtual_account"
  ) {
    return "waiting_deposit";
  }

  return "paid";
}

export async function applyTossConfirmResult(input: {
  orderId: string;
  paymentId: string;
  expectedAmount: number;
  tossPayment: TossPaymentWebhookData;
}): Promise<ApplyConfirmResult> {
  const confirmedAmount = input.tossPayment.totalAmount;
  if (
    confirmedAmount == null ||
    !Number.isFinite(confirmedAmount) ||
    Math.round(confirmedAmount) !== Math.round(input.expectedAmount)
  ) {
    return { success: false, error: "amount_mismatch" };
  }

  const wadealMethod = mapTossMethodToWadeal(input.tossPayment.method);
  const paymentStatus = resolvePaymentStatusFromToss(input.tossPayment, wadealMethod);
  const rawResponse = input.tossPayment as unknown as Json;

  const current = await getPaymentRecord(input.paymentId);
  if (!current) {
    return { success: false, error: "payment_not_found" };
  }

  if (current.status === "paid" && paymentStatus === "paid") {
    return { success: true, paymentStatus: "paid", alreadyProcessed: true };
  }

  if (current.status === "waiting_deposit" && paymentStatus === "waiting_deposit") {
    return { success: true, paymentStatus: "waiting_deposit", alreadyProcessed: true };
  }

  const updateResult = await updatePaymentStatus({
    paymentId: input.paymentId,
    status: paymentStatus,
    confirmedAmount: Math.round(confirmedAmount),
    paymentProvider: "toss",
    paymentKey: input.tossPayment.paymentKey ?? null,
    method: wadealMethod ?? current.method,
    rawResponse,
  });

  if (!updateResult.success) {
    return { success: false, error: "save_failed" };
  }

  await patchOrderAfterConfirm({
    orderId: input.orderId,
    paymentStatus,
    method: wadealMethod,
  });

  if (paymentStatus === "paid") {
    await appendOrderTimeline({
      orderId: input.orderId,
      status: "paid",
      title: "결제 완료",
      message: `${Math.round(confirmedAmount).toLocaleString("ko-KR")}원`,
    });
    await commitDiscounts(input.orderId);
    const order = await getOrderSummary(input.orderId);
    if (order) {
      await notifyPaymentPaid({
        userId: order.user_id,
        productName: order.product_name,
        amount: Math.round(confirmedAmount),
      });
    }
  } else if (paymentStatus === "waiting_deposit") {
    await appendOrderTimeline({
      orderId: input.orderId,
      status: "paid",
      title: "입금 대기",
      message: "가상계좌 입금 확인 후 배송이 시작돼요.",
    });
  }

  return { success: true, paymentStatus };
}

async function getPaymentRecord(paymentId: string) {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data } = await supabase
    .from("payments")
    .select("id, status, method")
    .eq("id", paymentId)
    .maybeSingle();

  return data as { id: string; status: string; method: string | null } | null;
}

async function getOrderSummary(orderId: string) {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data } = await supabase
    .from("orders")
    .select("user_id, product_name, product_type, shipping_status")
    .eq("id", orderId)
    .maybeSingle();

  return data as {
    user_id: string;
    product_name: string;
    product_type: string | null;
    shipping_status: string;
  } | null;
}

async function patchOrderAfterConfirm(input: {
  orderId: string;
  paymentStatus: PaymentRecordStatus;
  method: string | null;
}) {
  if (!isSupabaseConfigured()) {
    return;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return;
  }

  const { data: order } = await supabase
    .from("orders")
    .select("product_type, order_status, shipping_status")
    .eq("id", input.orderId)
    .maybeSingle();

  if (!order) {
    return;
  }

  const patch: Partial<OrderRow> = {
    payment_status: input.paymentStatus,
  };

  if (input.method) {
    patch.payment_method = input.method;
  }

  if (input.paymentStatus === "paid") {
    patch.paid_at = new Date().toISOString();
    patch.order_status = "confirmed";

    if (
      isNormalProduct(order.product_type as string) &&
      (order.shipping_status as string) === "none"
    ) {
      patch.shipping_status = "preparing";
    }
  } else if (input.paymentStatus === "waiting_deposit") {
    patch.order_status = "confirmed";
  }

  await supabase.from("orders").update(patch).eq("id", input.orderId);
}
