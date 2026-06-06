import { getAdminKpiCards } from "@/lib/admin/mock-admin-kpi-summary";
import type { LaunchReadinessSnapshot } from "@/lib/admin/launch-readiness";
import type { AdminDashboardStats } from "@/lib/data/admin-stats-shared";
import { KpiMetricCard } from "@/components/kpi/kpi-metric-card";
import { ui } from "@/lib/ui";

type AdminKpiSummarySectionProps = {
  stats: AdminDashboardStats;
  launchSnapshot: LaunchReadinessSnapshot;
};

/** Admin 운영 KPI mock summary — DB 집계 없음 */
export function AdminKpiSummarySection({
  stats,
  launchSnapshot,
}: AdminKpiSummarySectionProps) {
  const cards = getAdminKpiCards(stats, launchSnapshot);
  const isMock = stats.dataSource === "mock" || stats.dataSource === "empty" || launchSnapshot.usingMockData;

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <h2 className={ui.sectionTitle}>운영 KPI</h2>
        {isMock ?
          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800">
            mock
          </span>
        : null}
      </div>
      <p className="text-[11px] font-bold text-wadeal-muted">
        실제 DB 집계 전 미리보기 수치입니다. 법무·정산 검토 후 확정 KPI와 연동 예정.
      </p>
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-5">
        {cards.map((card) => (
          <KpiMetricCard
            deltaLabel={card.deltaLabel}
            href={card.href}
            key={card.id}
            label={card.label}
            value={card.value}
            warn={card.warn}
          />
        ))}
      </div>
    </section>
  );
}
