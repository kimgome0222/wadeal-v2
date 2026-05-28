import { redirect } from "next/navigation";

import { SellerProductComplianceNotice } from "@/components/seller-product-compliance-notice";
import { SellerProductsContent } from "@/components/seller-products-content";
import { SellerShell } from "@/components/seller-shell";
import { getSellerAccessContext } from "@/lib/auth/seller-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getSellerProducts } from "@/lib/data/seller-products";

export const dynamic = "force-dynamic";

export default async function SellerProductsPage() {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/login?next=/seller/products");
  }

  const { seller, isApproved } = await getSellerAccessContext(user);

  if (!seller || !isApproved) {
    redirect("/seller/apply");
  }

  const products = await getSellerProducts(user.id);

  return (
    <SellerShell title="상품 관리">
      <div className="space-y-4">
        <SellerProductComplianceNotice />
        <SellerProductsContent products={products} />
      </div>
    </SellerShell>
  );
}
