"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useRef, useState, useTransition } from "react";

import {
  fetchFeaturedSearchTermsAction,
  fetchSearchSuggestionsAction,
} from "@/app/actions/search";
import { SearchIcon } from "@/components/icons";
import type { PopularSearchTerm } from "@/lib/search/types";
import {
  clearRecentSearches,
  readRecentSearches,
  saveRecentSearch,
} from "@/lib/search/recent-searches";

type SearchPanelProps = {
  open: boolean;
  initialQuery?: string;
  popularTerms?: PopularSearchTerm[];
  onClose: () => void;
  onQueryChange?: (value: string) => void;
};

type SearchSuggestion = {
  query: string;
  label: string;
};

export function SearchPanel({
  open,
  initialQuery = "",
  popularTerms = [],
  onClose,
  onQueryChange,
}: SearchPanelProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(initialQuery);
  const [recentTerms, setRecentTerms] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [featuredTerms, setFeaturedTerms] = useState<PopularSearchTerm[]>(popularTerms);
  const [isPending, startTransition] = useTransition();

  const navigateToSearch = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      if (!trimmed) {
        return;
      }

      setRecentTerms(saveRecentSearch(trimmed));
      onClose();
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    },
    [onClose, router],
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    setQuery(initialQuery);
    setRecentTerms(readRecentSearches());
    setFeaturedTerms(popularTerms);

    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 50);

    return () => window.clearTimeout(timer);
  }, [initialQuery, open, popularTerms]);

  useEffect(() => {
    if (!open || featuredTerms.length > 0) {
      return;
    }

    startTransition(async () => {
      const result = await fetchFeaturedSearchTermsAction(8);
      setFeaturedTerms(result.terms);
    });
  }, [featuredTerms.length, open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = window.setTimeout(() => {
      startTransition(async () => {
        const result = await fetchSearchSuggestionsAction(trimmed);
        setSuggestions(result.suggestions);
      });
    }, 200);

    return () => window.clearTimeout(timer);
  }, [open, query]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigateToSearch(query);
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    onQueryChange?.(value);
  };

  const displayTerms = featuredTerms.length > 0 ? featuredTerms : popularTerms;

  return (
    <div aria-modal="true" className="fixed inset-0 z-[100] animate-celloh-fade-in bg-white" role="dialog">
      <div className="border-b border-wadeal-line px-4 pb-3 pt-2">
        <div className="flex items-center gap-2">
          <button
            aria-label="검색 닫기"
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-lg font-black text-wadeal-ink active:bg-gray-100"
            onClick={onClose}
            type="button"
          >
            ←
          </button>
          <form className="min-w-0 flex-1" onSubmit={handleSubmit}>
            <label className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-full border border-wadeal-line bg-wadeal-surface px-4 text-gray-500">
              <SearchIcon aria-hidden className="h-4 w-4 shrink-0" />
              <span className="sr-only">상품 검색</span>
              <input
                aria-label="상품 검색"
                className="min-w-0 flex-1 cursor-text bg-transparent text-[14px] font-medium text-wadeal-ink outline-none placeholder:font-normal placeholder:text-gray-400"
                name="q"
                onChange={(event) => handleQueryChange(event.target.value)}
                placeholder="찾고 싶은 상품을 검색해보세요"
                ref={inputRef}
                type="search"
                value={query}
              />
            </label>
          </form>
        </div>
      </div>

      <div className="max-h-[calc(100dvh-72px)] overflow-y-auto px-4 py-4">
        {query.trim().length >= 2 && suggestions.length > 0 ?
          <section className="space-y-2">
            <h2 className="text-xs font-black text-wadeal-muted">추천 검색어</h2>
            <ul className="space-y-1">
              {suggestions.map((item) => (
                <li key={item.query}>
                  <button
                    className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-2.5 text-left active:bg-gray-50"
                    onClick={() => navigateToSearch(item.query)}
                    type="button"
                  >
                    <SearchIcon aria-hidden className="h-3.5 w-3.5 shrink-0 text-wadeal-muted" />
                    <span className="truncate text-sm font-bold text-wadeal-ink">
                      {item.label}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        : null}

        {recentTerms.length > 0 ?
          <section className="mt-4 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-xs font-black text-wadeal-muted">최근 검색어</h2>
              <button
                className="cursor-pointer text-[11px] font-bold text-wadeal-muted underline underline-offset-2"
                onClick={() => {
                  clearRecentSearches();
                  setRecentTerms([]);
                }}
                type="button"
              >
                전체 삭제
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentTerms.map((term) => (
                <button
                  className="cursor-pointer rounded-full bg-wadeal-surface px-3 py-1.5 text-[12px] font-bold text-wadeal-ink ring-1 ring-wadeal-line active:bg-gray-100"
                  key={term}
                  onClick={() => navigateToSearch(term)}
                  type="button"
                >
                  {term}
                </button>
              ))}
            </div>
          </section>
        : null}

        {displayTerms.length > 0 ?
          <section className="mt-4 space-y-2">
            <h2 className="text-xs font-black text-wadeal-muted">인기 검색어</h2>
            <div className="flex flex-wrap gap-2">
              {displayTerms.map((term) => (
                <button
                  className="cursor-pointer rounded-full bg-white px-3 py-1.5 text-[12px] font-bold text-wadeal-ink ring-1 ring-wadeal-line active:bg-gray-50"
                  key={term.query}
                  onClick={() => navigateToSearch(term.query)}
                  type="button"
                >
                  {term.query}
                </button>
              ))}
            </div>
          </section>
        : null}

        {!isPending && query.trim().length >= 2 && suggestions.length === 0 ?
          <p className="mt-6 text-center text-xs font-bold text-wadeal-muted">
            &apos;{query.trim()}&apos; 검색 결과 보기
          </p>
        : null}

        <div className="mt-8 border-t border-wadeal-line pt-4">
          <Link
            className="text-xs font-black text-wadeal-red underline underline-offset-2"
            href="/search"
            onClick={onClose}
          >
            검색 결과 페이지로 이동
          </Link>
        </div>
      </div>
    </div>
  );
}
