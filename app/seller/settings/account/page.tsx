import Link from "next/link";

import { SellerBankAccountForm } from "@/components/seller-bank-account-form";
import { SellerShell } from "@/components/seller-shell";
import { getSellerAccessContext } from "@/lib/auth/seller-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function SellerSettingsAccountPage() {
  const user = await getServerAuthUser();
  const { seller } = await getSellerAccessContext(user);

  return (
    <SellerShell title="정산 계좌">
      <div className="mx-auto max-w-xl space-y-4">
        <div className="flex gap-2">
          <Link className={`${ui.btnOutline} h-9 px-3 text-xs`} href="/seller/settings">
            판매자 신청 정보
          </Link>
          <Link
            className={`${ui.btnOutline} h-9 border-wadeal-red px-3 text-xs text-wadeal-red`}
            href="/seller/settings/account"
          >
            정산 계좌
          </Link>
        </div>
        <SellerBankAccountForm seller={seller} />
      </div>
    </SellerShell>
  );
}
