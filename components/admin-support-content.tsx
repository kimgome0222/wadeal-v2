"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import {
  adminReplySupportTicketAction,
  adminUpdateSupportTicketStatusAction,
} from "@/app/actions/support";
import type {
  SupportTicketEscalatedFilter,
  SupportTicketListItem,
  SupportTicketStatusFilter,
  SupportTicketTypeFilter,
} from "@/lib/data/support-tickets-shared";
import {
  SUPPORT_TICKET_STATUSES,
  SUPPORT_TICKET_TYPES,
  getSupportStatusLabel,
  getSupportTypeLabel,
  isEscalatedSupportTicket,
  type SupportTicketStatus,
} from "@/lib/support/ticket-rules";
import { ui } from "@/lib/ui";

type AdminSupportContentProps = {
  tickets: SupportTicketListItem[];
  initialStatusFilter: SupportTicketStatusFilter;
  initialTypeFilter: SupportTicketTypeFilter;
  initialEscalatedFilter: SupportTicketEscalatedFilter;
  openEscalatedCount: number;
};

export function AdminSupportContent({
  tickets,
  initialStatusFilter,
  initialTypeFilter,
  initialEscalatedFilter,
  openEscalatedCount,
}: AdminSupportContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter);
  const [typeFilter, setTypeFilter] = useState(initialTypeFilter);
  const [escalatedFilter, setEscalatedFilter] = useState(initialEscalatedFilter);

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      if (statusFilter !== "all" && ticket.status !== statusFilter) {
        return false;
      }

      if (typeFilter !== "all" && ticket.type !== typeFilter) {
        return false;
      }

      if (escalatedFilter === "escalated" && !isEscalatedSupportTicket(ticket)) {
        return false;
      }

      return true;
    });
  }, [escalatedFilter, statusFilter, typeFilter, tickets]);

  function applyFilters(
    nextStatus: SupportTicketStatusFilter,
    nextType: SupportTicketTypeFilter,
    nextEscalated: SupportTicketEscalatedFilter = escalatedFilter,
  ) {
    const params = new URLSearchParams(searchParams.toString());

    if (nextStatus === "all") {
      params.delete("status");
    } else {
      params.set("status", nextStatus);
    }

    if (nextType === "all") {
      params.delete("type");
    } else {
      params.set("type", nextType);
    }

    if (nextEscalated === "escalated") {
      params.set("escalated", "1");
    } else {
      params.delete("escalated");
    }

    router.replace(`/admin/support?${params.toString()}`);
  }

  return (
    <div className="space-y-3">
      {openEscalatedCount > 0 ?
        <div className="flex flex-wrap gap-2">
          <button
            className={`${ui.btnOutline} h-9 px-3 text-xs ${
              escalatedFilter === "escalated" ? "border-wadeal-red text-wadeal-red" : ""
            }`}
            onClick={() => {
              const next = escalatedFilter === "escalated" ? "all" : "escalated";
              setEscalatedFilter(next);
              applyFilters(statusFilter, typeFilter, next);
            }}
            type="button"
          >
            긴급 문의 ({openEscalatedCount})
          </button>
        </div>
      : null}
      <div className="grid grid-cols-2 gap-2">
        <select
          className={ui.input}
          onChange={(event) => {
            const next = event.target.value as SupportTicketStatusFilter;
            setStatusFilter(next);
            applyFilters(next, typeFilter);
          }}
          value={statusFilter}
        >
          <option value="all">전체 상태</option>
          {SUPPORT_TICKET_STATUSES.map((status) => (
            <option key={status} value={status}>
              {getSupportStatusLabel(status)}
            </option>
          ))}
        </select>

        <select
          className={ui.input}
          onChange={(event) => {
            const next = event.target.value as SupportTicketTypeFilter;
            setTypeFilter(next);
            applyFilters(statusFilter, next);
          }}
          value={typeFilter}
        >
          <option value="all">전체 유형</option>
          {SUPPORT_TICKET_TYPES.map((type) => (
            <option key={type} value={type}>
              {getSupportTypeLabel(type)}
            </option>
          ))}
        </select>
      </div>

      <p className="text-xs font-bold text-wadeal-muted">
        총 {filteredTickets.length.toLocaleString("ko-KR")}건
      </p>

      {filteredTickets.length === 0 ?
        <div className="rounded-xl border border-dashed border-wadeal-line bg-white px-6 py-12 text-center">
          <p className="text-sm font-black text-wadeal-ink">표시할 문의가 없어요.</p>
        </div>
      : filteredTickets.map((ticket) => (
          <Link
            className={ui.panelClickable}
            href={`/admin/support/${ticket.id}`}
            key={ticket.id}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <p className="truncate text-sm font-black text-wadeal-ink">{ticket.title}</p>
                <p className="text-xs font-bold text-wadeal-muted">
                  {getSupportTypeLabel(ticket.type)} · {ticket.createdAtLabel}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                {isEscalatedSupportTicket(ticket) ?
                  <span className="rounded bg-red-100 px-2 py-0.5 text-[10px] font-black text-wadeal-red">
                    긴급
                  </span>
                : null}
                <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-black text-wadeal-ink">
                  {getSupportStatusLabel(ticket.status)}
                </span>
              </div>
            </div>
          </Link>
        ))
      }
    </div>
  );
}

type AdminSupportDetailContentProps = {
  ticket: SupportTicketListItem;
};

export function AdminSupportDetailContent({ ticket }: AdminSupportDetailContentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [adminReply, setAdminReply] = useState(ticket.adminReply ?? "");
  const [status, setStatus] = useState<SupportTicketStatus>(ticket.status);
  const [feedback, setFeedback] = useState<{ tone: "success" | "error"; message: string } | null>(
    null,
  );

  function handleReplySubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    startTransition(async () => {
      const result = await adminReplySupportTicketAction({
        ticketId: ticket.id,
        adminReply,
        status: "answered",
      });

      if (result.success) {
        setFeedback({ tone: "success", message: "답변이 등록됐어요." });
        setStatus("answered");
        router.refresh();
        return;
      }

      setFeedback({ tone: "error", message: "답변 등록에 실패했어요." });
    });
  }

  function handleStatusUpdate() {
    setFeedback(null);

    startTransition(async () => {
      const result = await adminUpdateSupportTicketStatusAction({
        ticketId: ticket.id,
        status,
      });

      if (result.success) {
        setFeedback({ tone: "success", message: "상태가 변경됐어요." });
        router.refresh();
        return;
      }

      setFeedback({ tone: "error", message: "상태 변경에 실패했어요." });
    });
  }

  return (
    <div className="space-y-4">
      {feedback ?
        <p
          className={`rounded-lg px-3 py-2 text-xs font-bold ${
            feedback.tone === "success" ?
              "bg-green-50 text-green-700"
            : "bg-red-50 text-wadeal-red"
          }`}
        >
          {feedback.message}
        </p>
      : null}

      <article className={ui.panel}>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-sm font-black text-wadeal-ink">{ticket.title}</p>
            <p className="text-xs font-bold text-wadeal-muted">
              {getSupportTypeLabel(ticket.type)} · {ticket.createdAtLabel}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1">
            {isEscalatedSupportTicket(ticket) ?
              <span className="rounded bg-red-100 px-2 py-0.5 text-[10px] font-black text-wadeal-red">
                긴급
              </span>
            : null}
            <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-black text-wadeal-ink">
              {getSupportStatusLabel(ticket.status)}
            </span>
          </div>
        </div>

        <p className="mt-4 whitespace-pre-wrap text-sm font-bold leading-relaxed text-wadeal-ink">
          {ticket.content}
        </p>
      </article>

      <div className={ui.panel}>
        <label className={ui.label} htmlFor="admin-support-status">
          처리 상태
        </label>
        <div className="flex gap-2">
          <select
            className={ui.input}
            id="admin-support-status"
            onChange={(event) => setStatus(event.target.value as SupportTicketStatus)}
            value={status}
          >
            {SUPPORT_TICKET_STATUSES.map((item) => (
              <option key={item} value={item}>
                {getSupportStatusLabel(item)}
              </option>
            ))}
          </select>
          <button
            className={`${ui.btnOutline} shrink-0 px-4 disabled:opacity-50`}
            disabled={isPending}
            onClick={handleStatusUpdate}
            type="button"
          >
            변경
          </button>
        </div>
      </div>

      <form className={ui.panel} onSubmit={handleReplySubmit}>
        <label className={ui.label} htmlFor="admin-support-reply">
          관리자 답변
        </label>
        <textarea
          className={`${ui.input} min-h-[120px] py-3`}
          id="admin-support-reply"
          onChange={(event) => setAdminReply(event.target.value)}
          placeholder="고객에게 전달할 답변을 입력해 주세요"
          required
          value={adminReply}
        />
        <button className={`${ui.btnPrimary} mt-3 disabled:opacity-50`} disabled={isPending} type="submit">
          {isPending ? "등록 중..." : "답변 등록"}
        </button>
      </form>
    </div>
  );
}
