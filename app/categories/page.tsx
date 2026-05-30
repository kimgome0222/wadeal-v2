import type { Metadata } from "next";
import { Suspense } from "react";

import { AppBuyerLayout } from "@/components/app-buyer-layout";
import { CategoriesSplitView } from "@/components/categories-split-view";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { isCategorySlug } from "@/lib/categories";
import { getAllActiveDeals } from "@/lib/data";
import { getUnreadCountForUser } from "@/lib/data/notifications";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "카테고리 전체보기",
  description: "celloh 카테고리에서 판매자와 상품을 만나보세요.",
};

type CategoriesPageProps = {
  searchParams: Promise<{ category?: string }>;
};

export default async function CategoriesPage({ searchParams }: CategoriesPageProps) {
  const params = await searchParams;
  const user = await getServerAuthUser();
  const unreadNotificationCount = user ? await getUnreadCountForUser(user.id) : 0;
  const catalog = await getAllActiveDeals();

  const initialCategory =
    params.category && isCategorySlug(params.category) ? params.category : undefined;

  return (
    <AppBuyerLayout unreadNotificationCount={unreadNotificationCount}>
      <div className={`${ui.appPageBody} bg-white pb-[max(calc(env(safe-area-inset-bottom)+120px),120px)]`}>
        <Suspense fallback={null}>
          <CategoriesSplitView catalog={catalog} initialCategory={initialCategory} />
        </Suspense>
      </div>
    </AppBuyerLayout>
  );
}
