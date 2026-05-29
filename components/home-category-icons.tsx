import Link from "next/link";

import { homeCategoryIcons } from "@/lib/categories";

export function HomeCategoryIcons() {
  return (
    <section aria-label="카테고리" className="pt-1">
      <div className="no-scrollbar -mx-1 flex gap-2.5 overflow-x-auto px-1">
        {homeCategoryIcons.map(({ id, label, tone, glyph, href }) => (
          <Link
            className="group flex w-[58px] shrink-0 cursor-pointer flex-col items-center gap-1.5 py-0.5"
            href={href}
            key={id}
          >
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-full text-[15px] leading-none transition-colors duration-200 group-hover:ring-[#2E5E4E]/30 ${tone} group-hover:text-[#2E5E4E]`}
            >
              {glyph}
            </span>
            <span className="max-w-[58px] truncate text-center text-[11px] font-medium text-wadeal-ink transition-colors duration-200 group-hover:text-[#2E5E4E]">
              {label}
            </span>
          </Link>
        ))}
        <Link
          className="group flex w-[58px] shrink-0 cursor-pointer flex-col items-center gap-1.5 py-0.5"
          href="/categories"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[14px] leading-none text-wadeal-muted ring-1 ring-wadeal-line/80 transition-colors duration-200 group-hover:text-[#2E5E4E] group-hover:ring-[#2E5E4E]/30">
            ☰
          </span>
          <span className="max-w-[58px] truncate text-center text-[11px] font-medium text-wadeal-muted transition-colors duration-200 group-hover:text-[#2E5E4E]">
            더보기
          </span>
        </Link>
      </div>
    </section>
  );
}
