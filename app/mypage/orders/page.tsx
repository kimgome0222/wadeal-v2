import { redirect } from "next/navigation";
import { EmptyState } from "@/components/empty-state";
import { MypageOrdersContent } from "@/components/mypage-orders-content";
import { MypagePagination } from "@/components/mypage-pagination";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { getUserOrdersDetailed } from "@/lib/data/orders";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { parseMypagePageParam } from "@/lib/pagination/mypage";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

type MypageOrdersPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function MypageOrdersPage({ searchParams }: MypageOrdersPageProps) {
  const user = await getServerAuthUser();

  if (!user) {
    redirect("/login?next=/mypage/orders");
  }

  const { page: pageParam } = await searchParams;
  const page = parseMypagePageParam(pageParam);
  const ordersResult = await getUserOrdersDetailed(user.id, { page, pageSize: 10 });

  return (
    <PageShell>
      <SubHeader backHref="/mypage" title="주문·배송" />
      <div className={`${ui.pageBody} space-y-3`}>
        <p className="text-xs font-bold text-wadeal-muted">
          일반 주문과 혜택 주문 내역을 확인할 수 있어요.
        </p>
        {ordersResult.items.length === 0 ?
          <EmptyState
            actionHref="/"
            actionLabel="쇼핑하러 가기"
            description="주문 내역이 여기에 표시돼요."
            title="아직 주문 내역이 없어요."
          />
        : <>
            <MypageOrdersContent orders={ordersResult.items} />
            <MypagePagination
              basePath="/mypage/orders"
              pagination={{
                page: ordersResult.page,
                total: ordersResult.total,
                totalPages: ordersResult.totalPages,
              }}
            />
          </>
        }
      </div>
    </PageShell>
  );
}
