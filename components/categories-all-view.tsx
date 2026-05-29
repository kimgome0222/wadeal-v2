import Link from "next/link";

import { categoryTitles, homeCategoryIcons, type CategorySlug } from "@/lib/categories";
import {
  getBrowsableCategoryTrees,
  getCategoryListingHref,
  type CategoryTreeItem,
} from "@/lib/categories/catalog";

const ICON_BY_TREE_SLUG: Partial<Record<CategorySlug, string>> = {
  food: "food",
  living: "living",
  beauty: "beauty",
  digital: "digital",
  fashion: "fashion",
  pet: "pet",
  baby: "kids",
  local: "gift",
};

const QUICK_LINKS: { slug: CategorySlug; label: string }[] = [
  { slug: "all", label: "전체" },
  { slug: "recommended", label: "오늘의 추천" },
  { slug: "popular", label: "인기 상품" },
  { slug: "new-sellers", label: "신규 입점" },
];

function CategorySection({ tree }: { tree: CategoryTreeItem }) {
  const icon = homeCategoryIcons.find(
    (item) => item.id === (ICON_BY_TREE_SLUG[tree.slug] ?? tree.slug),
  );

  return (
    <section className="overflow-hidden rounded-2xl border border-wadeal-line bg-white shadow-card">
      <Link
        className="flex cursor-pointer items-center gap-3 border-b border-wadeal-line px-4 py-3 transition-colors duration-150 hover:bg-wadeal-surface active:bg-wadeal-surface"
        href={getCategoryListingHref(tree.slug)}
      >
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base ${icon?.tone ?? "bg-wadeal-surface text-wadeal-ink"}`}
        >
          {icon?.glyph ?? "📦"}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-semibold text-wadeal-ink">{tree.label}</p>
          <p className="text-[11px] font-normal text-wadeal-muted">
            {categoryTitles[tree.slug]} · {tree.subcategories.length}개 하위
          </p>
        </div>
        <span aria-hidden className="text-[12px] font-medium text-wadeal-muted">
          →
        </span>
      </Link>
      <div className="grid grid-cols-2 gap-px bg-wadeal-line sm:grid-cols-3">
        {tree.subcategories.map((sub) => (
          <Link
            className="flex min-h-[44px] cursor-pointer items-center bg-white px-3 py-2.5 text-[12px] font-medium text-wadeal-ink transition-colors duration-150 active:bg-gray-50"
            href={getCategoryListingHref(tree.slug, sub.slug)}
            key={sub.slug}
          >
            {sub.label}
          </Link>
        ))}
      </div>
    </section>
  );
}

export function CategoriesAllView() {
  const trees = getBrowsableCategoryTrees();

  return (
    <div className="space-y-4 pb-2">
      <div className="space-y-2">
        <p className="text-[13px] font-semibold text-wadeal-ink">바로가기</p>
        <div className="flex flex-wrap gap-2">
          {QUICK_LINKS.map(({ slug, label }) => (
            <Link
              className="flex h-8 cursor-pointer items-center rounded-full border border-wadeal-line bg-white px-3 text-[12px] font-medium text-wadeal-ink transition-colors duration-150 hover:border-[#2E5E4E]/30 hover:text-[#2E5E4E] active:opacity-90"
              href={getCategoryListingHref(slug)}
              key={slug}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-[13px] font-semibold text-wadeal-ink">전체 카테고리</p>
        {trees.map((tree) => (
          <CategorySection key={tree.slug} tree={tree} />
        ))}
      </div>
    </div>
  );
}
