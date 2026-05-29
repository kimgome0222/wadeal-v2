import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { SellerProductEditForm } from "@/components/seller-product-edit-form";
import { SellerShell } from "@/components/seller-shell";
import { getSellerAccessContext } from "@/lib/auth/seller-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { getSellerProductEditDetail } from "@/lib/data/seller-products";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

type SellerProductEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function SellerProductEditPage({ params }: SellerProductEditPageProps) {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/login?next=/seller/products");
  }

  const { seller, isApproved } = await getSellerAccessContext(user);
  if (!seller || !isApproved) {
    redirect("/seller/apply");
  }

  const { id } = await params;
  const product = await getSellerProductEditDetail(user.id, id);
  if (!product) {
    notFound();
  }

  return (
    <SellerShell title="상품 수정">
      <div className="space-y-4">
        <Link className="text-xs font-black text-wadeal-red" href="/seller/products">
          ← 상품 목록
        </Link>
        <div className={`${ui.panel}`}>
          <SellerProductEditForm product={product} />
        </div>
      </div>
    </SellerShell>
  );
}
