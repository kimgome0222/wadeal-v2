"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { APP_CATEGORY_BAR_ITEMS } from "@/lib/app/category-bar-items";

function isActiveCategory(
  pathname: string,
  href: string,
  categoryFromQuery: string | null,
): boolean {
  if (pathname === "/categories" && href.startsWith("/category/")) {
    const slug = href.replace("/category/", "");
    if (slug === "all") {
      return !categoryFromQuery;
    }
    return categoryFromQuery === slug;
  }

  if (href.startsWith("/category/")) {
    return pathname === href || pathname.startsWith(`${href}/`) || pathname.startsWith(`${href}?`);
  }

  if (href.startsWith("/search?")) {
    return pathname === "/search";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppCategoryBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const categoryFromQuery = searchParams.get("category");

  return (
    <nav
      aria-label="카테고리"
      className="relative z-[69] h-11 min-h-[44px] border-b border-[#E8ECEA] bg-white"
    >
      <div className="no-scrollbar flex h-11 items-center gap-1 overflow-x-auto px-6">
        {APP_CATEGORY_BAR_ITEMS.map((item) => {
          const active = isActiveCategory(pathname, item.href, categoryFromQuery);
          const href = item.href;

          return (
            <Link
              className={`relative z-10 inline-flex h-9 shrink-0 cursor-pointer items-center rounded-xl px-3.5 text-[14px] font-semibold transition-colors duration-[100ms] active:scale-[0.97] ${
                active ? "text-[#2E5E4E]" : "text-[#666666] hover:text-[#2E5E4E]"
              }`}
              href={href}
              key={item.href}
              scroll={false}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
