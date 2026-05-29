import Link from "next/link";

import type { MypageDashboardSummary } from "@/lib/profile/types";

const STATUS_ITEMS = [
  { key: "paymentPending", label: "결제대기", href: "/mypage/orders?status=payment" },
  { key: "shipping", label: "배송중", href: "/mypage/orders?status=shipping" },
  { key: "totalOrders", label: "전체주문", href: "/mypage/orders" },
  { key: "reviewable", label: "리뷰", href: "/mypage/reviews" },
] as const;

type MypageOrderStatusBarProps = {
  summary: MypageDashboardSummary;
};

export function MypageOrderStatusBar({ summary }: MypageOrderStatusBarProps) {
  const counts: Record<(typeof STATUS_ITEMS)[number]["key"], number> = {
    paymentPending: summary.paymentPendingCount,
    shipping: summary.shippingCount,
    totalOrders: summary.totalOrders,
    reviewable: summary.reviewableCount,
  };

  return (
    <section className="rounded-xl border border-wadeal-line bg-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-wadeal-ink">주문·배송</h2>
        <Link className="text-xs font-medium text-wadeal-muted active:opacity-70" href="/mypage/orders">
          전체보기 ›
        </Link>
      </div>
      <div className="mt-3 grid grid-cols-4 divide-x divide-wadeal-line text-center">
        {STATUS_ITEMS.map((item) => (
          <Link
            className="flex flex-col items-center gap-1 py-1 active:opacity-70"
            href={item.href}
            key={item.key}
          >
            <span
              className={`text-lg font-bold ${counts[item.key] > 0 ? "text-wadeal-red" : "text-wadeal-ink"}`}
            >
              {counts[item.key]}
            </span>
            <span className="text-[11px] font-medium text-wadeal-muted">{item.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
