"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { categoryNavItems } from "@/lib/categories";

export function CategoryGrid() {
  const pathname = usePathname();
  const activeSlug =
    pathname.startsWith("/category/") ?
      pathname.replace("/category/", "")
    : "all";

  return (
    <nav
      aria-label="카테고리"
      className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto border-b border-wadeal-line bg-white px-4 pb-3"
    >
      {categoryNavItems.map(({ label, slug }) => {
        const active = activeSlug === slug || (pathname === "/" && slug === "all");
        const isHome = pathname === "/";
        const highlighted = isHome ? slug === "all" : active;

        return (
          <Link
            className={`flex h-9 shrink-0 items-center rounded-full px-4 text-sm font-extrabold ${
              highlighted ?
                "bg-wadeal-red text-white"
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
