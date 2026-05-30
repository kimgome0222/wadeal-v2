"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  CartIcon,
  HomeIcon,
  MenuIcon,
  SearchIcon,
  UserIcon,
} from "@/components/icons";

const navItems = [
  {
    label: "홈",
    href: "/",
    icon: HomeIcon,
    match: (path: string) => path === "/",
  },
  {
    label: "카테고리",
    href: "/categories",
    icon: MenuIcon,
    match: (path: string) =>
      path === "/categories" || path.startsWith("/category/"),
  },
  {
    label: "검색",
    href: "/search",
    icon: SearchIcon,
    match: (path: string) => path.startsWith("/search"),
  },
  {
    label: "마이셀로",
    href: "/mypage",
    icon: UserIcon,
    match: (path: string) => path.startsWith("/mypage"),
  },
  {
    label: "장바구니",
    href: "/join-cart",
    icon: CartIcon,
    match: (path: string) => path.startsWith("/join-cart"),
  },
] as const;

type BottomNavigationProps = {
  unreadCount?: number;
};

export function BottomNavigation({ unreadCount: _unreadCount = 0 }: BottomNavigationProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="하단 메뉴"
      className="fixed inset-x-0 bottom-0 z-[60] mx-auto w-full max-w-[430px] border-t border-[#DDE8E2] bg-white pb-[max(env(safe-area-inset-bottom),8px)] pt-1.5 shadow-[0_-4px_16px_rgba(31,42,36,0.06)]"
    >
      <div className="grid grid-cols-5 px-0.5">
        {navItems.map(({ label, href, icon: Icon, match }) => {
          const active = match(pathname);

          return (
            <Link
              aria-current={active ? "page" : undefined}
              aria-label={label}
              className={`relative flex min-h-[52px] w-full cursor-pointer flex-col items-center justify-center gap-0.5 rounded-lg text-[10px] font-semibold transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wadeal-red/25 active:scale-[0.97] ${
                active ? "text-[#2E5E4E]" : "text-gray-400"
              }`}
              href={href}
              key={label}
            >
              {active ?
                <span className="absolute top-0 h-0.5 w-7 rounded-full bg-[#2E5E4E]" />
              : null}
              <Icon className={`h-[22px] w-[22px] ${active ? "stroke-[2.5]" : ""}`} />
              <span className={active ? "font-semibold" : "font-medium"}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
