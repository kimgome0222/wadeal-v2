"use client";

import Image from "next/image";
import Link from "next/link";

import { currency } from "@/lib/deals";
import type { SellerFeaturedProduct } from "@/lib/sellers/seller-detail-mock";
import { ui } from "@/lib/ui";

type SellerFeaturedProductsRailProps = {
  products: SellerFeaturedProduct[];
  title?: string;
  onNavigate?: () => void;
  minItems?: number;
  maxItems?: number;
};

export function SellerFeaturedProductsRail({
  products,
  title = "대표 상품",
  onNavigate,
  minItems = 3,
  maxItems = 6,
}: SellerFeaturedProductsRailProps) {
  const items = products.slice(0, maxItems);

  if (items.length === 0) {
    return null;
  }

  const useGrid = items.length <= minItems;

  return (
    <div className="space-y-2.5">
      {title ?
        <p className="text-[11px] font-bold text-wadeal-muted">{title}</p>
      : null}
      {useGrid ?
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {items.map((product) => (
            <li key={product.slug}>
              <Link
                className={`${ui.cardInteractive} block overflow-hidden`}
                href={`/product/${product.slug}`}
                onClick={onNavigate}
              >
                <div className="relative aspect-square bg-gray-50">
                  <Image
                    alt={product.title}
                    className="object-cover transition-transform duration-300 ease-smooth group-hover:scale-[1.02]"
                    fill
                    sizes="120px"
                    src={product.imageUrl}
                  />
                </div>
                <div className="p-2">
                  <p className="line-clamp-2 text-[10px] font-bold leading-snug text-wadeal-ink">
                    {product.title}
                  </p>
                  <p className="mt-1 text-[11px] font-black text-wadeal-red">
                    {currency.format(product.groupPrice)}원
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      : <div className="celloh-rail-scroll no-scrollbar -mx-1 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-1 pb-1">
          {items.map((product) => (
            <Link
              className="group block w-[118px] shrink-0 snap-start sm:w-[128px]"
              href={`/product/${product.slug}`}
              key={product.slug}
              onClick={onNavigate}
            >
              <article className={`${ui.cardInteractive} overflow-hidden`}>
                <div className="relative aspect-square bg-gray-50">
                  <Image
                    alt={product.title}
                    className="object-cover transition-transform duration-300 ease-smooth group-hover:scale-[1.02]"
                    fill
                    sizes="128px"
                    src={product.imageUrl}
                  />
                </div>
                <div className="p-2">
                  <p className="line-clamp-2 text-[10px] font-bold leading-snug text-wadeal-ink">
                    {product.title}
                  </p>
                  <p className="mt-1 text-[11px] font-black text-wadeal-red">
                    {currency.format(product.groupPrice)}원
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      }
    </div>
  );
}
