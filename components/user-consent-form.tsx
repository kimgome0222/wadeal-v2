"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";

import { saveUserConsentsAction } from "@/app/actions/consents";
import type { ConsentFormValues } from "@/lib/consents/types";
import { EMPTY_CONSENT_FORM } from "@/lib/consents/types";
import { ui } from "@/lib/ui";

type UserConsentFormProps = {
  variant?: "default" | "compact";
  showSubmit?: boolean;
  submitLabel?: string;
  initialValues?: Partial<ConsentFormValues>;
  onSaved?: () => void;
  onValuesChange?: (values: ConsentFormValues, allRequiredChecked: boolean) => void;
};

const consentItems = [
  {
    key: "terms" as const,
    required: true,
    label: "이용약관 동의",
    href: "/terms",
  },
  {
    key: "privacy" as const,
    required: true,
    label: "개인정보처리방침 동의",
    href: "/privacy",
  },
  {
    key: "groupbuy" as const,
    required: true,
    label: "공동구매 가격 확정 방식 동의",
    href: "/commerce-policy",
    description: "마감 시점 누적 참여 수량 기준 최종 단가 확정",
  },
  {
    key: "marketing" as const,
    required: false,
    label: "마케팅 정보 수신 동의 (선택)",
    href: null,
    description: "이벤트, 혜택, 공동구매 추천 알림",
  },
] as const;

export function UserConsentForm({
  variant = "default",
  showSubmit = false,
  submitLabel = "동의하고 계속하기",
  initialValues,
  onSaved,
  onValuesChange,
}: UserConsentFormProps) {
  const [values, setValues] = useState<ConsentFormValues>({
    ...EMPTY_CONSENT_FORM,
    ...initialValues,
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const allRequiredChecked = values.terms && values.privacy && values.groupbuy;
  const allChecked = allRequiredChecked && values.marketing;

  function updateValues(next: ConsentFormValues) {
    setValues(next);
    onValuesChange?.(
      next,
      next.terms && next.privacy && next.groupbuy,
    );
  }

  function toggleField(key: keyof ConsentFormValues, checked: boolean) {
    updateValues({ ...values, [key]: checked });
  }

  function toggleAll(checked: boolean) {
    updateValues({
      terms: checked,
      privacy: checked,
      groupbuy: checked,
      marketing: checked,
    });
  }

  const requiredItems = useMemo(
    () => consentItems.filter((item) => item.required),
    [],
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
    variant === "compact" ?
      "rounded-xl border border-wadeal-line bg-white p-3"
    : `${ui.panel} space-y-3`;

  return (
    <div className={wrapperClass}>
      {variant === "default" ?
        <div>
          <p className="text-sm font-black text-wadeal-ink">약관 및 동의</p>
          <p className="mt-1 text-xs font-bold text-wadeal-muted">
            공동구매 참여를 위해 아래 필수 항목에 동의해 주세요.
          </p>
        </div>
      : null}

      <label className="flex cursor-pointer items-center gap-2.5 border-b border-wadeal-line pb-3">
        <input
          checked={allChecked}
          className="h-4 w-4 accent-wadeal-red"
          onChange={(event) => toggleAll(event.target.checked)}
          type="checkbox"
        />
        <span className="text-sm font-black text-wadeal-ink">전체 동의</span>
      </label>

      <div className="space-y-2.5">
        {consentItems.map((item) => (
          <label
            className="flex cursor-pointer items-start gap-2.5"
            key={item.key}
          >
            <input
              checked={values[item.key]}
              className="mt-0.5 h-4 w-4 accent-wadeal-red"
              onChange={(event) => toggleField(item.key, event.target.checked)}
              type="checkbox"
            />
            <span className="min-w-0 flex-1">
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
              </span>
              {"description" in item && item.description ?
                <span className="mt-0.5 block text-[11px] font-bold leading-relaxed text-wadeal-muted">
                  {item.description}
                </span>
              : null}
            </span>
          </label>
        ))}
      </div>

      {variant === "compact" && !showSubmit ?
        <p className="text-[11px] font-bold leading-relaxed text-gray-400">
          필수 항목({requiredItems.length}개)에 동의해야 로그인할 수 있어요.
        </p>
      : null}

      {errorMessage ?
        <p className="rounded-xl bg-red-50 px-4 py-3 text-center text-xs font-bold text-wadeal-red">
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

export function isConsentFormComplete(values: ConsentFormValues): boolean {
  return values.terms && values.privacy && values.groupbuy;
}
