import Link from "next/link";

import { SellerPlaceholderPanel, SellerShell } from "@/components/seller-shell";
import { getSellerAccessContext } from "@/lib/auth/seller-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getSellerStatusLabel } from "@/lib/sellers/types";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function SellerDashboardPage() {
  const user = await getServerAuthUser();
  const { seller, isApproved } = await getSellerAccessContext(user);

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
        <div className="grid gap-3 sm:grid-cols-2">
          <SellerPlaceholderPanel
            description="판매 중 상품 수, 진행 중 공동구매 수를 표시할 예정입니다."
            title="상품 현황"
          />
          <SellerPlaceholderPanel
            description="신규 주문, 배송 대기 건수를 표시할 예정입니다."
            title="주문/배송"
          />
          <SellerPlaceholderPanel
            description="정산 예정 금액과 지급 완료 내역을 표시할 예정입니다."
            title="정산"
          />
          <SellerPlaceholderPanel
            description="미답변 문의와 신규 리뷰를 표시할 예정입니다."
            title="C/S · 리뷰"
          />
        </div>
      </div>
    </SellerShell>
  );
}
