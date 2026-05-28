"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  updateSellerBankAccountAction,
  verifySellerBankAccountAction,
} from "@/app/actions/seller-finance";
import type { SellerRecord } from "@/lib/data/sellers";
import { ui } from "@/lib/ui";

type SellerBankAccountFormProps = {
  seller: SellerRecord | null;
};

export function SellerBankAccountForm({ seller }: SellerBankAccountFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [bankName, setBankName] = useState(seller?.bankName ?? "");
  const [accountNumber, setAccountNumber] = useState(seller?.accountNumber ?? "");
  const [accountHolder, setAccountHolder] = useState(seller?.accountHolder ?? "");
  const [feedback, setFeedback] = useState<string | null>(null);

  function handleVerify() {
    setFeedback(null);
    startTransition(async () => {
      const result = await verifySellerBankAccountAction({ bankName, accountNumber });
      setFeedback(result.message);
      if (result.success && result.accountHolder) {
        setAccountHolder(result.accountHolder);
      }
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);
    startTransition(async () => {
      const result = await updateSellerBankAccountAction({
        bankName,
        accountNumber,
        accountHolder,
      });
      setFeedback(result.message);
      if (result.success) {
        router.refresh();
      }
    });
  }

  return (
    <form className={`${ui.panel} space-y-4`} onSubmit={handleSubmit}>
      <p className="text-sm font-black text-wadeal-ink">결제대금 정산 계좌</p>
      <div>
        <label className={ui.label} htmlFor="bankName">
          은행명
        </label>
        <input
          className={ui.input}
          id="bankName"
          onChange={(event) => setBankName(event.target.value)}
          required
          value={bankName}
        />
      </div>
      <div>
        <label className={ui.label} htmlFor="accountNumber">
          계좌번호
        </label>
        <div className="flex gap-2">
          <input
            className={ui.input}
            id="accountNumber"
            onChange={(event) => setAccountNumber(event.target.value)}
            required
            value={accountNumber}
          />
          <button
            className={`${ui.btnOutline} h-11 shrink-0 px-3 text-xs disabled:opacity-50`}
            disabled={isPending}
            onClick={handleVerify}
            type="button"
          >
            예금주 확인
          </button>
        </div>
      </div>
      <div>
        <label className={ui.label} htmlFor="accountHolder">
          예금주
        </label>
        <input
          className={ui.input}
          id="accountHolder"
          onChange={(event) => setAccountHolder(event.target.value)}
          required
          value={accountHolder}
        />
      </div>
      {feedback ?
        <p className="text-xs font-bold text-wadeal-muted" role="status">
          {feedback}
        </p>
      : null}
      <button className={`${ui.btnPrimary} h-11 disabled:opacity-50`} disabled={isPending} type="submit">
        {isPending ? "저장 중..." : "계좌 저장"}
      </button>
    </form>
  );
}
