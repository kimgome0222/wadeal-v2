"use client";

import {
  ANONYMOUS,
  loadTossPayments,
  type TossPaymentsWidgets,
} from "@tosspayments/tosspayments-sdk";
import { useEffect, useRef, useState } from "react";

import type { PaymentMethod } from "@/lib/payments/payment-methods";
import { getPaymentMethodLabel } from "@/lib/payments/payment-methods";
import { ui } from "@/lib/ui";

type TossPaymentWidgetProps = {
  clientKey: string;
  customerKey: string;
  orderId: string;
  orderName: string;
  amount: number;
  paymentMethod: PaymentMethod;
  variantKey: string;
  agreementVariantKey: string;
  customerName?: string | null;
  customerEmail?: string | null;
  customerMobilePhone?: string | null;
};

export function TossPaymentWidget({
  clientKey,
  customerKey,
  orderId,
  orderName,
  amount,
  paymentMethod,
  variantKey,
  agreementVariantKey,
  customerName,
  customerEmail,
  customerMobilePhone,
}: TossPaymentWidgetProps) {
  const [ready, setReady] = useState(false);
  const [paying, setPaying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const widgetsRef = useRef<TossPaymentsWidgets | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const tossPayments = await loadTossPayments(clientKey);
        const key = customerKey.trim() || ANONYMOUS;
        const widgetInstance = tossPayments.widgets({ customerKey: key });
        widgetsRef.current = widgetInstance;

        await widgetInstance.setAmount({ currency: "KRW", value: amount });
        await widgetInstance.renderPaymentMethods({
          selector: "#toss-payment-method",
          variantKey,
        });
        await widgetInstance.renderAgreement({
          selector: "#toss-agreement",
          variantKey: agreementVariantKey,
        });

        if (!cancelled) {
          setReady(true);
        }
      } catch (error) {
        console.error("[toss-widget] init:", error);
        if (!cancelled) {
          setErrorMessage("결제 위젯을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.");
        }
      }
    }

    void init();

    return () => {
      cancelled = true;
    };
  }, [
    agreementVariantKey,
    amount,
    clientKey,
    customerKey,
    variantKey,
  ]);

  async function handlePay() {
    if (!widgetsRef.current) {
      return;
    }

    setPaying(true);
    setErrorMessage(null);

    const origin = window.location.origin;

    try {
      await widgetsRef.current.requestPayment({
        orderId,
        orderName,
        customerName: customerName ?? undefined,
        customerEmail: customerEmail ?? undefined,
        customerMobilePhone: customerMobilePhone ?? undefined,
        successUrl: `${origin}/payment/success`,
        failUrl: `${origin}/payment/fail`,
      });
    } catch (error) {
      console.error("[toss-widget] requestPayment:", error);
      const message =
        error instanceof Error && error.message ?
          error.message
        : "결제 요청에 실패했어요.";
      setErrorMessage(message);
      setPaying(false);
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-bold text-wadeal-muted">
        결제 수단:{" "}
        <span className="font-black text-wadeal-ink">
          {getPaymentMethodLabel(paymentMethod)}
        </span>
      </p>

      <div className="rounded-xl border border-wadeal-line bg-white p-3">
        <div id="toss-payment-method" />
      </div>

      <div className="rounded-xl border border-wadeal-line bg-white p-3">
        <div id="toss-agreement" />
      </div>

      {errorMessage ?
        <p className="rounded-xl bg-[#F5F8F4] px-4 py-3 text-center text-xs font-bold text-wadeal-red">
          {errorMessage}
        </p>
      : null}

      <button
        className={`${ui.btnPrimary} w-full cursor-pointer`}
        disabled={!ready || paying}
        onClick={() => void handlePay()}
        type="button"
      >
        {paying ? "결제창 여는 중..." : ready ? `${amount.toLocaleString("ko-KR")}원 결제하기` : "결제 준비 중..."}
      </button>
    </div>
  );
}
