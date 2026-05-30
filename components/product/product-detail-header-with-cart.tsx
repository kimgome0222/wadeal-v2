"use client";

import { ProductDetailHeader } from "@/components/product/product-detail-header";
import { useGuestJoinCartCount } from "@/lib/join-cart/use-guest-join-cart-count";

type ProductDetailHeaderWithCartProps = {
  backHref?: string;
  serverCartCount?: number;
};

export function ProductDetailHeaderWithCart({
  backHref = "back",
  serverCartCount = 0,
}: ProductDetailHeaderWithCartProps) {
  const guestCartCount = useGuestJoinCartCount();

  return (
    <ProductDetailHeader
      backHref={backHref}
      cartCount={serverCartCount + guestCartCount}
    />
  );
}
