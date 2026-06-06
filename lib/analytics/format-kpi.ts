import { formatOrderCurrency } from "@/lib/orders/admin-order-status";

/** KPI 숫자 포맷 — 대시보드 mock/표시 공통 */
export function formatKpiCount(value: number): string {
  return value.toLocaleString("ko-KR");
}

export function formatKpiCurrency(value: number): string {
  return formatOrderCurrency(value);
}

export function formatKpiPercent(value: number): string {
  return `${value.toLocaleString("ko-KR")}%`;
}

export function formatKpiDelta(deltaPercent: number | null | undefined): string | undefined {
  if (deltaPercent == null || Number.isNaN(deltaPercent)) {
    return undefined;
  }

  const sign = deltaPercent > 0 ? "+" : "";
  return `${sign}${deltaPercent.toLocaleString("ko-KR")}% vs 전일`;
}
