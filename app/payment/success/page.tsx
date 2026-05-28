import Link from "next/link";
import { redirect } from "next/navigation";

import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { applyTossConfirmResult } from "@/lib/payments/toss/apply-confirm-result";
import { confirmTossPayment } from "@/lib/payments/toss/client";
import { computePayableAmountForOrder } from "@/lib/payments/toss/amount";
import { validateOrderPaymentContext } from "@/lib/payments/toss/validate-order-payment";
import { isVirtualAccountMethod } from "@/lib/payments/payment-methods";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ui } from "@/lib/ui";

type PaymentSuccessPageProps = {
  searchParams: Promise<{
    paymentKey?: string;
    orderId?: string;
    amount?: string;
    paymentType?: string;
  }>;
};

export default async function PaymentSuccessPage({ searchParams }: PaymentSuccessPageProps) {
  const user = await getServerAuthUser();
  const params = await searchParams;

  const paymentKey = params.paymentKey?.trim();
  const orderId = params.orderId?.trim();

  if (!user) {
    const next = new URLSearchParams();
    if (paymentKey) next.set("paymentKey", paymentKey);
    if (orderId) next.set("orderId", orderId);
    if (params.amount) next.set("amount", params.amount);
    redirect(`/login?next=/payment/success${next.toString() ? `?${next}` : ""}`);
  }

  if (!paymentKey || !orderId) {
    return (
      <PaymentResultShell
        description="결제 정보가 올바르지 않아요. 주문 내역에서 다시 시도해 주세요."
        title="결제 확인 실패"
      />
    );
  }

  if (!isSupabaseConfigured()) {
    return (
      <PaymentResultShell
        description="결제 저장소가 연결되지 않았어요."
        title="결제 확인 실패"
      />
    );
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return (
      <PaymentResultShell
        description="서버 연결에 실패했어요. 잠시 후 다시 시도해 주세요."
        title="결제 확인 실패"
      />
    );
  }

  const { data: orderRow } = await supabase
    .from("orders")
    .select(
      "id, user_id, product_name, product_type, order_status, payment_status, final_price, final_payment_amount, payment_amount, joined_price, quantity, payment_method",
    )
    .eq("id", orderId)
    .maybeSingle();

  if (!orderRow || (orderRow as { user_id: string }).user_id !== user.id) {
    return (
      <PaymentResultShell
        description="주문을 찾을 수 없거나 결제 권한이 없어요."
        title="결제 확인 실패"
      />
    );
  }

  const expectedAmount = computePayableAmountForOrder(
    orderRow as Parameters<typeof computePayableAmountForOrder>[0],
  );

  if (expectedAmount == null) {
    return (
      <PaymentResultShell
        description="결제 금액을 확인할 수 없어요."
        title="결제 확인 실패"
      />
    );
  }

  if (params.amount != null && Math.round(Number(params.amount)) !== expectedAmount) {
    return (
      <PaymentResultShell
        description="결제 금액이 일치하지 않아요. 고객센터로 문의해 주세요."
        title="결제 확인 실패"
      />
    );
  }

  const validation = await validateOrderPaymentContext({
    orderId,
    userId: user.id,
    paymentMethodParam: (orderRow as { payment_method: string | null }).payment_method,
  });

  let paymentStatus: string = "paid";
  let alreadyProcessed = false;

  if (validation.ok) {
    const confirmResult = await confirmTossPayment({
      paymentKey,
      orderId,
      amount: expectedAmount,
    });

    if (!confirmResult.ok) {
      return (
        <PaymentResultShell
          description={confirmResult.message ?? "결제 승인 API 호출에 실패했어요."}
          failOrderId={orderId}
          title="결제 승인 실패"
        />
      );
    }

    const applyResult = await applyTossConfirmResult({
      orderId,
      paymentId: validation.context.payment.id,
      expectedAmount,
      tossPayment: confirmResult.payment,
    });

    if (!applyResult.success) {
      return (
        <PaymentResultShell
          description="결제는 완료됐지만 주문 상태 저장에 실패했어요. 주문 내역을 확인해 주세요."
          failOrderId={orderId}
          title="주문 반영 실패"
        />
      );
    }

    paymentStatus = applyResult.paymentStatus;
    alreadyProcessed = applyResult.alreadyProcessed ?? false;
  } else if (validation.error === "already_paid") {
    paymentStatus = (orderRow as { payment_status: string }).payment_status;
    alreadyProcessed = true;
  } else {
    return (
      <PaymentResultShell
        description="결제 상태를 확인할 수 없어요."
        failOrderId={orderId}
        title="결제 확인 실패"
      />
    );
  }

  const method = (orderRow as { payment_method: string | null }).payment_method;
  const isVirtualAccount = isVirtualAccountMethod(method);
  const waitingDeposit = paymentStatus === "waiting_deposit";

  return (
    <PageShell>
      <SubHeader backHref="/mypage/orders" title="결제 완료" />
      <div className={`${ui.pageBody} space-y-4 text-center`}>
        <p className={ui.successBanner}>
          {waitingDeposit ?
            "가상계좌가 발급됐어요. 입금 확인 후 배송이 시작돼요."
          : alreadyProcessed ?
            "이미 처리된 결제예요."
          : "결제가 완료됐어요."}
        </p>
        <p className="text-sm font-black text-wadeal-ink">
          {(orderRow as { product_name: string }).product_name}
        </p>
        <p className="text-xs font-bold text-wadeal-muted">
          {expectedAmount.toLocaleString("ko-KR")}원
          {isVirtualAccount && waitingDeposit ? " · 입금 대기" : ""}
        </p>
        <Link className={`${ui.btnPrimary} block`} href="/mypage/orders">
          주문 내역 보기
        </Link>
      </div>
    </PageShell>
  );
}

function PaymentResultShell({
  title,
  description,
  failOrderId,
}: {
  title: string;
  description: string;
  failOrderId?: string;
}) {
  return (
    <PageShell>
      <SubHeader backHref="/mypage/orders" title="결제" />
      <div className={`${ui.pageBody} space-y-4 text-center`}>
        <p className="text-sm font-black text-wadeal-ink">{title}</p>
        <p className="text-xs font-bold leading-relaxed text-wadeal-muted">{description}</p>
        {failOrderId ?
          <Link
            className={`${ui.btnPrimary} block`}
            href={`/payment/request/${failOrderId}`}
          >
            다시 결제하기
          </Link>
        : null}
        <Link className={`${ui.btnOutline} block`} href="/mypage/orders">
          주문 내역으로
        </Link>
      </div>
    </PageShell>
  );
}
