"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { AppCategoryBar } from "@/components/app-category-bar";
import { AppStickyHeader } from "@/components/app-sticky-header";
import { SearchIcon } from "@/components/icons";
import { ds } from "@/lib/design-system";
import { saveRecentSearch } from "@/lib/search/recent-searches";

type AppBuyerChromeProps = {
  unreadNotificationCount?: number;
  initialSearchQuery?: string;
  showSearch?: boolean;
  showCategoryBar?: boolean;
};

export function AppBuyerChrome({
  unreadNotificationCount = 0,
  initialSearchQuery = "",
  showSearch = true,
  showCategoryBar = true,
}: AppBuyerChromeProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialSearchQuery);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      router.push("/search");
      return;
    }
    saveRecentSearch(trimmed);
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <div className="sticky top-0 z-40 bg-white shadow-[0_1px_0_rgba(221,232,226,0.9)]">
      <AppStickyHeader unreadNotificationCount={unreadNotificationCount} />
      {showSearch ?
        <form className="px-4 pb-2.5" onSubmit={handleSubmit}>
          <label className={`${ds.chrome.searchInput} bg-[#F5F8F4] focus-within:bg-white`}>
            <SearchIcon aria-hidden className="h-4 w-4 shrink-0" />
            <span className="sr-only">상품 검색</span>
            <input
              aria-label="상품 검색"
              className="min-w-0 flex-1 cursor-text bg-transparent text-[14px] font-medium text-wadeal-ink outline-none placeholder:font-normal placeholder:text-gray-400"
              name="q"
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => router.push("/search")}
              placeholder="상품이나 판매자를 검색해보세요"
              suppressHydrationWarning
              type="search"
              value={query}
            />
          </label>
        </form>
      : null}
      {showCategoryBar ? <AppCategoryBar /> : null}
    </div>
  );
}
