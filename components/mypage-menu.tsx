import Link from "next/link";
import { MypageLogoutButton } from "@/components/mypage-logout-button";
import type { RoleNavLink } from "@/lib/auth/role-nav";

type MypageMenuProps = {
  unreadNotificationCount?: number;
  roleLinks?: RoleNavLink[];
};

type MenuSection = {
  title: string;
  items: {
    label: string;
    href: string;
    badge?: boolean;
    meta?: string;
  }[];
};

const customerMenuSections: MenuSection[] = [
  {
    title: "쇼핑",
    items: [
      { label: "주문내역", href: "/mypage/orders" },
      { label: "공동구매 참여내역", href: "/mypage/groupbuys" },
      { label: "리뷰", href: "/mypage/reviews" },
    ],
  },
  {
    title: "혜택·알림",
    items: [
      { label: "쿠폰/포인트", href: "/mypage/benefits" },
      { label: "알림", href: "/notifications", badge: true },
    ],
  },
  {
    title: "계정",
    items: [
      { label: "주소록", href: "/mypage/addresses" },
      { label: "결제수단", href: "/mypage/payment" },
      { label: "고객센터", href: "/mypage/support" },
      { label: "개인정보", href: "/mypage/profile" },
      { label: "설정", href: "/mypage/settings" },
    ],
  },
];

export function MypageMenu({
  unreadNotificationCount = 0,
  roleLinks = [],
}: MypageMenuProps) {
  return (
    <div className="space-y-3">
      {roleLinks.length > 1 ?
        <section>
          <h2 className="mb-2 text-xs font-bold text-wadeal-muted">센터 바로가기</h2>
          <ul className="overflow-hidden rounded-xl border border-wadeal-line bg-white divide-y divide-wadeal-line">
            {roleLinks.map((link) => (
              <li key={link.href}>
                <Link
                  className="flex w-full cursor-pointer items-center justify-between px-4 py-4 active:bg-gray-50"
                  href={link.href}
                >
                  <span className="text-sm font-black text-wadeal-ink">{link.label}</span>
                  <span aria-hidden className="text-gray-400">
                    ›
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      : null}

      {customerMenuSections.map((section) => (
        <section key={section.title}>
          <h2 className="mb-2 text-xs font-bold text-wadeal-muted">{section.title}</h2>
          <ul className="overflow-hidden rounded-xl border border-wadeal-line bg-white divide-y divide-wadeal-line">
            {section.items.map((item) => (
              <li key={item.href}>
                <Link
                  className="flex w-full cursor-pointer items-center justify-between px-4 py-4 active:bg-gray-50"
                  href={item.href}
                >
                  <span className="text-sm font-black text-wadeal-ink">{item.label}</span>
                  <span className="flex items-center gap-2">
                    {item.meta ?
                      <span className="text-xs font-bold text-wadeal-muted">{item.meta}</span>
                    : null}
                    {item.badge && unreadNotificationCount > 0 ?
                      <span className="rounded-full bg-wadeal-red px-2 py-0.5 text-[10px] font-black text-white">
                        {unreadNotificationCount > 99 ? "99+" : unreadNotificationCount}
                      </span>
                    : null}
                    <span aria-hidden className="text-gray-400">
                      ›
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <ul className="overflow-hidden rounded-xl border border-wadeal-line bg-white divide-y divide-wadeal-line">
        <li>
          <MypageLogoutButton />
        </li>
      </ul>
    </div>
  );
}
