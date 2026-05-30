"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";

import { saveUserConsentsAction } from "@/app/actions/consents";
import type { ConsentFormValues } from "@/lib/consents/types";
import { EMPTY_CONSENT_FORM } from "@/lib/consents/types";
import { ui } from "@/lib/ui";

type UserConsentFormProps = {
  variant?: "default" | "compact" | "checkout";
  showSubmit?: boolean;
  submitLabel?: string;
  initialValues?: Partial<ConsentFormValues>;
  onSaved?: () => void;
  onValuesChange?: (values: ConsentFormValues, allRequiredChecked: boolean) => void;
};

type ConsentItemKey = keyof ConsentFormValues;

type ConsentItem = {
  key: ConsentItemKey;
  required: boolean;
  label: string;
  href: string | null;
  description?: string;
  checkoutOnly?: boolean;
};

const consentItems: ConsentItem[] = [
  {
    key: "terms",
    required: true,
    label: "이용약관 동의",
    href: "/policies/terms",
  },
  {
    key: "privacy",
    required: true,
    label: "개인정보 수집 및 이용 동의",
    href: "/policies/privacy",
  },
  {
    key: "age14",
    required: true,
    label: "만 14세 이상 확인",
    href: "/policies/youth",
    description: "만 14세 미만은 가입할 수 없어요.",
  },
  {
    key: "groupbuy",
    required: true,
    label: "전자상거래·가격 확정 방식 동의",
    href: "/policies/commerce",
    description: "주문 상품·가격·할인 안내 확인",
  },
  {
    key: "orderPolicy",
    required: true,
    label: "주문·환불·배송 정책 확인",
    href: "/policies/refund",
    description: "환불/교환·배송 정책에 동의",
    checkoutOnly: true,
  },
  {
    key: "marketing",
    required: false,
    label: "마케팅 정보 수신 동의",
    href: "/policies/marketing",
    description: "이벤트, 혜택, 상품 추천 알림",
  },
  {
    key: "personalization",
    required: false,
    label: "개인화 추천 동의",
    href: null,
    description: "관심 상품 기반 맞춤 추천 (선택)",
  },
];

function isRequiredConsentsChecked(values: ConsentFormValues, includeCheckout: boolean): boolean {
  const requiredKeys = consentItems
    .filter((item) => item.required && (!item.checkoutOnly || includeCheckout))
    .map((item) => item.key);

  return requiredKeys.every((key) => values[key]);
}

function isAllConsentsChecked(values: ConsentFormValues, visibleKeys: ConsentItemKey[]): boolean {
  return visibleKeys.every((key) => values[key]);
}

export function UserConsentForm({
  variant = "default",
  showSubmit = false,
  submitLabel = "동의하고 계속하기",
  initialValues,
  onSaved,
  onValuesChange,
}: UserConsentFormProps) {
  const includeCheckout = variant === "checkout";
  const [values, setValues] = useState<ConsentFormValues>({
    ...EMPTY_CONSENT_FORM,
    ...initialValues,
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const masterRef = useRef<HTMLInputElement>(null);

  const visibleItems = useMemo(
    () => consentItems.filter((item) => !item.checkoutOnly || includeCheckout),
    [includeCheckout],
  );
  const visibleKeys = useMemo(() => visibleItems.map((item) => item.key), [visibleItems]);

  const allRequiredChecked = isRequiredConsentsChecked(values, includeCheckout);
  const allChecked = isAllConsentsChecked(values, visibleKeys);
  const someChecked = visibleKeys.some((key) => values[key]) && !allChecked;

  useEffect(() => {
    if (masterRef.current) {
      masterRef.current.indeterminate = someChecked;
    }
  }, [someChecked]);

  function updateValues(next: ConsentFormValues) {
    setValues(next);
    onValuesChange?.(next, isRequiredConsentsChecked(next, includeCheckout));
  }

  function toggleField(key: ConsentItemKey, checked: boolean) {
    setValues((current) => {
      const next = { ...current, [key]: checked };
      onValuesChange?.(next, isRequiredConsentsChecked(next, includeCheckout));
      return next;
    });
  }

  function toggleAll(checked: boolean) {
    const next = { ...values };
    for (const key of visibleKeys) {
      next[key] = checked;
    }
    updateValues(next);
  }

  const requiredItems = useMemo(
    () => visibleItems.filter((item) => item.required),
    [visibleItems],
  );

  function handleSubmit() {
    setErrorMessage(null);

    if (!allRequiredChecked) {
      setErrorMessage("필수 항목에 모두 동의해 주세요.");
      return;
    }

    startTransition(async () => {
      const result = await saveUserConsentsAction({
        terms: values.terms,
        privacy: values.privacy,
        groupbuy: values.groupbuy,
        marketing: values.marketing,
      });

      if (!result.success) {
        setErrorMessage("동의 내역 저장에 실패했어요. 다시 시도해 주세요.");
        return;
      }

      onSaved?.();
    });
  }

  const wrapperClass =
    variant === "compact" || variant === "checkout" ?
      "rounded-xl border border-wadeal-line bg-white p-3"
    : `${ui.panel} space-y-3`;

  return (
    <div className={wrapperClass}>
      {variant === "default" ?
        <div>
          <p className="text-sm font-black text-wadeal-ink">약관 및 동의</p>
          <p className="mt-1 text-xs font-bold text-wadeal-muted">
            celloh 이용을 위해 아래 필수 항목에 동의해 주세요.
          </p>
        </div>
      : null}

      <div className="flex items-center gap-2.5 border-b border-wadeal-line pb-3">
        <input
          checked={allChecked}
          className="h-4 w-4 shrink-0 accent-wadeal-red"
          id="consent-all"
          onChange={(event) => toggleAll(event.target.checked)}
          ref={masterRef}
          type="checkbox"
        />
        <label className="cursor-pointer text-sm font-black text-wadeal-ink" htmlFor="consent-all">
          전체 동의
        </label>
      </div>

      <div className="space-y-2.5">
        {visibleItems.map((item) => (
          <div className="flex items-start gap-2.5" key={item.key}>
            <input
              checked={values[item.key]}
              className="mt-0.5 h-4 w-4 shrink-0 accent-wadeal-red"
              id={`consent-${item.key}`}
              onChange={(event) => toggleField(item.key, event.target.checked)}
              type="checkbox"
            />
            <label className="min-w-0 flex-1 cursor-pointer" htmlFor={`consent-${item.key}`}>
              <span className="text-sm font-extrabold text-wadeal-ink">
                {item.required ? "[필수] " : "[선택] "}
                {item.href ?
                  <Link
                    className="text-wadeal-red underline underline-offset-2"
                    href={item.href}
                    onClick={(event) => event.stopPropagation()}
                    target="_blank"
                  >
                    {item.label}
                  </Link>
                : item.label}
                {item.href ?
                  <span className="ml-1 text-[11px] font-bold text-wadeal-muted">(보기)</span>
                : null}
              </span>
              {item.description ?
                <span className="mt-0.5 block text-[11px] font-bold leading-relaxed text-wadeal-muted">
                  {item.description}
                </span>
              : null}
            </label>
          </div>
        ))}
      </div>

      {(variant === "compact" || variant === "checkout") && !showSubmit ?
        <p className="text-[11px] font-bold leading-relaxed text-gray-400">
          필수 항목({requiredItems.length}개)에 동의해야 진행할 수 있어요.
        </p>
      : null}

      {errorMessage ?
        <p className="rounded-xl bg-[#F5F8F4] px-4 py-3 text-center text-xs font-bold text-wadeal-red">
          {errorMessage}
        </p>
      : null}

      {showSubmit ?
        <button
          className={`${ui.btnPrimary} cursor-pointer disabled:opacity-50`}
          disabled={isPending || !allRequiredChecked}
          onClick={handleSubmit}
          type="button"
        >
          {isPending ? "저장 중..." : submitLabel}
        </button>
      : null}
    </div>
  );
}

export function isConsentFormComplete(
  values: ConsentFormValues,
  options?: { checkout?: boolean },
): boolean {
  return isRequiredConsentsChecked(values, options?.checkout ?? false);
}
