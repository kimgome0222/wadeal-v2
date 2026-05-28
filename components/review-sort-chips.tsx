"use client";

import type { ReviewSortMode } from "@/lib/reviews/review-sort";
import { REVIEW_SORT_OPTIONS } from "@/lib/reviews/review-sort";

type ReviewSortChipsProps = {
  value: ReviewSortMode;
  onChange: (value: ReviewSortMode) => void;
};

export function ReviewSortChips({ value, onChange }: ReviewSortChipsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-0.5">
      {REVIEW_SORT_OPTIONS.map((option) => {
        const active = value === option.value;

        return (
          <button
            className={`shrink-0 cursor-pointer rounded-full border px-3 py-1.5 text-xs font-black transition-colors ${
              active ?
                "border-wadeal-red bg-wadeal-red text-white"
              : "border-wadeal-line bg-white text-wadeal-muted active:bg-gray-50"
            }`}
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
