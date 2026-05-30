"use client";

import Link from "next/link";
import { useState } from "react";

import {
  generateMockTicketNumber,
  INQUIRY_TYPE_OPTIONS,
} from "@/lib/support/mock-customer-support-data";
import { isValidEmailOrPhone } from "@/lib/auth/form-input-validation";
import { ui } from "@/lib/ui";

type FieldErrors = Record<string, string>;

export function SupportContactMockForm() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState("");
  const [consent, setConsent] = useState(false);

  function validate(form: FormData): FieldErrors {
    const next: FieldErrors = {};
    if (!String(form.get("type")).trim()) next.type = "문의 유형을 선택해 주세요.";
    if (!String(form.get("title")).trim()) next.title = "제목을 입력해 주세요.";
    if (!String(form.get("body")).trim()) next.body = "내용을 입력해 주세요.";
    if (!String(form.get("contact")).trim()) next.contact = "답변 받을 연락처를 입력해 주세요.";
    else if (!isValidEmailOrPhone(String(form.get("contact")))) {
      next.contact = "이메일 또는 휴대폰 번호 형식을 확인해 주세요.";
    }
    if (!consent) next.consent = "개인정보 수집·이용에 동의해 주세요.";
    return next;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setTicketNumber(generateMockTicketNumber());
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className={`${ui.panel} space-y-3 text-center`}>
        <p className="text-base font-black text-wadeal-ink">문의가 접수되었습니다</p>
        <p className="text-xs font-bold text-wadeal-muted">접수번호: {ticketNumber}</p>
        <p className="text-[11px] font-medium leading-relaxed text-wadeal-muted">
          mock UI — 실제 DB 저장·알림 발송 없음. 영업일 기준 순차 답변됩니다.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Link className={`${ui.btnPrimary} inline-flex h-11 items-center px-6`} href="/support/tickets">
            문의 내역
          </Link>
          <Link className={`${ui.btnOutline} inline-flex h-11 items-center px-6`} href="/support">
            고객센터
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form className={`${ui.panel} space-y-4`} onSubmit={handleSubmit}>
      <p className="rounded-lg bg-[#F5F7F6] px-3 py-2 text-[11px] font-bold leading-relaxed text-wadeal-muted">
        mock 문의 폼 — 제출 시 DB 저장 없음. 첨부파일은 placeholder만 표시됩니다.
      </p>

      <div>
        <label className={ui.label} htmlFor="type">
          문의 유형
        </label>
        <select className={ui.input} id="type" name="type">
          <option value="">선택</option>
          {INQUIRY_TYPE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {errors.type ? <p className="mt-1 text-[11px] font-bold text-wadeal-red">{errors.type}</p> : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={ui.label} htmlFor="orderNumber">
            주문번호 (선택)
          </label>
          <input className={ui.input} id="orderNumber" name="orderNumber" placeholder="ORD-..." />
        </div>
        <div>
          <label className={ui.label} htmlFor="product">
            상품 (선택)
          </label>
          <input className={ui.input} id="product" name="product" placeholder="상품명" />
        </div>
      </div>

      <div>
        <label className={ui.label} htmlFor="title">
          제목
        </label>
        <input className={ui.input} id="title" name="title" />
        {errors.title ? <p className="mt-1 text-[11px] font-bold text-wadeal-red">{errors.title}</p> : null}
      </div>

      <div>
        <label className={ui.label} htmlFor="body">
          내용
        </label>
        <textarea className={`${ui.input} min-h-28`} id="body" name="body" />
        {errors.body ? <p className="mt-1 text-[11px] font-bold text-wadeal-red">{errors.body}</p> : null}
      </div>

      <div>
        <label className={ui.label} htmlFor="attachment">
          첨부파일
        </label>
        <div className="rounded-xl border border-dashed border-wadeal-line bg-wadeal-surface px-4 py-6 text-center text-xs font-medium text-wadeal-muted">
          파일 업로드 placeholder — 실제 업로드 없음
        </div>
      </div>

      <div>
        <label className={ui.label} htmlFor="contact">
          답변 받을 이메일/연락처
        </label>
        <input className={ui.input} id="contact" name="contact" placeholder="email@example.com" type="text" />
        {errors.contact ? <p className="mt-1 text-[11px] font-bold text-wadeal-red">{errors.contact}</p> : null}
      </div>

      <label className="flex items-start gap-2 text-xs font-medium text-wadeal-muted">
        <input checked={consent} onChange={(e) => setConsent(e.target.checked)} type="checkbox" />
        <span>문의 처리를 위한 개인정보 수집·이용에 동의합니다.</span>
      </label>
      {errors.consent ? <p className="text-[11px] font-bold text-wadeal-red">{errors.consent}</p> : null}

      <button className={ui.btnPrimary} type="submit">
        문의 접수
      </button>
    </form>
  );
}
