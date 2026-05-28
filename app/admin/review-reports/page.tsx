import { redirect } from "next/navigation";
import { AdminAccessDenied } from "@/components/admin-access-denied";
import { AdminNav } from "@/components/admin-nav";
import { AdminReviewReportsContent } from "@/components/admin-review-reports-content";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getAllReviewReports } from "@/lib/data/review-reports";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function AdminReviewReportsPage() {
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

  const reports = await getAllReviewReports();

  return (
    <PageShell>
      <SubHeader backHref="/" title="신고 리뷰 관리" />
      <div className={`${ui.pageBody} space-y-3`}>
        <AdminNav current="/admin/review-reports" />
        <p className="text-xs font-bold text-wadeal-muted">
          접수된 리뷰 신고를 확인하고 처리할 수 있어요.
        </p>
        <AdminReviewReportsContent reports={reports} />
      </div>
    </PageShell>
  );
}
