import Link from "next/link";
import { redirect } from "next/navigation";

import { AppBuyerLayout } from "@/components/app-buyer-layout";
import { EmptyState } from "@/components/empty-state";
import { InquiryCustomerCenterMenu } from "@/components/inquiry/inquiry-customer-center-menu";
import { SubHeader } from "@/components/sub-header";
import { SupportInquiryHub } from "@/components/support-inquiry-hub";
import { SupportTicketCard } from "@/components/support-ticket-card";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getBusinessSettings } from "@/lib/data/business-settings";
import { getUnreadCountForUser } from "@/lib/data/notifications";
import { getSupportTicketsForUser } from "@/lib/data/support-tickets";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

const KAKAO_CHANNEL_URL = process.env.NEXT_PUBLIC_KAKAO_CHANNEL_URL ?? null;

export default async function MypageSupportPage() {
  const user = await getServerAuthUser();

  if (!user) {
    redirect("/login?next=/mypage/support");
  }

  const [tickets, business, unreadCount] = await Promise.all([
    getSupportTicketsForUser(user.id),
    getBusinessSettings(),
    getUnreadCountForUser(user.id),
  ]);

  return (
    <AppBuyerLayout showCategoryBar={false} showSearch={false} unreadNotificationCount={unreadCount}>
      <SubHeader backHref="/mypage" title="문의" />
      <div className={`${ui.pageBody} space-y-10 pb-[max(calc(env(safe-area-inset-bottom)+120px),120px)]`}>
        <InquiryCustomerCenterMenu />

        <SupportInquiryHub
          customerServiceEmail={business.customerServiceEmail}
          customerServicePhone={business.customerServicePhone}
          kakaoChannelUrl={KAKAO_CHANNEL_URL}
        />

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[20px] font-bold text-[#111111]">문의 내역</h2>
            <Link className="text-[14px] font-semibold text-[#2E5E4E]" href="/support/new">
              1:1 문의
            </Link>
          </div>

          {tickets.length === 0 ?
            <EmptyState
              description="궁금한 점을 남기면 빠르게 답변해 드려요."
              title="등록된 문의가 없어요"
            />
          : tickets.map((ticket) => <SupportTicketCard key={ticket.id} ticket={ticket} />)}
        </section>
      </div>
    </AppBuyerLayout>
  );
}
