"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { updateAdminReviewStatusAction } from "@/app/actions/admin-reviews";
import type { AdminReviewListItem } from "@/lib/data/admin-reviews";
import type { ReviewModerationStatus } from "@/lib/reviews/rating-utils";
import { ui } from "@/lib/ui";

type AdminReviewsContentProps = {
  reviews: AdminReviewListItem[];
  filter: "all" | "reported";
};

function statusTone(status: ReviewModerationStatus) {
  if (status === "visible") {
    return "bg-green-50 text-green-700";
  }
  if (status === "reported") {
    return "bg-red-50 text-wadeal-red";
  }
  if (status === "hidden") {
    return "bg-gray-100 text-wadeal-muted";
  }
  return "bg-gray-200 text-gray-500";
}

export function AdminReviewsContent({ reviews, filter }: AdminReviewsContentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);

  if (reviews.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-wadeal-line bg-white px-6 py-12 text-center">
        <p className="text-sm font-black text-wadeal-ink">
          {filter === "reported" ? "신고된 리뷰가 없어요." : "등록된 리뷰가 없어요."}
        </p>
      </div>
    );
  }

  function handleStatusChange(reviewId: string, status: ReviewModerationStatus) {
    setFeedback(null);

    startTransition(async () => {
      const result = await updateAdminReviewStatusAction(reviewId, status);
      if (result.success) {
        setFeedback("리뷰 상태가 변경됐어요.");
        router.refresh();
        return;
      }

      setFeedback("상태 변경에 실패했어요. 잠시 후 다시 시도해 주세요.");
    });
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-bold text-wadeal-muted">
        총 {reviews.length.toLocaleString("ko-KR")}건
      </p>
      {feedback ?
        <p className="rounded-lg bg-green-50 px-3 py-2 text-xs font-bold text-green-700">
          {feedback}
        </p>
      : null}
      {reviews.map((review) => (
        <article
          className="rounded-xl border border-wadeal-line bg-white p-4"
          key={review.id}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-sm font-black text-wadeal-ink">{review.productName}</p>
              <span
                className={`inline-block rounded px-2 py-0.5 text-[10px] font-black ${statusTone(review.status)}`}
              >
                {review.statusLabel}
              </span>
            </div>
            <span className="shrink-0 text-xs font-bold text-wadeal-muted">
              {review.createdAt}
            </span>
          </div>

          <p className="mt-3 rounded-lg bg-wadeal-surface px-3 py-2 text-xs font-bold leading-relaxed text-wadeal-ink">
            {"★".repeat(review.rating)}
            {"☆".repeat(5 - review.rating)} · {review.content}
          </p>

          <dl className="mt-3 space-y-1.5 text-xs font-bold text-wadeal-muted">
            <div className="flex justify-between gap-3">
              <dt>작성자</dt>
              <dd className="font-black text-wadeal-ink">{review.maskedUserId}</dd>
            </div>
            {review.isVerifiedPurchase ?
              <div className="flex justify-between gap-3">
                <dt>구매 인증</dt>
                <dd className="font-black text-green-700">구매확정 리뷰</dd>
              </div>
            : null}
          </dl>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <Link
              className={`${ui.btnOutline} h-11 cursor-pointer`}
              href={`/product/${review.productId}#product-reviews`}
            >
              상품 보기
            </Link>
            {review.status === "visible" ?
              <button
                className={`${ui.btnOutline} h-11 cursor-pointer disabled:opacity-50`}
                disabled={isPending}
                onClick={() => handleStatusChange(review.id, "hidden")}
                type="button"
              >
                숨기기
              </button>
            : review.status === "hidden" || review.status === "reported" ?
              <button
                className={`${ui.btnPrimary} h-11 cursor-pointer disabled:opacity-50`}
                disabled={isPending}
                onClick={() => handleStatusChange(review.id, "visible")}
                type="button"
              >
                노출하기
              </button>
            : <button
                className={`${ui.btnOutline} h-11 cursor-not-allowed opacity-50`}
                disabled
                type="button"
              >
                삭제됨
              </button>}
            {review.status !== "deleted" ?
              <button
                className={`${ui.btnOutline} col-span-2 h-11 cursor-pointer text-wadeal-red disabled:opacity-50`}
                disabled={isPending}
                onClick={() => handleStatusChange(review.id, "deleted")}
                type="button"
              >
                삭제 처리
              </button>
            : null}
          </div>
        </article>
      ))}
    </div>
  );
}
