"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  clearCellohPayOrderResult,
  readCellohPayOrderResult,
} from "@/lib/celloh-pay/celloh-pay-store";
import type { CellohPayOrderResult } from "@/lib/celloh-pay/types";
import { currency } from "@/lib/deals";
import { ui } from "@/lib/ui";

/** 셀로페이 mock 주문완료 화면 */
export function CellohPaySuccessContent() {
  const router = useRouter();
  const [order, setOrder] = useState<CellohPayOrderResult | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const result = readCellohPayOrderResult();
    setOrder(result);
    setReady(true);
    if (result) {
      clearCellohPayOrderResult();
    }
  }, []);

  if (!ready) {
    return (
      <div className="py-20 text-center text-[14px] text-[#666666]">주문 정보를 불러오는 중...</div>
    );
  }

  if (!order) {
    return (
      <div className={`${ui.pageBody} space-y-6 py-12 text-center`}>
        <p className="text-[15px] text-[#666666]">주문 정보를 찾을 수 없어요.</p>
        <Link className={`${ui.btnPrimary} inline-flex h-14 items-center px-8`} href="/">
          홈으로
        </Link>
      </div>
    );
  }

  return (
    <div className={`${ui.pageBody} space-y-8 pb-12 pt-6`}>
      <div className="text-center">
        <div
          aria-hidden
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F5F7F6] text-[28px] text-[#2E5E4E]"
        >
          ✓
        </div>
        <h1 className="mt-5 text-[24px] font-bold text-[#111111]">주문이 완료되었어요</h1>
        <p className="mt-2 text-[14px] text-[#666666]">{order.productName}</p>
      </div>

      <article className="space-y-4 rounded-[20px] border border-[#E8ECEA] bg-white p-5">
        <dl className="space-y-3 text-[14px]">
          <div className="flex justify-between gap-3">
            <dt className="text-[#666666]">주문번호</dt>
            <dd className="font-semibold text-[#111111]">{order.orderNumber}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-[#666666]">결제금액</dt>
            <dd className="font-bold tabular-nums text-[#111111]">
              {currency.format(order.amount)}원
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="shrink-0 text-[#666666]">배송지</dt>
            <dd className="text-right font-medium text-[#111111]">{order.addressSummary}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-[#666666]">결제수단</dt>
            <dd className="font-medium text-[#111111]">{order.paymentLabel}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-[#666666]">예상 도착일</dt>
            <dd className="font-medium text-[#111111]">{order.estimatedDelivery}</dd>
          </div>
        </dl>
      </article>

      <div className="space-y-3">
        <Link
          className={`${ui.btnPrimary} flex h-14 items-center justify-center rounded-2xl text-[16px] font-bold`}
          href="/mypage/orders"
        >
          주문내역 보기
        </Link>
        <button
          className={`${ui.btnOutline} flex h-14 w-full cursor-pointer items-center justify-center rounded-2xl text-[16px] font-bold`}
          onClick={() => router.push("/")}
          type="button"
        >
          계속 쇼핑하기
        </button>
      </div>
    </div>
  );
}
