import { redirect } from "next/navigation";
import { Suspense } from "react";

import { AdminAccessDenied } from "@/components/admin-access-denied";
import { AdminErrorLogsContent } from "@/components/admin-error-logs-content";
import { AdminNav } from "@/components/admin-nav";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getAdminErrorLogs, parseAdminErrorLogFilters } from "@/lib/data/admin-error-logs";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

type AdminErrorLogsPageProps = {
  searchParams: Promise<Record<string, string | undefined>>;
};

export default async function AdminErrorLogsPage({ searchParams }: AdminErrorLogsPageProps) {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/login?next=/admin/error-logs");
  }

  const isAdmin = await isAdminUser(user);
  if (!isAdmin) {
    return (
      <PageShell>
        <SubHeader backHref="/" title="에러 로그" />
        <div className={ui.pageBody}>
          <AdminAccessDenied />
        </div>
      </PageShell>
    );
  }

  const params = await searchParams;
  const filters = parseAdminErrorLogFilters(params);
  const { logs, totalCount, page, totalPages } = await getAdminErrorLogs(filters);

  return (
    <PageShell>
      <SubHeader backHref="/" title="에러 로그" />
      <div className={`${ui.pageBody} space-y-3`}>
        <AdminNav current="/admin/error-logs" />
        <p className="text-xs font-bold text-wadeal-muted">
          결제·웹훅·판매 종료 등 서비스 오류를 조회하고 해결 처리할 수 있어요. 민감 정보는 저장되지 않습니다.
        </p>
        <Suspense fallback={null}>
          <AdminErrorLogsContent
            filters={{
              level: filters.level,
              source: filters.source,
              resolved: filters.resolved,
            }}
            initialExpandedLogId={params.log?.trim() || null}
            logs={logs}
            page={page}
            totalCount={totalCount}
            totalPages={totalPages}
          />
        </Suspense>
      </div>
    </PageShell>
  );
}
