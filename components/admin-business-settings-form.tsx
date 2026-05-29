"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { updateAdminBusinessSettingsAction } from "@/app/actions/admin-business-settings";
import {
  isBusinessSettingsConfigured,
  type BusinessSettings,
  type BusinessSettingsFormInput,
} from "@/lib/business-settings/shared";
import { ui } from "@/lib/ui";

type AdminBusinessSettingsFormProps = {
  settings: BusinessSettings;
};

function errorMessage(error?: string) {
  switch (error) {
    case "invalid_input":
      return "입력값을 확인해 주세요. 사업자등록번호는 000-00-00000 형식이어야 합니다.";
    case "forbidden":
      return "관리자만 저장할 수 있어요.";
    case "login_required":
      return "로그인이 필요해요.";
    default:
      return "저장에 실패했어요. 잠시 후 다시 시도해 주세요.";
  }
}

function toFormState(settings: BusinessSettings): BusinessSettingsFormInput {
  return {
    businessName: settings.businessName ?? "",
    representativeName: settings.representativeName ?? "",
    businessNumber: settings.businessNumber ?? "",
    mailOrderSalesNumber: settings.mailOrderSalesNumber ?? "",
    businessAddress: settings.businessAddress ?? "",
    customerServicePhone: settings.customerServicePhone ?? "",
    customerServiceEmail: settings.customerServiceEmail ?? "",
    customerServiceHours: settings.customerServiceHours ?? "",
    hostingProvider: settings.hostingProvider ?? "",
    privacyManagerName: settings.privacyManagerName ?? "",
    privacyManagerEmail: settings.privacyManagerEmail ?? "",
    bankAccountInfo: settings.bankAccountInfo ?? "",
  };
}

export function AdminBusinessSettingsForm({ settings }: AdminBusinessSettingsFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null,
  );
  const [form, setForm] = useState<BusinessSettingsFormInput>(() => toFormState(settings));

  const showEmptyBanner = !isBusinessSettingsConfigured(settings);

  function updateField<K extends keyof BusinessSettingsFormInput>(
    key: K,
    value: BusinessSettingsFormInput[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    startTransition(async () => {
      const result = await updateAdminBusinessSettingsAction(form);

      if (result.success) {
        setFeedback({ type: "success", message: "저장됐어요." });
        router.refresh();
        return;
      }

      setFeedback({ type: "error", message: errorMessage(result.error) });
    });
  }

  return (
    <form className="space-y-4 rounded-xl border border-wadeal-line bg-white p-4" onSubmit={handleSubmit}>
      {showEmptyBanner ?
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
          <p className="text-xs font-black text-amber-800">사업자 정보를 입력해주세요</p>
          <p className="mt-1 text-[11px] font-bold leading-relaxed text-amber-700">
            푸터와 정책 페이지에 표시될 사업자·고객센터 정보를 등록해 주세요.
          </p>
        </div>
      : null}

      {feedback ?
        <p
          className={`rounded-lg px-3 py-2 text-xs font-bold ${
            feedback.type === "success" ? "bg-green-50 text-green-700" : "bg-[#F5F8F4] text-[#244C3F]"
          }`}
        >
          {feedback.message}
        </p>
      : null}

      <section className="space-y-3">
        <h2 className="text-sm font-black text-wadeal-ink">사업자 정보</h2>

        <div className="space-y-1.5">
          <label className={ui.label} htmlFor="business-name">
            상호명 *
          </label>
          <input
            className={ui.input}
            id="business-name"
            onChange={(event) => updateField("businessName", event.target.value)}
            required
            value={form.businessName}
          />
        </div>

        <div className="space-y-1.5">
          <label className={ui.label} htmlFor="representative-name">
            대표자명 *
          </label>
          <input
            className={ui.input}
            id="representative-name"
            onChange={(event) => updateField("representativeName", event.target.value)}
            required
            value={form.representativeName}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className={ui.label} htmlFor="business-number">
              사업자등록번호 *
            </label>
            <input
              className={ui.input}
              id="business-number"
              onChange={(event) => updateField("businessNumber", event.target.value)}
              placeholder="000-00-00000"
              required
              value={form.businessNumber}
            />
          </div>
          <div className="space-y-1.5">
            <label className={ui.label} htmlFor="mail-order-sales-number">
              통신판매업 신고번호 *
            </label>
            <input
              className={ui.input}
              id="mail-order-sales-number"
              onChange={(event) => updateField("mailOrderSalesNumber", event.target.value)}
              required
              value={form.mailOrderSalesNumber}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className={ui.label} htmlFor="business-address">
            사업장 주소 *
          </label>
          <input
            className={ui.input}
            id="business-address"
            onChange={(event) => updateField("businessAddress", event.target.value)}
            required
            value={form.businessAddress}
          />
        </div>

        <div className="space-y-1.5">
          <label className={ui.label} htmlFor="hosting-provider">
            호스팅 제공자
          </label>
          <input
            className={ui.input}
            id="hosting-provider"
            onChange={(event) => updateField("hostingProvider", event.target.value)}
            value={form.hostingProvider}
          />
        </div>
      </section>

      <section className="space-y-3 border-t border-wadeal-line pt-4">
        <h2 className="text-sm font-black text-wadeal-ink">고객센터</h2>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className={ui.label} htmlFor="customer-service-phone">
              전화번호
            </label>
            <input
              className={ui.input}
              id="customer-service-phone"
              onChange={(event) => updateField("customerServicePhone", event.target.value)}
              value={form.customerServicePhone}
            />
          </div>
          <div className="space-y-1.5">
            <label className={ui.label} htmlFor="customer-service-email">
              이메일
            </label>
            <input
              className={ui.input}
              id="customer-service-email"
              onChange={(event) => updateField("customerServiceEmail", event.target.value)}
              type="email"
              value={form.customerServiceEmail}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className={ui.label} htmlFor="customer-service-hours">
            운영 시간
          </label>
          <input
            className={ui.input}
            id="customer-service-hours"
            onChange={(event) => updateField("customerServiceHours", event.target.value)}
            placeholder="평일 10:00 - 18:00"
            value={form.customerServiceHours}
          />
        </div>
      </section>

      <section className="space-y-3 border-t border-wadeal-line pt-4">
        <h2 className="text-sm font-black text-wadeal-ink">개인정보보호 책임자</h2>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className={ui.label} htmlFor="privacy-manager-name">
              책임자명
            </label>
            <input
              className={ui.input}
              id="privacy-manager-name"
              onChange={(event) => updateField("privacyManagerName", event.target.value)}
              value={form.privacyManagerName}
            />
          </div>
          <div className="space-y-1.5">
            <label className={ui.label} htmlFor="privacy-manager-email">
              이메일
            </label>
            <input
              className={ui.input}
              id="privacy-manager-email"
              onChange={(event) => updateField("privacyManagerEmail", event.target.value)}
              type="email"
              value={form.privacyManagerEmail}
            />
          </div>
        </div>
      </section>

      <section className="space-y-3 border-t border-wadeal-line pt-4">
        <h2 className="text-sm font-black text-wadeal-ink">기타</h2>

        <div className="space-y-1.5">
          <label className={ui.label} htmlFor="bank-account-info">
            환불 계좌 정보
          </label>
          <input
            className={ui.input}
            id="bank-account-info"
            onChange={(event) => updateField("bankAccountInfo", event.target.value)}
            placeholder="은행명 / 계좌번호 / 예금주"
            value={form.bankAccountInfo}
          />
        </div>
      </section>

      <button
        className={`${ui.btnPrimary} h-11 cursor-pointer disabled:opacity-50`}
        disabled={isPending}
        type="submit"
      >
        저장
      </button>
    </form>
  );
}
