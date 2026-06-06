"use client";

import { CartPreviewGridCardFromCatalog } from "@/components/cart/cart-preview-grid-card";
import type { Deal } from "@/lib/deals";
import type { CartPreviewProduct } from "@/lib/mock/cart-preview-products";

type CartPreviewGridProps = {
  catalog: Deal[];
  products: CartPreviewProduct[];
  tabKey: string;
};

/** cart-preview 4열 compact grid */
export function CartPreviewGrid({ catalog, products, tabKey }: CartPreviewGridProps) {
  return (
    <div className="cart-preview-grid px-4 pt-4">
      {products.map((product) => (
        <CartPreviewGridCardFromCatalog
          catalog={catalog}
          key={`${tabKey}-${product.slug}`}
          product={product}
        />
      ))}
    </div>
  );
}
