import Link from "next/link";

import { AppBuyerLayout } from "@/components/app-buyer-layout";
import { SupportTicketCard } from "@/components/support-ticket-card";
import { SupportTicketsMockPanel } from "@/components/support/support-tickets-mock-panel";
import { SubHeader } from "@/components/sub-header";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getSupportTicketsForUser } from "@/lib/data/support-tickets";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function SupportTicketsPage() {
  const user = await getServerAuthUser();
  const realTickets = user ? await getSupportTicketsForUser(user.id) : [];

  return (
    <AppBuyerLayout showCategoryBar={false} showSearch={false}>
      <SubHeader backHref="/support" title="문의 내역" />
      <div className={`${ui.pageBody} space-y-6 pb-[max(calc(env(safe-area-inset-bottom)+120px),120px)]`}>
        {realTickets.length > 0 ?
          <section className="space-y-3">
            <h2 className="text-sm font-bold text-wadeal-ink">내 문의</h2>
            {realTickets.map((ticket) => (
              <SupportTicketCard key={ticket.id} ticket={ticket} />
            ))}
          </section>
        : null}

        <section className="space-y-3">
          {realTickets.length > 0 ?
            <h2 className="text-sm font-bold text-wadeal-ink">샘플 (mock)</h2>
          : null}
          <SupportTicketsMockPanel showLoginHint={!user} />
        </section>

        {!user ?
          <Link className={`${ui.btnOutline} block text-center text-sm`} href="/login?next=%2Fsupport%2Ftickets">
            로그인하고 실제 문의 내역 보기
          </Link>
        : null}
      </div>
    </AppBuyerLayout>
  );
}
