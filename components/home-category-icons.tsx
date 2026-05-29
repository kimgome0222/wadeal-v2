"use client";

import Link from "next/link";

import { homeCategoryIcons } from "@/lib/categories";

export function HomeCategoryIcons() {
  return (
    <section aria-label="카테고리" className="border-b border-wadeal-line bg-white px-3 py-3">
      <div className="grid grid-cols-5 gap-y-3">
        {homeCategoryIcons.map(({ slug, label, tone, glyph }) => (
          <Link
            className="flex cursor-pointer flex-col items-center gap-1.5 rounded-lg px-1 py-1 transition-colors duration-150 active:bg-gray-50"
            href={slug === "all" ? "/category/all" : `/category/${slug}`}
            key={slug}
          >
            <span
              className={`flex h-11 w-11 items-center justify-center rounded-2xl text-lg ${tone}`}
            >
              {glyph}
            </span>
            <span className="max-w-[64px] truncate text-center text-[11px] font-medium text-wadeal-ink">
              {label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
