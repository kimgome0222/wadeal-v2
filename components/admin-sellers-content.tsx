"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { reviewSellerApplicationAction } from "@/app/actions/admin-sellers";
import type { SellerRecord } from "@/lib/data/sellers";
import { getSellerStatusLabel } from "@/lib/sellers/types";
import { ui } from "@/lib/ui";

type AdminSellersContentProps = {
  sellers: SellerRecord[];
  showPendingOnly?: boolean;
};

export function AdminSellersContent({
  sellers,
  showPendingOnly = false,
}: AdminSellersContentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ tone: "success" | "error"; message: string } | null>(
    null,
  );
  const [rejectingSellerId, setRejectingSellerId] = useState<string | null>(null);
  const [rejectedReason, setRejectedReason] = useState("");

  const visibleSellers =
    showPendingOnly ? sellers.filter((seller) => seller.status === "pending_review") : sellers;

  function handleReview(
    sellerId: string,
    decision: "approved" | "rejected" | "suspended",
    reason?: string,
  ) {
    setFeedback(null);
    startTransition(async () => {
      const result = await reviewSellerApplicationAction({
        sellerId,
        decision,
        rejectedReason: decision === "rejected" ? reason : undefined,
      });
      if (result.success) {
        setFeedback({ tone: "success", message: result.message });
        setRejectingSellerId(null);
        setRejectedReason("");
      } else {
        setFeedback({ tone: "error", message: result.message });
      }
      router.refresh();
    });
  }

  if (visibleSellers.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-wadeal-line bg-white px-6 py-12 text-center">
        <p className="text-sm font-black text-wadeal-ink">
          {showPendingOnly ? "대기 중인 판매자 신청이 없어요." : "등록된 판매자가 없어요."}
        </p>
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
            : "bg-red-50 text-wadeal-red"
          }`}
        >
          {feedback.message}
        </p>
      : null}
      {visibleSellers.map((seller) => (
        <article className={`${ui.panel} space-y-3`} key={seller.id}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-black text-wadeal-ink">{seller.companyName}</p>
              <p className="mt-0.5 text-xs font-bold text-wadeal-muted">
                사업자번호 {seller.businessNumber}
              </p>
            </div>
            <span className="shrink-0 rounded bg-gray-100 px-2 py-0.5 text-[10px] font-black text-wadeal-muted">
              {getSellerStatusLabel(seller.status)}
            </span>
          </div>
          <dl className="grid gap-1.5 text-xs font-bold text-wadeal-muted sm:grid-cols-2">
            <div>
              <dt className="text-[10px] uppercase tracking-wide">정산 은행</dt>
              <dd className="font-black text-wadeal-ink">{seller.bankName ?? "-"}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-wide">계좌번호</dt>
              <dd className="font-black text-wadeal-ink">{seller.accountNumber ?? "-"}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-wide">예금주</dt>
              <dd className="font-black text-wadeal-ink">{seller.accountHolder ?? "-"}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-wide">신청일</dt>
              <dd className="font-black text-wadeal-ink">
                {new Date(seller.createdAt).toLocaleDateString("ko-KR")}
              </dd>
            </div>
          </dl>
          {seller.status === "rejected" && seller.rejectedReason ?
            <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-wadeal-red">
              반려 사유: {seller.rejectedReason}
            </p>
          : null}
          <Link
            className={`${ui.btnOutline} flex h-10 items-center justify-center text-sm`}
            href={`/admin/sellers/${seller.id}/review`}
          >
            심사 상세
          </Link>
          {seller.status === "pending_review" ?
            rejectingSellerId === seller.id ?
              <div className="space-y-2">
                <label className={ui.label} htmlFor={`reject-reason-${seller.id}`}>
                  반려 사유
                </label>
                <textarea
                  className={`${ui.input} min-h-[80px] py-3`}
                  id={`reject-reason-${seller.id}`}
                  onChange={(event) => setRejectedReason(event.target.value)}
                  placeholder="판매자에게 전달할 반려 사유를 입력해 주세요"
                  value={rejectedReason}
                />
                <div className="grid grid-cols-2 gap-2">
                  <button
                    className={`${ui.btnPrimary} h-10 cursor-pointer text-sm disabled:opacity-50`}
                    disabled={isPending || !rejectedReason.trim()}
                    onClick={() => handleReview(seller.id, "rejected", rejectedReason.trim())}
                    type="button"
                  >
                    반려 확정
                  </button>
                  <button
                    className={`${ui.btnOutline} h-10 cursor-pointer text-sm disabled:opacity-50`}
                    disabled={isPending}
                    onClick={() => {
                      setRejectingSellerId(null);
                      setRejectedReason("");
                    }}
                    type="button"
                  >
                    취소
                  </button>
                </div>
              </div>
            : <div className="grid grid-cols-2 gap-2">
                <button
                  className={`${ui.btnPrimary} h-10 cursor-pointer text-sm disabled:opacity-50`}
                  disabled={isPending}
                  onClick={() => handleReview(seller.id, "approved")}
                  type="button"
                >
                  승인
                </button>
                <button
                  className={`${ui.btnOutline} h-10 cursor-pointer text-sm text-wadeal-red disabled:opacity-50`}
                  disabled={isPending}
                  onClick={() => {
                    setRejectingSellerId(seller.id);
                    setRejectedReason("");
                  }}
                  type="button"
                >
                  반려
                </button>
              </div>

          : seller.status === "approved" ?
            <button
              className={`${ui.btnOutline} h-10 w-full cursor-pointer text-sm text-wadeal-red disabled:opacity-50`}
              disabled={isPending}
              onClick={() => handleReview(seller.id, "suspended")}
              type="button"
            >
              계정 정지
            </button>
          : null}
        </article>
      ))}
    </div>
  );
}
