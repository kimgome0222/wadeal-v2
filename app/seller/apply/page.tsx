import { redirect } from "next/navigation";

import { SellerApplicationForm } from "@/components/seller-application-form";
import { SellerShell } from "@/components/seller-shell";
import { getSellerAccessContext } from "@/lib/auth/seller-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { isSellerApproved } from "@/lib/sellers/types";

export const dynamic = "force-dynamic";

export default async function SellerApplyPage() {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/login?next=/seller/apply");
  }

  const { seller } = await getSellerAccessContext(user);

  if (seller && isSellerApproved(seller.status)) {
    redirect("/seller/dashboard");
  }

  return (
    <SellerShell title="판매자 신청">
      <div className="mx-auto max-w-xl space-y-4">
        <p className="text-xs font-bold text-wadeal-muted">
          상품 등록과 정산 관리를 이용하려면 사업자 정보를 먼저 등록해주세요. 관리자 검토 후 판매자
          센터 기능을 이용할 수 있어요.
        </p>
        <SellerApplicationForm existing={seller} />
      </div>
    </SellerShell>
  );
}
