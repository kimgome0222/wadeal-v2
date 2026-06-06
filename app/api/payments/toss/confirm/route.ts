import { NextResponse } from "next/server";

import { getServerAuthUser } from "@/lib/auth/server-session";
import { logError } from "@/lib/monitoring/error-log";
import { applyTossConfirmResult } from "@/lib/payments/toss/apply-confirm-result";
import { confirmTossPayment } from "@/lib/payments/toss/client";
import { computePayableAmountForOrder } from "@/lib/payments/toss/amount";
import { validateOrderPaymentContext } from "@/lib/payments/toss/validate-order-payment";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type ConfirmBody = {
  paymentKey?: string;
  orderId?: string;
  amount?: number;
};

export async function POST(request: Request) {
  const user = await getServerAuthUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "login_required" }, { status: 401 });
  }

  let body: ConfirmBody;
  try {
    body = (await request.json()) as ConfirmBody;
  } catch {
    return NextResponse.json({ success: false, error: "invalid_body" }, { status: 400 });
  }

  const paymentKey = body.paymentKey?.trim();
  const orderId = body.orderId?.trim();

  if (!paymentKey || !orderId) {
    return NextResponse.json({ success: false, error: "invalid_input" }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ success: false, error: "not_configured" }, { status: 503 });
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ success: false, error: "not_configured" }, { status: 503 });
  }

  const { data: orderRow, error: orderError } = await supabase
    .from("orders")
    .select(
      "id, user_id, product_type, order_status, payment_status, final_price, final_payment_amount, payment_amount, joined_price, quantity, payment_method",
    )
    .eq("id", orderId)
    .maybeSingle();

  if (orderError || !orderRow) {
    return NextResponse.json({ success: false, error: "order_not_found" }, { status: 404 });
  }

  if ((orderRow as { user_id: string }).user_id !== user.id) {
    return NextResponse.json({ success: false, error: "forbidden" }, { status: 403 });
  }

  const expectedAmount = computePayableAmountForOrder(
    orderRow as Parameters<typeof computePayableAmountForOrder>[0],
  );

  if (expectedAmount == null || expectedAmount <= 0) {
    return NextResponse.json({ success: false, error: "amount_unavailable" }, { status: 400 });
  }

  if (body.amount != null && Math.round(body.amount) !== expectedAmount) {
    return NextResponse.json({ success: false, error: "amount_mismatch" }, { status: 400 });
  }

  const validation = await validateOrderPaymentContext({
    orderId,
    userId: user.id,
    paymentMethodParam: (orderRow as { payment_method: string | null }).payment_method,
  });

  if (!validation.ok) {
    if (validation.error === "already_paid") {
      return NextResponse.json({
        success: true,
        paymentStatus: "paid",
        alreadyProcessed: true,
      });
    }

    const status =
      validation.error === "forbidden" ? 403
      : validation.error === "login_required" ? 401
      : 400;

    return NextResponse.json({ success: false, error: validation.error }, { status });
  }

  const confirmResult = await confirmTossPayment({
    paymentKey,
    orderId,
    amount: expectedAmount,
  });

  if (!confirmResult.ok) {
    void logError({
      level: "error",
      source: "payment",
      message: `Payment confirm failed: ${confirmResult.error}`,
      userId: user.id,
      orderId,
      metadata: {
        paymentKeyPrefix: paymentKey.slice(0, 12),
        tossMessage: confirmResult.message ?? null,
      },
    });
    const httpStatus = confirmResult.error === "not_configured" ? 503 : 502;
    return NextResponse.json(
      {
        success: false,
        error: confirmResult.error,
        message: confirmResult.message,
      },
      { status: httpStatus },
    );
  }

  const applyResult = await applyTossConfirmResult({
    orderId,
    paymentId: validation.context.payment.id,
    expectedAmount,
    tossPayment: confirmResult.payment,
  });

  if (!applyResult.success) {
    void logError({
      level: applyResult.error === "amount_mismatch" ? "warning" : "critical",
      source: "payment",
      message: `Apply confirm result failed: ${applyResult.error}`,
      userId: user.id,
      orderId,
      paymentId: validation.context.payment.id,
      metadata: { paymentKeyPrefix: paymentKey.slice(0, 12) },
    });
    const httpStatus = applyResult.error === "amount_mismatch" ? 400 : 500;
    return NextResponse.json({ success: false, error: applyResult.error }, { status: httpStatus });
  }

  return NextResponse.json({
    success: true,
    paymentStatus: applyResult.paymentStatus,
    alreadyProcessed: applyResult.alreadyProcessed ?? false,
  });
}
