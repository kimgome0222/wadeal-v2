"use client";

import Image from "next/image";
import Link from "next/link";

import { CartQuantityControl } from "@/components/cart/cart-quantity-control";
import { catalogDealFromRecommendation } from "@/lib/cart/catalog-from-recommendation";
import type { Deal } from "@/lib/deals";
import { getProductDetailHref } from "@/lib/deals/card-display";
import { currency } from "@/lib/deals";
import type { CartPreviewProduct } from "@/lib/mock/cart-preview-products";

const PLACEHOLDER = "/wadeal-wordmark.svg";

type CartPreviewGridCardProps = {
  product: CartPreviewProduct;
  deal?: Deal;
};

/** cart preview 4열 compact 카드 */
export function CartPreviewGridCard({ product, deal }: CartPreviewGridCardProps) {
  const href = deal ? getProductDetailHref(deal) : `/product/${product.id}`;

  return (
    <article className="relative min-w-0">
      <Link
        aria-label={`${product.name} 상세보기`}
        className="group block min-w-0 cursor-pointer"
        href={href}
      >
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#F5F7F6]">
          <Image
            alt=""
            className="object-cover"
            fill
            sizes="25vw"
            src={product.image || PLACEHOLDER}
          />
          {product.badgeLabel ?
            <span className="pointer-events-none absolute left-1 top-1 z-10 max-w-[85%] truncate rounded-md bg-[#2E5E4E] px-1 py-0.5 text-[9px] font-bold text-white">
              {product.badgeLabel}
            </span>
          : null}
        </div>
        <h3 className="mt-1.5 line-clamp-2 text-[11px] font-semibold leading-snug text-[#111111]">
          {product.name}
        </h3>
        <div className="mt-0.5">
          {product.discountRate ?
            <span className="mr-0.5 text-[12px] font-bold text-[#E28A3B]">
              {product.discountRate}%
            </span>
          : null}
          <span className="text-[13px] font-bold tabular-nums text-[#111111]">
            {currency.format(product.price)}원
          </span>
        </div>
      </Link>
      {deal ?
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-20 aspect-square overflow-visible"
        >
          <CartQuantityControl
            className="pointer-events-auto"
            deal={deal}
            openSheetOnFirstAdd={false}
            size="compact"
          />
        </div>
      : null}
    </article>
  );
}

export function CartPreviewGridCardFromCatalog({
  product,
  catalog,
}: {
  product: CartPreviewProduct;
  catalog: Deal[];
}) {
  const deal = catalog.find((item) => item.slug === product.slug);
  return <CartPreviewGridCard deal={deal} product={product} />;
}
