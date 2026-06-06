import type { LaunchReadinessSnapshot } from "@/lib/admin/launch-readiness";
import {
  formatKpiCount,
  formatKpiCurrency,
  formatKpiDelta,
} from "@/lib/analytics/format-kpi";
import type { AdminDashboardStats } from "@/lib/data/admin-stats-shared";

export type AdminKpiCard = {
  id: string;
  label: string;
  value: string;
  href?: string;
  warn?: boolean;
  deltaLabel?: string;
};

const MOCK_ADMIN_KPI = {
  todayRevenue: 1_284_000,
  todayRevenueDelta: 8,
  todayOrdersDelta: 5,
  paidOrders: 42,
  paidOrdersDelta: 3,
  cancelRefundRequests: 3,
  newMembers: 12,
  newMembersDelta: 15,
  newSellerApplications: 2,
  pendingReviewProducts: 5,
  pendingInquiries: 7,
  reportCount: 1,
  couponUsages: 48,
  couponUsagesDelta: -2,
} as const;

function countPaidOrders(stats: AdminDashboardStats): number {
  const paid = stats.ordersByPaymentStatus.find((row) => row.key === "paid");
  return paid?.count ?? MOCK_ADMIN_KPI.paidOrders;
}

export function getAdminKpiCards(
  stats: AdminDashboardStats,
  launchSnapshot: LaunchReadinessSnapshot,
): AdminKpiCard[] {
  const todayRevenue =
    stats.confirmedRevenue > 0 ? stats.confirmedRevenue : MOCK_ADMIN_KPI.todayRevenue;
  const todayOrders = stats.todayOrders > 0 ? stats.todayOrders : 18;
  const paidOrders = countPaidOrders(stats);
  const cancelRefund =
    launchSnapshot.unprocessedRefundRequestsCount ?? MOCK_ADMIN_KPI.cancelRefundRequests;
  const pendingInquiries =
    launchSnapshot.unprocessedSupportTicketsCount ?? MOCK_ADMIN_KPI.pendingInquiries;
  const reports = launchSnapshot.pendingReviewReportsCount ?? MOCK_ADMIN_KPI.reportCount;
  const useMock = stats.dataSource === "mock" || stats.dataSource === "empty";

  return [
    {
      id: "today-revenue",
      label: "오늘 매출",
      value: formatKpiCurrency(todayRevenue),
      href: "/admin/settlements",
      deltaLabel: useMock ? formatKpiDelta(MOCK_ADMIN_KPI.todayRevenueDelta) : undefined,
    },
    {
      id: "today-orders",
      label: "오늘 주문 수",
      value: `${formatKpiCount(todayOrders)}건`,
      href: "/admin/orders",
      deltaLabel: useMock ? formatKpiDelta(MOCK_ADMIN_KPI.todayOrdersDelta) : undefined,
    },
    {
      id: "paid-orders",
      label: "결제 완료 주문",
      value: `${formatKpiCount(paidOrders)}건`,
      href: "/admin/orders",
      deltaLabel: useMock ? formatKpiDelta(MOCK_ADMIN_KPI.paidOrdersDelta) : undefined,
    },
    {
      id: "cancel-refund",
      label: "취소/환불 요청",
      value: `${formatKpiCount(cancelRefund)}건`,
      href: "/admin/refunds",
      warn: cancelRefund > 0,
    },
    {
      id: "new-members",
      label: "신규 회원",
      value: `${formatKpiCount(MOCK_ADMIN_KPI.newMembers)}명`,
      href: "/admin/members",
      deltaLabel: formatKpiDelta(MOCK_ADMIN_KPI.newMembersDelta),
    },
    {
      id: "new-sellers",
      label: "신규 판매자 신청",
      value: `${formatKpiCount(MOCK_ADMIN_KPI.newSellerApplications)}건`,
      href: "/admin/sellers",
      warn: MOCK_ADMIN_KPI.newSellerApplications > 0,
    },
    {
      id: "pending-products",
      label: "검수 대기 상품",
      value: `${formatKpiCount(MOCK_ADMIN_KPI.pendingReviewProducts)}건`,
      href: "/admin/product-requests",
      warn: MOCK_ADMIN_KPI.pendingReviewProducts > 0,
    },
    {
      id: "pending-inquiries",
      label: "답변 대기 문의",
      value: `${formatKpiCount(pendingInquiries)}건`,
      href: "/admin/support",
      warn: pendingInquiries > 0,
    },
    {
      id: "reports",
      label: "신고 접수",
      value: `${formatKpiCount(reports)}건`,
      href: "/admin/review-reports",
      warn: reports > 0,
    },
    {
      id: "coupon-usages",
      label: "쿠폰 사용 건수",
      value: `${formatKpiCount(MOCK_ADMIN_KPI.couponUsages)}건`,
      href: "/admin/coupons",
      deltaLabel: formatKpiDelta(MOCK_ADMIN_KPI.couponUsagesDelta),
    },
  ];
}
