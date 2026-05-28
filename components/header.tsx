"use client";

import Link from "next/link";
import { WadealLogo } from "@/components/wadeal-logo";
import type { FormEventHandler } from "react";
import { BellIcon, SearchIcon, UserIcon } from "@/components/icons";
import type { HeaderUserInfo } from "@/lib/auth/user-display";
import type { RoleNavLink } from "@/lib/auth/role-nav";

type HeaderProps = {
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: FormEventHandler<HTMLFormElement>;
  user?: HeaderUserInfo | null;
  unreadNotificationCount?: number;
  roleLinks?: RoleNavLink[];
};

export function Header({
  searchQuery = "",
  onSearchChange,
  onSearchSubmit,
  user = null,
  unreadNotificationCount = 0,
  roleLinks = [],
}: HeaderProps) {
  return (
    <header className="border-b border-wadeal-line bg-white px-4 pb-2 pt-2">
      <div className="flex items-center gap-2.5">
        <WadealLogo href="/" variant="wordmark" />
        <form className="min-w-0 flex-1" onSubmit={onSearchSubmit}>
          <label className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-lg bg-wadeal-surface px-3 text-gray-500">
            <SearchIcon aria-hidden className="h-3.5 w-3.5 shrink-0" />
            <span className="sr-only">상품 검색</span>
            <input
              aria-label="상품 검색"
              className="min-w-0 flex-1 cursor-text bg-transparent text-[13px] font-medium text-wadeal-ink outline-none placeholder:font-normal placeholder:text-gray-400"
              name="q"
              onChange={(event) => onSearchChange?.(event.target.value)}
              placeholder="어떤 공동구매를 찾고 계신가요?"
              suppressHydrationWarning
              type="search"
              value={searchQuery}
            />
          </label>
        </form>
        {user ?
          <div className="flex shrink-0 items-center gap-1.5">
            <Link
              aria-label="알림"
              className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg transition-colors duration-150 active:bg-gray-100"
              href="/notifications"
            >
              <BellIcon className="h-[18px] w-[18px] text-wadeal-ink" />
              {unreadNotificationCount > 0 ?
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-wadeal-red px-1 text-[9px] font-black text-white">
                  {unreadNotificationCount > 99 ? "99+" : unreadNotificationCount}
                </span>
              : null}
            </Link>
            <Link
              className="flex max-w-[88px] cursor-pointer flex-col items-end rounded-lg px-1 py-0.5 transition-colors duration-150 active:bg-gray-100"
              href="/mypage/profile"
              title={`${user.displayName} · ${user.identityLine}`}
            >
              <span className="flex items-center gap-1">
                <UserIcon className="h-3.5 w-3.5 shrink-0 text-wadeal-ink" />
                <span className="truncate text-[11px] font-semibold text-wadeal-ink">
                  {user.displayName}
                </span>
              </span>
              <span className="truncate text-[10px] font-bold text-wadeal-muted">
                {user.identityLine}
              </span>
            </Link>
            {roleLinks.length > 1 ?
              <div className="hidden min-w-0 flex-col items-end gap-0.5 sm:flex">
                {roleLinks.slice(1).map((link) => (
                  <Link
                    className="truncate text-[10px] font-black text-wadeal-red underline underline-offset-2"
                    href={link.href}
                    key={link.href}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            : null}
          </div>
        : null}
      </div>
    </header>
  );
}
