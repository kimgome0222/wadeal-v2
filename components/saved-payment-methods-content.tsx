"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import {
  deactivateSavedPaymentMethodAction,
  setDefaultSavedPaymentMethodAction,
} from "@/app/actions/saved-payment-methods";
import type { SavedPaymentMethodSummary } from "@/lib/data/saved-payment-methods";
import { ui } from "@/lib/ui";

type SavedPaymentMethodsContentProps = {
  methods: SavedPaymentMethodSummary[];
  paymentNewHref: string;
};

export function SavedPaymentMethodsContent({
  methods,
  paymentNewHref,
}: SavedPaymentMethodsContentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSetDefault(methodId: string) {
    startTransition(async () => {
      await setDefaultSavedPaymentMethodAction(methodId);
      router.refresh();
    });
  }

  function handleDeactivate(methodId: string) {
    startTransition(async () => {
      await deactivateSavedPaymentMethodAction(methodId);
      router.refresh();
    });
  }

  const activeMethods = methods.filter((method) => method.status === "active");

  return (
    <div className="space-y-3">
      <p className="text-xs font-bold text-wadeal-muted">등록된 카드</p>

      {activeMethods.length === 0 ?
        <article className="rounded-xl border border-wadeal-line bg-white p-4">
          <p className="text-xs font-bold text-wadeal-muted">
            등록된 카드가 없어요. 자동결제 예약에 사용할 카드를 등록해 주세요.
          </p>
        </article>
      : activeMethods.map((method) => (
          <article className="rounded-xl border border-wadeal-line bg-white p-4" key={method.id}>
            {method.isDefault ?
              <span className="inline-block rounded bg-[#F5F8F4] px-2 py-0.5 text-[11px] font-black text-wadeal-red">
                기본 결제수단
              </span>
            : null}
            <dl className="mt-3 space-y-1.5 text-xs font-bold text-wadeal-muted">
              <div className="flex justify-between gap-3">
                <dt>카드사</dt>
                <dd className="font-black text-wadeal-ink">
                  {method.cardCompany ?? "등록 카드"}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>카드번호</dt>
                <dd className="font-black tracking-wider text-wadeal-ink">
                  **** **** **** {method.cardLast4}
                </dd>
              </div>
            </dl>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {!method.isDefault ?
                <button
                  className={`${ui.btnOutline} h-10 text-xs`}
                  disabled={isPending}
                  onClick={() => handleSetDefault(method.id)}
                  type="button"
                >
                  기본으로 설정
                </button>
              : <span />}
              <button
                className={`${ui.btnOutline} h-10 text-xs text-wadeal-red`}
                disabled={isPending}
                onClick={() => handleDeactivate(method.id)}
                type="button"
              >
                삭제
              </button>
            </div>
          </article>
        ))
      }

      <a className={`${ui.btnOutline} block w-full cursor-pointer text-center`} href={paymentNewHref}>
        새 카드 등록
      </a>
    </div>
  );
}
