"use client";

import Link from "next/link";
import { useState } from "react";

import {
  MOCK_SUPPORT_TICKETS,
  getMockTicketById,
  getTicketStatusLabel,
  type MockSupportTicket,
} from "@/lib/support/mock-customer-support-data";
import { ui } from "@/lib/ui";

type SupportTicketsMockPanelProps = {
  showLoginHint?: boolean;
};

export function SupportTicketsMockPanel({ showLoginHint = false }: SupportTicketsMockPanelProps) {
  const [tickets, setTickets] = useState<MockSupportTicket[]>(MOCK_SUPPORT_TICKETS);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = selectedId ? getMockTicketById(selectedId) ?? tickets.find((t) => t.id === selectedId) : null;

  function handleMockReply(ticketId: string) {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId ?
          {
            ...ticket,
            status: "answered" as const,
            reply: "mock 답변 — 실제 저장 없음. 문의 확인 후 순차 안내드립니다.",
            repliedAt: new Date().toISOString().slice(0, 10),
          }
        : ticket,
      ),
    );
  }

  if (selected) {
    return (
      <div className="space-y-4">
        <button
          className="text-xs font-semibold text-wadeal-red"
          onClick={() => setSelectedId(null)}
          type="button"
        >
          ← 목록
        </button>
        <div className={`${ui.panel} space-y-3`}>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-wadeal-surface px-2 py-0.5 text-[10px] font-black text-wadeal-muted">
              {getTicketStatusLabel(selected.status)}
            </span>
            <span className="text-[11px] font-medium text-wadeal-muted">{selected.ticketNumber}</span>
          </div>
          <h2 className="text-base font-bold text-wadeal-ink">{selected.title}</h2>
          <p className="text-[11px] font-medium text-wadeal-muted">
            {selected.type} · {selected.createdAt}
          </p>
          <p className="text-sm font-medium leading-relaxed text-wadeal-ink">{selected.body}</p>
          {selected.reply ?
            <div className="rounded-xl bg-[#F5F7F6] px-3 py-3">
              <p className="text-[11px] font-bold text-wadeal-red">답변</p>
              <p className="mt-1 text-xs font-medium leading-relaxed text-wadeal-muted">{selected.reply}</p>
              {selected.repliedAt ?
                <p className="mt-2 text-[10px] text-wadeal-muted">{selected.repliedAt}</p>
              : null}
            </div>
          : (
            <button
              className={`${ui.btnOutline} text-sm`}
              onClick={() => handleMockReply(selected.id)}
              type="button"
            >
              mock 답변 표시
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showLoginHint ?
        <p className="rounded-lg bg-[#F5F7F6] px-3 py-2 text-[11px] font-medium text-wadeal-muted">
          로그인 시 실제 문의 내역이 함께 표시됩니다. 아래는 mock 샘플입니다.
        </p>
      : (
        <p className="rounded-lg bg-[#F5F7F6] px-3 py-2 text-[11px] font-medium text-wadeal-muted">
          mock 문의 내역 — local state만 사용, DB 저장 없음
        </p>
      )}

      <div className="flex justify-end">
        <Link className={`${ui.btnPrimary} inline-flex h-10 items-center px-4 text-sm`} href="/support/contact">
          1:1 문의
        </Link>
      </div>

      <ul className="space-y-2">
        {tickets.map((ticket) => (
          <li key={ticket.id}>
            <button
              className={`${ui.panelClickable} w-full text-left`}
              onClick={() => setSelectedId(ticket.id)}
              type="button"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full bg-wadeal-surface px-2 py-0.5 text-[10px] font-black text-wadeal-muted">
                  {getTicketStatusLabel(ticket.status)}
                </span>
                <span className="text-[10px] font-medium text-wadeal-muted">{ticket.createdAt}</span>
              </div>
              <p className="mt-2 text-sm font-semibold text-wadeal-ink">{ticket.title}</p>
              <p className="mt-1 text-[11px] font-medium text-wadeal-muted">
                {ticket.ticketNumber} · {ticket.type}
              </p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
