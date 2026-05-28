"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { createAddressAction } from "@/app/actions/addresses";
import {
  DEFAULT_ADDRESS,
  readSavedAddress,
  returnLabel,
  writeSavedAddress,
  type SavedAddressData,
} from "@/lib/mock-storage";
import { ui } from "@/lib/ui";

const fields = [
  { id: "name", label: "받는 분", placeholder: "이름" },
  { id: "phone", label: "휴대폰 번호", placeholder: "010-0000-0000" },
  { id: "address", label: "주소 검색", placeholder: "도로명 주소" },
  { id: "detail", label: "상세 주소", placeholder: "동·호수" },
] as const;

type AddressSetupFormProps = {
  returnPath: string;
};

export function AddressSetupForm({ returnPath }: AddressSetupFormProps) {
  const [isPending, startTransition] = useTransition();
  const [defaultAddress, setDefaultAddress] = useState(true);
  const [saved, setSaved] = useState(false);
  const [formValues, setFormValues] = useState<SavedAddressData>(DEFAULT_ADDRESS);

  useEffect(() => {
    setFormValues(readSavedAddress());
  }, []);

  if (saved) {
    return (
      <div className="space-y-4">
        <p className={ui.successBanner} role="status">
          배송지가 저장되었어요.
        </p>
        <Link className={`${ui.btnPrimary} cursor-pointer`} href={returnPath}>
          {returnLabel(returnPath, "공동구매 참여로 돌아가기", "배송지 관리로 돌아가기")}
        </Link>
      </div>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        startTransition(async () => {
          writeSavedAddress(formValues);
          await createAddressAction({
            recipientName: formValues.name,
            phone: formValues.phone,
            postalCode: "00000",
            addressLine1: formValues.addressLine,
            addressLine2: formValues.addressDetail,
            isDefault: defaultAddress,
          });
          setSaved(true);
        });
      }}
    >
      {fields.map((field) => (
        <div key={field.id}>
          <label className={ui.label} htmlFor={field.id}>
            {field.label}
          </label>
          <input
            className={ui.input}
            id={field.id}
            name={field.id}
            onChange={(event) => {
              const value = event.target.value;
              setFormValues((prev) => ({
                ...prev,
                name: field.id === "name" ? value : prev.name,
                phone: field.id === "phone" ? value : prev.phone,
                addressLine: field.id === "address" ? value : prev.addressLine,
                addressDetail: field.id === "detail" ? value : prev.addressDetail,
              }));
            }}
            placeholder={field.placeholder}
            type="text"
            value={
              field.id === "name" ? formValues.name
              : field.id === "phone" ? formValues.phone
              : field.id === "address" ? formValues.addressLine
              : formValues.addressDetail
            }
          />
        </div>
      ))}

      <label className="flex cursor-pointer items-center gap-2.5">
        <input
          checked={defaultAddress}
          className="h-4 w-4 accent-wadeal-red"
          onChange={(event) => setDefaultAddress(event.target.checked)}
          type="checkbox"
        />
        <span className="text-sm font-extrabold text-wadeal-ink">기본 배송지로 설정</span>
      </label>

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
