"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  FAQ_CATEGORIES,
  FAQ_TOP10,
  SUPPORT_NOTICES,
} from "@/lib/support/mock-customer-support-data";
import { ui } from "@/lib/ui";

type CustomerSupportHomeProps = {
  customerServiceEmail?: string | null;
  customerServicePhone?: string | null;
  kakaoChannelUrl?: string | null;
};

export function CustomerSupportHome({
  customerServiceEmail,
  customerServicePhone,
  kakaoChannelUrl,
}: CustomerSupportHomeProps) {
  const [query, setQuery] = useState("");

  const filteredTop = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FAQ_TOP10;
    return FAQ_TOP10.filter(
      (item) =>
        item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div className="space-y-5">
      <section className={`${ui.panel} space-y-3`}>
        <label className={ui.label} htmlFor="support-search">
          궁금한 내용을 검색해보세요
        </label>
        <input
          className={ui.input}
          id="support-search"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="예: 환불, 배송조회, 쿠폰"
          type="search"
          value={query}
        />
        {query.trim() ?
          <p className="text-[11px] font-medium text-wadeal-muted">
            FAQ TOP 10에서 검색 결과 {filteredTop.length}건
          </p>
        : null}
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-bold text-wadeal-ink">빠른 도움말</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {FAQ_CATEGORIES.map((cat) => (
            <Link
              className={`${ui.panelClickable} text-center text-xs font-bold text-wadeal-ink`}
              href={cat.href}
              key={cat.id}
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-wadeal-ink">자주 묻는 질문 TOP 10</h2>
          <Link className="text-xs font-semibold text-wadeal-red" href="/support/faq">
            전체 보기
          </Link>
        </div>
        <ul className="space-y-2">
          {filteredTop.length === 0 ?
            <li className={`${ui.panel} text-center text-xs font-medium text-wadeal-muted`}>
              검색 결과가 없어요. FAQ 전체에서 다시 찾아보세요.
            </li>
          : filteredTop.map((item, index) => (
              <li key={item.id}>
                <Link
                  className={`${ui.panelClickable} block`}
                  href={`/support/faq?q=${encodeURIComponent(item.question)}`}
                >
                  <p className="text-[11px] font-bold text-wadeal-red">Q{index + 1}</p>
                  <p className="mt-1 text-sm font-semibold text-wadeal-ink">{item.question}</p>
                </Link>
              </li>
            ))}
        </ul>
      </section>

      <section className="grid gap-2 sm:grid-cols-2">
        <Link className={`${ui.btnPrimary} flex h-12 items-center justify-center text-sm`} href="/support/contact">
          1:1 문의하기
        </Link>
        <Link className={`${ui.btnOutline} flex h-12 items-center justify-center text-sm`} href="/support/tickets">
          문의 내역
        </Link>
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-wadeal-ink">공지사항</h2>
          <Link className="text-xs font-semibold text-wadeal-red" href="/support/notices">
            더보기
          </Link>
        </div>
        <ul className="divide-y divide-wadeal-line overflow-hidden rounded-2xl border border-wadeal-line bg-white">
          {SUPPORT_NOTICES.slice(0, 3).map((notice) => (
            <li key={notice.id}>
              <Link
                className="flex items-start justify-between gap-3 px-4 py-3.5 hover:bg-wadeal-surface"
                href={`/support/notices/${notice.id}`}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-wadeal-ink">{notice.title}</p>
                  <p className="mt-0.5 text-[11px] font-medium text-wadeal-muted">{notice.date}</p>
                </div>
                {notice.important ?
                  <span className="shrink-0 rounded bg-wadeal-red/10 px-2 py-0.5 text-[10px] font-black text-wadeal-red">
                    중요
                  </span>
                : null}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className={`${ui.panel} space-y-2`}>
        <h2 className="text-sm font-bold text-wadeal-ink">운영시간 안내</h2>
        <p className="text-xs font-medium leading-relaxed text-wadeal-muted">
          평일 09:00 – 18:00 (점심 12:00 – 13:00)
          <br />
          주말·공휴일은 1:1 문의 접수만 가능하며, 답변은 영업일 기준 순차 처리됩니다.
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {kakaoChannelUrl ?
            <a
              className="rounded-lg bg-[#fee500] px-3 py-2 text-xs font-bold text-[#3c1e1e]"
              href={kakaoChannelUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              카카오톡 문의
            </a>
          : (
            <span className="rounded-lg bg-[#fee500]/50 px-3 py-2 text-xs font-bold text-[#3c1e1e]">
              카카오톡 문의 (준비중)
            </span>
          )}
          {customerServiceEmail ?
            <a
              className={`${ui.btnOutline} inline-flex h-9 items-center px-3 text-xs`}
              href={`mailto:${customerServiceEmail}?subject=${encodeURIComponent("[celloh] 고객센터 문의")}`}
            >
              이메일 문의
            </a>
          : (
            <span className={`${ui.btnOutline} inline-flex h-9 items-center px-3 text-xs opacity-60`}>
              이메일 문의 (준비중)
            </span>
          )}
        </div>
        {customerServicePhone ?
          <p className="text-[11px] font-medium text-wadeal-muted">고객센터 {customerServicePhone}</p>
        : null}
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-bold text-wadeal-ink">정책 안내</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "환불/교환", href: "/policies/refund" },
            { label: "배송", href: "/policies/shipping" },
            { label: "결제", href: "/policies/payment" },
            { label: "친구추천", href: "/policies/referral" },
            { label: "리뷰", href: "/policies/review" },
          ].map((link) => (
            <Link
              className="rounded-full border border-wadeal-line bg-white px-3 py-1.5 text-[11px] font-semibold text-wadeal-ink hover:bg-wadeal-surface"
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>

      <Link className={`${ui.btnOutline} block text-center text-sm`} href="/reports">
        신고하기
      </Link>
    </div>
  );
}
