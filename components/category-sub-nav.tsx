"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import type { CategorySlug } from "@/lib/categories";
import { getCategoryTree } from "@/lib/categories/catalog";

type CategorySubNavProps = {
  categorySlug: CategorySlug;
};

export function CategorySubNav({ categorySlug }: CategorySubNavProps) {
  const tree = getCategoryTree(categorySlug);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeSub = searchParams.get("sub");

  if (!tree || tree.subcategories.length === 0) {
    return null;
  }

  const basePath = pathname.split("?")[0];

  const buildHref = (sub: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (sub) {
      params.set("sub", sub);
    } else {
      params.delete("sub");
    }
    params.delete("page");
    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  };

  return (
    <nav
      aria-label="하위 카테고리"
      className="no-scrollbar flex gap-1.5 overflow-x-auto border-b border-wadeal-line bg-white px-4 py-2"
    >
      <Link
        className={`flex h-7 shrink-0 cursor-pointer items-center rounded-full px-3 text-[12px] font-extrabold ${
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
            className={`flex h-7 shrink-0 cursor-pointer items-center rounded-full px-3 text-[12px] font-extrabold ${
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
