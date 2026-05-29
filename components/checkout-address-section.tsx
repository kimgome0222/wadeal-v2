"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { AddressFormFields } from "@/components/address-form-fields";
import { createAddressAction } from "@/app/actions/addresses";
import {
  DELIVERY_MEMO_CUSTOM,
  DELIVERY_MEMO_PRESETS,
  resolveDeliveryMemo,
} from "@/lib/addresses/delivery-memo";
import type { AddressFormInput, UserAddress } from "@/lib/addresses/types";
import { currency } from "@/lib/deals";
import { calculateShippingFee } from "@/lib/shipping/calculate-shipping-fee";
import type { ProductShippingProfile } from "@/lib/shipping/types";
import { ui } from "@/lib/ui";

type CheckoutAddressSectionProps = {
  addresses: UserAddress[];
  defaultAddressId: string | null;
  quantity: number;
  subtotalAmount: number;
  productShipping: ProductShippingProfile;
  onSelectionChange: (selection: {
    addressId: string | null;
    deliveryMemo: string;
    shippingFee: number;
  }) => void;
};

const inlineEmptyForm: AddressFormInput = {
  recipientName: "",
  phone: "",
  postalCode: "",
  addressLine1: "",
  addressLine2: "",
  isDefault: false,
};

function computeTotalShipping(
  productShipping: ProductShippingProfile,
  subtotalAmount: number,
  quantity: number,
  address: UserAddress | null,
): number {
  if (!address) {
    return 0;
  }

  return calculateShippingFee({
    product: productShipping,
    subtotal: subtotalAmount,
    quantity,
    address: {
      postalCode: address.postalCode,
      isRemoteArea: address.isRemoteArea,
    },
  }).totalShippingFee;
}

export function CheckoutAddressSection({
  addresses,
  defaultAddressId,
  quantity,
  subtotalAmount,
  productShipping,
  onSelectionChange,
}: CheckoutAddressSectionProps) {
  const initialId = defaultAddressId ?? addresses[0]?.id ?? null;
  const [selectedId, setSelectedId] = useState<string | null>(initialId);
  const [showPicker, setShowPicker] = useState(false);
  const [showInlineForm, setShowInlineForm] = useState(false);
  const [memoPreset, setMemoPreset] = useState<string>(DELIVERY_MEMO_PRESETS[0]);
  const [memoCustom, setMemoCustom] = useState("");
  const [inlineForm, setInlineForm] = useState<AddressFormInput>(inlineEmptyForm);
  const [inlineSaving, setInlineSaving] = useState(false);
  const [inlineError, setInlineError] = useState<string | null>(null);

  const selectedAddress = useMemo(
    () => addresses.find((address) => address.id === selectedId) ?? null,
    [addresses, selectedId],
  );

  const shippingBreakdown = useMemo(() => {
    if (!selectedAddress) {
      return null;
    }

    return calculateShippingFee({
      product: productShipping,
      subtotal: subtotalAmount,
      quantity,
      address: {
        postalCode: selectedAddress.postalCode,
        isRemoteArea: selectedAddress.isRemoteArea,
      },
    });
  }, [productShipping, selectedAddress, subtotalAmount, quantity]);

  const shippingFee = shippingBreakdown?.totalShippingFee ?? 0;
  const deliveryMemo = resolveDeliveryMemo(memoPreset, memoCustom);

  useEffect(() => {
    onSelectionChange({
      addressId: selectedId,
      deliveryMemo,
      shippingFee,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- parent callback is stable enough for checkout
  }, [selectedId, deliveryMemo, shippingFee]);

  function emitSelection(addressId: string | null) {
    const address = addresses.find((item) => item.id === addressId) ?? null;
    onSelectionChange({
      addressId,
      deliveryMemo,
      shippingFee: computeTotalShipping(productShipping, subtotalAmount, quantity, address),
    });
  }

  if (addresses.length === 0 && !showInlineForm) {
    return (
      <article className="rounded-xl border border-wadeal-line bg-white p-4">
        <h2 className={ui.sectionTitle}>배송지</h2>
        <p className="mt-3 text-xs font-bold text-wadeal-red">
          구매 전 배송지를 등록해 주세요.
        </p>
        <button
          className={`${ui.btnOutline} mt-3 w-full text-xs`}
          onClick={() => setShowInlineForm(true)}
          type="button"
        >
          배송지 등록
        </button>
      </article>
    );
  }

  return (
    <article className="rounded-xl border border-wadeal-line bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className={ui.sectionTitle}>배송지</h2>
        <button
          className="cursor-pointer text-xs font-black text-wadeal-red active:opacity-80"
          onClick={() => setShowPicker((value) => !value)}
          type="button"
        >
          {showPicker ? "접기" : "변경"}
        </button>
      </div>

      {selectedAddress ?
        <dl className="mt-3 space-y-1.5 text-xs font-bold text-wadeal-muted">
          <div className="flex justify-between gap-3">
            <dt>받는 분</dt>
            <dd className="font-black text-wadeal-ink">{selectedAddress.recipientName}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>주소</dt>
            <dd className="text-right font-black text-wadeal-ink">
              {selectedAddress.addressLine1}
              {selectedAddress.addressLine2 ? ` ${selectedAddress.addressLine2}` : ""}
            </dd>
          </div>
          {selectedAddress.isRemoteArea ?
            <p className="text-[10px] font-bold text-wadeal-red">
              제주·도서산간 지역 — 추가 배송비 {currency.format(shippingBreakdown?.remoteExtraFee ?? 0)}원
            </p>
          : null}
        </dl>
      : null}

      {showPicker ?
        <div className="mt-3 space-y-2">
          {addresses.map((address) => (
            <label
              className="flex cursor-pointer items-start gap-2 rounded-lg border border-wadeal-line px-3 py-2.5"
              key={address.id}
            >
              <input
                checked={selectedId === address.id}
                className="mt-0.5 accent-wadeal-red"
                name="checkout-address"
                onChange={() => {
                  setSelectedId(address.id);
                  emitSelection(address.id);
                }}
                type="radio"
              />
              <span className="text-xs font-bold text-wadeal-ink">
                {address.recipientName} · {address.addressLine1}
                {address.isRemoteArea ?
                  <span className="ml-1 text-wadeal-red">(도서산간)</span>
                : null}
              </span>
            </label>
          ))}
          <Link className="block text-center text-xs font-black text-wadeal-red" href="/mypage/addresses">
            배송지 관리
          </Link>
        </div>
      : null}

      <div className="mt-3">
        <label className={ui.label} htmlFor="delivery-memo">
          배송 메모
        </label>
        <select
          className={ui.input}
          id="delivery-memo"
          onChange={(event) => setMemoPreset(event.target.value)}
          value={memoPreset}
        >
          {DELIVERY_MEMO_PRESETS.map((preset) => (
            <option key={preset} value={preset}>
              {preset}
            </option>
          ))}
          <option value={DELIVERY_MEMO_CUSTOM}>직접 입력</option>
        </select>
        {memoPreset === DELIVERY_MEMO_CUSTOM ?
          <input
            className={`${ui.input} mt-2`}
            onChange={(event) => setMemoCustom(event.target.value)}
            placeholder="배송 요청사항"
            value={memoCustom}
          />
        : null}
      </div>

      {showInlineForm ?
        <div className="mt-4 space-y-3 border-t border-wadeal-line pt-4">
          <AddressFormFields
            onChange={setInlineForm}
            showDefaultToggle={addresses.length > 0}
            values={{
              ...inlineForm,
              isDefault: addresses.length === 0 ? true : inlineForm.isDefault,
            }}
          />
          {inlineError ?
            <p className="text-xs font-bold text-wadeal-red">{inlineError}</p>
          : null}
          <button
            className={`${ui.btnPrimary} w-full`}
            disabled={inlineSaving}
            onClick={async () => {
              setInlineSaving(true);
              setInlineError(null);
              const result = await createAddressAction({
                ...inlineForm,
                isDefault: addresses.length === 0 ? true : inlineForm.isDefault,
              });
              setInlineSaving(false);
              if (!result.success) {
                setInlineError("배송지 저장에 실패했어요.");
                return;
              }
              setShowInlineForm(false);
              window.location.reload();
            }}
            type="button"
          >
            {inlineSaving ? "저장 중..." : "배송지 저장"}
          </button>
        </div>
      : (
        <button
          className={`${ui.btnOutline} mt-3 w-full text-xs`}
          onClick={() => setShowInlineForm(true)}
          type="button"
        >
          새 배송지 추가
        </button>
      )}
    </article>
  );
}
