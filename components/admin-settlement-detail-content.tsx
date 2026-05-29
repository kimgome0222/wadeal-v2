"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  cancelSettlementAction,
  confirmSettlementAction,
  markSettlementPaidAction,
} from "@/app/actions/admin-settlements";
import { currency } from "@/lib/deals";
import {
  getSettlementStatusLabel,
  settlementStatusTone,
  type AdminSettlementDetail,
} from "@/lib/admin-settlements/shared";
import { ui } from "@/lib/ui";

type AdminSettlementDetailContentProps = {
  settlement: AdminSettlementDetail;
};

function formatDateTime(iso: string | null): string {
  if (!iso) {
    return "-";
  }

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("ko-KR");
}

export function AdminSettlementDetailContent({
  settlement,
}: AdminSettlementDetailContentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ tone: "success" | "error"; message: string } | null>(
    null,
  );

  function runAction(action: "confirm" | "paid" | "cancel") {
    setFeedback(null);

    startTransition(async () => {
      const result =
        action === "confirm"
          ? await confirmSettlementAction(settlement.id)
          : action === "paid"
            ? await markSettlementPaidAction(settlement.id)
            : await cancelSettlementAction(settlement.id);

      setFeedback({
        tone: result.success ? "success" : "error",
        message: result.message,
      });

      if (result.success) {
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-4">
      {feedback ?
        <p
          className={`rounded-lg px-3 py-2 text-xs font-bold ${
            feedback.tone === "success" ? "bg-green-50 text-green-700" : "bg-[#F5F8F4] text-[#244C3F]"
          }`}
        >
          {feedback.message}
        </p>
      : null}

      <article className="rounded-xl border border-wadeal-line bg-white p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-black text-wadeal-ink">{settlement.productName}</p>
            <p className="mt-0.5 text-xs font-bold text-wadeal-muted">{settlement.supplierName}</p>
          </div>
          <span
            className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-black ${settlementStatusTone(settlement.status)}`}
          >
            {getSettlementStatusLabel(settlement.status)}
          </span>
        </div>

        <dl className="mt-4 space-y-2 text-xs font-bold text-wadeal-muted">
          <div className="flex justify-between gap-3">
            <dt>정산 ID</dt>
            <dd className="max-w-[60%] truncate font-black text-wadeal-ink">{settlement.id}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>공급사 ID</dt>
            <dd className="max-w-[60%] truncate font-black text-wadeal-ink">
              {settlement.supplierId}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>상품 ID</dt>
            <dd className="max-w-[60%] truncate font-black text-wadeal-ink">{settlement.dealId}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>상품 ID</dt>
            <dd className="max-w-[60%] truncate font-black text-wadeal-ink">
              {settlement.productId}
            </dd>
          </div>
          <div className="flex justify-between gap-3 border-t border-wadeal-line pt-2">
            <dt>총 매출</dt>
            <dd className="font-black text-wadeal-ink">
              {currency.format(settlement.totalSalesAmount)}원
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>수수료율</dt>
            <dd className="font-black text-wadeal-ink">{settlement.commissionRate}%</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>수수료</dt>
            <dd className="font-black text-wadeal-red">
              {currency.format(settlement.commissionAmount)}원
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>정산 금액</dt>
            <dd className="text-sm font-black text-wadeal-ink">
              {currency.format(settlement.settlementAmount)}원
            </dd>
          </div>
          <div className="flex justify-between gap-3 border-t border-wadeal-line pt-2">
            <dt>생성일</dt>
            <dd className="font-black text-wadeal-ink">{formatDateTime(settlement.createdAt)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>수정일</dt>
            <dd className="font-black text-wadeal-ink">{formatDateTime(settlement.updatedAt)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>지급일</dt>
            <dd className="font-black text-wadeal-ink">{formatDateTime(settlement.settledAt)}</dd>
          </div>
        </dl>
      </article>

      <div className="flex flex-wrap gap-2">
        <Link className={`${ui.btnOutline} h-11 flex-1 cursor-pointer`} href="/admin/settlements">
          목록
        </Link>
        {settlement.status === "pending" ?
          <button
            className={`${ui.btnPrimary} h-11 flex-1 cursor-pointer disabled:opacity-50`}
            disabled={isPending}
            onClick={() => runAction("confirm")}
            type="button"
          >
            정산 확정
          </button>
        : null}
        {settlement.status === "confirmed" ?
          <button
            className={`${ui.btnPrimary} h-11 flex-1 cursor-pointer disabled:opacity-50`}
            disabled={isPending}
            onClick={() => runAction("paid")}
            type="button"
          >
            지급 완료
          </button>
        : null}
        {settlement.status === "pending" || settlement.status === "confirmed" ?
          <button
            className={`${ui.btnOutline} h-11 flex-1 cursor-pointer disabled:opacity-50`}
            disabled={isPending}
            onClick={() => runAction("cancel")}
            type="button"
          >
            취소
          </button>
        : null}
      </div>
    </div>
  );
}
