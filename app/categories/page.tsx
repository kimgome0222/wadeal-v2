import type { Metadata } from "next";

import { AppBuyerLayout } from "@/components/app-buyer-layout";
import { CategoriesSplitView } from "@/components/categories-split-view";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getUnreadCountForUser } from "@/lib/data/notifications";
import { ui } from "@/lib/ui";

export const metadata: Metadata = {
  title: "카테고리 전체보기",
  description: "celloh 카테고리에서 판매자와 상품을 만나보세요.",
};

export default async function CategoriesPage() {
  const user = await getServerAuthUser();
  const unreadNotificationCount = user ? await getUnreadCountForUser(user.id) : 0;

  return (
    <AppBuyerLayout unreadNotificationCount={unreadNotificationCount}>
      <div className={`${ui.pageBody} bg-white pb-4`}>
        <CategoriesSplitView />
      </div>
    </AppBuyerLayout>
  );
}
