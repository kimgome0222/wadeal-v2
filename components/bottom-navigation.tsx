"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GridIcon, HeartIcon, HomeIcon, UserIcon } from "@/components/icons";

const navItems = [
  { label: "홈", href: "/", icon: HomeIcon, match: (path: string) => path === "/" },
  {
    label: "카테고리",
    href: "/category/all",
    icon: GridIcon,
    match: (path: string) => path.startsWith("/category"),
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
];

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

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-[480px] border-t border-wadeal-line bg-white pb-[max(env(safe-area-inset-bottom),6px)] pt-1">
      <div className="grid grid-cols-5">
        {navItems.map(({ label, href, icon: Icon, match }) => {
          const active = match(pathname);
          return (
            <Link
              className={`flex min-h-[48px] flex-col items-center justify-center gap-0.5 text-[10px] font-bold ${
                active ? "text-wadeal-red" : "text-gray-500"
              }`}
              href={href}
              key={label}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
