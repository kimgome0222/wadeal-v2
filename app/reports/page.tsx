import { AppBuyerLayout } from "@/components/app-buyer-layout";
import { SupportReportMockForm } from "@/components/support/support-report-mock-form";
import { SubHeader } from "@/components/sub-header";
import { ui } from "@/lib/ui";

export default function ReportsPage() {
  return (
    <AppBuyerLayout showCategoryBar={false} showSearch={false}>
      <SubHeader backHref="/support" title="신고하기" />
      <div className={`${ui.pageBody} pb-[max(calc(env(safe-area-inset-bottom)+120px),120px)]`}>
        <SupportReportMockForm />
      </div>
    </AppBuyerLayout>
  );
}
