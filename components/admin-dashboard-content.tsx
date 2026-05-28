"use client";

import Link from "next/link";
import { useMemo } from "react";
import { AdminGoLiveReadinessSection } from "@/components/admin-go-live-readiness-section";
import { AdminMvpReadinessSection } from "@/components/admin-mvp-readiness-section";
import { EmptyState } from "@/components/empty-state";
import type { GoLiveReadinessResult } from "@/lib/admin/go-live-readiness";
import type { MvpReadinessResult } from "@/lib/admin/mvp-readiness";
import type { LaunchReadinessSnapshot } from "@/lib/admin/launch-readiness";
import type { AdminErrorLogSummary } from "@/lib/data/admin-error-logs";
import {
  ADMIN_STATS_PERIOD_LABELS,
  ADMIN_STATS_PERIODS,
  POPULAR_GROUP_BUY_SORT_LABELS,
  POPULAR_GROUP_BUY_SORT_OPTIONS,
  type AdminDashboardStats,
  type AdminRecentOrderRow,
  type AdminStatsPeriod,
  type PopularGroupBuyRow,
  type PopularGroupBuySortBy,
  type StatusCountRow,
} from "@/lib/data/admin-stats-shared";
import { formatOrderCurrency } from "@/lib/orders/admin-order-status";
import { ui } from "@/lib/ui";

type AdminDashboardContentProps = {
  stats: AdminDashboardStats;
  recentOrders: AdminRecentOrderRow[];
  popularGroupBuys: PopularGroupBuyRow[];
  launchSnapshot: LaunchReadinessSnapshot;
  goLiveReadiness: GoLiveReadinessResult | null;
  mvpReadiness: MvpReadinessResult | null;
  errorLogSummary: AdminErrorLogSummary;
  initialPeriod: AdminStatsPeriod;
  initialPopularSort: PopularGroupBuySortBy;
};

function StatusDot({ ok }: { ok: boolean }) {
  return (
    <span
      aria-hidden
      className={`inline-block h-2 w-2 rounded-full ${ok ? "bg-green-500" : "bg-wadeal-red"}`}
    />
  );
}

function MetricCard({
  label,
  value,
  warn,
}: {
  label: string;
  value: string;
  warn?: boolean;
}) {
  return (
    <div className={`${ui.panel} space-y-1`}>
      <p className="text-[11px] font-black text-wadeal-muted">{label}</p>
      <p
        className={`text-xl font-black tracking-[-0.02em] ${
          warn ? "text-wadeal-red" : "text-wadeal-ink"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function StatusBreakdownSection({
  title,
  rows,
}: {
  title: string;
  rows: StatusCountRow[];
}) {
  const total = rows.reduce((sum, row) => sum + row.count, 0);

  return (
    <section className="space-y-2">
      <h3 className="text-sm font-black text-wadeal-ink">{title}</h3>
      <div className={`${ui.panel} ${ui.listDivider}`}>
        {total === 0 ?
          <p className="py-2 text-xs font-bold text-wadeal-muted">해당 기간 주문이 없어요.</p>
        : rows.map((row) => (
            <div
              className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
              key={row.key}
            >
              <span className="text-xs font-bold text-wadeal-ink">{row.label}</span>
              <span className="text-xs font-black text-wadeal-muted">
                {row.count.toLocaleString("ko-KR")}
              </span>
            </div>
          ))
        }
      </div>
    </section>
  );
}

function formatRate(value: number | null, suffix = "%"): string {
  if (value == null) {
    return "-";
  }

  return `${value.toLocaleString("ko-KR")}${suffix}`;
}

export function AdminDashboardContent({
  stats,
  recentOrders,
  popularGroupBuys,
  launchSnapshot,
  goLiveReadiness,
  mvpReadiness,
  errorLogSummary,
  initialPeriod,
  initialPopularSort,
}: AdminDashboardContentProps) {
  const requiredEnvOk = launchSnapshot.envChecks
    .filter((check) => check.required)
    .every((check) => check.present);

  const periodLabel = ADMIN_STATS_PERIOD_LABELS[initialPeriod];

  const dataSourceNote = useMemo(() => {
    if (stats.dataSource === "mock") {
      return "Mock 데이터로 표시 중입니다.";
    }

    if (stats.dataSource === "empty") {
      return "Supabase에 집계할 데이터가 없습니다.";
    }

    return null;
  }, [stats.dataSource]);

  function buildDashboardHref(overrides: { period?: AdminStatsPeriod; rank?: PopularGroupBuySortBy }) {
    const params = new URLSearchParams();
    const period = overrides.period ?? initialPeriod;
    const rank = overrides.rank ?? initialPopularSort;

    if (period !== "7d") {
      params.set("period", period);
    }

    if (rank !== "participation") {
      params.set("rank", rank);
    }

    const query = params.toString();
    return query ? `/admin/dashboard?${query}` : "/admin/dashboard";
  }

  return (
    <div className="space-y-4">
      {dataSourceNote ?
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800">
          {dataSourceNote}
        </p>
      : null}

      {errorLogSummary.unresolvedCriticalCount > 0 ?
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-wadeal-red">
          미해결 치명(critical) 오류 {errorLogSummary.unresolvedCriticalCount.toLocaleString("ko-KR")}
          건이 있습니다.{" "}
          <Link className="underline" href="/admin/error-logs?level=critical&resolved=open">
            에러 로그에서 확인
          </Link>
        </p>
      : null}

      <section className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h2 className={ui.sectionTitle}>에러 모니터링</h2>
          <Link className="text-[11px] font-black text-wadeal-red" href="/admin/error-logs">
            전체 보기
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <MetricCard
            label="미해결 critical"
            value={errorLogSummary.unresolvedCriticalCount.toLocaleString("ko-KR")}
            warn={errorLogSummary.unresolvedCriticalCount > 0}
          />
          <MetricCard
            label="24h 오류 (error+)"
            value={errorLogSummary.errorsLast24h.toLocaleString("ko-KR")}
            warn={errorLogSummary.errorsLast24h > 0}
          />
        </div>
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h2 className={ui.sectionTitle}>운영 지표</h2>
          <span className="text-[11px] font-bold text-wadeal-muted">{periodLabel} 기준</span>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {ADMIN_STATS_PERIODS.map((option) => {
            const active = initialPeriod === option;
            return (
              <Link
                className={`${ui.btnOutline} h-9 text-[11px] ${
                  active ? "border-wadeal-red text-wadeal-red" : ""
                }`}
                href={buildDashboardHref({ period: option })}
                key={option}
              >
                {ADMIN_STATS_PERIOD_LABELS[option]}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-2">
        <MetricCard
          label="전체 주문"
          value={stats.totalOrders.toLocaleString("ko-KR")}
        />
        <MetricCard
          label="오늘 주문"
          value={stats.todayOrders.toLocaleString("ko-KR")}
        />
        <MetricCard
          label="참여 수량 합계"
          value={stats.totalParticipationQty.toLocaleString("ko-KR")}
        />
        <MetricCard
          label="예상 매출"
          value={formatOrderCurrency(stats.expectedRevenue)}
        />
        <MetricCard
          label="확정 매출"
          value={formatOrderCurrency(stats.confirmedRevenue)}
        />
        <MetricCard
          label="환불 금액"
          value={formatOrderCurrency(stats.refundAmount)}
          warn={stats.refundAmount > 0}
        />
        <MetricCard
          label="진행 중 공동구매"
          value={stats.activeGroupBuys.toLocaleString("ko-KR")}
        />
        <MetricCard
          label="마감 임박"
          value={stats.closingSoonGroupBuys.toLocaleString("ko-KR")}
          warn={stats.closingSoonGroupBuys > 0}
        />
      </section>

      <section className="space-y-2">
        <h2 className={ui.sectionTitle}>공동구매 운영</h2>
        <div className="grid grid-cols-2 gap-2">
          <MetricCard
            label="진행 중 상품"
            value={stats.groupBuyOps.inProgressProducts.toLocaleString("ko-KR")}
          />
          <MetricCard
            label="종료·확정 상품"
            value={stats.groupBuyOps.closedProducts.toLocaleString("ko-KR")}
          />
          <MetricCard
            label="목표 달성률"
            value={formatRate(stats.groupBuyOps.goalAchievementRate)}
          />
          <MetricCard
            label="가격 티어 단계 (평균)"
            value={
              stats.groupBuyOps.avgTierStage != null ?
                `${stats.groupBuyOps.avgTierStage} / ${stats.groupBuyOps.maxTierStages || "-"}`
              : "-"
            }
          />
          <MetricCard
            label="다음 티어까지 수량"
            value={stats.groupBuyOps.totalQtyToNextTier.toLocaleString("ko-KR")}
          />
        </div>
      </section>

      <div className="grid gap-4">
        <StatusBreakdownSection title="주문 상태" rows={stats.ordersByOrderStatus} />
        <StatusBreakdownSection title="결제 상태" rows={stats.ordersByPaymentStatus} />
        <StatusBreakdownSection title="배송 상태" rows={stats.ordersByShippingStatus} />
      </div>

      <section className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h2 className={ui.sectionTitle}>최근 주문</h2>
          <Link className="text-[11px] font-black text-wadeal-red" href="/admin/orders">
            전체 보기
          </Link>
        </div>
        {recentOrders.length === 0 ?
          <EmptyState
            description="선택한 기간에 등록된 주문이 없습니다."
            title="최근 주문이 없어요."
          />
        : <div className={`${ui.panel} overflow-x-auto`}>
            <table className="w-full min-w-[640px] text-left text-[11px]">
              <thead>
                <tr className="border-b border-wadeal-line text-wadeal-muted">
                  <th className="pb-2 pr-2 font-black">주문번호</th>
                  <th className="pb-2 pr-2 font-black">상품</th>
                  <th className="pb-2 pr-2 font-black">구매자</th>
                  <th className="pb-2 pr-2 font-black">수량</th>
                  <th className="pb-2 pr-2 font-black">예상금액</th>
                  <th className="pb-2 pr-2 font-black">확정금액</th>
                  <th className="pb-2 pr-2 font-black">상태</th>
                  <th className="pb-2 font-black">주문일</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-wadeal-line">
                {recentOrders.map((order) => (
                  <tr className="align-top" key={order.id}>
                    <td className="py-2.5 pr-2 font-bold text-wadeal-ink">{order.orderNumber}</td>
                    <td className="max-w-[120px] truncate py-2.5 pr-2 font-bold text-wadeal-ink">
                      {order.productName}
                    </td>
                    <td className="py-2.5 pr-2 font-bold text-wadeal-muted">{order.buyerName}</td>
                    <td className="py-2.5 pr-2 font-bold text-wadeal-ink">
                      {order.quantity.toLocaleString("ko-KR")}
                    </td>
                    <td className="py-2.5 pr-2 font-bold text-wadeal-ink">
                      {formatOrderCurrency(order.estimatedAmount)}
                    </td>
                    <td className="py-2.5 pr-2 font-bold text-wadeal-ink">
                      {order.confirmedAmount != null ?
                        formatOrderCurrency(order.confirmedAmount)
                      : "-"}
                    </td>
                    <td className="py-2.5 pr-2">
                      <span className="inline-block rounded bg-gray-100 px-2 py-0.5 text-[10px] font-black text-wadeal-ink">
                        {order.orderStatusLabel}
                      </span>
                    </td>
                    <td className="py-2.5 font-bold text-wadeal-muted">{order.orderDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
      </section>

      <section className="space-y-2">
        <h2 className={ui.sectionTitle}>인기 공동구매</h2>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
          {POPULAR_GROUP_BUY_SORT_OPTIONS.map((option) => {
            const active = initialPopularSort === option;
            return (
              <Link
                className={`${ui.btnOutline} h-9 text-[11px] ${
                  active ? "border-wadeal-red text-wadeal-red" : ""
                }`}
                href={buildDashboardHref({ rank: option })}
                key={option}
              >
                {POPULAR_GROUP_BUY_SORT_LABELS[option]}
              </Link>
            );
          })}
        </div>
        {popularGroupBuys.length === 0 ?
          <EmptyState
            description="등록된 공동구매 상품이 없습니다."
            title="랭킹 데이터가 없어요."
          />
        : <div className={`${ui.panel} ${ui.listDivider}`}>
            {popularGroupBuys.map((item, index) => (
              <div
                className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
                key={`${item.productId}-${index}`}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-wadeal-ink">
                    {index + 1}. {item.productName}
                  </p>
                  <p className="mt-0.5 text-[11px] font-bold text-wadeal-muted">
                    참여 {item.currentParticipants.toLocaleString("ko-KR")} / 목표{" "}
                    {item.targetParticipants.toLocaleString("ko-KR")}
                  </p>
                </div>
                <span className="shrink-0 text-xs font-black text-wadeal-red">
                  {POPULAR_GROUP_BUY_SORT_LABELS[initialPopularSort]}{" "}
                  {item.metricValue.toLocaleString("ko-KR")}
                </span>
              </div>
            ))}
          </div>
        }
      </section>

      {mvpReadiness ?
        <AdminMvpReadinessSection readiness={mvpReadiness} />
      : null}

      {goLiveReadiness ?
        <AdminGoLiveReadinessSection readiness={goLiveReadiness} />
      : null}

      <section className="space-y-2">
        <h2 className={ui.sectionTitle}>서비스 상태</h2>
        <div className={`${ui.panel} space-y-3`}>
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-black text-wadeal-ink">필수 환경변수</span>
            <span className="flex items-center gap-1.5 text-xs font-bold text-wadeal-muted">
              <StatusDot ok={requiredEnvOk} />
              {requiredEnvOk ? "설정 완료" : "누락 있음"}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-black text-wadeal-ink">Supabase 연결</span>
            <span className="flex items-center gap-1.5 text-xs font-bold text-wadeal-muted">
              <StatusDot ok={launchSnapshot.supabaseConnected} />
              {launchSnapshot.supabaseConnected ? "정상" : "오류"}
            </span>
          </div>
          {launchSnapshot.supabaseError ?
            <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-wadeal-red">
              {launchSnapshot.supabaseError}
            </p>
          : null}
          {launchSnapshot.isProduction && launchSnapshot.demoLoginEnabled ?
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800">
              프로덕션에서 데모 로그인이 활성화되어 있습니다.
            </p>
          : null}
          {launchSnapshot.usingMockData ?
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800">
              Mock 데이터 모드입니다.
            </p>
          : null}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <MetricCard
            label="등록 상품"
            value={
              launchSnapshot.productCount !== null ?
                String(launchSnapshot.productCount)
              : "-"
            }
          />
          <MetricCard
            label="미처리 문의"
            value={
              launchSnapshot.unprocessedSupportTicketsCount !== null ?
                String(launchSnapshot.unprocessedSupportTicketsCount)
              : "-"
            }
            warn={(launchSnapshot.unprocessedSupportTicketsCount ?? 0) > 0}
          />
          <MetricCard
            label="환불 요청 대기"
            value={
              launchSnapshot.unprocessedRefundRequestsCount !== null ?
                String(launchSnapshot.unprocessedRefundRequestsCount)
              : "-"
            }
            warn={(launchSnapshot.unprocessedRefundRequestsCount ?? 0) > 0}
          />
          <MetricCard
            label="신고 리뷰 대기"
            value={
              launchSnapshot.pendingReviewReportsCount !== null ?
                String(launchSnapshot.pendingReviewReportsCount)
              : "-"
            }
            warn={(launchSnapshot.pendingReviewReportsCount ?? 0) > 0}
          />
        </div>
      </section>

      <section className="space-y-2">
        <h2 className={ui.sectionTitle}>운영 바로가기</h2>
        <div className="grid grid-cols-2 gap-2">
          <Link className={`${ui.btnOutline} h-10 text-xs`} href="/admin/products">
            상품 관리
          </Link>
          <Link className={`${ui.btnOutline} h-10 text-xs`} href="/admin/orders">
            주문 관리
          </Link>
          <Link className={`${ui.btnOutline} h-10 text-xs`} href="/admin/settlements">
            정산 관리
          </Link>
          <Link className={`${ui.btnOutline} h-10 text-xs`} href="/admin/go-live-readiness">
            오픈 준비
          </Link>
          <Link className={`${ui.btnOutline} h-10 text-xs`} href="/admin/review-reports">
            신고 리뷰
          </Link>
          <Link className={`${ui.btnOutline} h-10 text-xs`} href="/admin/error-logs">
            에러 로그
          </Link>
        </div>
      </section>
    </div>
  );
}
