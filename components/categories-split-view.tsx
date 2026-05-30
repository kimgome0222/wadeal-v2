"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { categoryTitles, homeCategoryIcons, type CategorySlug } from "@/lib/categories";
import {
  getBrowsableCategoryTrees,
  getCategoryListingHref,
  type CategoryTreeItem,
} from "@/lib/categories/catalog";
import { ds } from "@/lib/design-system";

function getIconGlyph(slug: CategorySlug): string {
  const icon = homeCategoryIcons.find((item) => item.href.includes(`/category/${slug}`));
  return icon?.glyph ?? "📦";
}

export function CategoriesSplitView() {
  const trees = getBrowsableCategoryTrees();
  const [selected, setSelected] = useState<CategorySlug | "events">(trees[0]?.slug ?? "food");

  const rightTree = useMemo(
    () => trees.find((tree) => tree.slug === selected),
    [trees, selected],
  );

  const leftItems: { key: string; label: string; slug: CategorySlug | "events" }[] = [
    ...trees.map((tree) => ({ key: tree.slug, label: tree.label, slug: tree.slug as CategorySlug })),
    { key: "events", label: "혜택/기획전", slug: "events" as const },
  ];

  return (
    <div className="flex min-h-[calc(100vh-12rem)] border border-[#DDE8E2] bg-white">
      <nav
        aria-label="카테고리 목록"
        className="w-[108px] shrink-0 border-r border-[#DDE8E2] bg-[#FAFBFA]"
      >
        <ul>
          {leftItems.map((item) => {
            const active = selected === item.slug;
            return (
              <li key={item.key}>
                <button
                  className={`flex w-full cursor-pointer items-center border-l-2 px-2 py-3.5 text-left text-[12px] font-medium leading-snug transition-colors ${
                    active ?
                      "border-[#2E5E4E] bg-white text-[#2E5E4E]"
                    : "border-transparent text-wadeal-muted hover:bg-white/80"
                  }`}
                  onClick={() => setSelected(item.slug)}
                  type="button"
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="min-w-0 flex-1 overflow-y-auto p-4">
        {selected === "events" ?
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎁</span>
              <h2 className={ds.type.h3}>혜택/기획전</h2>
            </div>
            <ul className="space-y-1">
              {[
                { label: "진행 중 이벤트", href: "/events" },
                { label: "쿠폰·포인트", href: "/mypage/benefits" },
                { label: "특가 상품", href: "/category/closing-soon" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    className="flex min-h-[44px] items-center rounded-lg px-2 text-[13px] font-medium text-wadeal-ink hover:bg-[#F5F8F4]"
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        : rightTree ?
          <CategoryPanel tree={rightTree} />
        : null}
      </div>
    </div>
  );
}

function CategoryPanel({ tree }: { tree: CategoryTreeItem }) {
  const glyph = getIconGlyph(tree.slug);
  return (
    <div className="space-y-3">
      <Link
        className="flex items-center gap-2 rounded-xl bg-[#F5F8F4] px-3 py-3"
        href={getCategoryListingHref(tree.slug)}
      >
        <span className="text-2xl">{glyph}</span>
        <div>
          <h2 className={ds.type.h3}>{tree.label}</h2>
          <p className={`${ds.type.caption}`}>{categoryTitles[tree.slug]}</p>
        </div>
      </Link>
      <ul className="space-y-0.5">
        <li>
          <Link
            className="flex min-h-[44px] items-center rounded-lg px-2 text-[13px] font-semibold text-[#2E5E4E]"
            href={getCategoryListingHref(tree.slug)}
          >
            {tree.label} 전체
          </Link>
        </li>
        {tree.subcategories.map((sub) => (
          <li key={sub.slug}>
            <Link
              className="flex min-h-[44px] items-center rounded-lg px-2 text-[13px] font-medium text-wadeal-ink hover:bg-[#F5F8F4]"
              href={getCategoryListingHref(tree.slug, sub.slug)}
            >
              {sub.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
