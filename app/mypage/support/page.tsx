import Link from "next/link";
import { redirect } from "next/navigation";
import { EmptyState } from "@/components/empty-state";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { SupportTicketCard } from "@/components/support-ticket-card";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getSupportTicketsForUser } from "@/lib/data/support-tickets";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function MypageSupportPage() {
  const user = await getServerAuthUser();

  if (!user) {
    redirect("/login?next=/mypage/support");
  }

  const tickets = await getSupportTicketsForUser(user.id);

  return (
    <PageShell>
      <SubHeader backHref="/mypage" title="고객센터" />
      <div className={`${ui.pageBody} space-y-3`}>
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-bold text-wadeal-muted">문의 내역</p>
          <Link className="text-xs font-black text-wadeal-red" href="/support/new">
            문의하기
          </Link>
        </div>

        {tickets.length === 0 ?
          <EmptyState
            actionHref="/support/new"
            actionLabel="문의하기"
            description="주문, 배송, 환불 등 궁금한 점을 남겨 주세요."
            title="등록된 문의가 없어요."
          />
        : tickets.map((ticket) => <SupportTicketCard key={ticket.id} ticket={ticket} />)}
      </div>
    </PageShell>
  );
}
