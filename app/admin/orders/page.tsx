import { redirect } from "next/navigation";
import { AdminAccessDenied } from "@/components/admin-access-denied";
import { AdminNav } from "@/components/admin-nav";
import { AdminOrdersContent } from "@/components/admin-orders-content";
import { PageShell } from "@/components/page-shell";
import { SubHeader } from "@/components/sub-header";
import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import {
  filterAdminOrdersByStatus,
  getAllAdminOrdersDetailed,
  parseAdminOrderStatusFilter,
} from "@/lib/data/admin-orders";
import { getPaymentsByOrderIds } from "@/lib/data/payments";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

type AdminOrdersPageProps = {
  searchParams: Promise<{ status?: string }>;
};

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/login?next=/admin/orders");
  }

  const isAdmin = await isAdminUser(user);

  if (!isAdmin) {
    return (
      <PageShell>
        <SubHeader backHref="/" title="주문 관리" />
        <div className={ui.pageBody}>
          <AdminAccessDenied />
        </div>
      </PageShell>
    );
  }

  const params = await searchParams;
  const statusFilter = parseAdminOrderStatusFilter(params.status);
  const allOrders = await getAllAdminOrdersDetailed();
  const filteredOrders = filterAdminOrdersByStatus(allOrders, statusFilter);
  const joinedAmounts = new Map(
    allOrders.map((order) => [order.id, order.joinedPrice * order.quantity]),
  );
  const paymentsMap = await getPaymentsByOrderIds(
    allOrders.map((order) => order.id),
    joinedAmounts,
  );
  const paymentsByOrderId = Object.fromEntries(paymentsMap);

  return (
    <PageShell>
      <SubHeader backHref="/" title="주문 관리" />
      <div className={`${ui.pageBody} space-y-3`}>
        <AdminNav current="/admin/orders" />
        <p className="text-xs font-bold text-wadeal-muted">
          전체 주문을 조회하고 상태·배송 정보를 수정할 수 있어요.
        </p>
        <AdminOrdersContent
          initialFilter={statusFilter}
          orderDetails={allOrders}
          orders={filteredOrders}
          paymentsByOrderId={paymentsByOrderId}
        />
      </div>
    </PageShell>
  );
}
