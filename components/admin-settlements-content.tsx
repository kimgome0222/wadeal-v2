"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import {
  cancelSettlementAction,
  confirmSettlementAction,
  markSettlementPaidAction,
} from "@/app/actions/admin-settlements";
import { currency } from "@/lib/deals";
import {
  ADMIN_SETTLEMENT_STATUS_FILTER_OPTIONS,
  getSettlementStatusLabel,
  settlementStatusTone,
  type AdminSettlementListItem,
  type AdminSettlementStatusFilter,
} from "@/lib/admin-settlements/shared";
import { ui } from "@/lib/ui";

type AdminSettlementsContentProps = {
  settlements: AdminSettlementListItem[];
  initialFilter: AdminSettlementStatusFilter;
};

function formatDate(iso: string | null): string {
  if (!iso) {
    return "-";
  }

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("ko-KR");
}

export function AdminSettlementsContent({
  settlements,
  initialFilter,
}: AdminSettlementsContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [filter, setFilter] = useState<AdminSettlementStatusFilter>(initialFilter);
  const [feedback, setFeedback] = useState<{ tone: "success" | "error"; message: string } | null>(
    null,
  );

  const filteredSettlements = useMemo(() => {
    if (filter === "all") {
      return settlements;
    }

    return settlements.filter((item) => item.status === filter);
  }, [filter, settlements]);

  const totals = useMemo(() => {
    return filteredSettlements.reduce(
      (acc, item) => ({
        sales: acc.sales + item.totalSalesAmount,
        commission: acc.commission + item.commissionAmount,
        settlement: acc.settlement + item.settlementAmount,
      }),
      { sales: 0, commission: 0, settlement: 0 },
    );
  }, [filteredSettlements]);

  function applyFilter(nextFilter: AdminSettlementStatusFilter) {
    setFilter(nextFilter);
    const params = new URLSearchParams(searchParams.toString());

    if (nextFilter === "all") {
      params.delete("status");
    } else {
      params.set("status", nextFilter);
    }

    router.replace(`/admin/settlements?${params.toString()}`);
  }

  function runAction(
    settlementId: string,
    action: "confirm" | "paid" | "cancel",
  ) {
    setFeedback(null);

    startTransition(async () => {
      const result =
        action === "confirm"
          ? await confirmSettlementAction(settlementId)
          : action === "paid"
            ? await markSettlementPaidAction(settlementId)
            : await cancelSettlementAction(settlementId);

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
    <div className="space-y-3">
      {feedback ?
        <p
          className={`rounded-lg px-3 py-2 text-xs font-bold ${
            feedback.tone === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}
        >
          {feedback.message}
        </p>
      : null}

      <div className="flex flex-wrap gap-2">
        {ADMIN_SETTLEMENT_STATUS_FILTER_OPTIONS.map((option) => {
          const active = filter === option.value;

          return (
            <button
              className={`rounded-full border px-3 py-1.5 text-xs font-black ${
                active
                  ? "border-wadeal-red bg-wadeal-red text-white"
                  : "border-wadeal-line bg-white text-wadeal-muted"
              }`}
              key={option.value}
              onClick={() => applyFilter(option.value)}
              type="button"
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <div className="rounded-xl border border-wadeal-line bg-white p-4">
        <p className="text-xs font-black text-wadeal-ink">필터 합계</p>
        <dl className="mt-2 space-y-1 text-xs font-bold text-wadeal-muted">
          <div className="flex justify-between gap-3">
            <dt>총 매출</dt>
            <dd className="font-black text-wadeal-ink">
              {currency.format(totals.sales)}원
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>수수료</dt>
            <dd className="font-black text-wadeal-red">
              {currency.format(totals.commission)}원
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>정산 금액</dt>
            <dd className="font-black text-wadeal-ink">
              {currency.format(totals.settlement)}원
            </dd>
          </div>
        </dl>
      </div>

      {filteredSettlements.length === 0 ?
        <div className="rounded-xl border border-dashed border-wadeal-line bg-white px-6 py-12 text-center">
          <p className="text-sm font-black text-wadeal-ink">정산 내역이 없어요.</p>
          <p className="mt-1 text-xs font-bold text-wadeal-muted">
            공동구매 마감 후 공급사가 연결된 상품은 정산이 생성돼요.
          </p>
        </div>
      : <>
          <p className="text-xs font-bold text-wadeal-muted">
            총 {filteredSettlements.length.toLocaleString("ko-KR")}건
          </p>
          {filteredSettlements.map((settlement) => (
            <article
              className="rounded-xl border border-wadeal-line bg-white p-4"
              key={settlement.id}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-wadeal-ink">
                    {settlement.productName}
                  </p>
                  <p className="mt-0.5 truncate text-xs font-bold text-wadeal-muted">
                    {settlement.supplierName}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-black ${settlementStatusTone(settlement.status)}`}
                >
                  {getSettlementStatusLabel(settlement.status)}
                </span>
              </div>

              <dl className="mt-3 space-y-1.5 text-xs font-bold text-wadeal-muted">
                <div className="flex justify-between gap-3">
                  <dt>총 매출</dt>
                  <dd className="font-black text-wadeal-ink">
                    {currency.format(settlement.totalSalesAmount)}원
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>수수료 ({settlement.commissionRate}%)</dt>
                  <dd className="font-black text-wadeal-red">
                    {currency.format(settlement.commissionAmount)}원
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>정산 금액</dt>
                  <dd className="font-black text-wadeal-ink">
                    {currency.format(settlement.settlementAmount)}원
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>생성일</dt>
                  <dd className="font-black text-wadeal-ink">
                    {formatDate(settlement.createdAt)}
                  </dd>
                </div>
                {settlement.settledAt ?
                  <div className="flex justify-between gap-3">
                    <dt>지급일</dt>
                    <dd className="font-black text-wadeal-ink">
                      {formatDate(settlement.settledAt)}
                    </dd>
                  </div>
                : null}
              </dl>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  className={`${ui.btnOutline} h-9 flex-1 cursor-pointer text-xs`}
                  href={`/admin/settlements/${settlement.id}`}
                >
                  상세
                </Link>
                {settlement.status === "pending" ?
                  <button
                    className={`${ui.btnPrimary} h-9 flex-1 cursor-pointer text-xs disabled:opacity-50`}
                    disabled={isPending}
                    onClick={() => runAction(settlement.id, "confirm")}
                    type="button"
                  >
                    확정
                  </button>
                : null}
                {settlement.status === "confirmed" ?
                  <button
                    className={`${ui.btnPrimary} h-9 flex-1 cursor-pointer text-xs disabled:opacity-50`}
                    disabled={isPending}
                    onClick={() => runAction(settlement.id, "paid")}
                    type="button"
                  >
                    지급 완료
                  </button>
                : null}
                {settlement.status === "pending" || settlement.status === "confirmed" ?
                  <button
                    className={`${ui.btnOutline} h-9 flex-1 cursor-pointer text-xs disabled:opacity-50`}
                    disabled={isPending}
                    onClick={() => runAction(settlement.id, "cancel")}
                    type="button"
                  >
                    취소
                  </button>
                : null}
              </div>
            </article>
          ))}
        </>
      }
    </div>
  );
}
