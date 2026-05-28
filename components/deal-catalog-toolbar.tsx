"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  ACHIEVEMENT_FILTER_OPTIONS,
  DEAL_SORT_OPTIONS,
  DEAL_STATUS_FILTER_OPTIONS,
  DISCOUNT_FILTER_OPTIONS,
  PRICE_RANGE_PRESETS,
  type DealSortOption,
  type DealStatusFilter,
} from "@/lib/search/types";
import { buildDealCatalogSearchParams } from "@/lib/search/params";

type DealCatalogToolbarProps = {
  total: number;
  queryLabel?: string;
  showStatusFilter?: boolean;
};

function chipClass(active: boolean) {
  return `h-8 shrink-0 cursor-pointer rounded-full px-3.5 text-[13px] font-extrabold ${
    active ?
      "bg-wadeal-red text-white"
    : "bg-white text-wadeal-ink shadow-card"
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

  const currentSort = (searchParams.get("sort") as DealSortOption | null) ?? "popular";
  const currentStatus =
    (searchParams.get("status") as DealStatusFilter | null) ?? "active";
  const priceMin = searchParams.get("priceMin");
  const priceMax = searchParams.get("priceMax");
  const closingSoon = searchParams.get("closingSoon") === "1";
  const todayDeadline = searchParams.get("todayDeadline") === "1";
  const minDiscount = searchParams.get("minDiscount");
  const minAchievement = searchParams.get("minAchievement");

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

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-2">
        <div className="min-w-0">
          {queryLabel ?
            <p className="truncate text-sm font-black text-wadeal-ink">{queryLabel}</p>
          : null}
          <p className="text-xs font-bold text-wadeal-muted">총 {total}개</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-[11px] font-black text-wadeal-muted">정렬</p>
        <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
          {DEAL_SORT_OPTIONS.map((option) => (
            <button
              className={chipClass(currentSort === option.value)}
              key={option.value}
              onClick={() => pushParams({ sort: option.value })}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {showStatusFilter ?
        <div className="space-y-2">
          <p className="text-[11px] font-black text-wadeal-muted">상태</p>
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
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

      <div className="space-y-2">
        <p className="text-[11px] font-black text-wadeal-muted">가격</p>
        <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
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

      <div className="space-y-2">
        <p className="text-[11px] font-black text-wadeal-muted">필터</p>
        <div className="no-scrollbar flex flex-wrap gap-1.5">
          <button
            className={chipClass(closingSoon)}
            onClick={() => pushParams({ closingSoon: !closingSoon })}
            type="button"
          >
            마감임박
          </button>
          <button
            className={chipClass(todayDeadline)}
            onClick={() => pushParams({ todayDeadline: !todayDeadline })}
            type="button"
          >
            오늘 마감
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
                할인 {option.label}
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
                달성 {option.label}
              </button>
            );
          })}
        </div>
      </div>
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
      <h2 className="text-sm font-black text-wadeal-ink">인기 검색어</h2>
      <div className="flex flex-wrap gap-1.5">
        {terms.map((term) => (
          <Link
            className="rounded-full bg-white px-3 py-1.5 text-xs font-extrabold text-wadeal-ink shadow-card active:bg-gray-50"
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
      className="flex h-11 w-full cursor-pointer items-center justify-center rounded-lg border border-wadeal-line bg-white text-sm font-black text-wadeal-ink active:bg-gray-50"
      href={`?${next.toString()}`}
      scroll={false}
    >
      더 보기
    </Link>
  );
}
