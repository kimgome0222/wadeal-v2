"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { categoryNavItems } from "@/lib/categories";

type CategoryGridProps = {
  sticky?: boolean;
};

export function CategoryGrid({ sticky = false }: CategoryGridProps) {
  const pathname = usePathname();
  const activeSlug =
    pathname.startsWith("/category/") ?
      pathname.replace("/category/", "")
    : "all";

  return (
    <nav
      aria-label="카테고리"
      className={`no-scrollbar flex gap-1.5 overflow-x-auto bg-white px-4 py-2 ${
        sticky ? "border-b border-wadeal-line" : "-mx-4 border-b border-wadeal-line px-4"
      }`}
    >
      {categoryNavItems.map(({ label, slug }) => {
        const onCategoryPage = pathname.startsWith("/category/");
        const highlighted =
          onCategoryPage ? activeSlug === slug : pathname === "/" && slug === "all";

        return (
          <Link
            className={`flex h-8 shrink-0 items-center rounded-full px-3.5 text-[13px] font-extrabold transition-colors ${
              highlighted ?
                "bg-wadeal-red text-white shadow-sm"
              : "bg-gray-100 text-wadeal-ink"
            }`}
            href={`/category/${slug}`}
            key={slug}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
