import Link from "next/link";
import { notFound } from "next/navigation";

import { AppBuyerLayout } from "@/components/app-buyer-layout";
import { SupportNoticeDetail } from "@/components/support/support-notices-mock-list";
import { SubHeader } from "@/components/sub-header";
import { getNoticeById } from "@/lib/support/mock-customer-support-data";
import { ui } from "@/lib/ui";

type SupportNoticeDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function SupportNoticeDetailPage({ params }: SupportNoticeDetailPageProps) {
  const { id } = await params;
  const notice = getNoticeById(id);

  if (!notice) {
    notFound();
  }

  return (
    <AppBuyerLayout showCategoryBar={false} showSearch={false}>
      <SubHeader backHref="/support/notices" title="공지 상세" />
      <div className={`${ui.pageBody} space-y-4 pb-[max(calc(env(safe-area-inset-bottom)+120px),120px)]`}>
        <SupportNoticeDetail notice={notice} />
        <Link className={`${ui.btnOutline} block text-center text-sm`} href="/support/notices">
          목록으로
        </Link>
      </div>
    </AppBuyerLayout>
  );
}
