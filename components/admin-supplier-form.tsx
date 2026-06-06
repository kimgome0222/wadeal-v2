"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  createAdminSupplierAction,
  updateAdminSupplierAction,
} from "@/app/actions/admin-suppliers";
import {
  formatCommissionRate,
  type AdminSupplierDetail,
} from "@/lib/admin-suppliers/shared";
import type { SupplierStatus } from "@/lib/settlements/labels";
import { ui } from "@/lib/ui";

type AdminSupplierFormProps = {
  mode: "create" | "edit";
  supplier?: AdminSupplierDetail;
  cancelHref: string;
};

const statusOptions: { value: SupplierStatus; label: string }[] = [
  { value: "active", label: "활성 (active)" },
  { value: "paused", label: "일시중지 (paused)" },
  { value: "terminated", label: "종료 (terminated)" },
];

function errorMessage(error?: string) {
  switch (error) {
    case "invalid_input":
      return "입력값을 확인해 주세요.";
    case "not_found":
      return "공급사를 찾을 수 없어요.";
    case "forbidden":
      return "관리자만 저장할 수 있어요.";
    case "login_required":
      return "로그인이 필요해요.";
    default:
      return "저장에 실패했어요. 잠시 후 다시 시도해 주세요.";
  }
}

export function AdminSupplierForm({ mode, supplier, cancelHref }: AdminSupplierFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null,
  );

  const [name, setName] = useState(supplier?.name ?? "");
  const [businessNumber, setBusinessNumber] = useState(supplier?.businessNumber ?? "");
  const [contactName, setContactName] = useState(supplier?.contactName ?? "");
  const [phone, setPhone] = useState(supplier?.phone ?? "");
  const [email, setEmail] = useState(supplier?.email ?? "");
  const [bankName, setBankName] = useState(supplier?.bankName ?? "");
  const [bankAccount, setBankAccount] = useState(supplier?.bankAccount ?? "");
  const [bankHolder, setBankHolder] = useState(supplier?.bankHolder ?? "");
  const [status, setStatus] = useState<SupplierStatus>(supplier?.status ?? "active");
  const [commissionRate, setCommissionRate] = useState(
    String(supplier?.commissionRate ?? "10"),
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    const payload = {
      name,
      businessNumber,
      contactName,
      phone,
      email,
      bankName,
      bankAccount,
      bankHolder,
      status,
      commissionRate,
    };

    startTransition(async () => {
      const result =
        mode === "create"
          ? await createAdminSupplierAction(payload)
          : await updateAdminSupplierAction(supplier!.id, payload);

      if (result.success) {
        setFeedback({ type: "success", message: "저장됐어요." });
        router.push("/admin/suppliers");
        router.refresh();
        return;
      }

      setFeedback({ type: "error", message: errorMessage(result.error) });
    });
  }

  return (
    <form className="space-y-4 rounded-xl border border-wadeal-line bg-white p-4" onSubmit={handleSubmit}>
      {feedback ?
        <p
          className={`rounded-lg px-3 py-2 text-xs font-bold ${
            feedback.type === "success" ? "bg-green-50 text-green-700" : "bg-[#F5F8F4] text-[#244C3F]"
          }`}
        >
          {feedback.message}
        </p>
      : null}

      <div className="space-y-1.5">
        <label className="text-xs font-black text-wadeal-ink" htmlFor="supplier-name">
          공급사명 *
        </label>
        <input
          className={ui.input}
          id="supplier-name"
          onChange={(event) => setName(event.target.value)}
          required
          value={name}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-black text-wadeal-ink" htmlFor="supplier-business-number">
          사업자번호
        </label>
        <input
          className={ui.input}
          id="supplier-business-number"
          onChange={(event) => setBusinessNumber(event.target.value)}
          value={businessNumber}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-black text-wadeal-ink" htmlFor="supplier-contact-name">
            담당자
          </label>
          <input
            className={ui.input}
            id="supplier-contact-name"
            onChange={(event) => setContactName(event.target.value)}
            value={contactName}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-black text-wadeal-ink" htmlFor="supplier-phone">
            연락처
          </label>
          <input
            className={ui.input}
            id="supplier-phone"
            onChange={(event) => setPhone(event.target.value)}
            value={phone}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-black text-wadeal-ink" htmlFor="supplier-email">
          이메일
        </label>
        <input
          className={ui.input}
          id="supplier-email"
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          value={email}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-black text-wadeal-ink" htmlFor="supplier-bank-name">
          은행명
        </label>
        <input
          className={ui.input}
          id="supplier-bank-name"
          onChange={(event) => setBankName(event.target.value)}
          value={bankName}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-black text-wadeal-ink" htmlFor="supplier-bank-account">
            계좌번호
          </label>
          <input
            className={ui.input}
            id="supplier-bank-account"
            onChange={(event) => setBankAccount(event.target.value)}
            value={bankAccount}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-black text-wadeal-ink" htmlFor="supplier-bank-holder">
            예금주
          </label>
          <input
            className={ui.input}
            id="supplier-bank-holder"
            onChange={(event) => setBankHolder(event.target.value)}
            value={bankHolder}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-black text-wadeal-ink" htmlFor="supplier-status">
            상태
          </label>
          <select
            className={ui.input}
            id="supplier-status"
            onChange={(event) => setStatus(event.target.value as SupplierStatus)}
            value={status}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-black text-wadeal-ink" htmlFor="supplier-commission-rate">
            수수료율 (%)
          </label>
          <input
            className={ui.input}
            id="supplier-commission-rate"
            max="100"
            min="0"
            onChange={(event) => setCommissionRate(event.target.value)}
            step="0.01"
            type="number"
            value={commissionRate}
          />
          <p className="text-[10px] font-bold text-wadeal-muted">
            현재 {formatCommissionRate(Number(commissionRate) || 0)}
          </p>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Link className={`${ui.btnOutline} h-11 flex-1 cursor-pointer`} href={cancelHref}>
          취소
        </Link>
        <button
          className={`${ui.btnPrimary} h-11 flex-1 cursor-pointer disabled:opacity-50`}
          disabled={isPending}
          type="submit"
        >
          {mode === "create" ? "등록" : "저장"}
        </button>
      </div>
    </form>
  );
}
