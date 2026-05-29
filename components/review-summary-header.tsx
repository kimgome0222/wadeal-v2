import type { ReviewSummary } from "@/lib/data/reviews";
import { ds } from "@/lib/design-system";
import { renderStarString } from "@/lib/reviews/review-rules";

type ReviewSummaryHeaderProps = {
  summary: ReviewSummary;
};

export function ReviewSummaryHeader({ summary }: ReviewSummaryHeaderProps) {
  const averageLabel =
    summary.totalCount > 0 ? summary.averageRating.toFixed(1) : "0.0";

  return (
    <div className="rounded-xl border border-[#DDE8E2] bg-[#FAFBFA] p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="shrink-0 text-center">
          <p className={`${ds.type.stat} text-[28px] leading-none`}>{averageLabel}</p>
          <p className={`mt-1 text-sm font-medium ${ds.type.star}`}>
            {renderStarString(summary.averageRating)}
          </p>
          <p className={`mt-2 ${ds.type.statLabel}`}>평균 별점</p>
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          {summary.distribution.map((bar) => (
            <div className="grid grid-cols-[28px_1fr_36px] items-center gap-2" key={bar.star}>
              <span className={ds.type.statLabel}>{bar.star}점</span>
              <div className="h-1.5 overflow-hidden rounded-full bg-white">
                <div
                  className="h-full rounded-full bg-wadeal-red transition-all duration-300"
                  style={{ width: `${bar.percent}%` }}
                />
              </div>
              <span className={`text-right ${ds.type.statLabel}`}>{bar.percent}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-[#DDE8E2] pt-3">
        <p className={`${ds.type.caption} font-medium text-wadeal-ink`}>전체 리뷰</p>
        <p className={`${ds.type.caption} font-semibold text-wadeal-ink`}>
          {summary.totalCount.toLocaleString("ko-KR")}개
        </p>
      </div>
    </div>
  );
}
