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

function statusTone(status: string) {
  if (status === "오늘 마감") {
    return "text-wadeal-red";
  }

  return "text-wadeal-ink";
}

export function SavedProductCard({ item }: SavedProductCardProps) {
  return (
    <Link
      className="block cursor-pointer rounded-xl border border-wadeal-line bg-white p-4 shadow-card transition-all duration-200 active:scale-[0.99] active:opacity-90"
      href={`/product/${item.slug}`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-black text-wadeal-ink">{item.productName}</p>
        <span className={`shrink-0 text-xs font-black ${statusTone(item.status)}`}>
          {item.status}
        </span>
      </div>
      <dl className="mt-3 space-y-1.5 text-xs font-bold text-wadeal-muted">
        <div className="flex justify-between gap-3">
          <dt>현재가</dt>
          <dd className="font-black text-gray-400 line-through">
            {currency.format(item.currentPrice)}원
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>공동구매가</dt>
          <dd className="font-black text-wadeal-red">
            {currency.format(item.groupPrice)}원
          </dd>
        </div>
      </dl>
    </Link>
  );
}

export function SavedProductsEmptyState() {
  return (
    <EmptyState
      actionHref="/"
      actionLabel="상품 둘러보기"
      description="마음에 드는 공동구매를 찜해 보세요."
      title="아직 찜한 상품이 없어요."
    />
  );
}
