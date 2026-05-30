"use client";

import Link from "next/link";

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
    { label: "오늘 주문", value: `${s.todayOrders}건`, href: "/seller/orders" },
    { label: "배송 준비", value: `${s.preparingShipment}건`, href: "/seller/orders" },
    { label: "답변 대기 문의", value: `${s.pendingInquiries}건`, href: "/seller/inquiries" },
    { label: "새 리뷰", value: `${s.newReviews}건`, href: "/seller/reviews" },
    { label: "이번 달 정산 예정", value: `${s.pendingSettlement.toLocaleString("ko-KR")}원`, href: "/seller/finance/settlements" },
    { label: "검수 대기 상품", value: `${s.pendingReviewProducts}건`, href: "/seller/product-requests" },
    { label: "반려 상품", value: `${s.rejectedProducts}건`, href: "/seller/product-requests" },
  ];

  return (
    <div className="space-y-4">
      {showPreviewLabel ?
        <p className="rounded-lg bg-[#F5F7F6] px-3 py-2 text-[11px] font-bold text-wadeal-muted">
          mock 미리보기 — 실제 데이터 연동 전 요약 카드입니다.
        </p>
      : null}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link className={`${ui.panel} block space-y-1 active:scale-[0.99]`} href={card.href} key={card.label}>
            <p className="text-[10px] font-bold text-wadeal-muted">{card.label}</p>
            <p className="text-lg font-black text-wadeal-ink">{card.value}</p>
          </Link>
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
