import { redirect } from "next/navigation";

import { AdminSellerNoticeForm } from "@/components/admin-seller-notice-form";
import { AdminAccessDenied } from "@/components/admin-access-denied";
import { AdminNav } from "@/components/admin-nav";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function AdminSellerNoticeNewPage() {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/login?next=/admin/seller-notices/new");
  }

  if (!(await isAdminUser(user))) {
    return (
      <PageShell>
        <SubHeader backHref="/admin/seller-notices" title="공지 작성" />
        <div className={ui.pageBody}>
          <AdminAccessDenied />
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <SubHeader backHref="/admin/seller-notices" title="공지 작성" />
      <div className={`${ui.pageBody} space-y-4`}>
        <AdminNav current="/admin/seller-notices" />
        <AdminSellerNoticeForm />
      </div>
    </PageShell>
  );
}
