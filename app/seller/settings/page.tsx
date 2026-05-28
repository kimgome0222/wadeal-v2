import Link from "next/link";

import { SellerApplicationForm } from "@/components/seller-application-form";
import { SellerShell } from "@/components/seller-shell";
import { getSellerAccessContext } from "@/lib/auth/seller-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function SellerSettingsPage() {
  const user = await getServerAuthUser();
  const { seller } = await getSellerAccessContext(user);

  return (
    <SellerShell title="설정">
      <div className="mx-auto max-w-xl space-y-4">
        <p className="text-xs font-bold text-wadeal-muted">
          판매자 정보와 정산 계좌를 등록·수정할 수 있어요. 신청 후 관리자 승인이 필요합니다.
        </p>
        <div className="flex gap-2">
          <Link
            className={`${ui.btnOutline} h-9 border-wadeal-red px-3 text-xs text-wadeal-red`}
            href="/seller/settings"
          >
            판매자 신청 정보
          </Link>
          <Link className={`${ui.btnOutline} h-9 px-3 text-xs`} href="/seller/settings/account">
            정산 계좌
          </Link>
        </div>
        <SellerApplicationForm existing={seller} />
      </div>
    </SellerShell>
  );
}
