"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { APP_CATEGORY_BAR_ITEMS } from "@/lib/app/category-bar-items";

function isActiveCategory(pathname: string, href: string): boolean {
  if (href.startsWith("/category/")) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }
  if (href.startsWith("/search?")) {
    return pathname === "/search";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppCategoryBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="카테고리"
      className="border-b border-[#DDE8E2]/80 bg-white"
    >
      <div className="no-scrollbar flex gap-1 overflow-x-auto px-4 py-2">
        {APP_CATEGORY_BAR_ITEMS.map((item) => {
          const active = isActiveCategory(pathname, item.href);
          return (
            <Link
              className={`inline-flex h-8 shrink-0 items-center rounded-full px-3.5 text-[13px] font-medium transition-colors active:scale-[0.97] ${
                active ?
                  "bg-[#2E5E4E]/10 text-[#2E5E4E]"
                : "text-[#2E5E4E] hover:bg-[#F5F8F4]"
              }`}
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
