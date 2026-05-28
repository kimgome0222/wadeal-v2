import { NextResponse } from "next/server";

import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { processAdminOrderClaim } from "@/lib/data/admin-orders";
import { getTossSecretKey, isTossPaymentsConfigured } from "@/lib/payments/toss/env";

type RefundRequestBody = {
  orderId: string;
  paymentKey?: string;
  cancelReason: string;
  cancelAmount?: number;
  claimType?: "cancel" | "full_refund" | "partial_refund";
};

/**
 * Admin-only Toss refund endpoint.
 * Requires TOSS_SECRET_KEY or TOSS_PAYMENTS_SECRET_KEY (server env).
 * TODO: Call Toss Payments cancel API when live keys are configured.
 */
export async function POST(request: Request) {
  const user = await getServerAuthUser();
  if (!user || !(await isAdminUser(user))) {
    return NextResponse.json({ ok: false, message: "관리자만 처리할 수 있어요." }, { status: 403 });
  }

  let body: RefundRequestBody;
  try {
    body = (await request.json()) as RefundRequestBody;
  } catch {
    return NextResponse.json({ ok: false, message: "요청 형식이 올바르지 않아요." }, { status: 400 });
  }

  const orderId = body.orderId?.trim();
  const cancelReason = body.cancelReason?.trim();
  if (!orderId || !cancelReason) {
    return NextResponse.json(
      { ok: false, message: "주문 ID와 사유가 필요해요." },
      { status: 400 },
    );
  }

  const claimType = body.claimType ?? "full_refund";
  const result = await processAdminOrderClaim({
    orderId,
    claimType,
    reason: cancelReason,
    partialAmount: body.cancelAmount ?? null,
  });

  if (!result.success) {
    return NextResponse.json(
      { ok: false, message: "환불 처리에 실패했어요.", error: result.error },
      { status: 400 },
    );
  }

  const tossConfigured = isTossPaymentsConfigured();
  const secretKeyPresent = Boolean(getTossSecretKey());

  return NextResponse.json({
    ok: true,
    message: "환불 상태가 반영됐어요.",
    toss: {
      configured: tossConfigured,
      secretKeyPresent,
      paymentKey: body.paymentKey ?? null,
      // TODO: POST https://api.tosspayments.com/v1/payments/{paymentKey}/cancel
      apiDeferred: true,
    },
  });
}
