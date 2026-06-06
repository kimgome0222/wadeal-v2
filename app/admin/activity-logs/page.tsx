import { redirect } from "next/navigation";

import { AdminAccessDenied } from "@/components/admin-access-denied";
import { AdminActivityLogsContent } from "@/components/admin-activity-logs-content";
import { AdminNav } from "@/components/admin-nav";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import {
  getAdminActivityLogAdminOptions,
  getAdminActivityLogs,
  parseAdminActivityLogFilters,
} from "@/lib/data/admin-activity-logs";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

type AdminActivityLogsPageProps = {
  searchParams: Promise<Record<string, string | undefined>>;
};

export default async function AdminActivityLogsPage({
  searchParams,
}: AdminActivityLogsPageProps) {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/login?next=/admin/activity-logs");
  }

  const isAdmin = await isAdminUser(user);
  if (!isAdmin) {
    return (
      <PageShell>
        <SubHeader backHref="/" title="활동 로그" />
        <div className={ui.pageBody}>
          <AdminAccessDenied />
        </div>
      </PageShell>
    );
  }

  const params = await searchParams;
  const filters = parseAdminActivityLogFilters(params);
  const [{ logs, totalCount, page, totalPages }, adminOptions] = await Promise.all([
    getAdminActivityLogs(filters),
    getAdminActivityLogAdminOptions(),
  ]);

  return (
    <PageShell>
      <SubHeader backHref="/" title="활동 로그" />
      <div className={`${ui.pageBody} space-y-3`}>
        <AdminNav current="/admin/activity-logs" />
        <p className="text-xs font-bold text-wadeal-muted">
          관리자의 주요 변경 내역을 조회할 수 있어요. 로그는 수정·삭제할 수 없습니다.
        </p>
        <AdminActivityLogsContent
          adminOptions={adminOptions}
          filters={{
            adminId: filters.adminId,
            action: filters.action,
            targetType: filters.targetType,
            from: filters.from,
            to: filters.to,
          }}
          logs={logs}
          page={page}
          totalCount={totalCount}
          totalPages={totalPages}
        />
      </div>
    </PageShell>
  );
}
