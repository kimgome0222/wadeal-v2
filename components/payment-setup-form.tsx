"use client";

import Link from "next/link";
import { useState } from "react";
import { WADEAL_PAYMENT_SAVED } from "@/lib/mock-storage";
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

export function PaymentSetupForm({ returnPath }: PaymentSetupFormProps) {
  const [agreed, setAgreed] = useState(false);
  const [saved, setSaved] = useState(false);

  if (saved) {
    return (
      <div className="space-y-4">
        <p className={ui.successBanner} role="status">
          결제수단이 등록되었어요.
        </p>
        <Link className="btn-primary" href={returnPath}>
          공동구매 참여로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        if (!agreed) return;
        sessionStorage.setItem(WADEAL_PAYMENT_SAVED, "1");
        setSaved(true);
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
            placeholder={field.placeholder}
            type="text"
          />
        </div>
      ))}

      <p className="rounded-lg bg-wadeal-surface px-3 py-2.5 text-xs font-bold leading-relaxed text-wadeal-muted">
        마감 시 확정된 최종 가격으로 자동결제됩니다.
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

      <button className="btn-primary" disabled={!agreed} type="submit">
        결제수단 저장
      </button>
    </form>
  );
}
