"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import type { CategorySlug } from "@/lib/categories";
import { getCategoryTree } from "@/lib/categories/catalog";
import { buildDealCatalogSearchParams } from "@/lib/search/params";

type SearchSubNavProps = {
  categorySlug: CategorySlug;
};

export function SearchSubNav({ categorySlug }: SearchSubNavProps) {
  const searchParams = useSearchParams();
  const tree = getCategoryTree(categorySlug);
  const activeSub = searchParams.get("sub");

  if (!tree || tree.subcategories.length === 0) {
    return null;
  }

  const buildHref = (sub: string | null) => {
    const params = buildDealCatalogSearchParams(searchParams, {});
    params.set("cat", categorySlug);
    if (sub) {
      params.set("sub", sub);
    } else {
      params.delete("sub");
    }
    params.delete("page");
    const query = params.toString();
    return `/search?${query}`;
  };

  return (
    <nav
      aria-label="검색 하위 카테고리"
      className="no-scrollbar flex gap-1.5 overflow-x-auto border-b border-wadeal-line bg-white px-4 py-2"
    >
      <Link
        className={`flex h-7 shrink-0 cursor-pointer items-center rounded-full px-3 text-[12px] font-semibold transition-colors duration-150 ${
          !activeSub ?
            "bg-wadeal-ink text-white"
          : "bg-wadeal-surface text-wadeal-ink active:bg-gray-200"
        }`}
        href={buildHref(null)}
        scroll={false}
      >
        전체
      </Link>
      {tree.subcategories.map((sub) => {
        const active = activeSub === sub.slug;

        return (
          <Link
            className={`flex h-7 shrink-0 cursor-pointer items-center rounded-full px-3 text-[12px] font-semibold transition-colors duration-150 ${
              active ?
                "bg-wadeal-red text-white"
              : "bg-wadeal-surface text-wadeal-ink active:bg-gray-200"
            }`}
            href={buildHref(sub.slug)}
            key={sub.slug}
            scroll={false}
          >
            {sub.label}
          </Link>
        );
      })}
    </nav>
  );
}
