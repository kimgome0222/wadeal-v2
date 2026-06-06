"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useRef, useState, useTransition, type ReactNode } from "react";

import {
  fetchFeaturedSearchTermsAction,
  fetchSearchSuggestionsAction,
} from "@/app/actions/search";
import { SearchIcon } from "@/components/icons";
import { HighlightMatch } from "@/components/search/highlight-match";
import { ds } from "@/lib/design-system";
import type { SearchSuggestionKind } from "@/lib/data/search";
import type { PopularSearchTerm } from "@/lib/search/types";
import {
  clearRecentSearches,
  readRecentSearches,
  removeRecentSearch,
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
  kind: SearchSuggestionKind;
};

const SUGGESTION_KIND_LABEL: Record<SearchSuggestionKind, string> = {
  product: "상품",
  seller: "판매자",
  keyword: "추천",
};

function SearchSectionTitle({
  action,
  title,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <h2 className={ds.type.label}>{title}</h2>
      {action}
    </div>
  );
}

function SearchTermChip({
  children,
  onClick,
  rank,
}: {
  children: ReactNode;
  onClick: () => void;
  rank?: number;
}) {
  return (
    <button
      className={`${ds.chip.base} ${ds.chip.idle} inline-flex min-h-[36px] items-center gap-1.5 px-3.5 py-2 active:scale-[0.98]`}
      onClick={onClick}
      type="button"
    >
      {rank != null ?
        <span
          aria-hidden
          className={`text-[11px] font-semibold tabular-nums ${
            rank <= 3 ? "text-wadeal-coral" : "text-wadeal-muted"
          }`}
        >
          {rank}
        </span>
      : null}
      <span className="truncate">{children}</span>
    </button>
  );
}

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
      const result = await fetchFeaturedSearchTermsAction(10);
      setFeaturedTerms(result.terms);
    });
  }, [featuredTerms.length, open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const trimmed = query.trim();
    if (trimmed.length < 1) {
      setSuggestions([]);
      return;
    }

    const timer = window.setTimeout(() => {
      startTransition(async () => {
        const result = await fetchSearchSuggestionsAction(trimmed);
        setSuggestions(result.suggestions);
      });
    }, 180);

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

  const trimmedQuery = query.trim();
  const showAutocomplete = trimmedQuery.length >= 1;
  const recommendedTerms = featuredTerms.length > 0 ? featuredTerms : popularTerms;

  return (
    <div
      aria-label="검색"
      aria-modal="true"
      className="fixed inset-0 z-[100] animate-celloh-fade-in bg-white"
      role="dialog"
    >
      <div className={`${ds.chrome.header} px-4 pb-3 pt-[max(env(safe-area-inset-top),8px)]`}>
        <div className="flex items-center gap-2">
          <button
            aria-label="검색 닫기"
            className="flex h-11 min-h-[44px] w-11 min-w-[44px] shrink-0 cursor-pointer items-center justify-center rounded-xl text-lg font-semibold text-wadeal-ink transition-colors duration-200 hover:bg-[#FAFBFA] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wadeal-red/25"
            onClick={onClose}
            type="button"
          >
            ←
          </button>
          <form className="min-w-0 flex-1" onSubmit={handleSubmit}>
            <label className="flex h-11 min-h-[44px] min-w-0 flex-1 items-center gap-2 rounded-full border border-[#DDE8E2] bg-[#F5F8F4] px-4 text-gray-500 transition-colors focus-within:border-[#2E5E4E]/40 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#2E5E4E]/10">
              <SearchIcon aria-hidden className="h-4 w-4 shrink-0" />
              <span className="sr-only">상품 검색</span>
              <input
                aria-label="상품 검색"
                autoComplete="off"
                className="min-w-0 flex-1 cursor-text bg-transparent text-[14px] font-medium text-wadeal-ink outline-none placeholder:font-normal placeholder:text-gray-400"
                name="q"
                onChange={(event) => handleQueryChange(event.target.value)}
                placeholder="찾고 싶은 상품이나 판매자를 검색해보세요"
                ref={inputRef}
                type="search"
                value={query}
              />
              {trimmedQuery ?
                <button
                  aria-label="검색어 지우기"
                  className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-wadeal-muted transition-colors hover:bg-[#FAFBFA] hover:text-wadeal-ink"
                  onClick={() => handleQueryChange("")}
                  type="button"
                >
                  ×
                </button>
              : null}
            </label>
          </form>
        </div>
      </div>

      <div className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto px-4 py-4 pb-[max(env(safe-area-inset-bottom),16px)]">
        {showAutocomplete ?
          <section aria-busy={isPending} aria-label="자동완성" className="space-y-1">
            {isPending && suggestions.length === 0 ?
              <ul className="space-y-1">
                {Array.from({ length: 4 }).map((_, index) => (
                  <li
                    className="celloh-skeleton-shimmer h-11 rounded-xl"
                    key={index}
                  />
                ))}
              </ul>
            : null}

            {!isPending && suggestions.length > 0 ?
              <ul className="space-y-0.5">
                {suggestions.map((item) => (
                  <li key={`${item.kind}-${item.query}`}>
                    <button
                      className="flex min-h-[44px] w-full cursor-pointer items-center gap-2.5 rounded-xl px-2 py-2.5 text-left transition-colors duration-200 hover:bg-[#FAFBFA] active:scale-[0.99]"
                      onClick={() => navigateToSearch(item.query)}
                      type="button"
                    >
                      <SearchIcon aria-hidden className="h-3.5 w-3.5 shrink-0 text-wadeal-muted" />
                      <span className="min-w-0 flex-1 truncate text-sm font-medium text-wadeal-ink">
                        <HighlightMatch query={trimmedQuery} text={item.label} />
                      </span>
                      <span className={`shrink-0 ${ds.type.meta}`}>
                        {SUGGESTION_KIND_LABEL[item.kind]}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            : null}

            {!isPending ?
              <button
                className={`${ds.btn.outline} mt-3 min-h-[44px] text-[13px]`}
                onClick={() => navigateToSearch(trimmedQuery)}
                type="button"
              >
                &apos;{trimmedQuery}&apos; 검색 결과 보기
              </button>
            : null}
          </section>
        : <>
            {recommendedTerms.length > 0 ?
              <section className="space-y-2.5">
                <SearchSectionTitle title="추천 검색어" />
                <div className="flex flex-wrap gap-2">
                  {recommendedTerms.slice(0, 10).map((term, index) => (
                    <SearchTermChip
                      key={term.query}
                      onClick={() => navigateToSearch(term.query)}
                      rank={index + 1}
                    >
                      {term.query}
                    </SearchTermChip>
                  ))}
                </div>
              </section>
            : null}

            {recentTerms.length > 0 ?
              <section className={`space-y-2.5 ${recommendedTerms.length > 0 ? "mt-5" : ""}`}>
                <SearchSectionTitle
                  action={
                    <button
                      className={`${ds.type.link} min-h-[36px] px-1`}
                      onClick={() => {
                        clearRecentSearches();
                        setRecentTerms([]);
                      }}
                      type="button"
                    >
                      전체 삭제
                    </button>
                  }
                  title="최근 검색어"
                />
                <ul className="space-y-1">
                  {recentTerms.map((term) => (
                    <li
                      className="flex min-h-[44px] items-center gap-1 rounded-xl transition-colors hover:bg-[#FAFBFA]"
                      key={term}
                    >
                      <button
                        className="min-w-0 flex-1 cursor-pointer truncate px-2 py-2.5 text-left text-sm font-medium text-wadeal-ink"
                        onClick={() => navigateToSearch(term)}
                        type="button"
                      >
                        {term}
                      </button>
                      <button
                        aria-label={`${term} 삭제`}
                        className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg text-wadeal-muted transition-colors hover:bg-white hover:text-wadeal-ink"
                        onClick={() => setRecentTerms(removeRecentSearch(term))}
                        type="button"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            : null}

            {recentTerms.length === 0 && recommendedTerms.length === 0 ?
              <p className={`py-8 text-center ${ds.type.bodySm}`}>
                검색어를 입력하면 상품과 판매자를 찾아드려요.
              </p>
            : null}
          </>
        }

        <div className="mt-8 border-t border-[#DDE8E2] pt-4">
          <Link
            className={`${ds.type.link} inline-flex min-h-[44px] items-center font-medium text-wadeal-red`}
            href="/search"
            onClick={onClose}
          >
            전체 상품 둘러보기
          </Link>
        </div>
      </div>
    </div>
  );
}
