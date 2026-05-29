"use client";

import Link from "next/link";

import { homeCategoryIcons } from "@/lib/categories";

export function HomeCategoryIcons() {
  return (
    <section aria-label="카테고리" className="border-b border-wadeal-line bg-white">
      <div className="no-scrollbar flex gap-0.5 overflow-x-auto px-2 py-2">
        {homeCategoryIcons.map(({ slug, label, tone, glyph }) => (
          <Link
            className="flex w-[52px] shrink-0 cursor-pointer flex-col items-center gap-1 rounded-lg py-0.5 transition-colors duration-150 active:bg-gray-50"
            href={slug === "all" ? "/category/all" : `/category/${slug}`}
            key={slug}
          >
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm leading-none ${tone}`}
            >
              {glyph}
            </span>
            <span className="max-w-[52px] truncate text-center text-[10px] font-medium text-wadeal-ink">
              {label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
