"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { CategoryChip, CategoryChipTrack } from "@/components/category-chip";
import type { CategorySlug } from "@/lib/categories";
import { getCategoryDisplaySubcategories } from "@/lib/categories/category-display-subcategories";

type CategorySubNavProps = {
  categorySlug: CategorySlug;
};

/** 현재 상위 카테고리의 하위 chip row — 이모티콘만 추가, 중복 통합 리스트 없음 */
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
  }, [activeSub]);

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
      <CategoryChipTrack ariaLabel="하위 카테고리">
        <CategoryChip
          active={!displayActiveSub}
          href={buildHref(null)}
          icon="📦"
          label="전체"
          onClick={() => setPendingSub("__all__")}
        />
        {subcategories.map((sub) => (
          <CategoryChip
            active={displayActiveSub === sub.slug}
            href={buildHref(sub.slug)}
            icon={sub.glyph}
            key={sub.slug}
            label={sub.label}
            onClick={() => setPendingSub(sub.slug)}
          />
        ))}
      </CategoryChipTrack>
    </nav>
  );
}
