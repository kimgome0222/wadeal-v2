"use client";

import Link from "next/link";

import { KpiMetricCard } from "@/components/kpi/kpi-metric-card";
import {
  formatKpiCount,
  formatKpiCurrency,
  formatKpiDelta,
  formatKpiPercent,
} from "@/lib/analytics/format-kpi";
import {
  MOCK_SELLER_DASHBOARD_SUMMARY,
  MOCK_SELLER_QUICK_ACTIONS,
} from "@/lib/sellers/mock-seller-center-data";
import { ui } from "@/lib/ui";

type SellerDashboardMockSummaryProps = {
  showPreviewLabel?: boolean;
};

export function SellerDashboardMockSummary({ showPreviewLabel = true }: SellerDashboardMockSummaryProps) {
  const s = MOCK_SELLER_DASHBOARD_SUMMARY;

  const cards = [
    {
      id: "today-orders",
      label: "오늘 주문",
      value: `${formatKpiCount(s.todayOrders)}건`,
      href: "/seller/orders",
    },
    {
      id: "month-revenue",
      label: "이번 달 매출",
      value: formatKpiCurrency(s.monthRevenue),
      href: "/seller/finance/settlements",
      deltaLabel: formatKpiDelta(s.monthRevenueDelta),
    },
    {
      id: "preparing",
      label: "배송 준비",
      value: `${formatKpiCount(s.preparingShipment)}건`,
      href: "/seller/orders",
      warn: s.preparingShipment > 0,
    },
    {
      id: "inquiries",
      label: "답변 대기 문의",
      value: `${formatKpiCount(s.pendingInquiries)}건`,
      href: "/seller/inquiries",
      warn: s.pendingInquiries > 0,
    },
    {
      id: "reviews",
      label: "새 리뷰",
      value: `${formatKpiCount(s.newReviews)}건`,
      href: "/seller/reviews",
    },
    {
      id: "settlement",
      label: "정산 예정 금액",
      value: formatKpiCurrency(s.pendingSettlement),
      href: "/seller/finance/settlements",
    },
    {
      id: "pending-products",
      label: "검수 대기 상품",
      value: `${formatKpiCount(s.pendingReviewProducts)}건`,
      href: "/seller/product-requests",
      warn: s.pendingReviewProducts > 0,
    },
    {
      id: "rejected",
      label: "반려 상품",
      value: `${formatKpiCount(s.rejectedProducts)}건`,
      href: "/seller/product-requests",
      warn: s.rejectedProducts > 0,
    },
    {
      id: "repurchase",
      label: "재구매율",
      value: formatKpiPercent(s.repurchaseRateMock),
      href: "/seller/products",
    },
  ];

  return (
    <div className="space-y-4">
      {showPreviewLabel ?
        <p className="rounded-lg bg-[#F5F7F6] px-3 py-2 text-[11px] font-bold text-wadeal-muted">
          mock 미리보기 — 실제 데이터 연동 전 요약 카드입니다.
        </p>
      : null}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <KpiMetricCard
            deltaLabel={card.deltaLabel}
            href={card.href}
            key={card.id}
            label={card.label}
            value={card.value}
            warn={card.warn}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {MOCK_SELLER_QUICK_ACTIONS.map((action) => (
          <Link
            className={`${ui.btnOutline} h-9 px-3 text-[11px] font-bold`}
            href={action.href}
            key={action.href}
          >
            {action.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
