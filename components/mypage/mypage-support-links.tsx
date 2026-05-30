import Link from "next/link";

import { MypageLogoutButton } from "@/components/mypage-logout-button";

const SUPPORT_LINKS = [
  { label: "고객센터", href: "/support" },
  { label: "공지사항", href: "/support" },
  { label: "알림 설정", href: "/mypage/notification-settings" },
] as const;

export function MypageSupportLinks() {
  return (
    <section aria-label="고객센터 및 설정" className="space-y-3 px-6 pt-10">
      <ul className="overflow-hidden rounded-[16px] border border-[#E8ECEA] bg-white">
        {SUPPORT_LINKS.map((item) => (
          <li className="border-b border-[#E8ECEA] last:border-b-0" key={item.href + item.label}>
            <Link
              className="flex min-h-[56px] items-center px-4 text-[15px] font-medium text-[#111111] active:bg-[#FAFBFA]"
              href={item.href}
            >
              {item.label}
            </Link>
          </li>
        ))}
        <li>
          <MypageLogoutButton />
        </li>
      </ul>
    </section>
  );
}
