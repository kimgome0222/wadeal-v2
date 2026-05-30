"use client";

import Link from "next/link";

import { BellIcon, HeartIcon } from "@/components/icons";
import { WadealLogo } from "@/components/wadeal-logo";

type AppStickyHeaderProps = {
  unreadNotificationCount?: number;
};

export function AppStickyHeader({ unreadNotificationCount = 0 }: AppStickyHeaderProps) {
  return (
    <header className="flex h-12 min-h-[48px] items-center justify-between gap-2 bg-white px-4">
      <WadealLogo href="/" size="sm" variant="wordmark" />
      <div className="flex shrink-0 items-center gap-0.5">
        <Link
          aria-label="찜한 상품"
          className="relative flex h-11 w-11 items-center justify-center rounded-xl text-wadeal-ink transition-colors hover:bg-[#FAFBFA] active:scale-[0.97]"
          href="/saved"
        >
          <HeartIcon className="h-[22px] w-[22px]" />
        </Link>
        <Link
          aria-label="알림"
          className="relative flex h-11 w-11 items-center justify-center rounded-xl text-wadeal-ink transition-colors hover:bg-[#FAFBFA] active:scale-[0.97]"
          href="/notifications"
        >
          <BellIcon className="h-[22px] w-[22px]" />
          {unreadNotificationCount > 0 ?
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-wadeal-red px-1 text-[9px] font-semibold text-white">
              {unreadNotificationCount > 99 ? "99+" : unreadNotificationCount}
            </span>
          : null}
        </Link>
      </div>
    </header>
  );
}
