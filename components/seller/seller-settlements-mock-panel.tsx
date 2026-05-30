"use client";

import {
  getSettlementStatusLabel,
  MOCK_SETTLEMENT_RECORDS,
} from "@/lib/sellers/mock-seller-center-data";
import { ui } from "@/lib/ui";

export function SellerSettlementsMockPanel() {
  const scheduled = MOCK_SETTLEMENT_RECORDS.filter((r) => r.status === "scheduled").reduce(
    (sum, r) => sum + r.netAmount,
    0,
  );
  const paid = MOCK_SETTLEMENT_RECORDS.filter((r) => r.status === "paid").reduce(
    (sum, r) => sum + r.netAmount,
    0,
  );

  return (
    <div className="space-y-4">
      <p className="text-[11px] font-bold text-wadeal-muted">
        mock 정산 — 실제 지급/계좌 저장 없음 · 정산 주기: TODO (월 2회 placeholder)
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className={`${ui.panel} space-y-1`}>
          <p className="text-[10px] font-bold text-wadeal-muted">정산 예정</p>
          <p className="text-lg font-black text-wadeal-ink">{scheduled.toLocaleString("ko-KR")}원</p>
        </div>
        <div className={`${ui.panel} space-y-1`}>
          <p className="text-[10px] font-bold text-wadeal-muted">지급 완료</p>
          <p className="text-lg font-black text-wadeal-ink">{paid.toLocaleString("ko-KR")}원</p>
        </div>
        <div className={`${ui.panel} space-y-1`}>
          <p className="text-[10px] font-bold text-wadeal-muted">정산 계좌</p>
          <p className="text-sm font-black text-wadeal-ink">{MOCK_SETTLEMENT_RECORDS[0]?.accountMasked}</p>
        </div>
      </div>
      <div className="space-y-2">
        {MOCK_SETTLEMENT_RECORDS.map((record) => (
          <article className={`${ui.panel} space-y-2`} key={record.id}>
            <div className="flex justify-between gap-2">
              <p className="text-sm font-black text-wadeal-ink">{record.period}</p>
              <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-black">
                {getSettlementStatusLabel(record.status)}
              </span>
            </div>
            <dl className="grid grid-cols-2 gap-1 text-[11px] font-bold text-wadeal-muted">
              <div>매출 {record.grossAmount.toLocaleString("ko-KR")}원</div>
              <div>수수료 -{record.feeAmount.toLocaleString("ko-KR")}원</div>
              <div>환불 -{record.refundDeduction.toLocaleString("ko-KR")}원</div>
              <div className="text-wadeal-red">입금 {record.netAmount.toLocaleString("ko-KR")}원</div>
            </dl>
          </article>
        ))}
      </div>
    </div>
  );
}
