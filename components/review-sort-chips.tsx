"use client";

import type { ReviewSortMode } from "@/lib/reviews/review-sort";
import { REVIEW_SORT_OPTIONS } from "@/lib/reviews/review-sort";
import { ds } from "@/lib/design-system";

type ReviewSortChipsProps = {
  value: ReviewSortMode;
  onChange: (value: ReviewSortMode) => void;
};

export function ReviewSortChips({ value, onChange }: ReviewSortChipsProps) {
  return (
    <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-0.5" role="group" aria-label="리뷰 정렬">
      {REVIEW_SORT_OPTIONS.map((option) => {
        const active = value === option.value;

        return (
          <button
            aria-pressed={active}
            className={`${ds.chip.base} ${active ? ds.chip.active : ds.chip.idle}`}
            key={option.value}
            onClick={() => onChange(option.value)}
            type="button"
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
