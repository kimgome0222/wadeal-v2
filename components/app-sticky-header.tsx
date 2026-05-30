"use client";

import Link from "next/link";

import { BellIcon, HeartIcon } from "@/components/icons";
import { WadealLogo } from "@/components/wadeal-logo";

type AppStickyHeaderProps = {
  unreadNotificationCount?: number;
};

export function AppStickyHeader({ unreadNotificationCount = 0 }: AppStickyHeaderProps) {
  return (
    <header className="flex h-14 min-h-[56px] items-center justify-between gap-2 bg-[#2E5E4E] px-6">
      <WadealLogo href="/" size="sm" variant="wordmarkOnPrimary" />
      <div className="flex shrink-0 items-center gap-1">
        <Link
          aria-label="찜한 상품"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/35 text-white transition-colors active:scale-[0.97] active:bg-white/10"
          href="/saved"
        >
          <HeartIcon className="h-[22px] w-[22px]" />
        </Link>
        <Link
          aria-label="알림"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/35 text-white transition-colors active:scale-[0.97] active:bg-white/10"
          href="/notifications"
        >
          <BellIcon className="h-[22px] w-[22px]" />
          {unreadNotificationCount > 0 ?
            <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#E28A3B] px-1 text-[9px] font-semibold text-white">
              {unreadNotificationCount > 99 ? "99+" : unreadNotificationCount}
            </span>
          : null}
        </Link>
      </div>
    </header>
  );
}
