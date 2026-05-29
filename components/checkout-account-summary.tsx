"use client";

import Link from "next/link";
import type { SavedAddressData, SavedPaymentData } from "@/lib/mock-storage";
import { ui } from "@/lib/ui";

type CheckoutAccountSummaryProps = {
  addressHref: string;
  paymentHref: string;
  address: SavedAddressData;
  payment: SavedPaymentData;
  missingAddress?: boolean;
  missingPayment?: boolean;
  showAddress?: boolean;
};

export function CheckoutAccountSummary({
  addressHref,
  paymentHref,
  address,
  payment,
  missingAddress = false,
  missingPayment = false,
  showAddress = true,
}: CheckoutAccountSummaryProps) {
  return (
    <>
      {showAddress ?
      <article className="rounded-xl border border-wadeal-line bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className={ui.sectionTitle}>배송지</h2>
          <Link
            className="cursor-pointer text-xs font-black text-wadeal-red active:opacity-80"
            href={addressHref}
          >
            {missingAddress ? "배송지 등록" : "배송지 변경"}
          </Link>
        </div>
        {missingAddress ?
          <p className="mt-3 text-xs font-bold text-wadeal-red">
            구매 전 배송지를 등록해 주세요.
          </p>
        : <dl className="mt-3 space-y-1.5 text-xs font-bold text-wadeal-muted">
            <div className="flex justify-between gap-3">
              <dt>이름</dt>
              <dd className="font-black text-wadeal-ink">{address.name}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>연락처</dt>
              <dd className="font-black text-wadeal-ink">{address.phone}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>주소</dt>
              <dd className="text-right font-black text-wadeal-ink">{address.addressLine}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>상세주소</dt>
              <dd className="font-black text-wadeal-ink">{address.addressDetail}</dd>
            </div>
          </dl>
        }
      </article>
      : null}

      <article className="rounded-xl border border-wadeal-line bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className={ui.sectionTitle}>결제수단</h2>
          <Link
            className="cursor-pointer text-xs font-black text-wadeal-red active:opacity-80"
            href={paymentHref}
          >
            {missingPayment ? "결제수단 등록" : "결제수단 변경"}
          </Link>
        </div>
        {missingPayment ?
          <p className="mt-3 text-xs font-bold text-wadeal-red">
            구매 전 결제수단을 등록해 주세요.
          </p>
        : <dl className="mt-3 space-y-1.5 text-xs font-bold text-wadeal-muted">
            <div className="flex justify-between gap-3">
              <dt>카드명</dt>
              <dd className="font-black text-wadeal-ink">{payment.cardName}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>카드번호</dt>
              <dd className="font-black tracking-wider text-wadeal-ink">
                {payment.cardNumberMasked}
              </dd>
            </div>
          </dl>
        }
      </article>
    </>
  );
}
