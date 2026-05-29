"use client";

import Link from "next/link";
import type { User } from "@supabase/supabase-js";

import { MypageOrderStatusBar } from "@/components/mypage-order-status-bar";
import { resolveUserDisplayName } from "@/lib/auth/user-display";
import type { MypageDashboardSummary, UserProfile } from "@/lib/profile/types";
import { ui } from "@/lib/ui";

type MypageDashboardProps = {
  profile: UserProfile;
  summary: MypageDashboardSummary;
  user?: User | null;
};

type QuickLink = {
  emoji: string;
  label: string;
  href: string;
  highlight?: string;
};

export function MypageDashboard({ profile, summary, user = null }: MypageDashboardProps) {
  const displayName = resolveUserDisplayName({ profile, user });

  const quickLinks: QuickLink[] = [
    { emoji: "❤️", label: "찜", href: "/saved", highlight: String(summary.wishlistCount) },
    { emoji: "🛒", label: "장바구니", href: "/join-cart" },
    { emoji: "🔔", label: "가격알림", href: "/mypage/alerts" },
    { emoji: "🎁", label: "쿠폰·포인트", href: "/mypage/benefits" },
  ];

  return (
    <div className="space-y-3">
      <Link
        className="flex items-center gap-3 rounded-xl border border-wadeal-line bg-white p-4 transition-colors duration-150 active:bg-gray-50"
        href="/mypage/account"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-wadeal-surface text-lg font-bold text-wadeal-red">
          {displayName.slice(0, 1) || "W"}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-bold text-wadeal-ink">{displayName}</p>
          <p className="mt-0.5 text-xs font-medium text-wadeal-muted">
            {profile.memberGrade} · 회원정보 ›
          </p>
        </div>
        <span aria-hidden className="text-gray-400">
          ›
        </span>
      </Link>

      <MypageOrderStatusBar summary={summary} />

      <section className="rounded-xl border border-wadeal-line bg-white p-3">
        <div className="grid grid-cols-4 gap-1">
          {quickLinks.map((link) => (
            <Link
              className="flex flex-col items-center gap-1 rounded-lg py-2 transition-colors duration-150 active:bg-gray-50"
              href={link.href}
              key={link.href}
            >
              <span className="text-xl">{link.emoji}</span>
              <span className="text-[11px] font-medium text-wadeal-ink">{link.label}</span>
              {link.highlight && link.highlight !== "0" ?
                <span className="text-[10px] font-bold text-wadeal-red">{link.highlight}</span>
              : null}
            </Link>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-2 gap-2">
        <Link className={`${ui.panelClickable} block`} href="/mypage/groupbuys">
          <p className="text-xs font-medium text-wadeal-muted">참여 중 공구</p>
          <p className="mt-1 text-lg font-bold text-wadeal-ink">{summary.activeGroupBuyCount}</p>
        </Link>
        <Link className={`${ui.panelClickable} block`} href="/mypage/support">
          <p className="text-xs font-medium text-wadeal-muted">문의 진행</p>
          <p
            className={`mt-1 text-lg font-bold ${summary.supportOpenCount > 0 ? "text-wadeal-red" : "text-wadeal-ink"}`}
          >
            {summary.supportOpenCount}
          </p>
        </Link>
      </div>
    </div>
  );
}
