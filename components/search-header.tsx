"use client";

import Link from "next/link";

import { SearchBox } from "@/components/search/search-box";
import { WadealLogo } from "@/components/wadeal-logo";
import type { PopularSearchTerm } from "@/lib/search/types";

type SearchHeaderProps = {
  initialQuery?: string;
  backHref?: string;
  popularTerms?: PopularSearchTerm[];
};

export function SearchHeader({
  initialQuery = "",
  backHref,
  popularTerms = [],
}: SearchHeaderProps) {
  return (
    <header className="border-b border-wadeal-line bg-white px-4 pb-2 pt-2.5">
      <div className="flex items-center gap-2.5">
        {backHref ?
          <Link
            aria-label="뒤로가기"
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-lg font-black text-wadeal-ink active:bg-gray-100"
            href={backHref}
          >
            ←
          </Link>
        : <WadealLogo href="/" variant="wordmark" />
        }
        <div className="min-w-0 flex-1">
          <SearchBox
            compact
            initialQuery={initialQuery}
            placeholder="어떤 공동구매를 찾고 계신가요?"
            popularTerms={popularTerms}
          />
        </div>
      </div>
    </header>
  );
}
