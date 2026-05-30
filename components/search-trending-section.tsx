"use client";

import Link from "next/link";

import {
  getTrendingSearchHourLabel,
  getTrendingSearchTerms,
} from "@/lib/search/trending-search-terms";
import { ds } from "@/lib/design-system";

export function SearchTrendingSection() {
  const terms = getTrendingSearchTerms(10);
  const hourLabel = getTrendingSearchHourLabel();

  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-2">
        <h2 className={ds.type.h3}>급상승 검색어</h2>
        <span className={`${ds.type.caption} text-wadeal-muted`}>{hourLabel}</span>
      </div>
      <ol className="space-y-2">
        {terms.map(({ rank, term }) => (
          <li key={term}>
            <Link
              className="flex items-center gap-3 rounded-lg px-1 py-1.5 transition-colors hover:bg-[#F5F8F4]"
              href={`/search?q=${encodeURIComponent(term)}`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[12px] font-bold ${
                  rank <= 3 ? "bg-[#2E5E4E]/10 text-[#2E5E4E]" : "bg-[#F5F8F4] text-wadeal-muted"
                }`}
              >
                {rank}
              </span>
              <span className={`${ds.type.bodySm} font-medium text-wadeal-ink`}>{term}</span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
