"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { CategoryChip, CategoryChipTrack } from "@/components/category-chip";
import type { CategorySlug } from "@/lib/categories";
import { getCategoryTree } from "@/lib/categories/catalog";
import { getSubcategoryGlyph } from "@/lib/categories/subcategory-glyphs";

type CategorySubNavProps = {
  categorySlug: CategorySlug;
};

export function CategorySubNav({ categorySlug }: CategorySubNavProps) {
  const tree = getCategoryTree(categorySlug);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeSub = searchParams.get("sub");
  const [pendingSub, setPendingSub] = useState<string | null | "__all__" | undefined>(
    undefined,
  );

  useEffect(() => {
    setPendingSub(undefined);
  }, [activeSub]);

  if (!tree || tree.subcategories.length === 0) {
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
      <CategoryChipTrack ariaLabel="하위 카테고리">
        <CategoryChip
          active={!displayActiveSub}
          href={buildHref(null)}
          icon="🛍️"
          label="전체"
          onClick={() => setPendingSub("__all__")}
        />
        {tree.subcategories.map((sub) => (
          <CategoryChip
            active={displayActiveSub === sub.slug}
            href={buildHref(sub.slug)}
            icon={getSubcategoryGlyph(sub.slug, categorySlug)}
            key={sub.slug}
            label={sub.label}
            onClick={() => setPendingSub(sub.slug)}
          />
        ))}
      </CategoryChipTrack>
    </nav>
  );
}
