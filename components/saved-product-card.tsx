import Link from "next/link";

import { EmptyState } from "@/components/empty-state";
import { currency } from "@/lib/deals";

export type SavedProductCardItem = {
  id: string;
  slug: string;
  productName: string;
  currentPrice: number;
  groupPrice: number;
  status: string;
};

type SavedProductCardProps = {
  item: SavedProductCardItem;
};

function getDiscountPercent(original: number, price: number): number {
  if (original <= price) {
    return 0;
  }
  return Math.round(((original - price) / original) * 100);
}

export function SavedProductCard({ item }: SavedProductCardProps) {
  const discount = getDiscountPercent(item.currentPrice, item.groupPrice);

  return (
    <Link
      className="block min-w-0 cursor-pointer overflow-visible py-3 transition-opacity active:opacity-80"
      href={`/product/${item.slug}`}
    >
      <p className="line-clamp-2 text-[15px] font-semibold leading-[1.45] text-[#111111]">
        {item.productName}
      </p>
      <div className="mt-2 flex min-w-0 flex-wrap items-baseline gap-x-1.5 leading-[1.5]">
        {discount > 0 ?
          <span className="shrink-0 text-[18px] font-bold tabular-nums text-[#E28A3B]">
            {discount}%
          </span>
        : null}
        <span className="text-[18px] font-bold tabular-nums text-[#111111]">
          {currency.format(item.groupPrice)}원
        </span>
      </div>
      {item.currentPrice > item.groupPrice ?
        <p className="mt-1 text-[12px] text-[#666666] line-through">
          {currency.format(item.currentPrice)}원
        </p>
      : null}
    </Link>
  );
}

export function SavedProductsEmptyState({ className }: { className?: string }) {
  return (
    <EmptyState
      actionHref="/"
      actionLabel="상품 둘러보기"
      className={className}
      description="마음에 드는 상품을 찜해 보세요."
      title="아직 찜한 상품이 없어요."
    />
  );
}
