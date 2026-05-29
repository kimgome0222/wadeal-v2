"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  submitReviewDeleteAction,
  submitReviewReportAction,
  submitReviewUpdateAction,
} from "@/app/actions/data";
import type { ProductReviewItem } from "@/lib/data/reviews";
import {
  REVIEW_REPORT_REASONS,
  type ReviewReportReason,
} from "@/lib/reviews/review-report-reasons";
import { renderStarString } from "@/lib/reviews/review-rules";
import { ui, motion } from "@/lib/ui";

type ReviewCardProps = {
  review: ProductReviewItem;
  productId: string;
  currentUserId?: string | null;
  isBestReview?: boolean;
  likeCount: number;
  isLiked: boolean;
  onToggleLike: () => void;
  hasReported?: boolean;
};

const CONTENT_CLAMP_THRESHOLD = 72;

export function ReviewCard({
  review,
  productId,
  currentUserId,
  isBestReview = false,
  likeCount,
  isLiked,
  onToggleLike,
  hasReported = false,
}: ReviewCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [expanded, setExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editRating, setEditRating] = useState(review.rating);
  const [editContent, setEditContent] = useState(review.content);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState<ReviewReportReason>(
    REVIEW_REPORT_REASONS[0],
  );
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [reportModalError, setReportModalError] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isOwnReview = Boolean(currentUserId && review.userId === currentUserId);
  const needsClamp =
    !isEditing &&
    (review.content.length > CONTENT_CLAMP_THRESHOLD ||
      review.content.split("\n").length > 3);

  function openReportModal() {
    setReportReason(REVIEW_REPORT_REASONS[0]);
    setReportModalError(null);
    setIsReportModalOpen(true);
  }

  function handleReportConfirm() {
    if (isPending || hasReported || reportSubmitted) {
      return;
    }

    setReportModalError(null);

    startTransition(async () => {
      const result = await submitReviewReportAction({
        reviewId: review.id,
        reason: reportReason,
      });

      if (result.success) {
        setIsReportModalOpen(false);
        setReportSubmitted(true);
        return;
      }

      if (result.error === "login_required") {
        setReportModalError("로그인 후 신고할 수 있어요.");
      } else if (result.error === "already_reported") {
        setIsReportModalOpen(false);
        setReportSubmitted(true);
      } else if (result.error === "forbidden") {
        setReportModalError("본인 리뷰는 신고할 수 없어요.");
      } else {
        setReportModalError("신고 접수에 실패했어요. 잠시 후 다시 시도해 주세요.");
      }
    });
  }

  function openEditForm() {
    setEditRating(review.rating);
    setEditContent(review.content);
    setIsEditing(true);
    setErrorMessage(null);
    setFeedbackMessage(null);
  }

  function cancelEdit() {
    setIsEditing(false);
    setEditRating(review.rating);
    setEditContent(review.content);
  }

  function handleUpdateSubmit() {
    if (!editContent.trim() || isPending) {
      return;
    }

    setErrorMessage(null);
    setFeedbackMessage(null);

    startTransition(async () => {
      const result = await submitReviewUpdateAction({
        reviewId: review.id,
        productId,
        rating: editRating,
        content: editContent,
      });

      if (result.success) {
        setIsEditing(false);
        setFeedbackMessage("리뷰가 수정됐어요.");
        router.refresh();
        return;
      }

      setErrorMessage("리뷰 수정에 실패했어요. 잠시 후 다시 시도해 주세요.");
    });
  }

  function handleDeleteConfirm() {
    if (isPending) {
      return;
    }

    setErrorMessage(null);
    setFeedbackMessage(null);

    startTransition(async () => {
      const result = await submitReviewDeleteAction({
        reviewId: review.id,
        productId,
      });

      setIsDeleteModalOpen(false);

      if (result.success) {
        router.refresh();
        return;
      }

      setErrorMessage("리뷰 삭제에 실패했어요. 잠시 후 다시 시도해 주세요.");
    });
  }

  return (
    <>
      <article className="rounded-xl border border-wadeal-line bg-wadeal-surface px-4 py-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <p className="text-xs font-black text-wadeal-red">
              {renderStarString(isEditing ? editRating : review.rating)}
            </p>
            {isBestReview && !isEditing ?
              <span className="rounded bg-wadeal-red px-1.5 py-0.5 text-[10px] font-black text-white">
                베스트 리뷰
              </span>
            : null}
            {review.isVerifiedPurchase && !isEditing ?
              <span className="rounded bg-green-700 px-1.5 py-0.5 text-[10px] font-black text-white">
                구매확정 리뷰
              </span>
            : null}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {isOwnReview ?
              <>
                <button
                  className="cursor-pointer text-[11px] font-black text-wadeal-muted active:text-wadeal-ink disabled:opacity-50"
                  disabled={isPending}
                  onClick={openEditForm}
                  type="button"
                >
                  수정
                </button>
                <button
                  className="cursor-pointer text-[11px] font-black text-wadeal-red active:opacity-80 disabled:opacity-50"
                  disabled={isPending}
                  onClick={() => setIsDeleteModalOpen(true)}
                  type="button"
                >
                  삭제
                </button>
              </>
            : hasReported || reportSubmitted ?
              <span className="text-[11px] font-bold text-green-700">신고 접수됨</span>
            : <button
                className="cursor-pointer text-[11px] font-black text-wadeal-muted active:text-wadeal-ink"
                onClick={openReportModal}
                type="button"
              >
                신고
              </button>
            }
            <span className="text-[11px] font-bold text-gray-400">{review.createdAt}</span>
          </div>
        </div>
        <p className="mt-1 text-[11px] font-bold text-wadeal-muted">{review.author}</p>

        {isEditing ?
          <div className="mt-3 space-y-3 rounded-lg border border-wadeal-line bg-white p-3">
            <div>
              <p className="text-xs font-black text-wadeal-ink">별점</p>
              <div className="mt-2 flex gap-1">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    className={`cursor-pointer text-lg ${value <= editRating ? "text-wadeal-red" : "text-gray-300"}`}
                    disabled={isPending}
                    key={value}
                    onClick={() => setEditRating(value)}
                    type="button"
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={ui.label} htmlFor={`review-edit-${review.id}`}>
                리뷰 내용
              </label>
              <textarea
                className="min-h-[96px] w-full rounded-lg border border-wadeal-line bg-white px-3 py-2 text-sm font-bold text-wadeal-ink outline-none placeholder:text-gray-300 focus:border-wadeal-red"
                disabled={isPending}
                id={`review-edit-${review.id}`}
                onChange={(event) => setEditContent(event.target.value)}
                value={editContent}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                className={`${ui.btnOutline} h-11 cursor-pointer disabled:opacity-50`}
                disabled={isPending}
                onClick={cancelEdit}
                type="button"
              >
                취소
              </button>
              <button
                className={`${ui.btnPrimary} h-11 cursor-pointer disabled:opacity-50`}
                disabled={!editContent.trim() || isPending}
                onClick={handleUpdateSubmit}
                type="button"
              >
                {isPending ? "저장 중..." : "저장하기"}
              </button>
            </div>
          </div>
        : <>
            {review.images.length > 0 ?
              <div className="mt-3 flex flex-wrap gap-2">
                {review.images.map((url) => (
                  <div
                    className="h-16 w-16 overflow-hidden rounded-lg border border-wadeal-line bg-white"
                    key={url}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img alt="" className="h-full w-full object-cover" src={url} />
                  </div>
                ))}
              </div>
            : null}
            <p
              className={`mt-3 text-[13px] font-bold leading-relaxed text-wadeal-ink ${!expanded && needsClamp ? "line-clamp-3" : ""}`}
            >
              {review.content}
            </p>
            {needsClamp ?
              <button
                className="mt-1.5 cursor-pointer text-xs font-black text-wadeal-muted active:text-wadeal-ink"
                onClick={() => setExpanded((prev) => !prev)}
                type="button"
              >
                {expanded ? "접기" : "더보기"}
              </button>
            : null}
            <div className="mt-3 flex items-center justify-between gap-3 border-t border-wadeal-line pt-3">
              <button
                className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-black transition-colors ${
                  isLiked ?
                    "border-wadeal-red bg-[#F5F8F4] text-wadeal-red"
                  : "border-wadeal-line bg-white text-wadeal-muted active:bg-gray-50"
                }`}
                disabled={isPending}
                onClick={onToggleLike}
                type="button"
              >
                <span aria-hidden>👍</span>
                도움돼요
                <span>{likeCount.toLocaleString("ko-KR")}</span>
              </button>
            </div>
          </>
        }

        {feedbackMessage ?
          <p className="mt-2 text-[11px] font-bold text-green-700">{feedbackMessage}</p>
        : null}
        {errorMessage ?
          <p className="mt-2 text-[11px] font-bold text-[#2E5E4E]">{errorMessage}</p>
        : null}
        {reportSubmitted ?
          <p className="mt-2 text-[11px] font-bold text-green-700">신고가 접수됐어요.</p>
        : null}
      </article>

      {isReportModalOpen ?
        <div
          aria-labelledby="review-report-title"
          aria-modal="true"
          className={motion.modalBackdrop}
          role="dialog"
        >
          <div className={`${motion.modalPanel} text-left`}>
            <h2 className="text-center text-lg font-black text-wadeal-ink" id="review-report-title">
              리뷰 신고
            </h2>
            <p className="mt-3 text-center text-sm font-bold leading-relaxed text-wadeal-muted">
              이 리뷰를 신고하시겠어요?
            </p>
            <div className="mt-4 space-y-2">
              {REVIEW_REPORT_REASONS.map((reason) => {
                const selected = reportReason === reason;

                return (
                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-3 ${
                      selected ?
                        "border-wadeal-red bg-[#F5F8F4]"
                      : "border-wadeal-line bg-white"
                    }`}
                    key={reason}
                  >
                    <input
                      checked={selected}
                      className="h-4 w-4 accent-wadeal-red"
                      name={`report-reason-${review.id}`}
                      onChange={() => setReportReason(reason)}
                      type="radio"
                      value={reason}
                    />
                    <span className="text-sm font-black text-wadeal-ink">{reason}</span>
                  </label>
                );
              })}
            </div>
            {reportModalError ?
              <p className="mt-3 text-center text-xs font-bold text-[#2E5E4E]">
                {reportModalError}
              </p>
            : null}
            <div className="mt-6 grid grid-cols-2 gap-2">
              <button
                className={`${ui.btnOutline} h-11 cursor-pointer`}
                disabled={isPending}
                onClick={() => setIsReportModalOpen(false)}
                type="button"
              >
                취소
              </button>
              <button
                className={`${ui.btnPrimary} h-11 cursor-pointer disabled:opacity-50`}
                disabled={isPending}
                onClick={handleReportConfirm}
                type="button"
              >
                {isPending ? "접수 중..." : "신고하기"}
              </button>
            </div>
          </div>
        </div>
      : null}

      {isDeleteModalOpen ?
        <div
          aria-labelledby="review-delete-title"
          aria-modal="true"
          className={motion.modalBackdrop}
          role="dialog"
        >
          <div className={motion.modalPanel}>
            <h2 className="text-center text-lg font-black text-wadeal-ink" id="review-delete-title">
              리뷰 삭제
            </h2>
            <p className="mt-3 text-center text-sm font-bold leading-relaxed text-wadeal-muted">
              이 리뷰를 삭제하시겠어요?
            </p>
            <div className="mt-6 grid grid-cols-2 gap-2">
              <button
                className={`${ui.btnOutline} h-11 cursor-pointer`}
                disabled={isPending}
                onClick={() => setIsDeleteModalOpen(false)}
                type="button"
              >
                취소
              </button>
              <button
                className={`${ui.btnPrimary} h-11 cursor-pointer disabled:opacity-50`}
                disabled={isPending}
                onClick={handleDeleteConfirm}
                type="button"
              >
                {isPending ? "삭제 중..." : "삭제하기"}
              </button>
            </div>
          </div>
        </div>
      : null}
    </>
  );
}
