import Link from "next/link";

import { countPendingRefundsForAdmin } from "@/lib/data/refunds";
import { getAdminErrorLogSummary } from "@/lib/data/admin-error-logs";
import { getUnreadCountForAdmin } from "@/lib/data/admin-notifications";
import { countPendingReviewReportsForAdmin } from "@/lib/data/review-reports";
import { countPendingSellersForAdmin } from "@/lib/data/sellers";
import { countOpenEscalatedSupportTicketsForAdmin } from "@/lib/data/support-tickets";
import { ui } from "@/lib/ui";

const adminLinks = [
  { href: "/admin/dashboard", label: "대시보드" },
  { href: "/admin/products", label: "상품관리" },
  { href: "/admin/orders", label: "주문관리" },
  { href: "/admin/refunds", label: "환불요청", badgeKey: "pendingRefunds" as const },
  { href: "/admin/sellers", label: "판매자관리", badgeKey: "pendingSellers" as const },
  { href: "/admin/seller-notices", label: "판매자공지" },
  { href: "/admin/products?status=pending", label: "상품검수" },
  { href: "/admin/support", label: "문의관리", badgeKey: "escalatedSupport" as const },
  { href: "/admin/reviews", label: "리뷰관리" },
  { href: "/admin/review-reports", label: "신고리뷰", badgeKey: "pendingReviewReports" as const },
  { href: "/admin/settlements", label: "정산관리" },
  { href: "/admin/notifications", label: "알림센터", badgeKey: "notifications" as const },
  { href: "/admin/payments", label: "결제/웹훅" },
  { href: "/admin/error-logs", label: "에러로그", badgeKey: "criticalErrors" as const },
  { href: "/admin/activity-logs", label: "활동로그" },
  { href: "/admin/settings/business", label: "사업자설정" },
  { href: "/admin/settings/migrations", label: "Migration" },
] as const;

type AdminNavProps = {
  current: (typeof adminLinks)[number]["href"] | string;
};

type AdminNavBadges = {
  notifications: number;
  escalatedSupport: number;
  criticalErrors: number;
  pendingSellers: number;
  pendingReviewReports: number;
  pendingRefunds: number;
};

function NavBadge({ count }: { count: number }) {
  if (count <= 0) {
    return null;
  }

  return (
    <span className="inline-flex min-w-[1rem] items-center justify-center rounded-full bg-wadeal-red px-1 text-[9px] font-black leading-none text-white">
      {count > 99 ? "99+" : count}
    </span>
  );
}

async function loadAdminNavBadges(): Promise<AdminNavBadges> {
  const [
    adminUnreadCount,
    escalatedSupportCount,
    errorLogSummary,
    pendingSellerCount,
    pendingReviewReportCount,
    pendingRefundCount,
  ] = await Promise.all([
    getUnreadCountForAdmin().catch(() => 0),
    countOpenEscalatedSupportTicketsForAdmin().catch(() => 0),
    getAdminErrorLogSummary().catch(() => ({ unresolvedCriticalCount: 0 })),
    countPendingSellersForAdmin().catch(() => 0),
    countPendingReviewReportsForAdmin().catch(() => 0),
    countPendingRefundsForAdmin().catch(() => 0),
  ]);

  return {
    notifications: adminUnreadCount,
    escalatedSupport: escalatedSupportCount,
    criticalErrors: errorLogSummary.unresolvedCriticalCount,
    pendingSellers: pendingSellerCount,
    pendingReviewReports: pendingReviewReportCount,
    pendingRefunds: pendingRefundCount,
  };
}

export async function AdminNav({ current }: AdminNavProps) {
  const badges = await loadAdminNavBadges();

  return (
    <nav className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {adminLinks.map((link) => {
        const active =
          current === link.href || current.startsWith(link.href.split("?")[0] ?? link.href);
        const badgeCount =
          "badgeKey" in link && link.badgeKey ? badges[link.badgeKey] : 0;

        return (
          <Link
            className={`${ui.btnOutline} h-10 text-xs ${
              active ? "border-wadeal-red text-wadeal-red" : ""
            }`}
            href={link.href}
            key={link.href}
          >
            <span className="inline-flex items-center gap-1">
              {link.label}
              <NavBadge count={badgeCount} />
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
