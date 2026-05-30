"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { CategoryChip, CategoryChipGrid } from "@/components/category-chip";
import type { CategorySlug } from "@/lib/categories";
import { getCategoryDisplaySubcategories } from "@/lib/categories/category-display-subcategories";

type CategorySubNavProps = {
  categorySlug: CategorySlug;
};

/** 현재 상위 카테고리 하위 box grid — 1회만 렌더, emoji + label */
export function CategorySubNav({ categorySlug }: CategorySubNavProps) {
  const subcategories = getCategoryDisplaySubcategories(categorySlug);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeSub = searchParams.get("sub");
  const [pendingSub, setPendingSub] = useState<string | null | "__all__" | undefined>(
    undefined,
  );

  useEffect(() => {
    setPendingSub(undefined);
  }, [activeSub, categorySlug]);

  if (subcategories.length === 0) {
    return null;
  }

  const basePath = pathname.split("?")[0];
  const displayActiveSub =
    pendingSub === undefined ?
      activeSub
    : pendingSub === "__all__" ?
      null
    : pendingSub;

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
    <nav aria-label="하위 카테고리">
      <CategoryChipGrid ariaLabel="하위 카테고리">
        <CategoryChip
          active={!displayActiveSub}
          href={buildHref(null)}
          icon="📦"
          label="전체"
          layout="grid"
          onClick={() => setPendingSub("__all__")}
        />
        {subcategories.map((sub) => (
          <CategoryChip
            active={displayActiveSub === sub.slug}
            href={buildHref(sub.slug)}
            icon={sub.glyph}
            key={sub.slug}
            label={sub.label}
            layout="grid"
            onClick={() => setPendingSub(sub.slug)}
          />
        ))}
      </CategoryChipGrid>
    </nav>
  );
}
