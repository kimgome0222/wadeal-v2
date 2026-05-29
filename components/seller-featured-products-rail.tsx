"use client";

import Image from "next/image";
import Link from "next/link";

import { currency } from "@/lib/deals";
import type { Deal } from "@/lib/deals";
import { getProductDetailHref } from "@/lib/deals/card-display";
import { ds } from "@/lib/design-system";
import type { SellerFeaturedProduct } from "@/lib/sellers/seller-detail-mock";
import { getTierProgress } from "@/lib/pricing/tiers";

type SellerFeaturedProductsRailProps = {
  products: SellerFeaturedProduct[];
  title?: string;
  onNavigate?: () => void;
  minItems?: number;
  maxItems?: number;
  dealBySlug?: Map<string, Deal>;
};

export function SellerFeaturedProductsRail({
  products,
  title = "대표 상품",
  onNavigate,
  minItems = 3,
  maxItems = 6,
  dealBySlug,
}: SellerFeaturedProductsRailProps) {
  const items = products.slice(0, maxItems);

  if (items.length === 0) {
    return null;
  }

  const hrefFor = (product: SellerFeaturedProduct) =>
    getProductDetailHref({ id: product.id, slug: product.slug });

  const useCarousel = items.length > minItems;

  const cardClass =
    "group block overflow-hidden rounded-xl border border-[#DDE8E2] bg-white transition-all duration-200 ease-smooth hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(31,42,36,0.06)]";

  function renderPrice(product: SellerFeaturedProduct) {
    const deal = dealBySlug?.get(product.slug);
    if (deal) {
      const { applicablePrice } = getTierProgress(deal);
      return currency.format(applicablePrice);
    }
    return currency.format(product.groupPrice);
  }

  return (
    <div className="space-y-3">
      {title ?
        <h2 className={`${ds.type.h2} font-semibold`}>{title}</h2>
      : null}

      {useCarousel ?
        <div className="celloh-rail-scroll no-scrollbar -mx-1 flex snap-x snap-mandatory gap-2 overflow-x-auto px-1 pb-1 sm:grid sm:grid-cols-3 sm:gap-2.5 sm:overflow-visible sm:pb-0">
          {items.map((product) => (
            <Link
              className={`${cardClass} w-[42%] shrink-0 snap-start sm:w-auto`}
              href={hrefFor(product)}
              key={product.slug}
              onClick={onNavigate}
            >
              <div className="relative aspect-[3/4] bg-[#F8FAF8]">
                <Image
                  alt={product.title}
                  className="object-cover transition-transform duration-300 ease-smooth group-hover:scale-[1.02]"
                  fill
                  sizes="(min-width: 640px) 33vw, 42vw"
                  src={product.imageUrl}
                />
              </div>
              <div className="space-y-0.5 p-2">
                <p className={`${ds.type.caption} line-clamp-2 font-medium leading-snug text-wadeal-ink`}>
                  {product.title}
                </p>
                <p className={`${ds.type.caption} font-medium tabular-nums text-wadeal-ink`}>
                  {renderPrice(product)}원
                </p>
              </div>
            </Link>
          ))}
        </div>
      : <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2.5">
          {items.map((product) => (
            <li key={product.slug}>
              <Link className={cardClass} href={hrefFor(product)} onClick={onNavigate}>
                <div className="relative aspect-[3/4] bg-[#F8FAF8]">
                  <Image
                    alt={product.title}
                    className="object-cover transition-transform duration-300 ease-smooth group-hover:scale-[1.02]"
                    fill
                    sizes="(min-width: 640px) 33vw, 50vw"
                    src={product.imageUrl}
                  />
                </div>
                <div className="space-y-0.5 p-2">
                  <p className={`${ds.type.caption} line-clamp-2 font-medium leading-snug text-wadeal-ink`}>
                    {product.title}
                  </p>
                  <p className={`${ds.type.caption} font-medium tabular-nums text-wadeal-ink`}>
                    {renderPrice(product)}원
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      }
    </div>
  );
}
