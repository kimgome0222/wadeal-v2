"use client";

import type { AddressFormInput } from "@/lib/addresses/types";
import { ui } from "@/lib/ui";

const fields = [
  { key: "recipientName" as const, id: "recipientName", label: "받는 분", placeholder: "이름" },
  { key: "phone" as const, id: "phone", label: "휴대폰 번호", placeholder: "010-0000-0000" },
  { key: "postalCode" as const, id: "postalCode", label: "우편번호", placeholder: "12345" },
  { key: "addressLine1" as const, id: "addressLine1", label: "주소", placeholder: "도로명 주소" },
  { key: "addressLine2" as const, id: "addressLine2", label: "상세 주소", placeholder: "동·호수" },
];

type AddressFormFieldsProps = {
  values: AddressFormInput;
  onChange: (values: AddressFormInput) => void;
  showDefaultToggle?: boolean;
};

export function AddressFormFields({
  values,
  onChange,
  showDefaultToggle = true,
}: AddressFormFieldsProps) {
  return (
    <div className="space-y-4">
      {fields.map((field) => (
        <div key={field.key}>
          <label className={ui.label} htmlFor={field.id}>
            {field.label}
          </label>
          <input
            className={ui.input}
            id={field.id}
            name={field.id}
            onChange={(event) => {
              onChange({ ...values, [field.key]: event.target.value });
            }}
            placeholder={field.placeholder}
            type="text"
            value={values[field.key] ?? ""}
          />
        </div>
      ))}

      {showDefaultToggle ?
        <label className="flex cursor-pointer items-center gap-2.5">
          <input
            checked={values.isDefault ?? false}
            className="h-4 w-4 accent-wadeal-red"
            onChange={(event) => {
              onChange({ ...values, isDefault: event.target.checked });
            }}
            type="checkbox"
          />
          <span className="text-sm font-extrabold text-wadeal-ink">기본 배송지로 설정</span>
        </label>
      : null}
    </div>
  );
}
