import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminAccessDenied } from "@/components/admin-access-denied";
import { AdminNav } from "@/components/admin-nav";
import { AdminReviewReportsContent } from "@/components/admin-review-reports-content";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import {
  getAllReviewReports,
  type ReviewReportFilter,
} from "@/lib/data/review-reports";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

type AdminReviewReportsPageProps = {
  searchParams: Promise<{ status?: string }>;
};

function parseStatusFilter(value: string | undefined): ReviewReportFilter {
  if (value === "pending" || value === "resolved") {
    return value;
  }

  return "all";
}

export default async function AdminReviewReportsPage({
  searchParams,
}: AdminReviewReportsPageProps) {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/login?next=/admin/review-reports");
  }

  const isAdmin = await isAdminUser(user);

  if (!isAdmin) {
    return (
      <PageShell>
        <SubHeader backHref="/" title="신고 리뷰 관리" />
        <div className={ui.pageBody}>
          <AdminAccessDenied />
        </div>
      </PageShell>
    );
  }

  const { status: statusParam } = await searchParams;
  const statusFilter = parseStatusFilter(statusParam);
  const reports = await getAllReviewReports(statusFilter);

  return (
    <PageShell>
      <SubHeader backHref="/" title="신고 리뷰 관리" />
      <div className={`${ui.pageBody} space-y-3`}>
        <AdminNav current="/admin/review-reports" />
        <p className="text-xs font-bold text-wadeal-muted">
          접수된 리뷰 신고를 확인하고 처리할 수 있어요.
        </p>
        <div className="grid grid-cols-3 gap-2">
          <Link
            className={`${ui.btnOutline} h-10 text-xs ${statusFilter === "all" ? "border-wadeal-red text-wadeal-red" : ""}`}
            href="/admin/review-reports"
          >
            전체
          </Link>
          <Link
            className={`${ui.btnOutline} h-10 text-xs ${statusFilter === "pending" ? "border-wadeal-red text-wadeal-red" : ""}`}
            href="/admin/review-reports?status=pending"
          >
            접수
          </Link>
          <Link
            className={`${ui.btnOutline} h-10 text-xs ${statusFilter === "resolved" ? "border-wadeal-red text-wadeal-red" : ""}`}
            href="/admin/review-reports?status=resolved"
          >
            처리 완료
          </Link>
        </div>
        <AdminReviewReportsContent reports={reports} statusFilter={statusFilter} />
      </div>
    </PageShell>
  );
}
