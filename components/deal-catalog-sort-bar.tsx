"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { buildDealCatalogSearchParams } from "@/lib/search/params";
import { DEAL_SORT_OPTIONS, type DealSortOption } from "@/lib/search/types";

export function DealCatalogSortBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = (searchParams.get("sort") as DealSortOption | null) ?? "popular";

  const pushSort = (sort: DealSortOption) => {
    const next = buildDealCatalogSearchParams(searchParams, { sort, page: null });
    const query = next.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <nav
      aria-label="정렬"
      className="no-scrollbar flex gap-1 overflow-x-auto border-b border-wadeal-line bg-white px-4 py-2"
    >
      {DEAL_SORT_OPTIONS.map((option) => {
        const active = currentSort === option.value;

        return (
          <button
            className={`flex h-7 shrink-0 cursor-pointer items-center rounded-full px-3 text-[11px] font-semibold transition-colors duration-150 ${
              active ?
                "bg-wadeal-ink text-white"
              : "bg-wadeal-surface text-wadeal-muted active:bg-gray-200"
            }`}
            key={option.value}
            onClick={() => pushSort(option.value)}
            type="button"
          >
            {option.label}
          </button>
        );
      })}
    </nav>
  );
}
