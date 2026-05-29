import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { TossPaymentWidget } from "@/components/toss-payment-widget";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { currency } from "@/lib/deals";
import { getVirtualAccountDepositNotice } from "@/lib/orders/order-flow";
import { getTossClientKey } from "@/lib/payments/toss/env";
import {
  getTossAgreementVariantKey,
  getTossWidgetVariantKey,
} from "@/lib/payments/toss/map-method";
import {
  type OrderPaymentValidationError,
  validateOrderPaymentContext,
} from "@/lib/payments/toss/validate-order-payment";
import { isVirtualAccountMethod } from "@/lib/payments/payment-methods";
import { ui } from "@/lib/ui";

type PaymentRequestPageProps = {
  params: Promise<{ orderId: string }>;
};

const ERROR_MESSAGES: Record<OrderPaymentValidationError, string> = {
  login_required: "로그인이 필요해요.",
  not_configured: "결제 시스템이 아직 설정되지 않았어요.",
  order_not_found: "주문을 찾을 수 없어요.",
  forbidden: "결제 권한이 없어요.",
  invalid_payment_method: "유효하지 않은 결제 수단이에요.",
  already_paid: "이미 결제가 완료된 주문이에요.",
  not_payable: "지금은 결제할 수 없는 주문이에요.",
  amount_unavailable: "결제 금액을 확인할 수 없어요.",
  auto_pay_scheduled: "이 주문은 판매 종료 후 카드 자동결제가 예약되어 있어요.",
};

export default async function PaymentRequestPage({ params }: PaymentRequestPageProps) {
  const user = await getServerAuthUser();
  const { orderId } = await params;

  if (!user) {
    redirect(
      `/login?redirect=${encodeURIComponent(`/payment/request/${orderId}`)}&next=${encodeURIComponent(`/payment/request/${orderId}`)}`,
    );
  }

  const validation = await validateOrderPaymentContext({
    orderId,
    userId: user.id,
  });

  if (!validation.ok) {
    if (validation.error === "already_paid") {
      redirect("/mypage/orders");
    }

    if (validation.error === "order_not_found") {
      notFound();
    }

    return (
      <PageShell>
        <SubHeader backHref="/mypage/orders" title="결제" />
        <div className={`${ui.pageBody} space-y-4 text-center`}>
          <p className="text-sm font-black text-wadeal-ink">결제를 진행할 수 없어요</p>
          <p className="text-xs font-bold leading-relaxed text-wadeal-muted">
            {ERROR_MESSAGES[validation.error]}
          </p>
          <Link className={`${ui.btnOutline} block`} href="/mypage/orders">
            주문 내역으로
          </Link>
        </div>
      </PageShell>
    );
  }

  const clientKey = getTossClientKey();
  if (!clientKey) {
    return (
      <PageShell>
        <SubHeader backHref="/mypage/orders" title="결제" />
        <div className={`${ui.pageBody} space-y-4 text-center`}>
          <p className="text-sm font-black text-wadeal-ink">결제 설정이 필요해요</p>
          <p className="text-xs font-bold leading-relaxed text-wadeal-muted">
            NEXT_PUBLIC_TOSS_CLIENT_KEY 환경 변수를 설정한 뒤 다시 시도해 주세요.
          </p>
        </div>
      </PageShell>
    );
  }

  const { order, amount, paymentMethod } = validation.context;

  return (
    <PageShell className="pb-28">
      <SubHeader backHref="/mypage/orders" title="결제하기" />
      <div className={`${ui.pageBody} space-y-3`}>
        <article className="rounded-xl border border-wadeal-line bg-white p-4">
          <h2 className={ui.sectionTitle}>주문 정보</h2>
          <dl className="mt-3 space-y-2 text-xs font-bold text-wadeal-muted">
            <div className="flex justify-between gap-3">
              <dt>상품명</dt>
              <dd className="text-right font-black text-wadeal-ink">{order.product_name}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>결제 금액</dt>
              <dd className="text-lg font-black text-wadeal-red">
                {currency.format(amount)}원
              </dd>
            </div>
          </dl>
          {isVirtualAccountMethod(paymentMethod) ?
            <p className="mt-3 rounded-lg bg-wadeal-surface px-3 py-2.5 text-[11px] font-bold leading-relaxed text-wadeal-muted">
              {getVirtualAccountDepositNotice()}
            </p>
          : null}
        </article>

        <TossPaymentWidget
          agreementVariantKey={getTossAgreementVariantKey()}
          amount={amount}
          clientKey={clientKey}
          customerEmail={user.email}
          customerKey={user.id}
          customerName={user.user_metadata?.name as string | undefined}
          orderId={order.id}
          orderName={order.product_name}
          paymentMethod={paymentMethod}
          variantKey={getTossWidgetVariantKey(paymentMethod)}
        />
      </div>
    </PageShell>
  );
}
