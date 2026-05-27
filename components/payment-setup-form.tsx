"use client";

import { useState } from "react";

const fields = [
  { id: "cardNumber", label: "카드번호", placeholder: "0000 0000 0000 0000" },
  { id: "expiry", label: "유효기간", placeholder: "MM/YY" },
  { id: "birth", label: "생년월일", placeholder: "YYMMDD" },
  { id: "password", label: "카드 비밀번호 앞 2자리", placeholder: "••" },
] as const;

export function PaymentSetupForm() {
  const [agreed, setAgreed] = useState(false);
  const [saved, setSaved] = useState(false);

  if (saved) {
    return (
      <p
        className="rounded-xl bg-green-50 px-4 py-4 text-center text-sm font-extrabold text-green-700"
        role="status"
      >
        결제수단이 등록되었어요.
      </p>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        if (!agreed) return;
        setSaved(true);
      }}
    >
      {fields.map((field) => (
        <div key={field.id}>
          <label className="mb-1.5 block text-xs font-black text-wadeal-muted" htmlFor={field.id}>
            {field.label}
          </label>
          <input
            className="h-11 w-full rounded-lg border border-wadeal-line px-3 text-sm font-bold text-wadeal-ink outline-none placeholder:font-bold placeholder:text-gray-300 focus:border-wadeal-red"
            id={field.id}
            placeholder={field.placeholder}
            type="text"
          />
        </div>
      ))}

      <p className="rounded-lg bg-gray-50 px-3 py-2.5 text-xs font-bold leading-relaxed text-wadeal-muted">
        공동구매 마감 후 최종 가격으로 자동결제됩니다.
      </p>

      <label className="flex cursor-pointer items-start gap-2.5">
        <input
          checked={agreed}
          className="mt-0.5 h-4 w-4 accent-wadeal-red"
          onChange={(event) => setAgreed(event.target.checked)}
          type="checkbox"
        />
        <span className="text-sm font-extrabold leading-5 text-wadeal-ink">
          자동결제 및 결제수단 등록에 동의합니다.
        </span>
      </label>

      <button className="btn-primary" disabled={!agreed} type="submit">
        저장하기
      </button>
    </form>
  );
}
