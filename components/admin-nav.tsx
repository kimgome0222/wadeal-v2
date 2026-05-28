import Link from "next/link";
import { ui } from "@/lib/ui";

const adminLinks = [
  { href: "/admin/dashboard", label: "대시보드" },
  { href: "/admin/products", label: "상품관리" },
  { href: "/admin/orders", label: "주문관리" },
  { href: "/admin/sellers", label: "판매자관리" },
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

export function AdminNav({ current }: AdminNavProps) {
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
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
