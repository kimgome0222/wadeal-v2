import { redirect } from "next/navigation";
import { MypagePagination } from "@/components/mypage-pagination";
import { MypageReviewsContent } from "@/components/mypage-reviews-content";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { getUserOrdersDetailed } from "@/lib/data/orders";
import { getUserReviewedOrderIds } from "@/lib/data/reviews";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { parseMypagePageParam } from "@/lib/pagination/mypage";
import { ui } from "@/lib/ui";

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

  const [ordersResult, reviewedOrderIds] = await Promise.all([
    getUserOrdersDetailed(user.id, { page, pageSize: 10 }),
    getUserReviewedOrderIds(user.id),
  ]);

  return (
    <PageShell>
      <SubHeader backHref="/mypage" title="리뷰 관리" />
      <div className={`${ui.pageBody} space-y-3`}>
        <p className="text-xs font-bold text-wadeal-muted">
          구매 확정 후 15일 이내에 리뷰를 작성할 수 있어요.
        </p>
        <MypageReviewsContent
          orders={ordersResult.items}
          reviewedOrderIds={reviewedOrderIds}
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
    </PageShell>
  );
}
