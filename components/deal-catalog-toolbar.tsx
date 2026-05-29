"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import {
  ACHIEVEMENT_FILTER_OPTIONS,
  DEAL_SORT_OPTIONS,
  DEAL_STATUS_FILTER_OPTIONS,
  DISCOUNT_FILTER_OPTIONS,
  PRICE_RANGE_PRESETS,
  SELLER_FILTER_OPTIONS,
  SELLER_QUICK_FILTER_OPTIONS,
  type DealSortOption,
  type DealStatusFilter,
} from "@/lib/search/types";
import { buildDealCatalogSearchParams } from "@/lib/search/params";

type DealCatalogToolbarProps = {
  total: number;
  queryLabel?: string;
  showStatusFilter?: boolean;
};

function chipClass(active: boolean, compact = true) {
  return `${
    compact ? "h-7 px-2.5 text-[11px]" : "h-8 px-3 text-[12px]"
  } celloh-tab-pill shrink-0 cursor-pointer rounded-full font-semibold hover:-translate-y-0.5 hover:shadow-card-hover ${
    active ?
      "bg-wadeal-red text-white shadow-sm"
    : "bg-white text-wadeal-ink ring-1 ring-wadeal-line hover:border-wadeal-red/30 active:bg-wadeal-surface"
  }`;
}

export function DealCatalogToolbar({
  total,
  queryLabel,
  showStatusFilter = true,
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
    currentStatus !== "active" ? currentStatus : null,
  ].filter(Boolean).length;

  const pushParams = (updates: Parameters<typeof buildDealCatalogSearchParams>[1]) => {
    const next = buildDealCatalogSearchParams(searchParams, updates);
    const query = next.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  const isPricePresetActive = (min?: number, max?: number) => {
    const minValue = min == null ? null : String(min);
    const maxValue = max == null ? null : String(max);
    return (priceMin ?? null) === minValue && (priceMax ?? null) === maxValue;
  };

  const sortLabel =
    DEAL_SORT_OPTIONS.find((option) => option.value === currentSort)?.label ?? "추천순";

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          {queryLabel ?
            <p className="truncate text-[13px] font-bold text-wadeal-ink">{queryLabel}</p>
          : null}
          <p className="text-[11px] font-bold text-wadeal-muted">총 {total.toLocaleString("ko-KR")}개</p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <label className="relative">
            <span className="sr-only">정렬</span>
            <select
              aria-label="정렬"
              className="h-8 max-w-[112px] cursor-pointer appearance-none rounded-lg border border-wadeal-line bg-white pl-2.5 pr-6 text-[11px] font-semibold text-wadeal-ink outline-none transition-colors duration-150"
              onChange={(event) =>
                pushParams({ sort: event.target.value as DealSortOption })
              }
              value={currentSort}
            >
              {DEAL_SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span
              aria-hidden
              className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-wadeal-muted"
            >
              ▾
            </span>
          </label>
          <button
            aria-expanded={filtersOpen}
            className={`flex h-8 cursor-pointer items-center gap-1 rounded-lg border px-2.5 text-[11px] font-semibold transition-colors duration-150 ${
              filtersOpen || activeFilterCount > 0 ?
                "border-wadeal-red text-wadeal-red"
              : "border-wadeal-line text-wadeal-ink"
            }`}
            onClick={() => setFiltersOpen((open) => !open)}
            type="button"
          >
            필터
            {activeFilterCount > 0 ?
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-wadeal-red px-1 text-[9px] font-black text-white">
                {activeFilterCount}
              </span>
            : null}
          </button>
        </div>
      </div>

      {!filtersOpen ?
        <>
          <p className="text-[11px] font-bold text-wadeal-muted">{sortLabel} · 탭해서 필터 열기</p>
          <div className="no-scrollbar flex gap-1 overflow-x-auto pb-0.5">
            {SELLER_QUICK_FILTER_OPTIONS.map((option) => {
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
          <div className="no-scrollbar flex gap-1 overflow-x-auto pb-0.5">
            {PRICE_RANGE_PRESETS.slice(0, 5).map((preset) => {
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
        </>
      : null}

      {filtersOpen ?
        <div className="filter-panel celloh-dropdown">
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

type PopularSearchTermsProps = {
  terms: { query: string; count: number }[];
};

export function PopularSearchTerms({ terms }: PopularSearchTermsProps) {
  if (terms.length === 0) {
    return null;
  }

  return (
    <section className="space-y-2">
      <h2 className="text-[13px] font-bold text-wadeal-ink">인기 검색어</h2>
      <div className="flex flex-wrap gap-1">
        {terms.map((term) => (
          <Link
            className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-wadeal-ink ring-1 ring-wadeal-line transition-colors duration-150 active:bg-gray-50"
            href={`/search?q=${encodeURIComponent(term.query)}`}
            key={term.query}
          >
            {term.query}
          </Link>
        ))}
      </div>
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
