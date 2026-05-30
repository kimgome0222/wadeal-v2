import Link from "next/link";

import { COMMERCE_QUICK_MENU_ITEMS } from "@/lib/home/commerce-quick-menu";

export function HomeQuickMenu() {
  return (
    <nav aria-label="빠른 메뉴" className="mb-7 mt-5 bg-white">
      <div className="overflow-x-auto no-scrollbar">
        <div className="flex gap-2.5 px-6 pb-0.5">
          {COMMERCE_QUICK_MENU_ITEMS.map((item) => (
            <Link
              aria-label={item.label}
              className="flex w-[72px] shrink-0 cursor-pointer flex-col items-center gap-2.5 active:scale-[0.97]"
              href={item.href}
              key={item.id}
            >
              <span
                aria-hidden
                className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F5F7F6] text-[22px]"
              >
                {item.glyph}
              </span>
              <span className="w-full truncate text-center text-[12px] font-medium text-[#111111]">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
