import Link from "next/link";
import { redirect } from "next/navigation";
import { EmptyState } from "@/components/empty-state";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { SupportInquiryHub } from "@/components/support-inquiry-hub";
import { SupportTicketCard } from "@/components/support-ticket-card";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getBusinessSettings } from "@/lib/data/business-settings";
import { getSupportTicketsForUser } from "@/lib/data/support-tickets";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

const KAKAO_CHANNEL_URL = process.env.NEXT_PUBLIC_KAKAO_CHANNEL_URL ?? null;

export default async function SupportPage() {
  const user = await getServerAuthUser();

  if (!user) {
    redirect("/login?next=/support");
  }

  const [tickets, business] = await Promise.all([
    getSupportTicketsForUser(user.id),
    getBusinessSettings(),
  ]);

  return (
    <PageShell>
      <SubHeader backHref="/mypage" title="고객센터" />
      <div className={`${ui.pageBody} space-y-5`}>
        <SupportInquiryHub
          customerServiceEmail={business.customerServiceEmail}
          customerServicePhone={business.customerServicePhone}
          kakaoChannelUrl={KAKAO_CHANNEL_URL}
        />

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-bold text-wadeal-ink">문의 내역</h2>
            <Link className="text-xs font-semibold text-wadeal-red" href="/support/new">
              1:1 문의
            </Link>
          </div>

          {tickets.length === 0 ?
            <EmptyState
              description="위에서 문의 유형을 선택하거나 1:1 문의를 등록해 주세요."
              title="등록된 문의가 없어요."
            />
          : tickets.map((ticket) => <SupportTicketCard key={ticket.id} ticket={ticket} />)}
        </section>
      </div>
    </PageShell>
  );
}
