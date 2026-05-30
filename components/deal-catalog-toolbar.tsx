"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import {
  ACHIEVEMENT_FILTER_OPTIONS,
  DEAL_STATUS_FILTER_OPTIONS,
  DISCOUNT_FILTER_OPTIONS,
  PRICE_RANGE_PRESETS,
  SELLER_FILTER_OPTIONS,
  type DealSortOption,
  type DealStatusFilter,
} from "@/lib/search/types";
import { buildDealCatalogSearchParams } from "@/lib/search/params";
import {
  PLP_QUICK_FILTER_CHIPS,
  buildPlpQuickFilterUpdates,
  getActivePlpQuickFilter,
} from "@/lib/search/plp-quick-filters";
import { PLP_SORT_OPTIONS } from "@/lib/search/plp-sort-options";

type DealCatalogToolbarProps = {
  total: number;
  title?: string;
  queryLabel?: string;
  showStatusFilter?: boolean;
  showCount?: boolean;
};

function chipClass(active: boolean) {
  return `relative z-10 h-9 shrink-0 cursor-pointer rounded-[18px] px-3.5 text-[13px] font-medium transition-colors duration-150 active:scale-[0.98] ${
    active ?
      "border border-[#2E5E4E] bg-[#2E5E4E] text-white"
    : "border border-[#E8ECEA] bg-white text-[#111111] hover:border-[#2E5E4E]/30"
  }`;
}

export function DealCatalogToolbar({
  total,
  title,
  queryLabel,
  showStatusFilter = true,
  showCount = true,
}: DealCatalogToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const currentSort = (searchParams.get("sort") as DealSortOption | null) ?? "popular";
  const currentStatus =
    (searchParams.get("status") as DealStatusFilter | null) ?? "active";
  const priceMin = searchParams.get("priceMin");
  const priceMax = searchParams.get("priceMax");
  const closingSoon = searchParams.get("closingSoon") === "1";
  const todayDeadline = searchParams.get("todayDeadline") === "1";
  const minDiscount = searchParams.get("minDiscount");
  const minAchievement = searchParams.get("minAchievement");
  const verifiedSeller = searchParams.get("verifiedSeller") === "1";
  const minSellerRating = searchParams.get("minSellerRating") === "1";
  const highReviewSeller = searchParams.get("highReviewSeller") === "1";
  const fastResponseSeller = searchParams.get("fastResponseSeller") === "1";
  const highRepurchaseSeller = searchParams.get("highRepurchaseSeller") === "1";
  const highTrustSeller = searchParams.get("highTrustSeller") === "1";
  const freeShip = searchParams.get("freeShip") === "1";

  const activeQuickFilter = getActivePlpQuickFilter(searchParams);
  const displayTitle = title ?? queryLabel;

  const activeFilterCount = [
    priceMin,
    priceMax,
    closingSoon,
    todayDeadline,
    minDiscount,
    minAchievement,
    verifiedSeller,
    minSellerRating,
    highReviewSeller,
    fastResponseSeller,
    highRepurchaseSeller,
    highTrustSeller,
    freeShip,
    currentStatus !== "active" ? currentStatus : null,
  ].filter(Boolean).length;

  const pushParams = (updates: Parameters<typeof buildDealCatalogSearchParams>[1]) => {
    const next = buildDealCatalogSearchParams(searchParams, updates);
    const query = next.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const pushQuickFilter = (key: typeof activeQuickFilter) => {
    const updates = buildPlpQuickFilterUpdates(key, activeQuickFilter);
    pushParams({
      freeShip: updates.freeShip === "1",
      minDiscount: updates.minDiscount ? Number(updates.minDiscount) : null,
      minSellerRating: updates.minSellerRating === "1",
      highTrustSeller: updates.highTrustSeller === "1",
      sort: updates.sort as DealSortOption,
    });
  };

  const isPricePresetActive = (min?: number, max?: number) => {
    const minValue = min == null ? null : String(min);
    const maxValue = max == null ? null : String(max);
    return (priceMin ?? null) === minValue && (priceMax ?? null) === maxValue;
  };

  return (
    <div className="relative z-10 space-y-4">
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

      <div className="flex h-11 items-center justify-between gap-2 rounded-[14px] bg-[#F5F7F6] px-3">
        <label className="relative flex min-w-0 flex-1 items-center">
          <span className="sr-only">정렬</span>
          <select
            aria-label="정렬"
            className="h-full w-full min-w-0 cursor-pointer appearance-none bg-transparent pr-5 text-[14px] font-semibold text-[#111111] outline-none"
            onChange={(event) =>
              pushParams({ sort: event.target.value as DealSortOption })
            }
            value={currentSort}
          >
            {PLP_SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span
            aria-hidden
            className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[12px] text-[#666666]"
          >
            ▼
          </span>
        </label>
        <button
          aria-expanded={filtersOpen}
          className={`relative z-10 flex h-8 shrink-0 cursor-pointer items-center rounded-lg px-3 text-[14px] font-semibold transition-colors duration-150 ${
            filtersOpen || activeFilterCount > 0 ?
              "text-[#2E5E4E]"
            : "text-[#111111]"
          }`}
          onClick={() => setFiltersOpen((open) => !open)}
          type="button"
        >
          필터
          {activeFilterCount > 0 ?
            <span className="ml-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#2E5E4E] px-1 text-[9px] font-bold text-white">
              {activeFilterCount}
            </span>
          : null}
        </button>
      </div>

      {!filtersOpen ?
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-0.5">
          {PLP_QUICK_FILTER_CHIPS.map((chip) => {
            const active = activeQuickFilter === chip.key;
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

      {filtersOpen ?
        <div className="filter-panel celloh-dropdown space-y-3">
          {showStatusFilter ?
            <div className="space-y-1.5">
              <p className="text-[10px] font-semibold text-wadeal-muted">상태</p>
              <div className="no-scrollbar flex flex-wrap gap-1">
                {DEAL_STATUS_FILTER_OPTIONS.map((option) => (
                  <button
                    className={chipClass(currentStatus === option.value)}
                    key={option.value}
                    onClick={() => pushParams({ status: option.value })}
                    type="button"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          : null}

          <div className="space-y-1.5">
            <p className="text-[10px] font-semibold text-wadeal-muted">가격</p>
            <div className="no-scrollbar flex flex-wrap gap-1">
              {PRICE_RANGE_PRESETS.map((preset) => {
                const active = isPricePresetActive(preset.min, preset.max);

                return (
                  <button
                    className={chipClass(active)}
                    key={preset.label}
                    onClick={() =>
                      pushParams({
                        priceMin: preset.min ?? null,
                        priceMax: preset.max ?? null,
                      })
                    }
                    type="button"
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <p className="text-[10px] font-semibold text-wadeal-muted">조건</p>
            <div className="flex flex-wrap gap-1">
              <button
                className={chipClass(closingSoon)}
                onClick={() => pushParams({ closingSoon: !closingSoon })}
                type="button"
              >
                지금 주목
              </button>
              <button
                className={chipClass(todayDeadline)}
                onClick={() => pushParams({ todayDeadline: !todayDeadline })}
                type="button"
              >
                오늘 추천
              </button>
              {DISCOUNT_FILTER_OPTIONS.map((option) => {
                const active =
                  option.value == null ?
                    !minDiscount
                  : minDiscount === String(option.value);

                return (
                  <button
                    className={chipClass(active)}
                    key={option.label}
                    onClick={() => pushParams({ minDiscount: option.value ?? null })}
                    type="button"
                  >
                    혜택 {option.label}
                  </button>
                );
              })}
              {ACHIEVEMENT_FILTER_OPTIONS.map((option) => {
                const active =
                  option.value == null ?
                    !minAchievement
                  : minAchievement === String(option.value);

                return (
                  <button
                    className={chipClass(active)}
                    key={option.label}
                    onClick={() => pushParams({ minAchievement: option.value ?? null })}
                    type="button"
                  >
                    혜택 {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <p className="text-[10px] font-semibold text-wadeal-muted">판매자</p>
            <div className="flex flex-wrap gap-1">
              {SELLER_FILTER_OPTIONS.map((option) => {
                const sellerFilterState = {
                  verifiedSeller,
                  minSellerRating,
                  highReviewSeller,
                  fastResponseSeller,
                  highRepurchaseSeller,
                  highTrustSeller,
                } as const;
                const active = sellerFilterState[option.key];

                return (
                  <button
                    className={chipClass(active)}
                    key={option.key}
                    onClick={() =>
                      pushParams({
                        [option.key]: !active,
                      })
                    }
                    type="button"
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
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
