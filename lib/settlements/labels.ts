export type SupplierStatus = "active" | "paused" | "terminated";
export type SettlementStatus = "pending" | "confirmed" | "paid" | "cancelled";

export const DEFAULT_COMMISSION_RATE = 10;

export function getSupplierStatusLabel(status: SupplierStatus): string {
  switch (status) {
    case "active":
      return "활성";
    case "paused":
      return "일시중지";
    case "terminated":
      return "종료";
    default:
      return status;
  }
}

export function getSettlementStatusLabel(status: SettlementStatus): string {
  switch (status) {
    case "pending":
      return "정산 대기";
    case "confirmed":
      return "정산 확정";
    case "paid":
      return "지급 완료";
    case "cancelled":
      return "취소";
    default:
      return status;
  }
}

export function supplierStatusTone(status: SupplierStatus): string {
  switch (status) {
    case "active":
      return "bg-green-50 text-green-700";
    case "paused":
      return "bg-amber-50 text-amber-700";
    case "terminated":
      return "bg-gray-100 text-wadeal-muted";
    default:
      return "bg-gray-100 text-wadeal-muted";
  }
}

export function settlementStatusTone(status: SettlementStatus): string {
  switch (status) {
    case "pending":
      return "bg-amber-50 text-amber-700";
    case "confirmed":
      return "bg-blue-50 text-blue-700";
    case "paid":
      return "bg-green-50 text-green-700";
    case "cancelled":
      return "bg-gray-100 text-wadeal-muted";
    default:
      return "bg-gray-100 text-wadeal-muted";
  }
}
