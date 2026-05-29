import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AdminAccessDenied } from "@/components/admin-access-denied";
import { AdminDashboardContent } from "@/components/admin-dashboard-content";
import { AdminNav } from "@/components/admin-nav";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { getGoLiveReadinessForAdmin } from "@/lib/admin/go-live-readiness";
import { getMvpReadinessForAdmin } from "@/lib/admin/mvp-readiness";
import { getLaunchReadinessSnapshot } from "@/lib/admin/launch-readiness";
import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getAdminErrorLogSummary } from "@/lib/data/admin-error-logs";
import {
  getAdminDashboardStats,
  getPopularGroupBuys,
  getRecentAdminOrders,
  parseAdminStatsPeriod,
  parsePopularGroupBuySort,
} from "@/lib/data/admin-stats";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

type AdminDashboardPageProps = {
  searchParams: Promise<{ period?: string; rank?: string }>;
};

function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <div className={`${ui.panel} h-16 animate-pulse bg-gray-50`} key={index} />
        ))}
      </div>
      <div className={`${ui.panel} h-40 animate-pulse bg-gray-50`} />
    </div>
  );
}

export default async function AdminDashboardPage({ searchParams }: AdminDashboardPageProps) {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/login?next=/admin/dashboard");
  }

  const isAdmin = await isAdminUser(user);

  if (!isAdmin) {
    return (
      <PageShell>
        <SubHeader backHref="/" title="운영 대시보드" />
        <div className={ui.pageBody}>
          <AdminAccessDenied />
        </div>
      </PageShell>
    );
  }

  const params = await searchParams;
  const period = parseAdminStatsPeriod(params.period);
  const popularSort = parsePopularGroupBuySort(params.rank);

  let statsError: string | null = null;
  let stats = await getAdminDashboardStats(period).catch((error: unknown) => {
    statsError = error instanceof Error ? error.message : "운영 지표를 불러오지 못했습니다.";
    return null;
  });

  const [recentOrders, popularGroupBuys, launchSnapshot, goLiveReadiness, mvpReadiness, errorLogSummary] =
    await Promise.all([
      getRecentAdminOrders(10, period).catch(() => []),
      getPopularGroupBuys(popularSort, 5).catch(() => []),
      getLaunchReadinessSnapshot(),
      getGoLiveReadinessForAdmin(user).catch(() => null),
      getMvpReadinessForAdmin(user).catch(() => null),
      getAdminErrorLogSummary().catch(() => ({
        unresolvedCriticalCount: 0,
        errorsLast24h: 0,
        criticalLast24h: 0,
        warningLast24h: 0,
      })),
    ]);

  if (!stats) {
    stats = {
      totalOrders: 0,
      todayOrders: 0,
      totalParticipationQty: 0,
      expectedRevenue: 0,
      confirmedRevenue: 0,
      refundAmount: 0,
      activeGroupBuys: 0,
      closingSoonGroupBuys: 0,
      groupBuyOps: {
        inProgressProducts: 0,
        closedProducts: 0,
        goalAchievementRate: null,
        avgTierStage: null,
        maxTierStages: 0,
        totalQtyToNextTier: 0,
      },
      ordersByOrderStatus: [],
      ordersByPaymentStatus: [],
      ordersByShippingStatus: [],
      dataSource: "empty",
    };
  }

  return (
    <PageShell>
      <SubHeader backHref="/" title="운영 대시보드" />
      <div className={`${ui.pageBody} space-y-3`}>
        <AdminNav current="/admin/dashboard" />
        <p className="text-xs font-bold text-wadeal-muted">
          서비스 상태, 매출·주문, 판매 진행 현황을 한눈에 확인하세요.
        </p>

        {statsError ?
          <p className="rounded-lg bg-[#F5F8F4] px-3 py-2 text-xs font-bold text-wadeal-red">
            {statsError}
          </p>
        : null}

        <Suspense fallback={<DashboardSkeleton />}>
          <AdminDashboardContent
            errorLogSummary={errorLogSummary}
            goLiveReadiness={goLiveReadiness}
            mvpReadiness={mvpReadiness}
            initialPeriod={period}
            initialPopularSort={popularSort}
            launchSnapshot={launchSnapshot}
            popularGroupBuys={popularGroupBuys}
            recentOrders={recentOrders}
            stats={stats}
          />
        </Suspense>
      </div>
    </PageShell>
  );
}
