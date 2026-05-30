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
import { getMockAdminCoupons } from "@/lib/promotions/mock-coupon-catalog";
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
  const mockCoupons = getMockAdminCoupons();
  const usingMock = coupons.length === 0;

  return (
    <PageShell>
      <SubHeader backHref="/" title="쿠폰 관리" />
      <div className={`${ui.pageBody} space-y-4`}>
        <AdminNav current="/admin/coupons" />
        {usingMock ?
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-bold leading-relaxed text-amber-900">
            Supabase 미연결 또는 등록 쿠폰 없음 — 아래는 mock 쿠폰 목록입니다. 실제 지급·적용은
            하지 않습니다.
          </div>
        : null}
        <p className="text-xs font-bold text-wadeal-muted">
          쿠폰을 등록하고 사용 현황을 확인할 수 있어요.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link className={`${ui.btnOutline} h-9 text-xs`} href="/admin/promotions">
            프로모션 관리
          </Link>
          <Link className="text-xs font-bold text-wadeal-red" href="/join-cart">
            장바구니 tier 쿠폰 UI →
          </Link>
        </div>
        {!usingMock ?
          <Link className={`${ui.btnPrimary} h-11 cursor-pointer`} href="/admin/coupons/new">
            쿠폰 등록
          </Link>
        : null}
        <AdminCouponsContent coupons={coupons} mockCoupons={mockCoupons} showMockOnly={usingMock} />
      </div>
    </PageShell>
  );
}
