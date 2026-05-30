import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminAccessDenied } from "@/components/admin-access-denied";
import { AdminNav } from "@/components/admin-nav";
import { AdminPromotionsContent } from "@/components/admin-promotions-content";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getMockPromotions } from "@/lib/promotions/mock-promotion-data";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function AdminPromotionsPage() {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/admin/login?next=/admin/promotions");
  }

  const isAdmin = await isAdminUser(user);

  if (!isAdmin) {
    return (
      <PageShell>
        <SubHeader backHref="/" title="프로모션 관리" />
        <div className={ui.pageBody}>
          <AdminAccessDenied />
        </div>
      </PageShell>
    );
  }

  const promotions = getMockPromotions();

  return (
    <PageShell>
      <SubHeader backHref="/admin/dashboard" title="프로모션 관리" />
      <div className={`${ui.pageBody} space-y-4`}>
        <AdminNav current="/admin/promotions" />
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-bold leading-relaxed text-amber-900">
          mock UI입니다. 프로모션 등록·수정은 DB 연동 전까지 미리보기와 운영 문서(
          <code className="font-mono">docs/CELLOH_PROMOTION_OPERATIONS_PLAN.md</code>)를
          참고하세요. 실제 쿠폰 지급·할인 적용은 하지 않습니다.
        </div>
        <div className="flex flex-wrap gap-2">
          <Link className={`${ui.btnOutline} h-9 text-xs`} href="/admin/coupons">
            쿠폰 관리
          </Link>
          <Link className={`${ui.btnOutline} h-9 text-xs`} href="/admin/events">
            기획전 관리
          </Link>
        </div>
        <button
          className={`${ui.btnPrimary} h-11 w-full cursor-not-allowed opacity-60`}
          disabled
          type="button"
        >
          프로모션 등록 (준비 중)
        </button>
        <AdminPromotionsContent promotions={promotions} />
      </div>
    </PageShell>
  );
}
