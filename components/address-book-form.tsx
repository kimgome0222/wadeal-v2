"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

import { createAddressAction, updateAddressAction } from "@/app/actions/addresses";
import { AddressFormFields } from "@/components/address-form-fields";
import type { AddressFormInput, UserAddress } from "@/lib/addresses/types";
import { returnLabel } from "@/lib/mock-storage";
import { ui } from "@/lib/ui";

type AddressBookFormProps = {
  returnPath: string;
  initialAddress?: UserAddress;
};

const emptyForm: AddressFormInput = {
  recipientName: "",
  phone: "",
  postalCode: "",
  addressLine1: "",
  addressLine2: "",
  isDefault: true,
};

function toFormInput(address: UserAddress): AddressFormInput {
  return {
    recipientName: address.recipientName,
    phone: address.phone,
    postalCode: address.postalCode,
    addressLine1: address.addressLine1,
    addressLine2: address.addressLine2 ?? "",
    deliveryMemo: address.deliveryMemo ?? "",
    isDefault: address.isDefault,
  };
}

export function AddressBookForm({ returnPath, initialAddress }: AddressBookFormProps) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<AddressFormInput>(
    initialAddress ? toFormInput(initialAddress) : emptyForm,
  );

  if (saved) {
    return (
      <div className="space-y-4">
        <p className={ui.successBanner} role="status">
          배송지가 저장되었어요.
        </p>
        <Link className={`${ui.btnPrimary} cursor-pointer`} href={returnPath}>
          {returnLabel(returnPath, "주문으로 돌아가기", "배송지 관리로 돌아가기")}
        </Link>
      </div>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        setErrorMessage(null);
        startTransition(async () => {
          const result =
            initialAddress ?
              await updateAddressAction(initialAddress.id, formValues)
            : await createAddressAction(formValues);

          if (!result.success) {
            setErrorMessage("배송지 저장에 실패했어요. 입력 내용을 확인해 주세요.");
            return;
          }

          setSaved(true);
        });
      }}
    >
      <AddressFormFields onChange={setFormValues} values={formValues} />
      {errorMessage ?
        <p className="text-xs font-bold text-wadeal-red">{errorMessage}</p>
      : null}
      <button
        className={`${ui.btnPrimary} cursor-pointer disabled:opacity-50`}
        disabled={isPending}
        type="submit"
      >
        {isPending ? "저장 중..." : "배송지 저장"}
      </button>
    </form>
  );
}
