"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  approveSellerProductRequestAction,
  rejectSellerProductRequestAction,
} from "@/app/actions/admin-seller-product-requests";
import type { AdminSellerProductRequestItem } from "@/lib/data/admin-seller-product-requests";
import { getSellerProductRequestStatusLabel } from "@/lib/seller-product-request-labels";
import { currency } from "@/lib/deals";
import { ui } from "@/lib/ui";

type AdminSellerProductRequestsContentProps = {
  requests: AdminSellerProductRequestItem[];
};

export function AdminSellerProductRequestsContent({
  requests,
}: AdminSellerProductRequestsContentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ tone: "success" | "error"; message: string } | null>(
    null,
  );
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  function handleApprove(requestId: string) {
    setFeedback(null);
    startTransition(async () => {
      const result = await approveSellerProductRequestAction(requestId);
      setFeedback({
        tone: result.success ? "success" : "error",
        message: result.message,
      });
      router.refresh();
    });
  }

  function handleReject(requestId: string) {
    setFeedback(null);
    startTransition(async () => {
      const result = await rejectSellerProductRequestAction(requestId, rejectReason);
      setFeedback({
        tone: result.success ? "success" : "error",
        message: result.message,
      });
      if (result.success) {
        setRejectingId(null);
        setRejectReason("");
      }
      router.refresh();
    });
  }

  if (requests.length === 0) {
    return (
      <div className={`${ui.panel} py-10 text-center`}>
        <p className="text-sm font-black text-wadeal-ink">대기 중인 판매자 상품 요청이 없어요.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {feedback ?
        <p
          className={`rounded-lg px-3 py-2 text-xs font-bold ${
            feedback.tone === "success" ?
              "bg-green-50 text-green-700"
            : "bg-[#F5F8F4] text-wadeal-red"
          }`}
        >
          {feedback.message}
        </p>
      : null}

      {requests.map((request) => {
        const isPendingQueue =
          request.status === "pending" || request.status === "under_review";

        return (
          <article className={`${ui.panel} space-y-3`} key={request.id}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-black text-wadeal-ink">{request.productName}</p>
                <p className="mt-0.5 text-xs font-bold text-wadeal-muted">
                  {request.sellerCompanyName ?? "판매자"} ·{" "}
                  {getSellerProductRequestStatusLabel(request.status)}
                </p>
              </div>
              <span className="shrink-0 rounded bg-gray-100 px-2 py-0.5 text-[10px] font-black text-wadeal-muted">
                {new Date(request.createdAt).toLocaleDateString("ko-KR")}
              </span>
            </div>

            {request.description ?
              <p className="text-xs font-bold text-wadeal-muted">{request.description}</p>
            : null}

            <dl className="grid gap-1 text-xs font-bold text-wadeal-muted sm:grid-cols-2">
              <div>
                <dt className="inline">판매가 </dt>
                <dd className="inline font-black text-wadeal-ink">
                  {request.groupPrice != null ? `${currency.format(request.groupPrice)}원` : "-"}
                </dd>
              </div>
              <div>
                <dt className="inline">정가 </dt>
                <dd className="inline font-black text-wadeal-ink">
                  {request.originalPrice != null ?
                    `${currency.format(request.originalPrice)}원`
                  : "-"}
                </dd>
              </div>
              <div>
                <dt className="inline">목표 </dt>
                <dd className="inline font-black text-wadeal-ink">
                  {request.targetParticipants?.toLocaleString("ko-KR") ?? "-"}명
                </dd>
              </div>
            </dl>

            {request.rejectedReason && request.status === "rejected" ?
              <p className="rounded-lg bg-[#F5F8F4] px-3 py-2 text-xs font-bold text-wadeal-red">
                반려: {request.rejectedReason}
              </p>
            : null}

            {isPendingQueue ?
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <button
                    className={`${ui.btnPrimary} h-10 px-4 text-xs disabled:opacity-50`}
                    disabled={isPending}
                    onClick={() => handleApprove(request.id)}
                    type="button"
                  >
                    승인
                  </button>
                  <button
                    className={`${ui.btnOutline} h-10 px-4 text-xs disabled:opacity-50`}
                    disabled={isPending}
                    onClick={() => {
                      setRejectingId(rejectingId === request.id ? null : request.id);
                      setRejectReason("");
                    }}
                    type="button"
                  >
                    반려
                  </button>
                </div>
                {rejectingId === request.id ?
                  <div className="space-y-2">
                    <textarea
                      className="min-h-20 w-full rounded-xl bg-gray-50 px-3 py-2 text-xs font-bold outline-none"
                      onChange={(event) => setRejectReason(event.target.value)}
                      placeholder="반려 사유"
                      value={rejectReason}
                    />
                    <button
                      className={`${ui.btnOutline} h-10 w-full text-xs disabled:opacity-50`}
                      disabled={isPending || !rejectReason.trim()}
                      onClick={() => handleReject(request.id)}
                      type="button"
                    >
                      반려 확정
                    </button>
                  </div>
                : null}
              </div>
            : null}
          </article>
        );
      })}
    </div>
  );
}
