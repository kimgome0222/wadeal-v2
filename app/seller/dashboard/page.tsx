import Link from "next/link";

import { SellerShell } from "@/components/seller-shell";
import { getSellerAccessContext } from "@/lib/auth/seller-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getSellerDashboardStats } from "@/lib/data/seller-analytics";
import { getRecentPublishedSellerNotices } from "@/lib/data/seller-notices";
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

  return (
    <SellerShell title="대시보드">
      <div className="space-y-4">
        <div className={`${ui.panel} space-y-2`}>
          <p className="text-sm font-black text-wadeal-ink">판매자 센터</p>
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
