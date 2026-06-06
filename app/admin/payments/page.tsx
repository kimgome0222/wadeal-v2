import { redirect } from "next/navigation";
import { AdminAccessDenied } from "@/components/admin-access-denied";
import { AdminNav } from "@/components/admin-nav";
import { AdminPaymentsContent } from "@/components/admin-payments-content";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getAdminRecentPayments, getAdminWebhookLogs } from "@/lib/data/admin-payments";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function AdminPaymentsPage() {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/login?next=/admin/payments");
  }

  const isAdmin = await isAdminUser(user);

  if (!isAdmin) {
    return (
      <PageShell>
        <SubHeader backHref="/" title="결제 / 웹훅" />
        <div className={ui.pageBody}>
          <AdminAccessDenied />
        </div>
      </PageShell>
    );
  }

  const [webhookLogs, recentPayments] = await Promise.all([
    getAdminWebhookLogs(50),
    getAdminRecentPayments(30),
  ]);

  return (
    <PageShell>
      <SubHeader backHref="/" title="결제 / 웹훅" />
      <div className={`${ui.pageBody} space-y-3`}>
        <AdminNav current="/admin/payments" />
        <p className="text-xs font-bold text-wadeal-muted">
          토스페이먼츠 웹훅 수신 기록과 최근 결제 상태를 확인할 수 있어요.
        </p>
        <AdminPaymentsContent recentPayments={recentPayments} webhookLogs={webhookLogs} />
      </div>
    </PageShell>
  );
}
