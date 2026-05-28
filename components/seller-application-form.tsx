"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { submitSellerApplicationAction } from "@/app/actions/seller";
import type { SellerRecord } from "@/lib/data/sellers";
import { getSellerStatusLabel } from "@/lib/sellers/types";
import { ui } from "@/lib/ui";

type SellerApplicationFormProps = {
  existing?: SellerRecord | null;
};

export function SellerApplicationForm({ existing }: SellerApplicationFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [companyName, setCompanyName] = useState(existing?.companyName ?? "");
  const [businessNumber, setBusinessNumber] = useState(existing?.businessNumber ?? "");
  const [representativeName, setRepresentativeName] = useState(existing?.representativeName ?? "");
  const [bankName, setBankName] = useState(existing?.bankName ?? "");
  const [accountNumber, setAccountNumber] = useState(existing?.accountNumber ?? "");
  const [accountHolder, setAccountHolder] = useState(existing?.accountHolder ?? "");
  const [feedback, setFeedback] = useState<{ tone: "success" | "error"; message: string } | null>(
    null,
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    startTransition(async () => {
      const result = await submitSellerApplicationAction({
        companyName,
        businessNumber,
        representativeName,
        bankName,
        accountNumber,
        accountHolder,
      });

      if (!result.success) {
        setFeedback({
          tone: "error",
          message:
            result.error === "already_exists" ?
              "이미 신청 내역이 있어요. 설정에서 상태를 확인해 주세요."
            : result.error === "login_required" ?
              "로그인이 필요해요."
            : "신청 저장에 실패했어요. 다시 시도해 주세요.",
        });
        return;
      }

      setFeedback({
        tone: "success",
        message: "판매자 가입 신청이 접수됐어요. 관리자 승인을 기다려 주세요.",
      });
      router.refresh();
    });
  }

  return (
    <form className={`${ui.panel} space-y-4`} onSubmit={handleSubmit}>
      {existing ?
        <p className="rounded-lg bg-gray-50 px-3 py-2 text-xs font-bold text-wadeal-muted">
          현재 상태: {getSellerStatusLabel(existing.status)}
        </p>
      : null}
      <div>
        <label className={ui.label} htmlFor="companyName">
          상호명
        </label>
        <input
          className={ui.input}
          id="companyName"
          onChange={(event) => setCompanyName(event.target.value)}
          required
          value={companyName}
        />
      </div>
      <div>
        <label className={ui.label} htmlFor="businessNumber">
          사업자등록번호
        </label>
        <input
          className={ui.input}
          id="businessNumber"
          onChange={(event) => setBusinessNumber(event.target.value)}
          placeholder="000-00-00000"
          required
          value={businessNumber}
        />
      </div>
      <div>
        <label className={ui.label} htmlFor="representativeName">
          대표자명
        </label>
        <input
          className={ui.input}
          id="representativeName"
          onChange={(event) => setRepresentativeName(event.target.value)}
          required
          value={representativeName}
        />
      </div>
      <div>
        <label className={ui.label} htmlFor="bankName">
          정산 은행
        </label>
        <input
          className={ui.input}
          id="bankName"
          onChange={(event) => setBankName(event.target.value)}
          required
          value={bankName}
        />
      </div>
      <div>
        <label className={ui.label} htmlFor="accountNumber">
          계좌번호
        </label>
        <input
          className={ui.input}
          id="accountNumber"
          onChange={(event) => setAccountNumber(event.target.value)}
          required
          value={accountNumber}
        />
      </div>
      <div>
        <label className={ui.label} htmlFor="accountHolder">
          예금주
        </label>
        <input
          className={ui.input}
          id="accountHolder"
          onChange={(event) => setAccountHolder(event.target.value)}
          required
          value={accountHolder}
        />
      </div>
      {feedback ?
        <p
          className={`rounded-lg px-3 py-2 text-xs font-bold ${
            feedback.tone === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-wadeal-red"
          }`}
          role="status"
        >
          {feedback.message}
        </p>
      : null}
      <button
        className={`${ui.btnPrimary} cursor-pointer disabled:opacity-50`}
        disabled={isPending}
        type="submit"
      >
        {isPending ? "저장 중..." : existing?.status === "rejected" ? "재신청하기" : "판매자 신청하기"}
      </button>
    </form>
  );
}
