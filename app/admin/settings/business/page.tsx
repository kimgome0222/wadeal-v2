import { redirect } from "next/navigation";

import { AdminAccessDenied } from "@/components/admin-access-denied";
import { AdminBusinessSettingsForm } from "@/components/admin-business-settings-form";
import { AdminNav } from "@/components/admin-nav";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getBusinessSettings } from "@/lib/data/business-settings";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function AdminBusinessSettingsPage() {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/login?next=/admin/settings/business");
  }

  const isAdmin = await isAdminUser(user);

  if (!isAdmin) {
    return (
      <PageShell>
        <SubHeader backHref="/admin/dashboard" title="사업자 정보" />
        <div className={ui.pageBody}>
          <AdminAccessDenied />
        </div>
      </PageShell>
    );
  }

  const settings = await getBusinessSettings();

  return (
    <PageShell>
      <SubHeader backHref="/admin/dashboard" title="사업자 정보" />
      <div className={`${ui.pageBody} space-y-4`}>
        <AdminNav current="/admin/settings/business" />
        <AdminBusinessSettingsForm settings={settings} />
      </div>
    </PageShell>
  );
}
