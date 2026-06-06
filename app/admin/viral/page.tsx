import { redirect } from "next/navigation";

import { AdminNav } from "@/components/admin-nav";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getAdminViralSummary } from "@/lib/data/admin-viral";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function AdminViralPage() {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/admin/login?next=/admin/viral");
  }
  if (!(await isAdminUser(user))) {
    redirect("/unauthorized?next=/admin/viral");
  }

  const summary = await getAdminViralSummary();

  return (
    <PageShell>
      <SubHeader backHref="/admin/dashboard" title="바이럴/초대 통계" />
      <div className={`${ui.pageBody} space-y-4`}>
        <AdminNav current="/admin/viral" />
        <p className="text-xs font-bold text-wadeal-muted">
          공유 로그·초대 방문(referral_visits) 기준 요약입니다.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <article className="rounded-xl border border-wadeal-line bg-white p-4">
            <p className="text-[11px] font-bold text-wadeal-muted">총 공유</p>
            <p className="mt-1 text-2xl font-black text-wadeal-ink">{summary.totalShareLogs}</p>
          </article>
          <article className="rounded-xl border border-wadeal-line bg-white p-4">
            <p className="text-[11px] font-bold text-wadeal-muted">초대 방문</p>
            <p className="mt-1 text-2xl font-black text-wadeal-ink">
              {summary.totalReferralVisits}
            </p>
          </article>
        </div>

        <section className="space-y-2">
          <h2 className="text-sm font-black text-wadeal-ink">상위 초대 코드</h2>
          <div className="rounded-xl border border-wadeal-line bg-white p-4">
            {summary.topReferralCodes.length === 0 ?
              <p className="text-xs font-bold text-wadeal-muted">집계 데이터가 없어요.</p>
            : <ul className="space-y-2">
                {summary.topReferralCodes.map((item) => (
                  <li
                    className="flex items-center justify-between text-xs font-bold text-wadeal-muted"
                    key={item.referralCode}
                  >
                    <span className="font-black text-wadeal-ink">{item.referralCode}</span>
                    <span>{item.visitCount}회</span>
                  </li>
                ))}
              </ul>
            }
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-black text-wadeal-ink">최근 초대 방문</h2>
          <div className="rounded-xl border border-wadeal-line bg-white p-4">
            {summary.recentVisits.length === 0 ?
              <p className="text-xs font-bold text-wadeal-muted">최근 방문 기록이 없어요.</p>
            : <ul className="space-y-2">
                {summary.recentVisits.map((item, index) => (
                  <li
                    className="flex items-center justify-between gap-3 text-xs font-bold text-wadeal-muted"
                    key={`${item.referralCode}-${item.visitedAt}-${index}`}
                  >
                    <span className="font-black text-wadeal-ink">{item.referralCode}</span>
                    <span>{new Date(item.visitedAt).toLocaleString("ko-KR")}</span>
                  </li>
                ))}
              </ul>
            }
          </div>
        </section>
      </div>
    </PageShell>
  );
}
