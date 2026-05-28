"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  approveRefundRequestAction,
  rejectRefundRequestAction,
} from "@/app/actions/admin-refunds";
import type { RefundRecord } from "@/lib/data/refunds";
import { ui } from "@/lib/ui";

type AdminRefundsContentProps = {
  refunds: RefundRecord[];
};

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function AdminRefundsContent({ refunds }: AdminRefundsContentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [feedback, setFeedback] = useState<{ tone: "success" | "error"; message: string } | null>(
    null,
  );

  const selected = refunds.find((refund) => refund.id === selectedId) ?? null;

  function handleApprove(refundId: string) {
    setFeedback(null);
    startTransition(async () => {
      const result = await approveRefundRequestAction(refundId);
      setFeedback({ tone: result.ok ? "success" : "error", message: result.message });
      if (result.ok) {
        setSelectedId(null);
        setRejectReason("");
        router.refresh();
      }
    });
  }

  function handleReject(refundId: string) {
    setFeedback(null);
    startTransition(async () => {
      const result = await rejectRefundRequestAction(refundId, rejectReason);
      setFeedback({ tone: result.ok ? "success" : "error", message: result.message });
      if (result.ok) {
        setSelectedId(null);
        setRejectReason("");
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-3">
      {feedback ?
        <p
          className={`rounded-lg px-3 py-2 text-xs font-bold ${
            feedback.tone === "success" ?
              "bg-green-50 text-green-700"
            : "bg-red-50 text-wadeal-red"
          }`}
        >
          {feedback.message}
        </p>
      : null}

      {refunds.length === 0 ?
        <div className={`${ui.panel} text-center`}>
          <p className="text-sm font-black text-wadeal-ink">대기 중인 환불/취소 요청이 없어요.</p>
          <Link className={`${ui.btnOutline} mt-3 inline-block`} href="/admin/orders">
            주문 관리로 이동
          </Link>
        </div>
      : refunds.map((refund) => (
        <div className={ui.panel} key={refund.id}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-black text-wadeal-ink">{refund.productName}</p>
              <p className="mt-1 text-xs font-bold text-wadeal-muted">
                {refund.claimType === "cancel" ? "취소 요청" : "환불 요청"} · 주문{" "}
                {refund.orderNumber}
              </p>
              <p className="mt-1 text-xs font-bold text-wadeal-muted">
                {refund.buyerName} · {formatDate(refund.createdAt)}
              </p>
            </div>
            <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-black text-amber-900">
              대기
            </span>
          </div>

          <p className="mt-3 rounded-lg bg-wadeal-surface px-3 py-2 text-xs font-bold text-wadeal-ink">
            사유: {refund.reason}
          </p>
          <p className="mt-2 text-xs font-bold text-wadeal-muted">
            요청 금액: {refund.amount.toLocaleString("ko-KR")}원
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              className={`${ui.btnPrimary} disabled:opacity-50`}
              disabled={isPending}
              onClick={() => handleApprove(refund.id)}
              type="button"
            >
              승인
            </button>
            <button
              className={`${ui.btnOutline} disabled:opacity-50`}
              disabled={isPending}
              onClick={() => setSelectedId(refund.id)}
              type="button"
            >
              반려
            </button>
            <Link className={ui.btnOutline} href={`/admin/orders?status=전체`}>
              주문 상세
            </Link>
          </div>

          {selected?.id === refund.id ?
            <div className="mt-3 space-y-2 rounded-xl border border-wadeal-line p-3">
              <label className="block text-xs font-black text-wadeal-ink" htmlFor={`reject-${refund.id}`}>
                반려 사유
              </label>
              <textarea
                className="min-h-20 w-full rounded-lg border border-wadeal-line px-3 py-2 text-xs font-bold"
                id={`reject-${refund.id}`}
                onChange={(event) => setRejectReason(event.target.value)}
                placeholder="고객에게 전달할 반려 사유를 입력해 주세요."
                value={rejectReason}
              />
              <div className="flex gap-2">
                <button
                  className={`${ui.btnPrimary} disabled:opacity-50`}
                  disabled={isPending}
                  onClick={() => handleReject(refund.id)}
                  type="button"
                >
                  반려 확정
                </button>
                <button
                  className={ui.btnOutline}
                  onClick={() => {
                    setSelectedId(null);
                    setRejectReason("");
                  }}
                  type="button"
                >
                  취소
                </button>
              </div>
            </div>
          : null}
        </div>
      ))}
    </div>
  );
}
