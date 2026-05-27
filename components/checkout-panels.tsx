"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  WADEAL_ADDRESS_SAVED,
  WADEAL_PAYMENT_SAVED,
} from "@/lib/mock-storage";
import { ui } from "@/lib/ui";

type CheckoutPanelsProps = {
  dealSlug: string;
};

function readSaved(key: string) {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(key) === "1";
}

export function CheckoutPanels({ dealSlug }: CheckoutPanelsProps) {
  const [addressSaved, setAddressSaved] = useState(false);
  const [paymentSaved, setPaymentSaved] = useState(false);

  const checkoutPath = `/checkout/${dealSlug}`;
  const addressHref = `/mypage/address/new?return=${encodeURIComponent(checkoutPath)}`;
  const paymentHref = `/mypage/payment/new?return=${encodeURIComponent(checkoutPath)}`;

  useEffect(() => {
    function sync() {
      setAddressSaved(readSaved(WADEAL_ADDRESS_SAVED));
      setPaymentSaved(readSaved(WADEAL_PAYMENT_SAVED));
    }
    sync();
    window.addEventListener("focus", sync);
    return () => window.removeEventListener("focus", sync);
  }, []);

  return (
    <>
      <Link className={ui.panelClickable} href={addressHref}>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-wadeal-ink">배송지</h2>
          <span className="text-xs font-bold text-wadeal-red">
            {addressSaved ? "변경" : "등록"}
          </span>
        </div>
        {addressSaved ?
          <>
            <p className="mt-2 text-sm font-extrabold text-wadeal-ink">김가나</p>
            <p className="mt-0.5 text-[13px] font-bold text-wadeal-muted">
              서울 강남구 테헤란로 123, 1004호 · 010-1234-5678
            </p>
          </>
        : <p className="mt-2 text-sm font-extrabold text-wadeal-muted">
            배송지를 등록해주세요
          </p>
        }
      </Link>

      <Link className={ui.panelClickable} href={paymentHref}>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-wadeal-ink">결제수단</h2>
          <span className="text-xs font-bold text-wadeal-red">
            {paymentSaved ? "변경" : "등록"}
          </span>
        </div>
        {paymentSaved ?
          <p className="mt-2 text-sm font-extrabold text-wadeal-ink">
            신한카드 **** 4242
          </p>
        : <p className="mt-2 text-sm font-extrabold text-wadeal-muted">
            결제수단을 등록해주세요
          </p>
        }
      </Link>
    </>
  );
}
