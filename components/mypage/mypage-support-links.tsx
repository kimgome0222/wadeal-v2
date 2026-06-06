import Link from "next/link";

import { BellIcon, ChevronRightIcon, HelpCircleIcon, SettingsIcon } from "@/components/icons";
import { MypageLogoutButton } from "@/components/mypage-logout-button";

const SUPPORT_LINKS = [
  { label: "고객센터", href: "/support", icon: HelpCircleIcon },
  { label: "FAQ", href: "/support/faq", icon: HelpCircleIcon },
  { label: "문의 내역", href: "/support/tickets", icon: HelpCircleIcon },
  { label: "공지사항", href: "/support/notices", icon: BellIcon },
  { label: "알림 설정", href: "/mypage/notification-settings", icon: SettingsIcon },
] as const;

export function MypageSupportLinks() {
  return (
    <section aria-label="고객센터 및 설정" className="space-y-3 px-6 pt-2">
      <ul className="overflow-hidden rounded-[16px] border border-[#E8ECEA] bg-white">
        {SUPPORT_LINKS.map((item) => {
          const Icon = item.icon;
          return (
            <li className="border-b border-[#E8ECEA] last:border-b-0" key={item.href + item.label}>
              <Link
                className="flex min-h-[56px] items-center gap-3 px-4 text-[15px] font-medium text-[#111111] active:bg-[#FAFBFA]"
                href={item.href}
              >
                <Icon className="h-5 w-5 shrink-0 text-[#666666]" />
                <span className="min-w-0 flex-1">{item.label}</span>
                <ChevronRightIcon className="h-5 w-5 shrink-0 text-[#999999]" />
              </Link>
            </li>
          );
        })}
        <li>
          <MypageLogoutButton />
        </li>
      </ul>
    </section>
  );
}
