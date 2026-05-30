"use client";

import { FormEvent, Suspense, useState } from "react";
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
    <div className="sticky top-0 z-[60] bg-white shadow-[0_1px_0_rgba(17,17,17,0.04)]">
      <AppStickyHeader unreadNotificationCount={unreadNotificationCount} />
      {showSearch ?
        <form className="border-b border-[#E8ECEA] bg-white px-6 pb-4 pt-1" onSubmit={handleSubmit}>
          <label className={ds.chrome.searchInput}>
            <SearchIcon aria-hidden className="h-5 w-5 shrink-0 text-[#666666]" />
            <span className="sr-only">상품 검색</span>
            <input
              aria-label="상품 검색"
              className="min-w-0 flex-1 cursor-text bg-transparent text-[15px] font-medium text-[#111111] outline-none placeholder:font-normal placeholder:text-[#666666]"
              name="q"
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => router.push("/search")}
              placeholder="좋은 판매자와 상품을 찾아보세요"
              suppressHydrationWarning
              type="search"
              value={query}
            />
          </label>
        </form>
      : null}
      {showCategoryBar ?
        <Suspense fallback={null}>
          <AppCategoryBar />
        </Suspense>
      : null}
    </div>
  );
}
