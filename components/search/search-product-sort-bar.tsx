"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { SEARCH_PRODUCT_SORT_OPTIONS } from "@/lib/search/search-data";
import { buildDealCatalogSearchParams } from "@/lib/search/params";
import type { DealSortOption } from "@/lib/search/types";

export function SearchProductSortBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSort = (searchParams.get("sort") as DealSortOption | null) ?? "popular";

  function selectSort(sort: DealSortOption) {
    const next = buildDealCatalogSearchParams(searchParams, { sort });
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto pb-0.5">
      {SEARCH_PRODUCT_SORT_OPTIONS.map((option) => {
        const active = currentSort === option.value;
        return (
          <button
            aria-pressed={active}
            className={`relative z-10 h-9 shrink-0 cursor-pointer rounded-[18px] px-3.5 text-[13px] font-medium transition-colors active:scale-[0.98] ${
              active ?
                "border border-[#2E5E4E] bg-[#2E5E4E] text-white"
              : "border border-[#E8ECEA] bg-white text-[#111111] hover:border-[#2E5E4E]/30"
            }`}
            key={option.value}
            onClick={() => selectSort(option.value)}
            type="button"
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
