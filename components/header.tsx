"use client";

import Link from "next/link";
import { WadealLogo } from "@/components/wadeal-logo";
import type { FormEventHandler, ReactNode } from "react";
import { BellIcon, CartIcon, SearchIcon, UserIcon } from "@/components/icons";
import type { HeaderUserInfo } from "@/lib/auth/user-display";
import type { RoleNavLink } from "@/lib/auth/role-nav";

type HeaderProps = {
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: FormEventHandler<HTMLFormElement>;
  user?: HeaderUserInfo | null;
  unreadNotificationCount?: number;
  roleLinks?: RoleNavLink[];
  /** 홈: 쿠팡형 2단 헤더 · 기타: 컴팩트 */
  variant?: "home" | "compact";
};

function HeaderIconLink({
  ariaLabel,
  badge,
  href,
  children,
}: {
  ariaLabel: string;
  badge?: number;
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      aria-label={ariaLabel}
      className="relative flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-colors duration-150 active:bg-gray-100"
      href={href}
    >
      {children}
      {badge && badge > 0 ?
        <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-wadeal-red px-1 text-[9px] font-bold text-white">
          {badge > 99 ? "99+" : badge}
        </span>
      : null}
    </Link>
  );
}

export function Header({
  searchQuery = "",
  onSearchChange,
  onSearchSubmit,
  user = null,
  unreadNotificationCount = 0,
  roleLinks = [],
  variant = "compact",
}: HeaderProps) {
  const profileHref = user ? "/mypage/account" : "/mypage";
  const profileLabel = user?.displayName ?? "마이";

  if (variant === "home") {
    return (
      <header className="border-b border-wadeal-line bg-white px-4 pb-3 pt-2">
        <div className="flex items-center justify-between gap-2">
          <WadealLogo href="/" size="sm" variant="wordmark" />
          <div className="flex shrink-0 items-center gap-0.5">
            <HeaderIconLink
              ariaLabel="알림"
              badge={unreadNotificationCount}
              href="/notifications"
            >
              <BellIcon className="h-[20px] w-[20px] text-wadeal-ink" />
            </HeaderIconLink>
            <HeaderIconLink ariaLabel="장바구니" href="/join-cart">
              <CartIcon className="h-[20px] w-[20px] text-wadeal-ink" />
            </HeaderIconLink>
            <Link
              className="flex max-w-[72px] cursor-pointer flex-col items-center rounded-lg px-1 py-0.5 transition-colors duration-150 active:bg-gray-100"
              href={profileHref}
              title={user ? `${user.displayName} · ${user.identityLine}` : "마이페이지"}
            >
              <UserIcon className="h-[20px] w-[20px] text-wadeal-ink" />
              <span className="mt-0.5 max-w-full truncate text-[10px] font-medium text-wadeal-ink">
                {profileLabel}
              </span>
            </Link>
          </div>
        </div>

        <form className="mt-2.5" onSubmit={onSearchSubmit}>
          <label className="flex h-10 w-full items-center gap-2 rounded-full border border-wadeal-line bg-wadeal-surface px-4 text-gray-500 shadow-sm">
            <SearchIcon aria-hidden className="h-4 w-4 shrink-0" />
            <span className="sr-only">상품 검색</span>
            <input
              aria-label="상품 검색"
              className="min-w-0 flex-1 cursor-text bg-transparent text-[14px] font-medium text-wadeal-ink outline-none placeholder:font-normal placeholder:text-gray-400"
              name="q"
              onChange={(event) => onSearchChange?.(event.target.value)}
              placeholder="찾고 싶은 공동구매를 검색해보세요"
              suppressHydrationWarning
              type="search"
              value={searchQuery}
            />
          </label>
        </form>

        {roleLinks.length > 1 ?
          <div className="mt-2 flex flex-wrap justify-end gap-2">
            {roleLinks.slice(1).map((link) => (
              <Link
                className="text-[10px] font-semibold text-wadeal-red underline underline-offset-2"
                href={link.href}
                key={link.href}
              >
                {link.label}
              </Link>
            ))}
          </div>
        : null}
      </header>
    );
  }

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
        <div className="flex shrink-0 items-center gap-0.5">
          <HeaderIconLink
            ariaLabel="알림"
            badge={unreadNotificationCount}
            href="/notifications"
          >
            <BellIcon className="h-[18px] w-[18px] text-wadeal-ink" />
          </HeaderIconLink>
          {user ?
            <Link
              className="flex max-w-[88px] cursor-pointer flex-col items-end rounded-lg px-1 py-0.5 transition-colors duration-150 active:bg-gray-100"
              href={profileHref}
              title={`${user.displayName} · ${user.identityLine}`}
            >
              <span className="flex items-center gap-1">
                <UserIcon className="h-3.5 w-3.5 shrink-0 text-wadeal-ink" />
                <span className="truncate text-[11px] font-semibold text-wadeal-ink">
                  {user.displayName}
                </span>
              </span>
              <span className="truncate text-[10px] font-medium text-wadeal-muted">
                {user.identityLine}
              </span>
            </Link>
          : <HeaderIconLink ariaLabel="마이페이지" href="/mypage">
              <UserIcon className="h-[18px] w-[18px] text-wadeal-ink" />
            </HeaderIconLink>
          }
        </div>
      </div>
    </header>
  );
}
