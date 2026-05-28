import { notFound, redirect } from "next/navigation";

import { AdminSellerNoticeForm } from "@/components/admin-seller-notice-form";
import { AdminAccessDenied } from "@/components/admin-access-denied";
import { AdminNav } from "@/components/admin-nav";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getAdminSellerNoticeById } from "@/lib/data/seller-notices";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function AdminSellerNoticeEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/login?next=/admin/seller-notices");
  }

  if (!(await isAdminUser(user))) {
    return (
      <PageShell>
        <SubHeader backHref="/admin/seller-notices" title="공지 수정" />
        <div className={ui.pageBody}>
          <AdminAccessDenied />
        </div>
      </PageShell>
    );
  }

  const { id } = await params;
  const notice = await getAdminSellerNoticeById(id);
  if (!notice) {
    notFound();
  }

  return (
    <PageShell>
      <SubHeader backHref="/admin/seller-notices" title="공지 수정" />
      <div className={`${ui.pageBody} space-y-4`}>
        <AdminNav current="/admin/seller-notices" />
        <AdminSellerNoticeForm notice={notice} />
      </div>
    </PageShell>
  );
}
