import type { ReactNode } from "react";

import { AppBottomNavigation } from "@/components/app-bottom-navigation";
import { AppBuyerChrome } from "@/components/app-buyer-chrome";
import { ui } from "@/lib/ui";

type AppBuyerLayoutProps = {
  children: ReactNode;
  unreadNotificationCount?: number;
  initialSearchQuery?: string;
  showSearch?: boolean;
  showCategoryBar?: boolean;
};

/** 탭 루트 페이지 공통 — sticky 헤더 · 검색 · 카테고리 바 · 하단 탭 */
export function AppBuyerLayout({
  children,
  unreadNotificationCount = 0,
  initialSearchQuery = "",
  showSearch = true,
  showCategoryBar = true,
}: AppBuyerLayoutProps) {
  return (
    <main className={`${ui.pageWrap} pb-28 bg-white`}>
      <AppBuyerChrome
        initialSearchQuery={initialSearchQuery}
        showCategoryBar={showCategoryBar}
        showSearch={showSearch}
        unreadNotificationCount={unreadNotificationCount}
      />
      {children}
      <AppBottomNavigation unreadCount={unreadNotificationCount} />
    </main>
  );
}
