import {
  isEscalatedSupportTicketType,
  isSupportTicketStatus,
  isSupportTicketType,
  type SupportTicketStatus,
  type SupportTicketType,
} from "@/lib/support/ticket-rules";

export type SupportTicketListItem = {
  id: string;
  userId: string;
  orderId: string | null;
  productId: string | null;
  dealId: string | null;
  type: SupportTicketType;
  title: string;
  content: string;
  status: SupportTicketStatus;
  adminReply: string | null;
  createdAt: string;
  createdAtLabel: string;
  updatedAt: string;
  resolvedAt: string | null;
  orderProductName?: string | null;
};

export type SupportTicketStatusFilter = SupportTicketStatus | "all";
export type SupportTicketTypeFilter = SupportTicketType | "all";
export type SupportTicketEscalatedFilter = "all" | "escalated";

export function parseSupportEscalatedFilter(
  value: string | undefined,
): SupportTicketEscalatedFilter {
  if (value === "escalated" || value === "1" || value === "true") {
    return "escalated";
  }

  return "all";
}

export function isEscalatedSupportTicket(ticket: Pick<SupportTicketListItem, "type">): boolean {
  return isEscalatedSupportTicketType(ticket.type);
}

export function filterSupportTickets(
  tickets: SupportTicketListItem[],
  statusFilter: SupportTicketStatusFilter,
  typeFilter: SupportTicketTypeFilter,
  escalatedFilter: SupportTicketEscalatedFilter = "all",
): SupportTicketListItem[] {
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
}

export function countOpenEscalatedSupportTickets(tickets: SupportTicketListItem[]): number {
  return tickets.filter(
    (ticket) =>
      isEscalatedSupportTicket(ticket) &&
      ticket.status !== "resolved" &&
      ticket.status !== "closed",
  ).length;
}

export function parseSupportStatusFilter(value: string | undefined): SupportTicketStatusFilter {
  if (!value || value === "all") {
    return "all";
  }

  return isSupportTicketStatus(value) ? value : "all";
}

export function parseSupportTypeFilter(value: string | undefined): SupportTicketTypeFilter {
  if (!value || value === "all") {
    return "all";
  }

  return isSupportTicketType(value) ? value : "all";
}
