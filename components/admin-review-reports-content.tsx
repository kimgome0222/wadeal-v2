"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { resolveReviewReportAction } from "@/app/actions/admin-review-reports";
import type { ReviewReportFilter, ReviewReportListItem } from "@/lib/data/review-reports";
import { ui } from "@/lib/ui";

type AdminReviewReportsContentProps = {
  reports: ReviewReportListItem[];
  statusFilter: ReviewReportFilter;
};

function statusLabel(status: ReviewReportListItem["status"]) {
  return status === "resolved" ? "처리 완료" : "접수";
}

export function AdminReviewReportsContent({
  reports,
  statusFilter,
}: AdminReviewReportsContentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);

  if (reports.length === 0) {
    const emptyMessage =
      statusFilter === "pending" ? "접수 대기 중인 신고가 없어요."
      : statusFilter === "resolved" ? "처리 완료된 신고가 없어요."
      : "접수된 신고 리뷰가 없어요.";

    return (
      <div className="rounded-xl border border-dashed border-wadeal-line bg-white px-6 py-12 text-center">
        <p className="text-sm font-black text-wadeal-ink">{emptyMessage}</p>
        <p className="mt-1 text-xs font-bold text-wadeal-muted">
          사용자 신고가 들어오면 이 화면에 표시돼요.
        </p>
      </div>
    );
  }

  function handleResolve(reportId: string) {
    setFeedback(null);

    startTransition(async () => {
      const result = await resolveReviewReportAction(reportId);

      if (result.success) {
        setFeedback("신고 처리가 완료됐어요.");
        router.refresh();
        return;
      }

      setFeedback("처리에 실패했어요. 잠시 후 다시 시도해 주세요.");
    });
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-bold text-wadeal-muted">
        총 {reports.length.toLocaleString("ko-KR")}건
      </p>
      {feedback ?
        <p className="rounded-lg bg-green-50 px-3 py-2 text-xs font-bold text-green-700">
          {feedback}
        </p>
      : null}
      {reports.map((report) => (
        <article
          className="rounded-xl border border-wadeal-line bg-white p-4"
          key={report.id}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-sm font-black text-wadeal-ink">{report.reason}</p>
              <span
                className={`inline-block rounded px-2 py-0.5 text-[10px] font-black ${
                  report.status === "resolved" ?
                    "bg-gray-100 text-wadeal-muted"
                  : "bg-red-50 text-wadeal-red"
                }`}
              >
                {statusLabel(report.status)}
              </span>
            </div>
            <span className="shrink-0 text-xs font-bold text-wadeal-muted">
              {report.createdAt}
            </span>
          </div>

          {report.reviewPreview ?
            <p className="mt-3 rounded-lg bg-wadeal-surface px-3 py-2 text-xs font-bold leading-relaxed text-wadeal-ink">
              {report.reviewPreview}
            </p>
          : null}

          <dl className="mt-3 space-y-1.5 text-xs font-bold text-wadeal-muted">
            <div className="flex justify-between gap-3">
              <dt>신고자</dt>
              <dd className="font-black text-wadeal-ink">{report.maskedUserId}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>review_id</dt>
              <dd className="max-w-[180px] truncate font-mono text-[11px] font-black text-wadeal-ink">
                {report.reviewId}
              </dd>
            </div>
          </dl>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {report.productId ?
              <Link
                className={`${ui.btnOutline} h-11 cursor-pointer`}
                href={`/product/${report.productId}#product-reviews`}
              >
                리뷰 확인
              </Link>
            : <button
                className={`${ui.btnOutline} h-11 cursor-not-allowed opacity-50`}
                disabled
                type="button"
              >
                리뷰 확인
              </button>
            }
            <button
              className={`${ui.btnPrimary} h-11 cursor-pointer disabled:opacity-50`}
              disabled={isPending || report.status === "resolved"}
              onClick={() => handleResolve(report.id)}
              type="button"
            >
              {report.status === "resolved" ? "처리됨" : isPending ? "처리 중..." : "처리 완료"}
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
