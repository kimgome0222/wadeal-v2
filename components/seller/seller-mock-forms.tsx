"use client";

import Link from "next/link";
import { useState } from "react";

import {
  validateBusinessNumber,
  type MockProductRequestStatus,
} from "@/lib/sellers/mock-seller-center-data";
import { ui } from "@/lib/ui";

const SELLER_CATEGORIES = ["식품", "뷰티", "생활", "패션", "디지털", "반려"];

type FieldErrors = Record<string, string>;

/** 입점 신청 mock — DB 저장 없음 */
export function SellerOnboardingMockForm() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [consents, setConsents] = useState({
    terms: false,
    settlement: false,
    review: false,
    privacy: false,
  });

  function validate(form: FormData): FieldErrors {
    const next: FieldErrors = {};
    if (!String(form.get("companyName")).trim()) next.companyName = "상호명을 입력해 주세요.";
    if (!String(form.get("representativeName")).trim()) next.representativeName = "대표자명을 입력해 주세요.";
    const biz = String(form.get("businessNumber"));
    if (!validateBusinessNumber(biz)) next.businessNumber = "000-00-00000 형식으로 입력해 주세요.";
    if (!String(form.get("contactName")).trim()) next.contactName = "담당자 이름을 입력해 주세요.";
    if (!String(form.get("contactPhone")).trim()) next.contactPhone = "담당자 연락처를 입력해 주세요.";
    if (!String(form.get("contactEmail")).trim()) next.contactEmail = "담당자 이메일을 입력해 주세요.";
    if (!consents.terms || !consents.settlement || !consents.review || !consents.privacy) {
      next.consents = "필수 약관에 모두 동의해 주세요.";
    }
    return next;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className={`${ui.panel} space-y-3 text-center`}>
        <p className="text-base font-black text-wadeal-ink">입점 신청이 접수되었습니다</p>
        <p className="text-xs font-bold leading-relaxed text-wadeal-muted">
          mock UI — 실제 DB 저장 없음. 관리자 검토 후 승인 안내를 받게 됩니다.
        </p>
        <Link className={`${ui.btnPrimary} inline-flex h-11 items-center px-6`} href="/seller/dashboard">
          대시보드로
        </Link>
      </div>
    );
  }

  return (
    <form className={`${ui.panel} space-y-4`} onSubmit={handleSubmit}>
      <p className="rounded-lg bg-[#F5F7F6] px-3 py-2 text-[11px] font-bold leading-relaxed text-wadeal-muted">
        운영 초안 mock — 제출 시 DB 저장 없음. 파일 업로드는 placeholder만 표시됩니다.
      </p>

      {(["companyName", "representativeName", "businessNumber", "mailOrderNumber"] as const).map((name) => (
        <div key={name}>
          <label className={ui.label} htmlFor={name}>
            {name === "companyName" ? "브랜드/상호명" : name === "representativeName" ? "대표자명" : name === "businessNumber" ? "사업자등록번호" : "통신판매업 신고번호"}
          </label>
          <input
            className={ui.input}
            id={name}
            name={name}
            placeholder={name === "businessNumber" ? "000-00-00000" : undefined}
          />
          {errors[name] ? <p className="mt-1 text-[11px] font-bold text-wadeal-red">{errors[name]}</p> : null}
        </div>
      ))}

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={ui.label} htmlFor="contactName">담당자 이름</label>
          <input className={ui.input} id="contactName" name="contactName" />
          {errors.contactName ? <p className="mt-1 text-[11px] font-bold text-wadeal-red">{errors.contactName}</p> : null}
        </div>
        <div>
          <label className={ui.label} htmlFor="contactPhone">담당자 연락처</label>
          <input className={ui.input} id="contactPhone" name="contactPhone" />
          {errors.contactPhone ? <p className="mt-1 text-[11px] font-bold text-wadeal-red">{errors.contactPhone}</p> : null}
        </div>
      </div>
      <div>
        <label className={ui.label} htmlFor="contactEmail">담당자 이메일</label>
        <input className={ui.input} id="contactEmail" name="contactEmail" type="email" />
        {errors.contactEmail ? <p className="mt-1 text-[11px] font-bold text-wadeal-red">{errors.contactEmail}</p> : null}
      </div>
      <div>
        <label className={ui.label} htmlFor="category">판매 카테고리</label>
        <select className={ui.input} id="category" name="category">
          {SELLER_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div>
        <label className={ui.label} htmlFor="intro">대표 상품 설명</label>
        <textarea className={`${ui.input} min-h-20`} id="intro" name="intro" placeholder="판매 예정 상품과 브랜드 소개" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-dashed border-wadeal-line bg-gray-50 px-3 py-4 text-center text-[11px] font-bold text-wadeal-muted">
          사업자등록증 업로드 (placeholder)
        </div>
        <div className="rounded-xl border border-dashed border-wadeal-line bg-gray-50 px-3 py-4 text-center text-[11px] font-bold text-wadeal-muted">
          통신판매업 신고증 업로드 (placeholder)
        </div>
      </div>
      <div className="rounded-xl border border-dashed border-wadeal-line bg-gray-50 px-3 py-3 text-[11px] font-bold text-wadeal-muted">
        정산 계좌: 은행명 / ****-**** / 예금주 (placeholder — 실제 저장 없음)
      </div>

      <fieldset className="space-y-2">
        <legend className="text-xs font-black text-wadeal-ink">약관 동의</legend>
        {[
          { key: "terms" as const, label: "판매자 이용약관", href: "/policies/seller" },
          { key: "settlement" as const, label: "정산 정책", href: "/policies/seller" },
          { key: "review" as const, label: "상품 검수 기준", href: "/policies/seller" },
          { key: "privacy" as const, label: "개인정보 처리 위탁 동의", href: "/policies/privacy" },
        ].map((item) => (
          <label className="flex items-start gap-2 text-xs font-bold text-wadeal-ink" key={item.key}>
            <input
              checked={consents[item.key]}
              className="mt-0.5"
              onChange={(e) => setConsents((c) => ({ ...c, [item.key]: e.target.checked }))}
              type="checkbox"
            />
            <span>
              [필수]{" "}
              <Link className="text-wadeal-red underline" href={item.href} target="_blank">
                {item.label}
              </Link>
            </span>
          </label>
        ))}
        {errors.consents ? <p className="text-[11px] font-bold text-wadeal-red">{errors.consents}</p> : null}
      </fieldset>

      <button className={`${ui.btnPrimary} w-full`} type="submit">
        입점 신청하기 (mock)
      </button>
    </form>
  );
}

export function SellerProductRequestMockForm() {
  const [status, setStatus] = useState<MockProductRequestStatus>("draft");
  const [feedback, setFeedback] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitted");
    setFeedback("상품 등록 요청이 접수되었습니다. (mock — DB 저장 없음)");
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <p className="text-[11px] font-bold text-wadeal-muted">
        상태: {status === "draft" ? "작성중" : "검수요청"} · mock submit only
      </p>
      <input className={ui.input} name="productName" placeholder="상품명 *" required />
      <select className={ui.input} name="category">
        {SELLER_CATEGORIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <div className="grid gap-2 sm:grid-cols-3">
        <input className={ui.input} name="salePrice" placeholder="판매가 *" required type="number" />
        <input className={ui.input} name="originalPrice" placeholder="원가격" type="number" />
        <input className={ui.input} name="discountRate" placeholder="할인율 (%)" type="number" />
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="rounded-xl border border-dashed border-wadeal-line bg-gray-50 px-3 py-6 text-center text-[11px] font-bold text-wadeal-muted">
          대표 이미지 (placeholder)
        </div>
        <div className="rounded-xl border border-dashed border-wadeal-line bg-gray-50 px-3 py-6 text-center text-[11px] font-bold text-wadeal-muted">
          상세 이미지 (placeholder)
        </div>
      </div>
      <input className={ui.input} name="stock" placeholder="재고 수량" type="number" />
      <select className={ui.input} name="shippingType">
        <option value="parcel">택배</option>
        <option value="direct">직배송</option>
      </select>
      <div className="grid gap-2 sm:grid-cols-2">
        <input className={ui.input} name="shippingFee" placeholder="배송비" type="number" />
        <input className={ui.input} name="freeShippingThreshold" placeholder="무료배송 기준 (원)" type="number" />
      </div>
      <label className="flex items-center gap-2 text-xs font-bold text-wadeal-ink">
        <input defaultChecked name="returnable" type="checkbox" /> 교환/반품 가능
      </label>
      <input className={ui.input} name="origin" placeholder="제조/원산지" />
      <input className={ui.input} name="expiry" placeholder="소비기한/유통기한 (placeholder)" />
      <input className={ui.input} name="certification" placeholder="KC/인증 여부 (placeholder)" />
      <textarea className={`${ui.input} min-h-20`} name="description" placeholder="상품 설명" />
      <textarea className={`${ui.input} min-h-16`} name="sellingPoints" placeholder="판매 포인트" />
      <button className={`${ui.btnPrimary} h-11 w-full`} type="submit">
        관리자 검수 요청 (mock)
      </button>
      {feedback ? <p className="text-xs font-bold text-green-700" role="status">{feedback}</p> : null}
    </form>
  );
}
