"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { registerMockBillingCardAction } from "@/app/actions/saved-payment-methods";
import { savePaymentAction } from "@/app/actions/data";
import { returnLabel, writeSavedPayment } from "@/lib/mock-storage";
import { ui } from "@/lib/ui";

const fields = [
  { id: "cardNumber", label: "카드번호", placeholder: "0000 0000 0000 0000" },
  { id: "expiry", label: "유효기간", placeholder: "MM/YY" },
  { id: "birth", label: "생년월일", placeholder: "YYMMDD" },
  { id: "password", label: "카드 비밀번호 앞 2자리", placeholder: "••" },
] as const;

type PaymentSetupFormProps = {
  returnPath: string;
};

function maskCardNumber(cardNumber: string) {
  const digits = cardNumber.replace(/\D/g, "");
  const lastFour = digits.slice(-4).padStart(4, "0");
  return `**** **** **** ${lastFour}`;
}

export function PaymentSetupForm({ returnPath }: PaymentSetupFormProps) {
  const [isPending, startTransition] = useTransition();
  const [agreed, setAgreed] = useState(false);
  const [saved, setSaved] = useState(false);
  const [cardNumber, setCardNumber] = useState("");

  if (saved) {
    return (
      <div className="space-y-4">
        <p className={ui.successBanner} role="status">
          결제수단이 등록되었어요.
        </p>
        <Link className={`${ui.btnPrimary} cursor-pointer`} href={returnPath}>
          {returnLabel(returnPath, "상품 구매로 돌아가기", "결제수단 관리로 돌아가기")}
        </Link>
      </div>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        if (!agreed) {
          return;
        }

        startTransition(async () => {
          const lastFour = maskCardNumber(cardNumber || "1234").slice(-4);
          const billingResult = await registerMockBillingCardAction({
            cardLast4: lastFour,
            cardCompany: "등록 카드",
          });

          if (!billingResult.success) {
            return;
          }

          const paymentData = {
            cardName: "등록 카드",
            cardNumberMasked: maskCardNumber(cardNumber || "1234"),
          };
          writeSavedPayment(paymentData);
          await savePaymentAction(paymentData);
          setSaved(true);
        });
      }}
    >
      {fields.map((field) => (
        <div key={field.id}>
          <label className={ui.label} htmlFor={field.id}>
            {field.label}
          </label>
          <input
            className={ui.input}
            id={field.id}
            name={field.id}
            onChange={
              field.id === "cardNumber" ?
                (event) => setCardNumber(event.target.value)
              : undefined
            }
            placeholder={field.placeholder}
            type="text"
            value={field.id === "cardNumber" ? cardNumber : undefined}
          />
        </div>
      ))}

      <p className="rounded-lg bg-wadeal-surface px-3 py-2.5 text-xs font-bold leading-relaxed text-wadeal-muted">
        테스트용 mock 화면이에요. 실제 카드번호·CVC·비밀번호는 저장하지 않으며, PG 연동 후
        결제대행사를 통해 등록됩니다.
      </p>
      <p className="rounded-lg bg-wadeal-surface px-3 py-2.5 text-xs font-bold leading-relaxed text-wadeal-muted">
        판매 종료 시 확정된 최종 가격으로 자동결제됩니다.
      </p>

      <label className="flex cursor-pointer items-start gap-2.5">
        <input
          checked={agreed}
          className="mt-0.5 h-4 w-4 accent-wadeal-red"
          onChange={(event) => setAgreed(event.target.checked)}
          type="checkbox"
        />
        <span className="text-sm font-extrabold leading-5 text-wadeal-ink">
          결제수단 등록 및 자동결제에 동의합니다.
        </span>
      </label>

      <button
        className={`${ui.btnPrimary} cursor-pointer disabled:cursor-not-allowed disabled:opacity-50`}
        disabled={!agreed || isPending}
        type="submit"
      >
        {isPending ? "저장 중..." : "결제수단 저장"}
      </button>
    </form>
  );
}
