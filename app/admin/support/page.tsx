import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AdminAccessDenied } from "@/components/admin-access-denied";
import { AdminNav } from "@/components/admin-nav";
import { AdminSupportContent } from "@/components/admin-support-content";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import {
  countOpenEscalatedSupportTickets,
  filterSupportTickets,
  getAllSupportTicketsForAdmin,
  parseSupportEscalatedFilter,
  parseSupportStatusFilter,
  parseSupportTypeFilter,
} from "@/lib/data/support-tickets";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

type AdminSupportPageProps = {
  searchParams: Promise<{ status?: string; type?: string; escalated?: string }>;
};

export default async function AdminSupportPage({ searchParams }: AdminSupportPageProps) {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/login?next=/admin/support");
  }

  const isAdmin = await isAdminUser(user);

  if (!isAdmin) {
    return (
      <PageShell>
        <SubHeader backHref="/" title="문의 관리" />
        <div className={ui.pageBody}>
          <AdminAccessDenied />
        </div>
      </PageShell>
    );
  }

  const params = await searchParams;
  const statusFilter = parseSupportStatusFilter(params.status);
  const typeFilter = parseSupportTypeFilter(params.type);
  const escalatedFilter = parseSupportEscalatedFilter(params.escalated);
  const allTickets = await getAllSupportTicketsForAdmin();
  const filteredTickets = filterSupportTickets(
    allTickets,
    statusFilter,
    typeFilter,
    escalatedFilter,
  );
  const openEscalatedCount = countOpenEscalatedSupportTickets(allTickets);

  return (
    <PageShell>
      <SubHeader backHref="/" title="문의 관리" />
      <div className={`${ui.pageBody} space-y-3`}>
        <AdminNav current="/admin/support" />
        <p className="text-xs font-bold text-wadeal-muted">
          고객 문의를 확인하고 답변·상태를 관리할 수 있어요.
          {openEscalatedCount > 0 ?
            <> 미처리 긴급 문의 {openEscalatedCount.toLocaleString("ko-KR")}건</>
          : null}
        </p>
        <Suspense fallback={null}>
          <AdminSupportContent
            initialEscalatedFilter={escalatedFilter}
            initialStatusFilter={statusFilter}
            initialTypeFilter={typeFilter}
            openEscalatedCount={openEscalatedCount}
            tickets={filteredTickets}
          />
        </Suspense>
      </div>
    </PageShell>
  );
}
