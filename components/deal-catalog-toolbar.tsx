"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { buildDealCatalogSearchParams } from "@/lib/search/params";
import {
  PLP_QUICK_FILTER_CHIPS,
  buildPlpQuickFilterUpdates,
  getActivePlpQuickFilter,
} from "@/lib/search/plp-quick-filters";
import type { DealSortOption, DealStatusFilter } from "@/lib/search/types";
import { ChevronDownIcon, SlidersHorizontalIcon } from "@/components/icons";
import { PlpFilterSheet } from "@/components/plp/plp-filter-sheet";
import { PlpSortDropdown } from "@/components/plp/plp-sort-dropdown";
import { PLP_SORT_OPTIONS } from "@/lib/search/plp-sort-options";

type DealCatalogToolbarProps = {
  total: number;
  title?: string;
  queryLabel?: string;
  showCount?: boolean;
};

function chipClass(active: boolean) {
  return `relative h-9 shrink-0 cursor-pointer rounded-[18px] px-3.5 text-[13px] font-medium transition-colors duration-[100ms] ease-out active:scale-[0.98] ${
    active ?
      "border border-[#2E5E4E] bg-[#2E5E4E] text-white"
    : "border border-[#E8ECEA] bg-white text-[#111111] hover:border-[#2E5E4E]/30"
  }`;
}

function scrollCatalogToTop() {
  window.scrollTo({ top: 0, behavior: "instant" });
}

export function DealCatalogToolbar({
  total,
  title,
  queryLabel,
  showCount = true,
}: DealCatalogToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const barRef = useRef<HTMLDivElement>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortDropdownTop, setSortDropdownTop] = useState(0);
  const [pendingSort, setPendingSort] = useState<DealSortOption | null>(null);
  const [pendingQuickFilter, setPendingQuickFilter] = useState<
    ReturnType<typeof getActivePlpQuickFilter> | null
  >(null);

  const currentSort = (searchParams.get("sort") as DealSortOption | null) ?? "popular";
  const displaySort = pendingSort ?? currentSort;
  const currentStatus =
    (searchParams.get("status") as DealStatusFilter | null) ?? "active";
  const priceMin = searchParams.get("priceMin");
  const priceMax = searchParams.get("priceMax");
  const closingSoon = searchParams.get("closingSoon") === "1";
  const todayDeadline = searchParams.get("todayDeadline") === "1";
  const freeShip = searchParams.get("freeShip") === "1";

  const activeQuickFilter = getActivePlpQuickFilter(searchParams);
  const displayQuickFilter = pendingQuickFilter ?? activeQuickFilter;
  const displayTitle = title ?? queryLabel;

  useEffect(() => {
    setPendingSort(null);
    setPendingQuickFilter(null);
  }, [searchParams]);

  const activeFilterCount = [
    priceMin,
    priceMax,
    closingSoon,
    todayDeadline,
    freeShip,
    currentStatus !== "active" ? currentStatus : null,
  ].filter(Boolean).length;

  const pushParams = (updates: Parameters<typeof buildDealCatalogSearchParams>[1]) => {
    const next = buildDealCatalogSearchParams(searchParams, updates);
    const query = next.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    router.refresh();
  };

  const pushQuickFilter = (key: typeof activeQuickFilter) => {
    setPendingQuickFilter(key);
    scrollCatalogToTop();
    const updates = buildPlpQuickFilterUpdates(key, activeQuickFilter);
    pushParams({
      freeShip: updates.freeShip === "1",
      minDiscount: updates.minDiscount ? Number(updates.minDiscount) : null,
      minSellerRating: updates.minSellerRating === "1",
      highTrustSeller: false,
      priceMin: updates.priceMin ? Number(updates.priceMin) : null,
      priceMax: updates.priceMax ? Number(updates.priceMax) : null,
      sort: updates.sort as DealSortOption,
    });
  };

  const isPricePresetActive = (min?: number, max?: number) => {
    const minValue = min == null ? null : String(min);
    const maxValue = max == null ? null : String(max);
    return (priceMin ?? null) === minValue && (priceMax ?? null) === maxValue;
  };

  function openSortDropdown() {
    const rect = barRef.current?.getBoundingClientRect();
    setSortDropdownTop(rect?.bottom ?? 120);
    setSortOpen(true);
    setFiltersOpen(false);
  }

  function handleResetFilters() {
    setPendingQuickFilter("all");
    pushParams({
      freeShip: false,
      minDiscount: null,
      minSellerRating: false,
      priceMin: null,
      priceMax: null,
      sort: "popular",
      status: "active",
    });
  }

  return (
    <div className="relative z-[80] mb-5 space-y-3">
      {displayTitle ?
        <div className="space-y-1">
          <h1 className="text-[24px] font-bold leading-tight text-[#111111]">{displayTitle}</h1>
          {showCount ?
            <p className="text-[13px] text-[#666666]">
              상품 {total.toLocaleString("ko-KR")}개
            </p>
          : null}
        </div>
      : showCount ?
        <p className="text-[13px] text-[#666666]">
          상품 {total.toLocaleString("ko-KR")}개
        </p>
      : null}

      <div className="relative" ref={barRef}>
        <div className="flex h-11 items-center justify-between gap-2 rounded-[14px] bg-[#F5F7F6] px-3">
          <button
            aria-expanded={sortOpen}
            className="relative flex min-w-0 flex-1 cursor-pointer items-center gap-1 text-left"
            onClick={() => {
              if (sortOpen) {
                setSortOpen(false);
                return;
              }
              openSortDropdown();
            }}
            type="button"
          >
            <span className="truncate text-[14px] font-semibold text-[#111111]">
              {PLP_SORT_OPTIONS.find((option) => option.value === displaySort)?.label ?? "추천순"}
            </span>
            <ChevronDownIcon
              aria-hidden
              className={`h-4 w-4 shrink-0 text-[#666666] transition-transform duration-[100ms] ease-out ${sortOpen ? "rotate-180" : ""}`}
            />
          </button>
          <button
            aria-expanded={filtersOpen}
            className={`relative flex h-9 shrink-0 cursor-pointer items-center rounded-lg px-3 text-[14px] font-semibold transition-colors duration-[100ms] ease-out ${
              filtersOpen || activeFilterCount > 0 || activeQuickFilter !== "all" ?
                "text-[#2E5E4E]"
              : "text-[#111111]"
            }`}
            onClick={() => {
              setFiltersOpen(true);
              setSortOpen(false);
            }}
            type="button"
          >
            <SlidersHorizontalIcon aria-hidden className="mr-1.5 h-4 w-4" />
            필터
            {activeFilterCount > 0 || activeQuickFilter !== "all" ?
              <span className="ml-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#2E5E4E] px-1 text-[9px] font-bold text-white">
                {(activeFilterCount || 0) + (activeQuickFilter !== "all" ? 1 : 0)}
              </span>
            : null}
          </button>
        </div>
      </div>

      <PlpSortDropdown
        displaySort={displaySort}
        onClose={() => setSortOpen(false)}
        onSelect={(sort) => {
          setPendingSort(sort);
          scrollCatalogToTop();
          pushParams({ sort });
        }}
        open={sortOpen}
        top={sortDropdownTop}
      />

      <PlpFilterSheet
        activeFilterCount={activeFilterCount + (activeQuickFilter !== "all" ? 1 : 0)}
        activeQuickFilter={displayQuickFilter}
        isPricePresetActive={isPricePresetActive}
        onClose={() => setFiltersOpen(false)}
        onPricePreset={(min, max) => {
          scrollCatalogToTop();
          pushParams({ priceMin: min ?? null, priceMax: max ?? null });
        }}
        onQuickFilter={pushQuickFilter}
        onReset={handleResetFilters}
        open={filtersOpen}
      />

      {!filtersOpen ?
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-0.5">
          {PLP_QUICK_FILTER_CHIPS.map((chip) => {
            const active = displayQuickFilter === chip.key;
            return (
              <button
                aria-pressed={active}
                className={chipClass(active)}
                key={chip.key}
                onClick={() => pushQuickFilter(chip.key)}
                type="button"
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      : null}
    </div>
  );
}

import { ds } from "@/lib/design-system";

type PopularSearchTermsProps = {
  terms: { query: string; count: number }[];
};

export function PopularSearchTerms({ terms }: PopularSearchTermsProps) {
  if (terms.length === 0) {
    return null;
  }

  return (
    <section aria-label="인기 검색어" className="space-y-3">
      <h2 className={ds.type.h2}>인기 검색어</h2>
      <ol className="space-y-1">
        {terms.map((term, index) => (
          <li key={term.query}>
            <Link
              className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-xl px-2 py-2 transition-colors duration-200 hover:bg-[#FAFBFA] active:scale-[0.99]"
              href={`/search?q=${encodeURIComponent(term.query)}`}
            >
              <span
                aria-hidden
                className={`w-5 shrink-0 text-center text-[13px] font-semibold tabular-nums ${
                  index < 3 ? "text-wadeal-coral" : "text-wadeal-muted"
                }`}
              >
                {index + 1}
              </span>
              <span className={`min-w-0 flex-1 truncate ${ds.type.body}`}>{term.query}</span>
              {term.count > 0 ?
                <span className={`shrink-0 ${ds.type.meta}`}>
                  {term.count.toLocaleString("ko-KR")}
                </span>
              : null}
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}

type DealCatalogLoadMoreProps = {
  hasMore: boolean;
  nextPage: number;
};

export function DealCatalogLoadMore({ hasMore, nextPage }: DealCatalogLoadMoreProps) {
  const searchParams = useSearchParams();

  if (!hasMore) {
    return null;
  }

  const next = buildDealCatalogSearchParams(searchParams, { page: nextPage });

  return (
    <Link
      className="flex h-10 w-full cursor-pointer items-center justify-center rounded-lg border border-wadeal-line bg-white text-[13px] font-semibold text-wadeal-ink transition-colors duration-150 active:bg-gray-50"
      href={`?${next.toString()}`}
      scroll={false}
    >
      더 보기
    </Link>
  );
}
