import type { SupportTicketListItem } from "@/lib/data/support-tickets-shared";
import { getSupportStatusLabel, getSupportTypeLabel } from "@/lib/support/ticket-rules";
import { ui } from "@/lib/ui";

type SupportTicketDetailProps = {
  ticket: SupportTicketListItem;
};

function formatTimestamp(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function SupportTicketDetail({ ticket }: SupportTicketDetailProps) {
  return (
    <div className="space-y-3">
      <article className={ui.panel}>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-sm font-black text-wadeal-ink">{ticket.title}</p>
            <p className="text-xs font-bold text-wadeal-muted">
              {getSupportTypeLabel(ticket.type)} · {formatTimestamp(ticket.createdAt)}
            </p>
          </div>
          <span className="shrink-0 rounded bg-gray-100 px-2 py-0.5 text-[10px] font-black text-wadeal-ink">
            {getSupportStatusLabel(ticket.status)}
          </span>
        </div>

        <p className="mt-4 whitespace-pre-wrap text-sm font-bold leading-relaxed text-wadeal-ink">
          {ticket.content}
        </p>
      </article>

      {ticket.adminReply ?
        <article className="rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="text-xs font-black text-green-700">관리자 답변</p>
          <p className="mt-2 whitespace-pre-wrap text-sm font-bold leading-relaxed text-green-900">
            {ticket.adminReply}
          </p>
        </article>
      : (
        <p className="rounded-xl bg-wadeal-surface px-4 py-3 text-xs font-bold text-wadeal-muted">
          답변 대기 중이에요. 처리되면 알림으로 안내해 드릴게요.
        </p>
      )}
    </div>
  );
}
