"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  createSellerBillingAction,
} from "@/app/actions/seller-finance";
import type { SellerBillingRecord } from "@/lib/settlements/seller-settlement-types";
import {
  formatKrw,
  getSellerBillingStatusLabel,
  sellerBillingStatusTone,
} from "@/lib/settlements/seller-settlement-types";
import { ui } from "@/lib/ui";

type SellerBillingsContentProps = {
  billings: SellerBillingRecord[];
};

export function SellerBillingsContent({ billings }: SellerBillingsContentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [amount, setAmount] = useState("50000");
  const [paymentMode, setPaymentMode] = useState<"immediate" | "settlement_deduction">(
    "settlement_deduction",
  );
  const [feedback, setFeedback] = useState<string | null>(null);

  function handleCreateBilling() {
    setFeedback(null);
    startTransition(async () => {
      const result = await createSellerBillingAction({
        billingType: "ad_fee",
        amount: Number(amount),
        paymentMode,
        description: "광고비",
      });
      setFeedback(result.message);
      if (result.success) {
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className={`${ui.panel} space-y-3`}>
        <p className="text-sm font-black text-wadeal-ink">광고비 청구 (테스트)</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={ui.label} htmlFor="billingAmount">
              금액
            </label>
            <input
              className={ui.input}
              id="billingAmount"
              onChange={(event) => setAmount(event.target.value)}
              type="number"
              value={amount}
            />
          </div>
          <div>
            <label className={ui.label} htmlFor="paymentMode">
              결제 방식
            </label>
            <select
              className={ui.input}
              id="paymentMode"
              onChange={(event) =>
                setPaymentMode(event.target.value as "immediate" | "settlement_deduction")
              }
              value={paymentMode}
            >
              <option value="settlement_deduction">다음 정산 시 차감</option>
              <option value="immediate">즉시 결제</option>
            </select>
          </div>
        </div>
        <button
          className={`${ui.btnOutline} h-10 disabled:opacity-50`}
          disabled={isPending}
          onClick={handleCreateBilling}
          type="button"
        >
          청구 생성
        </button>
      </div>

      <div className="space-y-2">
        {billings.length === 0 ?
          <div className={`${ui.panel} py-8 text-center`}>
            <p className="text-sm font-bold text-wadeal-muted">청구 내역이 없어요.</p>
          </div>
        : billings.map((billing) => (
            <div className={`${ui.panel} flex items-center justify-between gap-3`} key={billing.id}>
              <div>
                <p className="text-sm font-black text-wadeal-ink">
                  {billing.description ?? billing.billingType}
                </p>
                <p className="mt-1 text-xs font-bold text-wadeal-muted">
                  {formatKrw(billing.amount)} ·{" "}
                  {billing.paymentMode === "settlement_deduction" ?
                    "정산 차감"
                  : "즉시 결제"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded px-2 py-1 text-[10px] font-black ${sellerBillingStatusTone(billing.status)}`}
                >
                  {getSellerBillingStatusLabel(billing.status)}
                </span>
                {billing.status === "pending" && billing.paymentMode === "immediate" ?
                  <span className="text-[10px] font-bold text-wadeal-muted">즉시 결제 준비 중</span>
                : null}
              </div>
            </div>
          ))
        }
      </div>

      {feedback ?
        <p className="text-xs font-bold text-wadeal-muted" role="status">
          {feedback}
        </p>
      : null}
    </div>
  );
}
