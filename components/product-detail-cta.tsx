import Link from "next/link";
import { AddToJoinCartButton } from "@/components/add-to-join-cart-button";
import { ProductShareButton } from "@/components/product-share-button";
import type { Deal } from "@/lib/deals";
import { currency, getDealDiscount, isDealClosed, isDealSoldOut } from "@/lib/deals";
import type { ShareMessageContent } from "@/lib/share/types";
import { ui } from "@/lib/ui";

type ProductDetailCTAProps = {
  deal: Deal;
  shareContent: ShareMessageContent;
  referralCode: string | null;
};

export function ProductDetailCTA({
  deal,
  shareContent,
  referralCode,
}: ProductDetailCTAProps) {
  const discount = getDealDiscount(deal);
  const closed = isDealClosed(deal);
  const soldOut = isDealSoldOut(deal);
  const unavailable = closed || soldOut;

  return (
    <div className={`${ui.stickyFooter} flex items-center gap-2`}>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold text-wadeal-muted">공동구매가</p>
        <p className="flex items-baseline gap-1.5">
          <span className="text-base font-black text-wadeal-red">{discount}%</span>
          <span className="truncate text-lg font-black text-wadeal-ink">
            {currency.format(deal.groupPrice)}원
          </span>
        </p>
      </div>
      {unavailable ?
        <span className="flex h-12 min-w-[9.5rem] shrink-0 cursor-not-allowed items-center justify-center rounded-lg bg-gray-200 px-5 text-[15px] font-black text-wadeal-muted">
          {soldOut && !closed ? "품절" : "마감됨"}
        </span>
      : <>
          <AddToJoinCartButton dealSlug={deal.slug} />
          <Link
            className="flex h-12 min-w-[7rem] shrink-0 cursor-pointer items-center justify-center rounded-lg bg-wadeal-red px-2.5 text-[12px] font-black text-white active:opacity-90"
            href={`/join/${deal.slug}`}
          >
            바로 참여하기
          </Link>
        </>}
      <ProductShareButton
        productSlug={deal.slug}
        referralCode={referralCode}
        shareContent={shareContent}
      />
      <Link
        aria-label="가격 알림 설정"
        className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-wadeal-line bg-white text-wadeal-muted active:bg-gray-50"
        href={`/alert/${deal.slug}`}
      >
        <svg aria-hidden className="h-5 w-5" fill="none" viewBox="0 0 20 20">
          <path
            d="M10 3a4 4 0 00-4 4v2.5l-1.2 2.4A1 1 0 005.6 13h8.8a1 1 0 00.8-1.1L14 9.5V7a4 4 0 00-4-4z"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="1.4"
          />
          <path
            d="M8.5 14a1.5 1.5 0 003 0"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.4"
          />
        </svg>
      </Link>
    </div>
  );
}
