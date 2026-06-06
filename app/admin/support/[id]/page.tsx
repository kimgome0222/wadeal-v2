import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AdminAccessDenied } from "@/components/admin-access-denied";
import { AdminNav } from "@/components/admin-nav";
import { AdminSupportDetailContent } from "@/components/admin-support-content";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getSupportTicketByIdForAdmin } from "@/lib/data/support-tickets";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

type AdminSupportDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminSupportDetailPage({ params }: AdminSupportDetailPageProps) {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/login?next=/admin/support");
  }

  const isAdmin = await isAdminUser(user);

  if (!isAdmin) {
    return (
      <PageShell>
        <SubHeader backHref="/" title="문의 상세" />
        <div className={ui.pageBody}>
          <AdminAccessDenied />
        </div>
      </PageShell>
    );
  }

  const { id } = await params;
  const ticket = await getSupportTicketByIdForAdmin(id);

  if (!ticket) {
    notFound();
  }

  return (
    <PageShell>
      <SubHeader backHref="/admin/support" title="문의 상세" />
      <div className={`${ui.pageBody} space-y-3`}>
        <AdminNav current="/admin/support" />
        <AdminSupportDetailContent ticket={ticket} />
        <Link className={`${ui.btnOutline} block text-center`} href="/admin/support">
          목록으로
        </Link>
      </div>
    </PageShell>
  );
}
