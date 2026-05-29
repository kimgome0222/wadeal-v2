"use client";

import Link from "next/link";
import type { User } from "@supabase/supabase-js";

import { MypageOrderStatusBar } from "@/components/mypage-order-status-bar";
import { resolveUserDisplayName } from "@/lib/auth/user-display";
import type { MypageDashboardSummary, UserProfile } from "@/lib/profile/types";
import { ds } from "@/lib/design-system";
import { ui } from "@/lib/ui";

type MypageDashboardProps = {
  profile: UserProfile;
  summary: MypageDashboardSummary;
  user?: User | null;
};

type QuickLink = {
  label: string;
  href: string;
  highlight?: string;
};

export function MypageDashboard({ profile, summary, user = null }: MypageDashboardProps) {
  const displayName = resolveUserDisplayName({ profile, user });

  const quickLinks: QuickLink[] = [
    { label: "주문", href: "/mypage/orders", highlight: String(summary.activeGroupBuyCount) },
    { label: "찜", href: "/saved", highlight: String(summary.wishlistCount) },
    { label: "리뷰", href: "/mypage/reviews" },
    { label: "최근 본", href: "/mypage/recent" },
    { label: "쿠폰·포인트", href: "/mypage/benefits" },
    { label: "문의", href: "/mypage/support" },
  ];

  return (
    <div className={ds.page.stackSm}>
      <Link
        className={`${ds.card.padded} flex items-center gap-3 transition-colors hover:bg-[#FAFBFA]`}
        href="/mypage/account"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F8FAF8] text-base font-semibold text-[#2E5E4E] ring-1 ring-wadeal-line/60">
          {displayName.slice(0, 1) || "c"}
        </span>
        <div className="min-w-0 flex-1">
          <p className={`truncate ${ds.type.h3}`}>{displayName}</p>
          <p className={`mt-0.5 ${ds.type.caption}`}>
            {profile.memberGrade} · 회원정보
          </p>
        </div>
        <span aria-hidden className={ds.type.caption}>
          ›
        </span>
      </Link>

      <MypageOrderStatusBar summary={summary} />

      <section className={`${ds.card.padded} !p-3`}>
        <div className="grid grid-cols-3 gap-1 sm:grid-cols-6">
          {quickLinks.map((link) => (
            <Link
              className="flex flex-col items-center gap-1 rounded-lg py-2.5 transition-colors hover:bg-[#F8FAF8] active:bg-[#F8FAF8]"
              href={link.href}
              key={link.href}
            >
              <span className={`${ds.type.caption} text-wadeal-ink`}>{link.label}</span>
              {link.highlight && link.highlight !== "0" ?
                <span className="text-[10px] font-medium text-[#2E5E4E]">{link.highlight}</span>
              : null}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
