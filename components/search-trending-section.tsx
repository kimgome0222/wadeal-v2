"use client";

import Link from "next/link";

import {
  getTrendingSearchHourLabel,
  getTrendingSearchTerms,
} from "@/lib/search/trending-search-terms";

export function SearchTrendingSection() {
  const terms = getTrendingSearchTerms(10);
  const hourLabel = getTrendingSearchHourLabel();

  return (
    <section aria-label="급상승 검색어" className="space-y-4">
      <div className="flex items-end justify-between gap-2">
        <h2 className="text-[20px] font-bold text-[#111111]">급상승 검색어</h2>
        <span className="text-[13px] text-[#666666]">{hourLabel}</span>
      </div>
      <ol className="grid grid-cols-2 gap-x-3 gap-y-2">
        {terms.map(({ rank, term }) => (
          <li key={term}>
            <Link
              className="flex min-h-[44px] items-center gap-2.5 rounded-xl px-1 py-1.5 transition-colors active:bg-[#F5F7F6]"
              href={`/search?q=${encodeURIComponent(term)}`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[12px] font-bold tabular-nums ${
                  rank <= 3 ? "bg-[#2E5E4E]/10 text-[#2E5E4E]" : "bg-[#F5F7F6] text-[#666666]"
                }`}
              >
                {rank}
              </span>
              <span className="min-w-0 truncate text-[14px] font-medium text-[#111111]">
                {term}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
