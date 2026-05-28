export type SellerSettlementStatus = "pending" | "confirmed" | "deposit_confirmed";

export function getSellerSettlementStatusLabel(status: SellerSettlementStatus): string {
  switch (status) {
    case "pending":
      return "정산 대기";
    case "confirmed":
      return "정산 확정";
    case "deposit_confirmed":
      return "입금 완료";
    default:
      return status;
  }
}

export function sellerSettlementStatusTone(status: SellerSettlementStatus): string {
  switch (status) {
    case "pending":
      return "bg-amber-50 text-amber-700";
    case "confirmed":
      return "bg-blue-50 text-blue-700";
    case "deposit_confirmed":
      return "bg-green-50 text-green-700";
    default:
      return "bg-gray-100 text-wadeal-muted";
  }
}
