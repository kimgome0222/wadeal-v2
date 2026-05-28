"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeartIcon, HomeIcon, UserIcon } from "@/components/icons";

const navItems = [
  {
    label: "홈",
    href: "/",
    icon: HomeIcon,
    match: (path: string) => path === "/",
  },
  {
    label: "알림",
    href: "/notifications",
    icon: BellIcon,
    match: (path: string) => path.startsWith("/notifications"),
  },
  {
    label: "찜",
    href: "/saved",
    icon: HeartIcon,
    match: (path: string) => path.startsWith("/saved"),
  },
  {
    label: "마이",
    href: "/mypage",
    icon: UserIcon,
    match: (path: string) => path.startsWith("/mypage"),
  },
] as const;

function BellIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10 20a2 2 0 0 0 4 0" strokeLinecap="round" />
    </svg>
  );
}

type BottomNavigationProps = {
  unreadCount?: number;
};

export function BottomNavigation({ unreadCount = 0 }: BottomNavigationProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="하단 메뉴"
      className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-[480px] border-t border-wadeal-line bg-white/95 backdrop-blur-sm pb-[max(env(safe-area-inset-bottom),8px)] pt-1.5"
    >
      <div className="grid grid-cols-4 px-1">
        {navItems.map(({ label, href, icon: Icon, match }) => {
          const active = match(pathname);

          return (
            <Link
              aria-current={active ? "page" : undefined}
              aria-label={label}
              className={`relative flex min-h-[54px] w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-lg text-[10px] font-bold transition-colors active:opacity-80 ${
                active ? "text-wadeal-red" : "text-gray-400"
              }`}
              href={href}
              key={label}
            >
              {active ?
                <span className="absolute top-0 h-0.5 w-8 rounded-full bg-wadeal-red" />
              : null}
              <span className="relative">
                <Icon className={`h-[22px] w-[22px] ${active ? "stroke-[2.5]" : ""}`} />
                {label === "알림" && unreadCount > 0 ?
                  <span className="absolute -right-1.5 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-wadeal-red px-1 text-[9px] font-black text-white">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                : null}
              </span>
              <span className={active ? "font-black" : "font-bold"}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
