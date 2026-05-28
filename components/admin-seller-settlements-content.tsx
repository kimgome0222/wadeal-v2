"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import {
  adminConfirmSellerSettlementAction,
  adminPaySellerSettlementAction,
} from "@/app/actions/admin-seller-settlements";
import type { SellerSettlementRecord } from "@/lib/settlements/seller-settlement-types";
import {
  formatKrw,
  formatSettlementPeriod,
  getSellerSettlementRecordStatusLabel,
  sellerSettlementStatusTone,
} from "@/lib/settlements/seller-settlement-types";
import { ui } from "@/lib/ui";

type AdminSellerSettlementsContentProps = {
  records: (SellerSettlementRecord & { companyName: string })[];
};

export function AdminSellerSettlementsContent({ records }: AdminSellerSettlementsContentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function runAction(action: (recordId: string) => Promise<{ success: boolean; message: string }>, recordId: string) {
    startTransition(async () => {
      await action(recordId);
      router.refresh();
    });
  }

  if (records.length === 0) {
    return (
      <div className={`${ui.panel} py-8 text-center`}>
        <p className="text-sm font-bold text-wadeal-muted">판매자 정산 명세가 없어요.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {records.map((record) => (
        <div className={`${ui.panel} space-y-3`} key={record.id}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm font-black text-wadeal-ink">{record.companyName}</p>
              <p className="text-xs font-bold text-wadeal-muted">
                {formatSettlementPeriod(record.periodStart, record.periodEnd)} ·{" "}
                {formatKrw(record.netPayoutAmount)}
              </p>
            </div>
            <span
              className={`rounded px-2 py-1 text-[10px] font-black ${sellerSettlementStatusTone(record.status)}`}
            >
              {getSellerSettlementRecordStatusLabel(record.status)}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {(record.status === "pending_seller_confirm" || record.status === "seller_confirmed") && (
              <button
                className={`${ui.btnOutline} h-9 px-3 text-xs disabled:opacity-50`}
                disabled={isPending}
                onClick={() => runAction(adminConfirmSellerSettlementAction, record.id)}
                type="button"
              >
                정산 확정
              </button>
            )}
            {record.status === "confirmed" && (
              <button
                className={`${ui.btnPrimary} h-9 px-3 text-xs disabled:opacity-50`}
                disabled={isPending}
                onClick={() => runAction(adminPaySellerSettlementAction, record.id)}
                type="button"
              >
                입금 완료 처리
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
