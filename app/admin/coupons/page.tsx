import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminAccessDenied } from "@/components/admin-access-denied";
import { AdminCouponsContent } from "@/components/admin-coupons-content";
import { AdminNav } from "@/components/admin-nav";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getAdminCoupons } from "@/lib/data/admin-coupons";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/login?next=/admin/coupons");
  }

  const isAdmin = await isAdminUser(user);

  if (!isAdmin) {
    return (
      <PageShell>
        <SubHeader backHref="/" title="쿠폰 관리" />
        <div className={ui.pageBody}>
          <AdminAccessDenied />
        </div>
      </PageShell>
    );
  }

  const coupons = await getAdminCoupons();

  return (
    <PageShell>
      <SubHeader backHref="/" title="쿠폰 관리" />
      <div className={`${ui.pageBody} space-y-4`}>
        <AdminNav current="/admin/coupons" />
        <p className="text-xs font-bold text-wadeal-muted">
          쿠폰을 등록하고 사용 현황을 확인할 수 있어요.
        </p>
        <Link className={`${ui.btnPrimary} h-11 cursor-pointer`} href="/admin/coupons/new">
          쿠폰 등록
        </Link>
        <AdminCouponsContent coupons={coupons} />
      </div>
    </PageShell>
  );
}
