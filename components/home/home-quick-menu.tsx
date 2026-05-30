import Link from "next/link";

import { HOME_QUICK_MENU_ITEMS } from "@/lib/home/quick-menu-items";

export function HomeQuickMenu() {
  return (
    <nav aria-label="빠른 메뉴" className="mb-5 mt-5 bg-white">
      <div className="overflow-x-auto px-6 pb-2 no-scrollbar">
        <div className="grid grid-flow-col grid-rows-2 auto-cols-[72px] gap-x-3 gap-y-3">
          {HOME_QUICK_MENU_ITEMS.map((item) => (
            <Link
              aria-label={item.label}
              className="flex w-[72px] cursor-pointer flex-col items-center gap-2 active:scale-[0.97]"
              href={item.href}
              key={item.id}
            >
              <span
                aria-hidden
                className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#F5F7F6] text-[20px]"
              >
                {item.glyph}
              </span>
              <span className="line-clamp-2 w-full text-center text-[12px] font-medium leading-tight text-[#111111]">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
