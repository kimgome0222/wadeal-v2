import { redirect } from "next/navigation";

import { AdminAccessDenied } from "@/components/admin-access-denied";
import { AdminMigrationsStatusSection } from "@/components/admin-migrations-status-section";
import { AdminNav } from "@/components/admin-nav";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { getMigrationStatusForAdmin } from "@/lib/admin/migration-status";
import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function AdminMigrationsSettingsPage() {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/login?next=/admin/settings/migrations");
  }

  const isAdmin = await isAdminUser(user);

  if (!isAdmin) {
    return (
      <PageShell>
        <SubHeader backHref="/admin/dashboard" title="Migration 상태" />
        <div className={ui.pageBody}>
          <AdminAccessDenied />
        </div>
      </PageShell>
    );
  }

  const migrationStatus = await getMigrationStatusForAdmin(user);
  if (!migrationStatus) {
    redirect("/login?next=/admin/settings/migrations");
  }

  return (
    <PageShell>
      <SubHeader backHref="/admin/dashboard" title="Migration 상태" />
      <div className={`${ui.pageBody} space-y-4`}>
        <AdminNav current="/admin/settings/migrations" />
        <AdminMigrationsStatusSection status={migrationStatus} />
      </div>
    </PageShell>
  );
}
