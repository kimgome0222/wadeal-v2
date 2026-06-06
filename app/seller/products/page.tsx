import Link from "next/link";
import { redirect } from "next/navigation";

import { SellerBusinessInfoRequired } from "@/components/seller-business-info-required";
import { SellerProductComplianceNotice } from "@/components/seller-product-compliance-notice";
import { SellerProductsContent } from "@/components/seller-products-content";
import { SellerShell } from "@/components/seller-shell";
import { getSellerAccessContext } from "@/lib/auth/seller-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getSellerProducts } from "@/lib/data/seller-products";
import { getSellerSetupStatus } from "@/lib/sellers/setup-status";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function SellerProductsPage() {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/login?next=/seller/products");
  }

  const { seller, isApproved } = await getSellerAccessContext(user);

  if (!seller) {
    redirect("/seller/apply");
  }

  const setup = getSellerSetupStatus(seller);
  const products = isApproved && setup.canRegisterProducts ? await getSellerProducts(user.id) : [];

  return (
    <SellerShell title="상품 관리">
      <div className="space-y-4">
        {!isApproved || !setup.canRegisterProducts ?
          <SellerBusinessInfoRequired />
        : <>
            <div className="flex flex-wrap gap-2">
              <Link className={`${ui.btnPrimary} inline-flex h-10 items-center px-4 text-xs`} href="/seller/products/new">
                + 상품 등록 요청
              </Link>
              <Link className={`${ui.btnOutline} inline-flex h-10 items-center px-4 text-xs`} href="/seller/product-requests">
                요청 내역
              </Link>
            </div>
            <SellerProductComplianceNotice />
            <SellerProductsContent products={products} />
          </>
        }
      </div>
    </SellerShell>
  );
}
