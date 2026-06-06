import Link from "next/link";

import { SellerDashboardMockSummary } from "@/components/seller/seller-dashboard-mock-summary";
import { SellerCenterTrustOpsPanel } from "@/components/seller-center-trust-ops-panel";
import { SellerDashboardStatusPanel } from "@/components/seller-dashboard-status-panel";
import { SellerShell } from "@/components/seller-shell";
import { getSellerAccessContext } from "@/lib/auth/seller-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getSellerDashboardStats } from "@/lib/data/seller-analytics";
import { getRecentPublishedSellerNotices } from "@/lib/data/seller-notices";
import { getSellerSetupStatus } from "@/lib/sellers/setup-status";
import { showSellerCenterMock } from "@/lib/sellers/show-seller-mock";
import { getSellerStatusLabel } from "@/lib/sellers/types";
import { formatOrderCurrency } from "@/lib/orders/admin-order-status";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function SellerDashboardPage() {
  const user = await getServerAuthUser();
  const { seller, isApproved } = await getSellerAccessContext(user);
  const stats =
    isApproved && seller ? await getSellerDashboardStats(seller.userId, seller.id) : null;
  const recentNotices = isApproved && seller ? await getRecentPublishedSellerNotices(5) : [];
  const setup = getSellerSetupStatus(seller);

  const quickActions = [
    {
      href: setup.canRegisterProducts ? "/seller/products/new" : "/seller/settings",
      label: "상품 등록",
    },
    { href: "/seller/orders", label: "주문 관리" },
    { href: "/seller/inquiries", label: "문의 관리" },
    {
      href: setup.canManageSettlements ? "/seller/finance/settlements" : "/seller/settings",
      label: "정산 관리",
    },
  ] as const;

  const useMockPreview = showSellerCenterMock() || !isApproved;

  return (
    <SellerShell title="대시보드">
      <div className="space-y-4">
        <SellerDashboardStatusPanel companyName={seller?.companyName} setup={setup} />

        {useMockPreview ?
          <SellerDashboardMockSummary />
        : null}

        <div className={`${ui.panel} space-y-3 border-wadeal-red/20 bg-wadeal-surface/50`}>
          <p className="text-base font-black text-wadeal-ink">celloh에 오신 것을 환영합니다</p>
          <p className="text-sm font-medium leading-relaxed text-wadeal-muted">
            좋은 상품은 좋은 판매자에게서 시작됩니다.
          </p>
          <p className="text-xs font-bold text-wadeal-muted">
            상품을 등록하고, 주문·문의·정산을 celloh에서 관리하세요.
          </p>
          <div className="grid grid-cols-2 gap-2 pt-1 sm:grid-cols-4">
            {quickActions.map((item) => (
              <Link
                className={`${ui.btnOutline} h-10 text-[11px] font-bold`}
                href={item.href}
                key={item.label}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <SellerCenterTrustOpsPanel />

        <div className={`${ui.panel} space-y-2`}>
          <p className="text-sm font-black text-wadeal-ink">판매자 센터</p>
          <p className="text-xs font-medium leading-relaxed text-wadeal-muted">
            celloh에서 좋은 상품과 판매자의 이야기를 고객에게 보여주세요.
          </p>
          <p className="text-xs font-bold text-wadeal-muted">
            {seller ?
              `${seller.companyName} · ${getSellerStatusLabel(seller.status)}`
            : "판매자 신청 후 승인되면 기능을 이용할 수 있어요."}
          </p>
          {!isApproved ?
            <Link className="text-xs font-black text-wadeal-red underline underline-offset-2" href="/seller/apply">
              판매자 신청하기
            </Link>
          : null}
        </div>

        {isApproved && stats ?
          <>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className={`${ui.panel} space-y-1`}>
                <p className="text-[10px] font-bold text-wadeal-muted">오늘 주문</p>
                <p className="text-lg font-black text-wadeal-ink">
                  {stats.todayOrders.toLocaleString("ko-KR")}건
                </p>
                <p className="text-[10px] font-bold text-wadeal-muted">
                  전체 {stats.totalOrders.toLocaleString("ko-KR")}건
                </p>
              </div>
              <div className={`${ui.panel} space-y-1`}>
                <p className="text-[10px] font-bold text-wadeal-muted">배송 대기</p>
                <p className="text-lg font-black text-wadeal-ink">
                  {stats.pendingShipment.toLocaleString("ko-KR")}건
                </p>
                {stats.pendingShipment > 0 ?
                  <Link className="text-[10px] font-black text-wadeal-red" href="/seller/orders">
                    주문/배송 확인 →
                  </Link>
                : null}
              </div>
              <div className={`${ui.panel} space-y-1`}>
                <p className="text-[10px] font-bold text-wadeal-muted">환불 요청</p>
                <p className="text-lg font-black text-wadeal-ink">
                  {stats.refundRequestCount.toLocaleString("ko-KR")}건
                </p>
              </div>
              <div className={`${ui.panel} space-y-1`}>
                <p className="text-[10px] font-bold text-wadeal-muted">정산 예정</p>
                <p className="text-lg font-black text-wadeal-red">
                  {formatOrderCurrency(stats.pendingSettlementAmount)}
                </p>
                <Link className="text-[10px] font-black text-wadeal-red" href="/seller/finance/settlements">
                  정산 내역 →
                </Link>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className={`${ui.panel} space-y-1`}>
                <p className="text-[10px] font-bold text-wadeal-muted">결제완료 주문</p>
                <p className="text-lg font-black text-wadeal-ink">
                  {stats.paidOrders.toLocaleString("ko-KR")}건
                </p>
              </div>
              <div className={`${ui.panel} space-y-1`}>
                <p className="text-[10px] font-bold text-wadeal-muted">매출 (결제완료)</p>
                <p className="text-lg font-black text-wadeal-red">
                  {formatOrderCurrency(stats.totalRevenue)}
                </p>
              </div>
              <div className={`${ui.panel} space-y-1`}>
                <p className="text-[10px] font-bold text-wadeal-muted">리뷰</p>
                <p className="text-lg font-black text-wadeal-ink">
                  {stats.avgRating != null ? `${stats.avgRating}점` : "-"}
                </p>
                <p className="text-[10px] font-bold text-wadeal-muted">
                  {stats.reviewCount.toLocaleString("ko-KR")}건
                  {stats.pendingReviewReplies > 0 ?
                    ` · 답글 필요 ${stats.pendingReviewReplies}건`
                  : ""}
                </p>
              </div>
            </div>
          </>
        : null}

        {isApproved ?
          <div className="grid gap-3 sm:grid-cols-2">
            <Link className={`${ui.panel} block space-y-1`} href="/seller/products">
              <p className="text-sm font-black text-wadeal-ink">상품 요청</p>
              <p className="text-xs font-bold text-wadeal-muted">상품 등록·검수 요청</p>
            </Link>
            <Link className={`${ui.panel} block space-y-1`} href="/seller/orders">
              <p className="text-sm font-black text-wadeal-ink">주문/배송</p>
              <p className="text-xs font-bold text-wadeal-muted">주문 확인·송장 등록</p>
            </Link>
            <Link className={`${ui.panel} block space-y-1`} href="/seller/finance/settlements">
              <p className="text-sm font-black text-wadeal-ink">정산</p>
              <p className="text-xs font-bold text-wadeal-muted">정산 내역 확인</p>
            </Link>
            <Link className={`${ui.panel} block space-y-1`} href="/seller/reviews">
              <p className="text-sm font-black text-wadeal-ink">C/S · 리뷰</p>
              <p className="text-xs font-bold text-wadeal-muted">
                {stats && stats.pendingReviewReplies > 0 ?
                  `답글 필요 ${stats.pendingReviewReplies}건`
                : "리뷰 답글 관리"}
              </p>
            </Link>
          </div>
        : null}

        {recentNotices.length > 0 ?
          <div className={`${ui.panel} space-y-3`}>
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-black text-wadeal-ink">최근 공지</p>
              <Link className="text-xs font-black text-wadeal-red" href="/seller/notices">
                전체 보기
              </Link>
            </div>
            <div className="space-y-2">
              {recentNotices.map((notice) => (
                <Link
                  className="block rounded-lg border border-wadeal-line px-3 py-2"
                  href={`/seller/notices/${notice.id}`}
                  key={notice.id}
                >
                  <p className="text-xs font-black text-wadeal-ink">
                    {notice.isImportant ?
                      <span className="mr-1 text-wadeal-red">[중요]</span>
                    : null}
                    {notice.title}
                  </p>
                  <p className="mt-1 text-[10px] font-bold text-wadeal-muted">{notice.categoryLabel}</p>
                </Link>
              ))}
            </div>
          </div>
        : null}
      </div>
    </SellerShell>
  );
}
