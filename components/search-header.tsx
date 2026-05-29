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
    <header className="border-b border-[#DDE8E2] bg-white px-4 pb-2 pt-[max(env(safe-area-inset-top),8px)]">
      <div className="flex items-center gap-2.5">
        {backHref ?
          <Link
            aria-label="뒤로가기"
            className="flex h-11 min-h-[44px] w-11 min-w-[44px] shrink-0 cursor-pointer items-center justify-center rounded-xl text-lg font-semibold text-wadeal-ink transition-colors duration-200 hover:bg-[#FAFBFA] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wadeal-red/25"
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
            placeholder="어떤 상품을 찾고 계신가요?"
            popularTerms={popularTerms}
          />
        </div>
      </div>
    </header>
  );
}
