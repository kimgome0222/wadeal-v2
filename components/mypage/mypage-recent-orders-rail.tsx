"use client";

import Image from "next/image";
import Link from "next/link";

import type { MypageRecentOrderItem } from "@/lib/mypage/hub-data";
import { currency } from "@/lib/deals";
import { ui } from "@/lib/ui";

type MypageRecentOrdersRailProps = {
  orders: MypageRecentOrderItem[];
};

export function MypageRecentOrdersRail({ orders }: MypageRecentOrdersRailProps) {
  if (orders.length === 0) {
    return (
      <section className="space-y-4 px-6 pt-10">
        <h2 className="text-[20px] font-bold text-[#111111]">최근 주문</h2>
        <p className="rounded-[20px] bg-[#F5F7F6] py-8 text-center text-[14px] text-[#666666]">
          아직 주문 내역이 없어요.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-4 pt-10">
      <div className="flex items-end justify-between gap-3 px-6">
        <h2 className="text-[20px] font-bold text-[#111111]">최근 주문</h2>
        <Link className="text-[13px] font-medium text-[#666666]" href="/mypage/orders">
          더보기
        </Link>
      </div>
      <div className="no-scrollbar flex gap-3 overflow-x-auto px-6 pb-0.5">
        {orders.map((order) => (
          <article
            className="flex w-[140px] shrink-0 flex-col gap-2"
            key={order.id}
          >
            <Link
              className="relative aspect-square overflow-hidden rounded-[16px] bg-[#F5F7F6]"
              href={`/product/${order.productSlug}`}
            >
              {order.imageUrl ?
                <Image
                  alt={order.productName}
                  className="object-cover"
                  fill
                  sizes="140px"
                  src={order.imageUrl}
                />
              : null}
            </Link>
            <Link className="line-clamp-2 text-[13px] font-medium leading-snug text-[#111111]" href={`/product/${order.productSlug}`}>
              {order.productName}
            </Link>
            <p className="text-[14px] font-bold tabular-nums text-[#111111]">
              {currency.format(order.price)}원
            </p>
            <Link
              className={`${ui.btnOutline} flex h-9 items-center justify-center rounded-xl text-[12px] font-semibold`}
              href={`/join/${order.productSlug}`}
            >
              장바구니
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
