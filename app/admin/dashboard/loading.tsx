import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { ui } from "@/lib/ui";

export default function AdminDashboardLoading() {
  return (
    <PageShell>
      <SubHeader backHref="/" title="운영 대시보드" />
      <div className={`${ui.pageBody} space-y-4`}>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div className={`${ui.btnOutline} h-10 animate-pulse bg-gray-50`} key={index} />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <div className={`${ui.panel} h-16 animate-pulse bg-gray-50`} key={index} />
          ))}
        </div>
        <div className={`${ui.panel} h-48 animate-pulse bg-gray-50`} />
      </div>
    </PageShell>
  );
}
