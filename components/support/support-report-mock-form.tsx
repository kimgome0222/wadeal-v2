"use client";

import Link from "next/link";
import { useState } from "react";

import {
  REPORT_REASON_OPTIONS,
  REPORT_TARGET_OPTIONS,
} from "@/lib/support/mock-customer-support-data";
import { ui } from "@/lib/ui";

type FieldErrors = Record<string, string>;

export function SupportReportMockForm() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [reportId, setReportId] = useState("");

  function validate(form: FormData): FieldErrors {
    const next: FieldErrors = {};
    if (!String(form.get("target")).trim()) next.target = "신고 대상 유형을 선택해 주세요.";
    if (!String(form.get("reason")).trim()) next.reason = "신고 사유를 선택해 주세요.";
    if (!String(form.get("detail")).trim()) next.detail = "상세 내용을 입력해 주세요.";
    return next;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setReportId(`RP-${Date.now().toString().slice(-8)}`);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className={`${ui.panel} space-y-3 text-center`}>
        <p className="text-base font-black text-wadeal-ink">신고가 접수되었습니다</p>
        <p className="text-xs font-bold text-wadeal-muted">접수번호: {reportId}</p>
        <p className="text-[11px] font-medium leading-relaxed text-wadeal-muted">
          mock UI — DB 저장 없음. 운영팀 검토 후 필요 시 조치됩니다.
        </p>
        <Link className={`${ui.btnPrimary} inline-flex h-11 items-center px-6`} href="/support">
          고객센터로
        </Link>
      </div>
    );
  }

  return (
    <form className={`${ui.panel} space-y-4`} onSubmit={handleSubmit}>
      <p className="rounded-lg bg-[#F5F7F6] px-3 py-2 text-[11px] font-bold leading-relaxed text-wadeal-muted">
        신고 접수 mock — 실제 DB 저장 없음. 관리자 신고 관리는 별도 admin 기능으로 연동 예정입니다.
      </p>

      <div>
        <label className={ui.label} htmlFor="target">
          신고 대상 유형
        </label>
        <select className={ui.input} id="target" name="target">
          <option value="">선택</option>
          {REPORT_TARGET_OPTIONS.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
        {errors.target ? <p className="mt-1 text-[11px] font-bold text-wadeal-red">{errors.target}</p> : null}
      </div>

      <div>
        <label className={ui.label} htmlFor="reason">
          신고 사유
        </label>
        <select className={ui.input} id="reason" name="reason">
          <option value="">선택</option>
          {REPORT_REASON_OPTIONS.map((reason) => (
            <option key={reason} value={reason}>
              {reason}
            </option>
          ))}
        </select>
        {errors.reason ? <p className="mt-1 text-[11px] font-bold text-wadeal-red">{errors.reason}</p> : null}
      </div>

      <div>
        <label className={ui.label} htmlFor="detail">
          상세 내용
        </label>
        <textarea className={`${ui.input} min-h-28`} id="detail" name="detail" />
        {errors.detail ? <p className="mt-1 text-[11px] font-bold text-wadeal-red">{errors.detail}</p> : null}
      </div>

      <div>
        <label className={ui.label} htmlFor="attachment">
          첨부 (선택)
        </label>
        <div className="rounded-xl border border-dashed border-wadeal-line bg-wadeal-surface px-4 py-6 text-center text-xs font-medium text-wadeal-muted">
          첨부 placeholder — 실제 업로드 없음
        </div>
      </div>

      <div className="rounded-xl bg-wadeal-surface px-3 py-3 text-[11px] font-medium leading-relaxed text-wadeal-muted">
        처리 안내: 접수 후 영업일 3일 이내 검토하며, 허위 신고 시 서비스 이용이 제한될 수 있습니다.
      </div>

      <button className={ui.btnPrimary} type="submit">
        신고 접수
      </button>
    </form>
  );
}
