import Link from "next/link";
import type { SupportTicketListItem } from "@/lib/data/support-tickets-shared";
import { getSupportStatusLabel, getSupportTypeLabel } from "@/lib/support/ticket-rules";
import { ui } from "@/lib/ui";

type SupportTicketCardProps = {
  ticket: SupportTicketListItem;
};

function statusTone(status: SupportTicketListItem["status"]): string {
  if (status === "open") {
    return "bg-red-50 text-wadeal-red";
  }
  if (status === "answered" || status === "resolved") {
    return "bg-green-50 text-green-700";
  }
  if (status === "in_progress") {
    return "bg-amber-50 text-amber-700";
  }
  return "bg-gray-100 text-wadeal-muted";
}

export function SupportTicketCard({ ticket }: SupportTicketCardProps) {
  return (
    <Link className={ui.panelClickable} href={`/support/${ticket.id}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <p className="truncate text-sm font-black text-wadeal-ink">{ticket.title}</p>
          <p className="text-xs font-bold text-wadeal-muted">
            {getSupportTypeLabel(ticket.type)} · {ticket.createdAtLabel}
          </p>
        </div>
        <span
          className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-black ${statusTone(ticket.status)}`}
        >
          {getSupportStatusLabel(ticket.status)}
        </span>
      </div>
      {ticket.adminReply ?
        <p className="mt-2 line-clamp-2 text-xs font-bold text-wadeal-muted">
          답변: {ticket.adminReply}
        </p>
      : null}
    </Link>
  );
}
