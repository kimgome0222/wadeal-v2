import { redirect } from "next/navigation";
import { EmptyState } from "@/components/empty-state";
import { MypagePagination } from "@/components/mypage-pagination";
import { PageShell } from "@/components/page-shell";
import { PriceAlertCard } from "@/components/price-alert-card";
import { SubHeader } from "@/components/sub-header";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getAlertsForUser } from "@/lib/data/alerts";
import { parseMypagePageParam } from "@/lib/pagination/mypage";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

type MypageAlertsPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function MypageAlertsPage({ searchParams }: MypageAlertsPageProps) {
  const user = await getServerAuthUser();

  if (!user) {
    redirect("/login?next=/mypage/alerts");
  }

  const { page: pageParam } = await searchParams;
  const page = parseMypagePageParam(pageParam);
  const alertsResult = await getAlertsForUser(user.id, { page, pageSize: 10 });

  return (
    <PageShell>
      <SubHeader backHref="/mypage" title="내 가격 알림" />
      <div className={`${ui.pageBody} space-y-3`}>
        <p className="text-xs font-bold text-wadeal-muted">설정한 가격 알림</p>
        {alertsResult.items.length === 0 ?
          <EmptyState
            actionHref="/"
            actionLabel="상품 둘러보기"
            description="설정한 가격 알림이 여기에 표시돼요."
            title="설정한 가격 알림이 없어요."
          />
        : <>
            {alertsResult.items.map((alert) => (
              <PriceAlertCard alert={alert} key={alert.id} />
            ))}
            <MypagePagination
              basePath="/mypage/alerts"
              pagination={{
                page: alertsResult.page,
                total: alertsResult.total,
                totalPages: alertsResult.totalPages,
              }}
            />
          </>
        }
      </div>
    </PageShell>
  );
}
