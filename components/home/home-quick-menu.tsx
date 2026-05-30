import Link from "next/link";

import { HOME_QUICK_MENU_ITEMS } from "@/lib/home/quick-menu-items";

export function HomeQuickMenu() {
  return (
    <nav aria-label="빠른 메뉴">
      <div className="no-scrollbar -mx-6 flex gap-4 overflow-x-auto px-6 pb-0.5">
        {HOME_QUICK_MENU_ITEMS.map((item) => (
          <Link
            className="flex w-[64px] shrink-0 flex-col items-center gap-2 active:scale-[0.97]"
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
    </nav>
  );
}
