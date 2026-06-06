"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { homeCategoryChips } from "@/lib/categories";

type CategoryGridProps = {
  sticky?: boolean;
};

export function CategoryGrid({ sticky = false }: CategoryGridProps) {
  const pathname = usePathname();
  const activeSlug =
    pathname.startsWith("/category/") ?
      pathname.replace("/category/", "").split("/")[0]
    : null;

  return (
    <nav
      aria-label="카테고리"
      className={`no-scrollbar flex gap-1.5 overflow-x-auto bg-white px-4 py-2 ${
        sticky ? "border-b border-wadeal-line" : ""
      }`}
    >
      {homeCategoryChips.map(({ label, slug }) => {
        const highlighted = activeSlug === slug;

        return (
          <Link
            className={`flex h-7 shrink-0 cursor-pointer items-center rounded-full px-3 text-[12px] font-semibold transition-colors duration-150 ${
              highlighted ?
                "bg-wadeal-ink text-white"
              : "bg-wadeal-surface text-wadeal-ink active:bg-gray-200"
            }`}
            href={`/category/${slug}`}
            key={slug}
          >
            {label}
          </Link>
        );
      })}
      <Link
        className="flex h-7 shrink-0 cursor-pointer items-center rounded-full bg-wadeal-surface px-3 text-[12px] font-semibold text-wadeal-muted ring-1 ring-wadeal-line transition-colors duration-150 active:bg-gray-200"
        href="/categories"
      >
        전체 ▾
      </Link>
    </nav>
  );
}
