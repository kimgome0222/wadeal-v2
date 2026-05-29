"use client";

import { useEffect } from "react";

import { saveRecentSearch } from "@/lib/search/recent-searches";

type SearchQueryTrackerProps = {
  query: string;
};

/** 검색 결과 페이지 진입 시 최근 검색어에 반영 */
export function SearchQueryTracker({ query }: SearchQueryTrackerProps) {
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      return;
    }

    saveRecentSearch(trimmed);
  }, [query]);

  return null;
}
