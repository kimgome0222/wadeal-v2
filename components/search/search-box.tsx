"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { SearchIcon } from "@/components/icons";
import { SearchPanel } from "@/components/search/search-panel";
import { saveRecentSearch } from "@/lib/search/recent-searches";
import type { PopularSearchTerm } from "@/lib/search/types";

type SearchBoxProps = {
  initialQuery?: string;
  popularTerms?: PopularSearchTerm[];
  placeholder?: string;
  compact?: boolean;
};

export function SearchBox({
  initialQuery = "",
  popularTerms = [],
  placeholder = "찾고 싶은 상품이나 판매자를 검색해보세요",
  compact = false,
}: SearchBoxProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [panelOpen, setPanelOpen] = useState(false);

  const navigateToSearch = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      setPanelOpen(true);
      return;
    }

    saveRecentSearch(trimmed);
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigateToSearch(query);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label
          className={`flex w-full items-center gap-2 rounded-full border border-[#DDE8E2] bg-[#F5F8F4] text-gray-500 transition-colors focus-within:border-[#2E5E4E]/40 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#2E5E4E]/10 ${
            compact ? "h-11 min-h-[44px] rounded-full px-3.5" : "h-11 min-h-[44px] px-4"
          }`}
        >
          <SearchIcon aria-hidden className="h-4 w-4 shrink-0" />
          <span className="sr-only">상품 검색</span>
          <input
            aria-label="상품 검색"
            autoComplete="off"
            className={`min-w-0 flex-1 cursor-text bg-transparent font-medium text-wadeal-ink outline-none placeholder:font-normal placeholder:text-gray-400 ${
              compact ? "text-[13px]" : "text-[14px]"
            }`}
            name="q"
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => setPanelOpen(true)}
            placeholder={placeholder}
            suppressHydrationWarning
            type="search"
            value={query}
          />
        </label>
      </form>

      <SearchPanel
        initialQuery={query}
        onClose={() => setPanelOpen(false)}
        onQueryChange={setQuery}
        open={panelOpen}
        popularTerms={popularTerms}
      />
    </>
  );
}

export function SearchBoxLink({
  placeholder = "찾고 싶은 상품이나 판매자를 검색해보세요",
  compact = false,
}: {
  placeholder?: string;
  compact?: boolean;
}) {
  return (
    <Link
      aria-label="검색 페이지로 이동"
      className={`flex w-full items-center gap-2 rounded-full border border-[#DDE8E2] bg-[#F5F8F4] text-gray-500 transition-colors hover:border-[#2E5E4E]/30 hover:bg-white ${
        compact ? "h-11 min-h-[44px] rounded-full px-3.5" : "h-11 min-h-[44px] px-4"
      }`}
      href="/search"
    >
      <SearchIcon aria-hidden className="h-4 w-4 shrink-0" />
      <span
        className={`min-w-0 flex-1 font-medium text-gray-400 ${
          compact ? "text-[13px]" : "text-[14px]"
        }`}
      >
        {placeholder}
      </span>
    </Link>
  );
}
