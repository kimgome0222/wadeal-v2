"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  deleteAddressAction,
  setDefaultAddressAction,
} from "@/app/actions/addresses";
import type { UserAddress } from "@/lib/addresses/types";
import { ui } from "@/lib/ui";

type AddressesBookContentProps = {
  addresses: UserAddress[];
  newAddressHref: string;
};

export function AddressesBookContent({ addresses, newAddressHref }: AddressesBookContentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  function handleSetDefault(addressId: string) {
    startTransition(async () => {
      await setDefaultAddressAction(addressId);
      router.refresh();
    });
  }

  function handleDelete(addressId: string) {
    startTransition(async () => {
      await deleteAddressAction(addressId);
      setConfirmDeleteId(null);
      router.refresh();
    });
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-bold text-wadeal-muted">등록된 배송지</p>

      {addresses.length === 0 ?
        <article className="rounded-xl border border-wadeal-line bg-white p-4">
          <p className="text-xs font-bold text-wadeal-muted">
            등록된 배송지가 없어요. 배송지를 추가해 주세요.
          </p>
        </article>
      : addresses.map((address) => (
          <article className="rounded-xl border border-wadeal-line bg-white p-4" key={address.id}>
            {address.isDefault ?
              <span className="inline-block rounded bg-red-50 px-2 py-0.5 text-[11px] font-black text-wadeal-red">
                기본 배송지
              </span>
            : null}
            {address.isRemoteArea ?
              <span className="ml-1.5 inline-block rounded bg-gray-100 px-2 py-0.5 text-[10px] font-black text-wadeal-muted">
                도서산간
              </span>
            : null}
            <dl className="mt-3 space-y-1.5 text-xs font-bold text-wadeal-muted">
              <div className="flex justify-between gap-3">
                <dt>이름</dt>
                <dd className="font-black text-wadeal-ink">{address.recipientName}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>연락처</dt>
                <dd className="font-black text-wadeal-ink">{address.phone}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>우편번호</dt>
                <dd className="font-black text-wadeal-ink">{address.postalCode}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>주소</dt>
                <dd className="text-right font-black text-wadeal-ink">{address.addressLine1}</dd>
              </div>
              {address.addressLine2 ?
                <div className="flex justify-between gap-3">
                  <dt>상세주소</dt>
                  <dd className="font-black text-wadeal-ink">{address.addressLine2}</dd>
                </div>
              : null}
              {address.deliveryMemo ?
                <div className="flex justify-between gap-3">
                  <dt>배송 메모</dt>
                  <dd className="text-right font-black text-wadeal-ink">{address.deliveryMemo}</dd>
                </div>
              : null}
            </dl>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {!address.isDefault ?
                <button
                  className={`${ui.btnOutline} h-10 text-xs`}
                  disabled={isPending}
                  onClick={() => handleSetDefault(address.id)}
                  type="button"
                >
                  기본으로 설정
                </button>
              : <span />}
              <Link
                className={`${ui.btnOutline} flex h-10 items-center justify-center text-xs`}
                href={`/mypage/addresses/${address.id}/edit`}
              >
                수정
              </Link>
            </div>
            {confirmDeleteId === address.id ?
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button
                  className={`${ui.btnOutline} h-10 text-xs`}
                  disabled={isPending}
                  onClick={() => setConfirmDeleteId(null)}
                  type="button"
                >
                  취소
                </button>
                <button
                  className={`${ui.btnOutline} h-10 text-xs text-wadeal-red`}
                  disabled={isPending}
                  onClick={() => handleDelete(address.id)}
                  type="button"
                >
                  삭제 확인
                </button>
              </div>
            : <button
                className={`${ui.btnOutline} mt-2 h-10 w-full text-xs text-wadeal-red`}
                disabled={isPending}
                onClick={() => setConfirmDeleteId(address.id)}
                type="button"
              >
                삭제
              </button>
            }
          </article>
        ))
      }

      <Link className={`${ui.btnOutline} block w-full cursor-pointer text-center`} href={newAddressHref}>
        새 배송지 추가
      </Link>
    </div>
  );
}
