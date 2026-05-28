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
        <p className="rounded-lg border border-wadeal-line bg-wadeal-surface px-3 py-2 text-[11px] font-bold leading-relaxed text-wadeal-muted">
          카카오톡 알림 발송은 준비 중이에요. 목표가 도달 시 앱 내 알림으로 안내할 예정이에요.
        </p>
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
