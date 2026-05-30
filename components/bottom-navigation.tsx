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
import { ds } from "@/lib/design-system";

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
    <nav aria-label="하단 메뉴" className={ds.chrome.bottomNav}>
      <div className="grid h-16 grid-cols-5 px-1">
        {navItems.map(({ label, href, icon: Icon, match }) => {
          const active = match(pathname);

          return (
            <Link
              aria-current={active ? "page" : undefined}
              aria-label={label}
              className={`relative flex min-h-[64px] w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-lg transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wadeal-red/25 active:scale-[0.97] ${
                active ? "text-[#2E5E4E]" : "text-[#999999]"
              }`}
              href={href}
              key={label}
            >
              {active ?
                <span className="absolute top-0 h-0.5 w-7 rounded-full bg-[#2E5E4E]" />
              : null}
              <Icon className="h-6 w-6" strokeWidth={active ? 2.25 : 2} />
              <span className={`${ds.type.tabLabel} ${active ? "font-semibold" : "font-medium"}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
