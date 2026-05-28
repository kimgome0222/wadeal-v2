"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { confirmSellerSettlementAction } from "@/app/actions/seller-finance";
import type { SellerSettlementRecord } from "@/lib/settlements/seller-settlement-types";
import {
  formatKrw,
  formatSettlementPeriod,
  getSellerSettlementRecordStatusLabel,
  sellerSettlementStatusTone,
} from "@/lib/settlements/seller-settlement-types";
import { ui } from "@/lib/ui";

type SellerSettlementsContentProps = {
  records: SellerSettlementRecord[];
  selectedRecordId?: string | null;
};

export function SellerSettlementsContent({
  records,
  selectedRecordId,
}: SellerSettlementsContentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);

  const selected =
    records.find((record) => record.id === selectedRecordId) ?? records[0] ?? null;

  function handleConfirm(recordId: string) {
    setFeedback(null);
    startTransition(async () => {
      const result = await confirmSellerSettlementAction(recordId);
      setFeedback(result.message);
      if (result.success) {
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-4">
      {records.length === 0 ?
        <div className={`${ui.panel} py-10 text-center`}>
          <p className="text-sm font-bold text-wadeal-muted">아직 정산 내역이 없어요.</p>
        </div>
      : <>
          <div className="space-y-2">
            {records.map((record) => (
              <button
                className={`${ui.panel} w-full text-left ${
                  selected?.id === record.id ? "ring-2 ring-wadeal-red/30" : ""
                }`}
                key={record.id}
                onClick={() => router.push(`/seller/finance/settlements?record=${record.id}`)}
                type="button"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-black text-wadeal-ink">
                      {formatSettlementPeriod(record.periodStart, record.periodEnd)}
                    </p>
                    <p className="mt-1 text-xs font-bold text-wadeal-muted">
                      최종 입금 예정 {formatKrw(record.netPayoutAmount)}
                    </p>
                  </div>
                  <span
                    className={`rounded px-2 py-1 text-[10px] font-black ${sellerSettlementStatusTone(record.status)}`}
                  >
                    {getSellerSettlementRecordStatusLabel(record.status)}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {selected ?
            <div className={`${ui.panel} space-y-4`}>
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-black text-wadeal-ink">정산 상세 영수증</h2>
                <span
                  className={`rounded px-2 py-1 text-[10px] font-black ${sellerSettlementStatusTone(selected.status)}`}
                >
                  {getSellerSettlementRecordStatusLabel(selected.status)}
                </span>
              </div>

              <div className="divide-y divide-wadeal-line rounded-lg border border-wadeal-line">
                {selected.items.map((item) => (
                  <div
                    className="flex items-center justify-between px-3 py-2 text-sm"
                    key={`${selected.id}-${item.id}-${item.label}`}
                  >
                    <span className="font-bold text-wadeal-muted">{item.label}</span>
                    <span
                      className={`font-black ${
                        item.amount < 0 ? "text-wadeal-red" : "text-wadeal-ink"
                      }`}
                    >
                      {formatKrw(Math.abs(item.amount))}
                      {item.amount < 0 ? " (-)" : ""}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between bg-gray-50 px-3 py-3">
                  <span className="text-sm font-black text-wadeal-ink">최종 입금 예정액</span>
                  <span className="text-base font-black text-wadeal-red">
                    {formatKrw(selected.netPayoutAmount)}
                  </span>
                </div>
              </div>

              {selected.status === "paid" ?
                <div className="rounded-lg bg-green-50 px-3 py-3 text-xs font-bold text-green-700">
                  입금 완료
                  {selected.depositConfirmedAt ?
                    ` · ${new Date(selected.depositConfirmedAt).toLocaleString("ko-KR")}`
                  : null}
                  {selected.receiptReference ?
                    <div className="mt-2">
                      <button
                        className={`${ui.btnOutline} h-9 text-xs`}
                        onClick={() =>
                          alert(`입금 영수증 다운로드 준비 중\n참조번호: ${selected.receiptReference}`)
                        }
                        type="button"
                      >
                        입금 영수증 다운로드 (준비 중)
                      </button>
                    </div>
                  : null}
                </div>
              : null}

              {selected.status === "pending_seller_confirm" ?
                <button
                  className={`${ui.btnPrimary} h-11 disabled:opacity-50`}
                  disabled={isPending}
                  onClick={() => handleConfirm(selected.id)}
                  type="button"
                >
                  {isPending ? "처리 중..." : "정산 내역 확인 완료"}
                </button>
              : null}

              {feedback ?
                <p className="text-xs font-bold text-wadeal-muted" role="status">
                  {feedback}
                </p>
              : null}
            </div>
          : null}
        </>
      }
    </div>
  );
}
