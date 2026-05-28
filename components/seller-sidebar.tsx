"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ui } from "@/lib/ui";

const sellerLinks = [
  { href: "/seller/dashboard", label: "대시보드" },
  { href: "/seller/products", label: "상품 요청" },
  { href: "/seller/orders", label: "주문/배송" },
  { href: "/seller/cs-reviews", label: "문의·리뷰" },
  { href: "/seller/finance/settlements", label: "정산" },
  { href: "/seller/notices", label: "공지" },
  { href: "/seller/notifications", label: "알림" },
  { href: "/seller/settings", label: "공지·설정" },
] as const;

type SellerSidebarProps = {
  notificationUnreadCount?: number;
};

export function SellerSidebar({ notificationUnreadCount = 0 }: SellerSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-[5.5rem] shrink-0 border-r border-wadeal-line bg-white sm:w-40">
      <div className="sticky top-0 px-2 py-4">
        <Link
          className="mb-4 block px-1 text-center text-sm font-black text-wadeal-red sm:text-left"
          href="/seller/dashboard"
        >
          판매자
          <span className="hidden sm:inline"> 센터</span>
        </Link>
        <nav aria-label="판매자 센터 메뉴" className="space-y-1">
          {sellerLinks.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <Link
                className={`block rounded-lg px-2 py-2 text-[11px] font-black leading-tight sm:px-3 sm:text-xs ${
                  active ?
                    "bg-wadeal-red text-white"
                  : "text-wadeal-muted hover:bg-gray-50 hover:text-wadeal-ink"
                }`}
                href={link.href}
                key={link.href}
              >
                <span className="inline-flex items-center gap-1">
                  {link.label}
                  {link.href === "/seller/notifications" && notificationUnreadCount > 0 ?
                    <span className="inline-flex min-w-[1rem] items-center justify-center rounded-full bg-wadeal-red px-1 text-[9px] font-black leading-none text-white">
                      {notificationUnreadCount > 99 ? "99+" : notificationUnreadCount}
                    </span>
                  : null}
                </span>
              </Link>
            );
          })}
        </nav>
        <Link
          className={`${ui.btnOutline} mt-4 hidden h-9 text-[11px] sm:flex`}
          href="/"
        >
          쇼핑몰로
        </Link>
      </div>
    </aside>
  );
}
