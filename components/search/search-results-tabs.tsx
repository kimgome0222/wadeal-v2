"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { SearchResultsTab } from "@/lib/search/search-data";

type SearchResultsTabsProps = {
  productCount: number;
  sellerCount: number;
};

function buildTabHref(
  pathname: string,
  searchParams: URLSearchParams,
  tab: SearchResultsTab,
): string {
  const params = new URLSearchParams(searchParams.toString());
  if (tab === "products") {
    params.delete("tab");
  } else {
    params.set("tab", tab);
  }
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function SearchResultsTabs({ productCount, sellerCount }: SearchResultsTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab: SearchResultsTab =
    searchParams.get("tab") === "sellers" ? "sellers" : "products";

  function selectTab(tab: SearchResultsTab) {
    router.replace(buildTabHref(pathname, searchParams, tab), { scroll: false });
  }

  const tabs: { key: SearchResultsTab; label: string; count: number }[] = [
    { key: "products", label: "상품", count: productCount },
    { key: "sellers", label: "판매자", count: sellerCount },
  ];

  return (
    <div className="relative z-10 border-b border-[#E8ECEA]">
      <div className="flex h-11">
        {tabs.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <button
              aria-pressed={active}
              className={`relative z-10 flex flex-1 cursor-pointer items-center justify-center gap-1.5 text-[15px] font-semibold transition-colors ${
                active ? "text-[#2E5E4E]" : "text-[#666666]"
              }`}
              key={tab.key}
              onClick={() => selectTab(tab.key)}
              type="button"
            >
              {tab.label}
              <span className="text-[13px] font-medium tabular-nums">
                {tab.count.toLocaleString("ko-KR")}
              </span>
              {active ?
                <span className="absolute inset-x-4 bottom-0 h-0.5 rounded-full bg-[#2E5E4E]" />
              : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function useSearchResultsTab(): SearchResultsTab {
  const searchParams = useSearchParams();
  return searchParams.get("tab") === "sellers" ? "sellers" : "products";
}
