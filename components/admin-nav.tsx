import Link from "next/link";

import { getUnreadCountForAdmin } from "@/lib/data/admin-notifications";
import { ui } from "@/lib/ui";

const adminLinks = [
  { href: "/admin/dashboard", label: "대시보드" },
  { href: "/admin/products", label: "상품관리" },
  { href: "/admin/orders", label: "주문관리" },
  { href: "/admin/sellers", label: "판매자관리" },
  { href: "/admin/seller-notices", label: "판매자공지" },
  { href: "/admin/products?status=pending", label: "상품검수" },
  { href: "/admin/support", label: "문의관리" },
  { href: "/admin/reviews", label: "리뷰관리" },
  { href: "/admin/settlements", label: "정산관리" },
  { href: "/admin/notifications", label: "알림센터" },
  { href: "/admin/payments", label: "결제/에러로그" },
  { href: "/admin/settings/business", label: "사업자설정" },
] as const;

type AdminNavProps = {
  current: (typeof adminLinks)[number]["href"] | string;
};

export async function AdminNav({ current }: AdminNavProps) {
  const adminUnreadCount = await getUnreadCountForAdmin();

  return (
    <nav className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {adminLinks.map((link) => {
        const active = current === link.href || current.startsWith(link.href.split("?")[0] ?? link.href);

        return (
          <Link
            className={`${ui.btnOutline} h-10 text-xs ${
              active ? "border-wadeal-red text-wadeal-red" : ""
            }`}
            href={link.href}
            key={link.href}
          >
            <span className="inline-flex items-center gap-1">
              {link.label}
              {link.href === "/admin/notifications" && adminUnreadCount > 0 ?
                <span className="inline-flex min-w-[1rem] items-center justify-center rounded-full bg-wadeal-red px-1 text-[9px] font-black leading-none text-white">
                  {adminUnreadCount > 99 ? "99+" : adminUnreadCount}
                </span>
              : null}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
