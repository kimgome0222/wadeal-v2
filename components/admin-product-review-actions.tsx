"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  approveAdminProductAction,
  rejectAdminProductAction,
  resubmitAdminProductReviewAction,
} from "@/app/actions/admin-products";
import type { AdminProductListItem } from "@/lib/admin-products/shared";
import {
  approvalStatusTone,
  getProductApprovalStatusLabel,
} from "@/lib/products/approval-status";
import { ui } from "@/lib/ui";

type AdminProductReviewActionsProps = {
  product: Pick<
    AdminProductListItem,
    "productId" | "approvalStatus" | "rejectedReason" | "name"
  >;
  layout?: "list" | "detail";
};

export function AdminProductReviewActions({
  product,
  layout = "list",
}: AdminProductReviewActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  function handleApprove() {
    setFeedback(null);
    startTransition(async () => {
      const result = await approveAdminProductAction(product.productId);
      if (!result.success) {
        setFeedback("승인에 실패했어요.");
        return;
      }
      router.refresh();
    });
  }

  function handleReject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    startTransition(async () => {
      const result = await rejectAdminProductAction({
        productId: product.productId,
        reason: rejectReason,
      });

      if (!result.success) {
        setFeedback(
          result.error === "invalid_input"
            ? "반려 사유를 입력해 주세요."
            : "반려 처리에 실패했어요.",
        );
        return;
      }

      setShowRejectForm(false);
      setRejectReason("");
      router.refresh();
    });
  }

  function handleResubmit() {
    setFeedback(null);
    startTransition(async () => {
      const result = await resubmitAdminProductReviewAction(product.productId);
      if (!result.success) {
        setFeedback("재검수 요청에 실패했어요.");
        return;
      }
      router.refresh();
    });
  }

  const buttonClass = layout === "detail" ? "h-11" : "h-10";

  return (
    <div className="space-y-2">
      {feedback ?
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-wadeal-red" role="alert">
          {feedback}
        </p>
      : null}

      {product.approvalStatus === "rejected" && product.rejectedReason ?
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-wadeal-red">
          반려 사유: {product.rejectedReason}
        </p>
      : null}

      {product.approvalStatus === "pending_review" ?
        <div className="grid grid-cols-2 gap-2">
          <button
            className={`${ui.btnPrimary} ${buttonClass} cursor-pointer text-sm disabled:opacity-50`}
            disabled={isPending}
            onClick={handleApprove}
            type="button"
          >
            승인
          </button>
          <button
            className={`${ui.btnOutline} ${buttonClass} cursor-pointer text-sm text-wadeal-red disabled:opacity-50`}
            disabled={isPending}
            onClick={() => setShowRejectForm((value) => !value)}
            type="button"
          >
            반려
          </button>
        </div>
      : null}

      {showRejectForm ?
        <form className="space-y-2" onSubmit={handleReject}>
          <label className={ui.label} htmlFor={`reject-reason-${product.productId}`}>
            반려 사유
          </label>
          <textarea
            className={`${ui.input} min-h-[88px] resize-y`}
            id={`reject-reason-${product.productId}`}
            onChange={(event) => setRejectReason(event.target.value)}
            placeholder="수정이 필요한 항목을 입력해 주세요."
            required
            value={rejectReason}
          />
          <button
            className={`${ui.btnOutline} ${buttonClass} w-full cursor-pointer text-sm text-wadeal-red disabled:opacity-50`}
            disabled={isPending}
            type="submit"
          >
            반려 확정
          </button>
        </form>
      : null}

      {product.approvalStatus === "rejected" ?
        <button
          className={`${ui.btnOutline} ${buttonClass} w-full cursor-pointer text-sm disabled:opacity-50`}
          disabled={isPending}
          onClick={handleResubmit}
          type="button"
        >
          재검수 요청
        </button>
      : null}
    </div>
  );
}

export function AdminProductApprovalBadge({
  status,
}: {
  status: AdminProductListItem["approvalStatus"];
}) {
  return (
    <span
      className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-black ${approvalStatusTone(status)}`}
    >
      {getProductApprovalStatusLabel(status)}
    </span>
  );
}
