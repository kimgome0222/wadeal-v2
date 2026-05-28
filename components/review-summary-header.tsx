import type { ReviewSummary } from "@/lib/data/reviews";
import { renderStarString } from "@/lib/reviews/review-rules";

type ReviewSummaryHeaderProps = {
  summary: ReviewSummary;
};

export function ReviewSummaryHeader({ summary }: ReviewSummaryHeaderProps) {
  const averageLabel =
    summary.totalCount > 0 ? summary.averageRating.toFixed(1) : "0.0";

  return (
    <div className="rounded-2xl border border-wadeal-line bg-wadeal-surface p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="shrink-0 text-center">
          <p className="text-3xl font-black text-wadeal-ink">{averageLabel}</p>
          <p className="mt-1 text-sm font-black text-wadeal-red">
            {renderStarString(summary.averageRating)}
          </p>
          <p className="mt-2 text-[11px] font-bold text-wadeal-muted">평균 별점</p>
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          {summary.distribution.map((bar) => (
            <div className="grid grid-cols-[28px_1fr_36px] items-center gap-2" key={bar.star}>
              <span className="text-[11px] font-black text-wadeal-muted">{bar.star}점</span>
              <div className="h-2 overflow-hidden rounded-full bg-white">
                <div
                  className="h-full rounded-full bg-wadeal-red transition-all"
                  style={{ width: `${bar.percent}%` }}
                />
              </div>
              <span className="text-right text-[11px] font-bold text-wadeal-muted">
                {bar.percent}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-wadeal-line pt-3">
        <p className="text-xs font-black text-wadeal-ink">전체 리뷰</p>
        <p className="text-sm font-black text-wadeal-red">
          {summary.totalCount.toLocaleString("ko-KR")}개
        </p>
      </div>
    </div>
  );
}
