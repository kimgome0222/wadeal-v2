import type { ReactNode } from "react";

import { AppBottomNavigation } from "@/components/app-bottom-navigation";
import { AppBuyerChrome } from "@/components/app-buyer-chrome";
import { ui } from "@/lib/ui";
import { ds } from "@/lib/design-system";

type AppBuyerLayoutProps = {
  children: ReactNode;
  unreadNotificationCount?: number;
  initialSearchQuery?: string;
  showSearch?: boolean;
  showCategoryBar?: boolean;
  showBottomNav?: boolean;
};

/** 탭 루트 페이지 공통 — sticky 헤더 · 검색 · 카테고리 바 · 하단 탭 */
export function AppBuyerLayout({
  children,
  unreadNotificationCount = 0,
  initialSearchQuery = "",
  showSearch = true,
  showCategoryBar = true,
  showBottomNav = true,
}: AppBuyerLayoutProps) {
  return (
    <main
      className={`${ui.pageWrap} ${showBottomNav ? ds.spacing.bottomNav : "pb-4"} bg-white`}
    >
      <AppBuyerChrome
        initialSearchQuery={initialSearchQuery}
        showCategoryBar={showCategoryBar}
        showSearch={showSearch}
        unreadNotificationCount={unreadNotificationCount}
      />
      <div className="relative z-0 min-w-0">{children}</div>
      {showBottomNav ?
        <AppBottomNavigation unreadCount={unreadNotificationCount} />
      : null}
    </main>
  );
}
