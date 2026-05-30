import { redirect } from "next/navigation";

import { AppBuyerLayout } from "@/components/app-buyer-layout";
import { MypagePagination } from "@/components/mypage-pagination";
import { MypageReviewsContent } from "@/components/mypage-reviews-content";
import { SubHeader } from "@/components/sub-header";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getUserOrdersDetailed } from "@/lib/data/orders";
import { getReviewsByUserId, getUserReviewedOrderIds } from "@/lib/data/reviews";
import { getUnreadCountForUser } from "@/lib/data/notifications";
import {
  buildWritableReviewItems,
  buildWrittenReviewItems,
} from "@/lib/mypage/review-hub-data";
import { parseMypagePageParam } from "@/lib/pagination/mypage";

export const dynamic = "force-dynamic";

type MypageReviewsPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function MypageReviewsPage({ searchParams }: MypageReviewsPageProps) {
  const user = await getServerAuthUser();

  if (!user) {
    redirect("/login?next=/mypage/reviews");
  }

  const { page: pageParam } = await searchParams;
  const page = parseMypagePageParam(pageParam);

  const [ordersResult, reviewedOrderIds, writtenReviews, unreadCount] = await Promise.all([
    getUserOrdersDetailed(user.id, { page, pageSize: 20 }),
    getUserReviewedOrderIds(user.id),
    getReviewsByUserId(user.id),
    getUnreadCountForUser(user.id),
  ]);

  const [writableItems, writtenItems] = await Promise.all([
    buildWritableReviewItems(ordersResult.items, reviewedOrderIds),
    buildWrittenReviewItems(writtenReviews),
  ]);

  return (
    <AppBuyerLayout showCategoryBar={false} showSearch={false} unreadNotificationCount={unreadCount}>
      <SubHeader backHref="/mypage" title="리뷰 관리" />
      <div className="px-6 pt-4">
        <MypageReviewsContent
          writableItems={writableItems}
          writtenItems={writtenItems}
        />
        <MypagePagination
          basePath="/mypage/reviews"
          pagination={{
            page: ordersResult.page,
            total: ordersResult.total,
            totalPages: ordersResult.totalPages,
          }}
        />
      </div>
    </AppBuyerLayout>
  );
}
