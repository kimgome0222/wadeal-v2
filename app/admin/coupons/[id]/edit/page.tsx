import { notFound, redirect } from "next/navigation";
import { AdminAccessDenied } from "@/components/admin-access-denied";
import { AdminCouponForm } from "@/components/admin-coupon-form";
import { AdminNav } from "@/components/admin-nav";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getAdminCouponById } from "@/lib/data/admin-coupons";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

type AdminCouponEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminCouponEditPage({ params }: AdminCouponEditPageProps) {
  const user = await getServerAuthUser();
  if (!user) {
    const { id } = await params;
    redirect(`/login?next=/admin/coupons/${id}/edit`);
  }

  const isAdmin = await isAdminUser(user);

  if (!isAdmin) {
    return (
      <PageShell>
        <SubHeader backHref="/admin/coupons" title="쿠폰 수정" />
        <div className={ui.pageBody}>
          <AdminAccessDenied />
        </div>
      </PageShell>
    );
  }

  const { id } = await params;
  const coupon = await getAdminCouponById(id);

  if (!coupon) {
    notFound();
  }

  return (
    <PageShell>
      <SubHeader backHref="/admin/coupons" title="쿠폰 수정" />
      <div className={`${ui.pageBody} space-y-4`}>
        <AdminNav current="/admin/coupons" />
        <AdminCouponForm cancelHref="/admin/coupons" coupon={coupon} mode="edit" />
      </div>
    </PageShell>
  );
}
