"use client";

import { ProductDetailHeader } from "@/components/product/product-detail-header";
import { useCartTotalCount } from "@/hooks/use-cart";

type ProductDetailHeaderWithCartProps = {
  backHref?: string;
  serverCartCount?: number;
};

export function ProductDetailHeaderWithCart({
  backHref = "back",
}: ProductDetailHeaderWithCartProps) {
  const cartCount = useCartTotalCount();

  return (
    <ProductDetailHeader
      backHref={backHref}
      cartCount={cartCount}
    />
  );
}
