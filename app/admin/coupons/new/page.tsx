import { redirect } from "next/navigation";
import { AdminAccessDenied } from "@/components/admin-access-denied";
import { AdminCouponForm } from "@/components/admin-coupon-form";
import { AdminNav } from "@/components/admin-nav";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function AdminCouponNewPage() {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/login?next=/admin/coupons/new");
  }

  const isAdmin = await isAdminUser(user);

  if (!isAdmin) {
    return (
      <PageShell>
        <SubHeader backHref="/admin/coupons" title="쿠폰 등록" />
        <div className={ui.pageBody}>
          <AdminAccessDenied />
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <SubHeader backHref="/admin/coupons" title="쿠폰 등록" />
      <div className={`${ui.pageBody} space-y-4`}>
        <AdminNav current="/admin/coupons" />
        <AdminCouponForm cancelHref="/admin/coupons" mode="create" />
      </div>
    </PageShell>
  );
}
