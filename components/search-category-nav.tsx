"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import type { CategorySlug } from "@/lib/categories";
import { homeCategoryChips, isCategorySlug } from "@/lib/categories";
import { buildDealCatalogSearchParams } from "@/lib/search/params";

const SEARCH_CATEGORY_CHIPS = homeCategoryChips.filter(
  (chip) => chip.slug !== "closing-soon",
);

export function SearchCategoryNav() {
  const searchParams = useSearchParams();
  const activeCatRaw = searchParams.get("cat");
  const activeCat =
    activeCatRaw && isCategorySlug(activeCatRaw) ? activeCatRaw : null;

  const buildHref = (slug: CategorySlug | null) => {
    const params = buildDealCatalogSearchParams(searchParams, {});
    if (slug && slug !== "all") {
      params.set("cat", slug);
    } else {
      params.delete("cat");
    }
    params.delete("sub");
    params.delete("page");
    const query = params.toString();
    return query ? `/search?${query}` : "/search";
  };

  return (
    <nav
      aria-label="검색 카테고리"
      className="no-scrollbar flex gap-1.5 overflow-x-auto border-b border-wadeal-line bg-white px-4 py-2"
    >
      {SEARCH_CATEGORY_CHIPS.map(({ label, slug }) => {
        const active = slug === "all" ? !activeCat || activeCat === "all" : activeCat === slug;

        return (
          <Link
            className={`flex h-7 shrink-0 cursor-pointer items-center rounded-full px-3 text-[12px] font-semibold transition-colors duration-150 ${
              active ?
                "bg-wadeal-ink text-white"
              : "bg-wadeal-surface text-wadeal-ink active:bg-gray-200"
            }`}
            href={buildHref(slug === "all" ? null : slug)}
            key={slug}
            scroll={false}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
