import Link from "next/link";
import type { ReactNode } from "react";

import { SellerSidebar } from "@/components/seller-sidebar";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getUnreadCountForSeller } from "@/lib/data/seller-notifications";
import { getSellerByUserId } from "@/lib/data/sellers";
import { getSellerStatusLabel, type SellerStatus } from "@/lib/sellers/types";
import { ui } from "@/lib/ui";

type SellerShellProps = {
  children: ReactNode;
  title: string;
};

export async function SellerShell({ children, title }: SellerShellProps) {
  const user = await getServerAuthUser();
  let notificationUnreadCount = 0;
  if (user) {
    const seller = await getSellerByUserId(user.id);
    if (seller) {
      notificationUnreadCount = await getUnreadCountForSeller(seller.id);
    }
  }

  return (
    <div className="mx-auto min-h-screen max-w-5xl bg-gray-50">
      <header className="flex items-center justify-between border-b border-wadeal-line bg-white px-4 py-3 sm:hidden">
        <p className="text-sm font-black text-wadeal-ink">{title}</p>
        <Link className="text-xs font-black text-wadeal-red" href="/">
          쇼핑몰
        </Link>
      </header>
      <div className="flex min-h-[calc(100vh-3rem)] sm:min-h-screen">
        <SellerSidebar notificationUnreadCount={notificationUnreadCount} />
        <div className="min-w-0 flex-1">
          <div className="hidden border-b border-wadeal-line bg-white px-6 py-4 sm:block">
            <h1 className="text-lg font-black text-wadeal-ink">{title}</h1>
          </div>
          <div className="p-4 sm:p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

type SellerPendingScreenProps = {
  status: SellerStatus;
};

export function SellerPendingScreen({ status }: SellerPendingScreenProps) {
  const isRejected = status === "rejected";
  const isSuspended = status === "suspended";

  return (
    <div className="mx-auto flex min-h-screen max-w-lg items-center px-4 py-10">
      <div className={`${ui.panel} w-full space-y-4 text-center`}>
        <p className="text-base font-black text-wadeal-ink">
          {isRejected ?
            "판매자 신청이 반려되었어요"
          : isSuspended ?
            "판매자 계정이 정지되었어요"
          : "관리자 승인 대기 중입니다"}
        </p>
        <p className="text-xs font-bold leading-relaxed text-wadeal-muted">
          {isRejected ?
            "반려 사유 확인 후 설정에서 정보를 수정해 다시 신청해 주세요."
          : isSuspended ?
            "문의가 필요하면 고객센터로 연락해 주세요."
          : "승인 완료 후 상품 관리, 주문/배송, 정산 기능을 이용할 수 있어요."}
        </p>
        <p className="text-[11px] font-bold text-wadeal-muted">
          현재 상태: {getSellerStatusLabel(status)}
        </p>
        <div className="grid gap-2">
          <Link className={`${ui.btnPrimary} h-11`} href="/seller/settings">
            {isRejected ? "신청 정보 수정" : "신청 상태 확인"}
          </Link>
          <Link className={`${ui.btnOutline} h-11`} href="/">
            쇼핑몰로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}

type SellerPlaceholderPanelProps = {
  title: string;
  description: string;
};

export function SellerPlaceholderPanel({ title, description }: SellerPlaceholderPanelProps) {
  return (
    <div className={`${ui.panel} space-y-2`}>
      <p className="text-sm font-black text-wadeal-ink">{title}</p>
      <p className="text-xs font-bold leading-relaxed text-wadeal-muted">{description}</p>
    </div>
  );
}
