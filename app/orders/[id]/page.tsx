import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { CustomerOrderDetailContent } from "@/components/customer-order-detail-content";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getOrderTimelines } from "@/lib/data/order-timelines";
import { getUserOrderById } from "@/lib/data/orders";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

type CustomerOrderDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CustomerOrderDetailPage({ params }: CustomerOrderDetailPageProps) {
  const user = await getServerAuthUser();
  if (!user) {
    redirect(`/login?next=/orders/${(await params).id}`);
  }

  const { id } = await params;
  const [order, timelineEntries] = await Promise.all([
    getUserOrderById(user.id, id),
    getOrderTimelines(id),
  ]);

  if (!order) {
    notFound();
  }

  return (
    <PageShell>
      <SubHeader backHref="/mypage/orders" title="주문 상세" />
      <div className={`${ui.pageBody} mx-auto max-w-2xl space-y-4`}>
        <CustomerOrderDetailContent order={order} timelineEntries={timelineEntries} />
        <Link className={`${ui.btnOutline} inline-flex h-10 items-center px-4 text-xs`} href="/mypage/orders">
          주문 목록으로
        </Link>
      </div>
    </PageShell>
  );
}
