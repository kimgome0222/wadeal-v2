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
          판매자 정보와 정산 계좌를 등록·수정할 수 있어요. 상품 등록과 정산 관리를 이용하려면 사업자
          정보를 먼저 등록해주세요.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            className={`${ui.btnOutline} h-9 border-wadeal-red px-3 text-xs text-wadeal-red`}
            href="/seller/settings"
          >
            판매자 신청 정보
          </Link>
          <Link className={`${ui.btnOutline} h-9 px-3 text-xs`} href="/seller/settings/account">
            정산 계좌
          </Link>
          <Link className={`${ui.btnOutline} h-9 px-3 text-xs`} href="/seller/notices">
            공지·정책
          </Link>
        </div>
        <SellerApplicationForm existing={seller} />
      </div>
    </SellerShell>
  );
}
