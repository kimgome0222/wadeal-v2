import Link from "next/link";
import { redirect } from "next/navigation";

import { SellerBusinessInfoRequired } from "@/components/seller-business-info-required";
import { SellerProductRequestForm } from "@/components/seller-product-request-form";
import { SellerShell } from "@/components/seller-shell";
import { getSellerAccessContext } from "@/lib/auth/seller-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getCategories } from "@/lib/data/categories";
import { getSellerSetupStatus } from "@/lib/sellers/setup-status";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function SellerProductNewPage() {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/login?next=/seller/products/new");
  }

  const { seller, isApproved } = await getSellerAccessContext(user);
  if (!seller) {
    redirect("/seller/apply");
  }

  const setup = getSellerSetupStatus(seller);

  if (!isApproved || !setup.canRegisterProducts) {
    return (
      <SellerShell title="상품 등록 요청">
        <SellerBusinessInfoRequired />
      </SellerShell>
    );
  }

  const categories = await getCategories();

  return (
    <SellerShell title="상품 등록 요청">
      <div className="space-y-4">
        <div className={`${ui.panel} space-y-2`}>
          <p className="text-sm font-black text-wadeal-ink">새 상품 등록 요청</p>
          <p className="text-xs font-bold text-wadeal-muted">
            요청 후 관리자 검수를 거쳐 판매가 시작돼요. 반려 시 사유 확인 후 다시 요청할 수 있어요.
          </p>
        </div>
        <div className={`${ui.panel}`}>
          <SellerProductRequestForm categories={categories} />
        </div>
        <Link className="text-xs font-black text-wadeal-red" href="/seller/product-requests">
          등록 요청 내역 보기 →
        </Link>
      </div>
    </SellerShell>
  );
}
