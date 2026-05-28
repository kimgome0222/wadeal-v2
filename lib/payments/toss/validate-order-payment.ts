import type { PaymentRow } from "@/lib/database/types";
import { computePayableAmountForOrder } from "@/lib/payments/toss/amount";
import { parsePaymentMethodParam } from "@/lib/payments/toss/map-method";
import type { PaymentMethod } from "@/lib/payments/payment-methods";
import { isPaymentMethod } from "@/lib/payments/payment-methods";
import { normalizePaymentFlow } from "@/lib/payments/payment-flow";
import {
  normalizeOrderStatus,
  normalizePaymentStatus,
} from "@/lib/orders/order-status";
import { isNormalProduct } from "@/lib/products/product-type";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type OrderPaymentValidationError =
  | "login_required"
  | "not_configured"
  | "order_not_found"
  | "forbidden"
  | "invalid_payment_method"
  | "already_paid"
  | "not_payable"
  | "amount_unavailable"
  | "auto_pay_scheduled";

export type ValidatedOrderPaymentContext = {
  order: {
    id: string;
    user_id: string;
    product_name: string;
    product_id: string;
    product_type: string | null;
    order_status: string;
    payment_status: string;
    payment_method: string | null;
    payment_flow: string | null;
    final_price: number | null;
    final_payment_amount: number | null;
    payment_amount: number | null;
    joined_price: number;
    quantity: number;
  };
  payment: PaymentRow;
  amount: number;
  paymentMethod: PaymentMethod;
};

const ORDER_SELECT =
  "id, user_id, product_name, product_id, product_type, order_status, payment_status, payment_method, payment_flow, final_price, final_payment_amount, payment_amount, joined_price, quantity";

const PAYMENT_SELECT =
  "id, order_id, user_id, deal_id, product_id, payment_provider, payment_key, amount, requested_amount, confirmed_amount, status, method, approved_at, failed_at, cancelled_at, raw_response, created_at, updated_at";

export async function validateOrderPaymentContext(input: {
  orderId: string;
  userId: string | null;
  paymentMethodParam?: string | null;
}): Promise<
  | { ok: true; context: ValidatedOrderPaymentContext }
  | { ok: false; error: OrderPaymentValidationError }
> {
  if (!input.userId) {
    return { ok: false, error: "login_required" };
  }

  if (!isSupabaseConfigured()) {
    return { ok: false, error: "not_configured" };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { ok: false, error: "not_configured" };
  }

  const { data: orderRow, error: orderError } = await supabase
    .from("orders")
    .select(ORDER_SELECT)
    .eq("id", input.orderId)
    .maybeSingle();

  if (orderError) {
    console.error("[toss] validate order:", orderError.message);
    return { ok: false, error: "order_not_found" };
  }

  if (!orderRow) {
    return { ok: false, error: "order_not_found" };
  }

  const order = orderRow as ValidatedOrderPaymentContext["order"];

  if (order.user_id !== input.userId) {
    return { ok: false, error: "forbidden" };
  }

  const paymentStatus = normalizePaymentStatus(order.payment_status);
  if (paymentStatus === "paid" || paymentStatus === "waiting_deposit") {
    return { ok: false, error: "already_paid" };
  }

  if (paymentStatus === "cancelled" || paymentStatus === "refunded") {
    return { ok: false, error: "not_payable" };
  }

  const paymentFlow = normalizePaymentFlow(order.payment_flow);
  if (!isNormalProduct(order.product_type) && paymentFlow === "post_deadline_auto") {
    return { ok: false, error: "auto_pay_scheduled" };
  }

  const orderStatus = normalizeOrderStatus(order.order_status);
  if (isNormalProduct(order.product_type)) {
    if (orderStatus === "cancelled" || orderStatus === "refunded") {
      return { ok: false, error: "not_payable" };
    }
  } else if (orderStatus !== "confirmed") {
    return { ok: false, error: "not_payable" };
  }

  const methodFromParam = parsePaymentMethodParam(input.paymentMethodParam);
  const methodFromOrder =
    order.payment_method && isPaymentMethod(order.payment_method) ?
      order.payment_method
    : null;
  const paymentMethod = methodFromParam ?? methodFromOrder;

  if (!paymentMethod) {
    return { ok: false, error: "invalid_payment_method" };
  }

  if (methodFromOrder && methodFromParam && methodFromOrder !== methodFromParam) {
    return { ok: false, error: "invalid_payment_method" };
  }

  const amount = computePayableAmountForOrder(order);
  if (amount == null || amount <= 0) {
    return { ok: false, error: "amount_unavailable" };
  }

  let { data: paymentRow } = await supabase
    .from("payments")
    .select(PAYMENT_SELECT)
    .eq("order_id", order.id)
    .maybeSingle();

  if (!paymentRow) {
    const { data: paymentId, error: createError } = await supabase.rpc(
      "create_pending_payment_for_order",
      { p_order_id: order.id, p_method: paymentMethod },
    );

    if (createError || !paymentId) {
      console.error("[toss] create pending payment:", createError?.message);
      return { ok: false, error: "not_payable" };
    }

    const refetch = await supabase
      .from("payments")
      .select(PAYMENT_SELECT)
      .eq("id", paymentId as string)
      .maybeSingle();

    paymentRow = refetch.data;
  }

  if (!paymentRow) {
    return { ok: false, error: "not_payable" };
  }

  const payment = paymentRow as PaymentRow;
  const paymentRecordStatus = payment.status;

  if (paymentRecordStatus === "paid") {
    return { ok: false, error: "already_paid" };
  }

  if (payment.requested_amount !== amount) {
    await supabase
      .from("payments")
      .update({
        requested_amount: amount,
        amount,
        method: paymentMethod,
        updated_at: new Date().toISOString(),
      })
      .eq("id", payment.id);
  }

  return {
    ok: true,
    context: {
      order,
      payment,
      amount,
      paymentMethod,
    },
  };
}
