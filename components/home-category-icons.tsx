"use client";

import Link from "next/link";

import { homeCategoryIcons } from "@/lib/categories";

export function HomeCategoryIcons() {
  return (
    <section aria-label="카테고리" className="border-b border-wadeal-line bg-white">
      <div className="flex items-center justify-between px-4 pb-1 pt-2">
        <p className="text-[13px] font-bold text-wadeal-ink">카테고리</p>
        <Link
          className="cursor-pointer text-[11px] font-semibold text-wadeal-muted underline-offset-2 transition-colors duration-150 active:text-wadeal-red"
          href="/categories"
        >
          전체보기
        </Link>
      </div>
      <div className="no-scrollbar flex gap-0.5 overflow-x-auto px-2 pb-2 pt-0.5">
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
        <Link
          className="flex w-[52px] shrink-0 cursor-pointer flex-col items-center gap-1 rounded-lg py-0.5 transition-colors duration-150 active:bg-gray-50"
          href="/categories"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-wadeal-surface text-sm leading-none text-wadeal-ink ring-1 ring-wadeal-line">
            ☰
          </span>
          <span className="max-w-[52px] truncate text-center text-[10px] font-medium text-wadeal-ink">
            전체
          </span>
        </Link>
      </div>
    </section>
  );
}
