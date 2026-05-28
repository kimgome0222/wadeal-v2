import { redirect } from "next/navigation";

import { AdminAccessDenied } from "@/components/admin-access-denied";
import { AdminGoLiveReadinessSection } from "@/components/admin-go-live-readiness-section";
import { AdminNav } from "@/components/admin-nav";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { getGoLiveReadinessForAdmin } from "@/lib/admin/go-live-readiness";
import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function AdminGoLiveReadinessPage() {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/login?next=/admin/go-live-readiness");
  }

  const isAdmin = await isAdminUser(user);
  if (!isAdmin) {
    return (
      <PageShell>
        <SubHeader backHref="/admin/dashboard" title="오픈 준비 상태" />
        <div className={ui.pageBody}>
          <AdminAccessDenied />
        </div>
      </PageShell>
    );
  }

  const readiness = await getGoLiveReadinessForAdmin(user);
  if (!readiness) {
    redirect("/login?next=/admin/go-live-readiness");
  }

  return (
    <PageShell>
      <SubHeader backHref="/admin/dashboard" title="오픈 준비 상태" />
      <div className={`${ui.pageBody} space-y-3`}>
        <AdminNav current="/admin/dashboard" />
        <p className="text-xs font-bold text-wadeal-muted">
          PG 심사·사업자 정보·정책·결제·운영 항목의 자동 점검 결과입니다. 수동 체크리스트는
          저장소의 docs/GO_LIVE_CHECKLIST.md를 참고하세요.
        </p>
        <AdminGoLiveReadinessSection readiness={readiness} showFullLink={false} />
        <section className="space-y-2">
          <h2 className={ui.sectionTitle}>관련 문서</h2>
          <div className={`${ui.panel} space-y-2 text-xs font-bold text-wadeal-muted`}>
            <p>docs/GO_LIVE_CHECKLIST.md — 출시 전 수동 체크리스트</p>
            <p>docs/PG_REVIEW_PREP.md — PG 심사 제출용 서비스 설명</p>
            <p>docs/PAYMENT_FLOW.md — 결제 흐름 상세</p>
            <p>docs/ENVIRONMENT_VARIABLES.md — Vercel 환경변수 가이드</p>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
