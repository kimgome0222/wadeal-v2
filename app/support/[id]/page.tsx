import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { SupportTicketDetail } from "@/components/support-ticket-detail";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getSupportTicketByIdForUser } from "@/lib/data/support-tickets";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

type SupportDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function SupportDetailPage({ params }: SupportDetailPageProps) {
  const user = await getServerAuthUser();

  if (!user) {
    redirect("/login?next=/support");
  }

  const { id } = await params;
  const ticket = await getSupportTicketByIdForUser(user.id, id);

  if (!ticket) {
    notFound();
  }

  return (
    <PageShell>
      <SubHeader backHref="/support/tickets" title="문의 상세" />
      <div className={`${ui.pageBody} space-y-3`}>
        <SupportTicketDetail ticket={ticket} />
        <Link className={`${ui.btnOutline} block text-center`} href="/support/tickets">
          목록으로
        </Link>
      </div>
    </PageShell>
  );
}
