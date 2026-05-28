"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { SearchIcon } from "@/components/icons";
import { WadealLogo } from "@/components/wadeal-logo";

type SearchHeaderProps = {
  initialQuery?: string;
  backHref?: string;
};

export function SearchHeader({ initialQuery = "", backHref }: SearchHeaderProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      router.push("/search");
      return;
    }

    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

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
        : <WadealLogo href="/" />
        }
        <form className="flex min-w-0 flex-1 items-center" onSubmit={handleSubmit}>
          <label className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-lg bg-wadeal-surface px-3 text-gray-500">
            <SearchIcon aria-hidden className="h-3.5 w-3.5 shrink-0" />
            <span className="sr-only">상품 검색</span>
            <input
              aria-label="상품 검색"
              className="min-w-0 flex-1 cursor-text bg-transparent text-[13px] font-bold text-wadeal-ink outline-none placeholder:font-bold placeholder:text-gray-400"
              name="q"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="어떤 공동구매를 찾고 계신가요?"
              suppressHydrationWarning
              type="search"
              value={query}
            />
          </label>
        </form>
      </div>
    </header>
  );
}
