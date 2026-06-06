"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  FAQ_CATEGORIES,
  FAQ_ITEMS,
  type FaqCategoryId,
} from "@/lib/support/mock-customer-support-data";
import { ui } from "@/lib/ui";

type FaqAccordionPanelProps = {
  initialCategory?: FaqCategoryId | "all";
  initialQuery?: string;
};

export function FaqAccordionPanel({
  initialCategory = "all",
  initialQuery = "",
}: FaqAccordionPanelProps) {
  const [category, setCategory] = useState<FaqCategoryId | "all">(initialCategory);
  const [query, setQuery] = useState(initialQuery);
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAQ_ITEMS.filter((item) => {
      const matchCategory = category === "all" || item.category === category;
      const matchQuery =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q);
      return matchCategory && matchQuery;
    });
  }, [category, query]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className={ui.label} htmlFor="faq-search">
          FAQ 검색
        </label>
        <input
          className={ui.input}
          id="faq-search"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="키워드로 검색"
          type="search"
          value={query}
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${
            category === "all" ?
              "bg-wadeal-red text-white"
            : "bg-wadeal-surface text-wadeal-muted"
          }`}
          onClick={() => setCategory("all")}
          type="button"
        >
          전체
        </button>
        {FAQ_CATEGORIES.map((cat) => (
          <button
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${
              category === cat.id ?
                "bg-wadeal-red text-white"
              : "bg-wadeal-surface text-wadeal-muted"
            }`}
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            type="button"
          >
            {cat.label}
          </button>
        ))}
      </div>

      <p className="text-[11px] font-medium text-wadeal-muted">총 {filtered.length}건</p>

      {filtered.length === 0 ?
        <div className={`${ui.panel} text-center text-sm font-medium text-wadeal-muted`}>
          검색 결과가 없어요.
          <Link className="mt-2 block text-wadeal-red" href="/support/contact">
            1:1 문의하기
          </Link>
        </div>
      : (
        <ul className="space-y-2">
          {filtered.map((item) => {
            const isOpen = openId === item.id;
            return (
              <li className="overflow-hidden rounded-2xl border border-wadeal-line bg-white" key={item.id}>
                <button
                  aria-expanded={isOpen}
                  className="flex w-full items-start justify-between gap-3 px-4 py-3.5 text-left"
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  type="button"
                >
                  <span className="text-sm font-semibold text-wadeal-ink">{item.question}</span>
                  <span aria-hidden className="shrink-0 text-wadeal-muted">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen ?
                  <div className="border-t border-wadeal-line bg-wadeal-surface px-4 py-3.5 text-xs font-medium leading-relaxed text-wadeal-muted">
                    {item.answer}
                  </div>
                : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
