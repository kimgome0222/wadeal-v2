"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { SearchPanel } from "@/components/search/search-panel";
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
  placeholder = "찾고 싶은 상품을 검색해보세요",
  compact = false,
}: SearchBoxProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [panelOpen, setPanelOpen] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      setPanelOpen(true);
      return;
    }

    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label
          className={`flex w-full items-center gap-2 rounded-full border border-wadeal-line bg-wadeal-surface text-gray-500 shadow-sm ${
            compact ? "h-9 rounded-lg px-3" : "h-10 px-4"
          }`}
        >
          <span className="sr-only">상품 검색</span>
          <input
            aria-label="상품 검색"
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
  placeholder = "찾고 싶은 상품을 검색해보세요",
  compact = false,
}: {
  placeholder?: string;
  compact?: boolean;
}) {
  return (
    <Link
      className={`flex w-full items-center gap-2 rounded-full border border-wadeal-line bg-wadeal-surface text-gray-500 shadow-sm ${
        compact ? "h-9 rounded-lg px-3" : "h-10 px-4"
      }`}
      href="/search"
    >
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
