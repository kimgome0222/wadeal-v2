import type { Json } from "@/lib/database/types";
import type { ErrorLevel, ErrorSource } from "@/lib/monitoring/error-log-shared";

export type AdminErrorLogListItem = {
  id: string;
  level: ErrorLevel;
  levelLabel: string;
  source: ErrorSource;
  sourceLabel: string;
  message: string;
  messagePreview: string;
  stack: string | null;
  userId: string | null;
  orderId: string | null;
  paymentId: string | null;
  dealId: string | null;
  productId: string | null;
  metadata: Json | null;
  resolvedAt: string | null;
  resolvedAtLabel: string | null;
  isResolved: boolean;
  createdAt: string;
  createdAtLabel: string;
};

export function getErrorLogRelatedHref(
  log: Pick<AdminErrorLogListItem, "orderId" | "paymentId" | "productId" | "dealId">,
): { label: string; href: string } | null {
  if (log.orderId) {
    return { label: "주문 관리", href: `/admin/orders?order=${log.orderId}` };
  }

  if (log.paymentId) {
    return { label: "결제 / 웹훅", href: "/admin/payments" };
  }

  if (log.productId) {
    return { label: "상품 상세", href: `/product/${log.productId}` };
  }

  if (log.dealId) {
    return { label: "주문 관리", href: "/admin/orders" };
  }

  return null;
}

export type AdminErrorLogFilters = {
  level?: ErrorLevel;
  source?: ErrorSource;
  resolved?: "all" | "open" | "resolved";
  page?: number;
  pageSize?: number;
};

export type AdminErrorLogListResult = {
  logs: AdminErrorLogListItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
