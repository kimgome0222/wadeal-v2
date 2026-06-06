export type SellerBillingType = "ad_fee" | "extra_charge";
export type SellerBillingStatus = "pending" | "paid" | "overdue";

export function getSellerBillingTypeLabel(type: SellerBillingType): string {
  switch (type) {
    case "ad_fee":
      return "광고비";
    case "extra_charge":
      return "기타 청구";
    default:
      return type;
  }
}

export function getSellerBillingStatusLabel(status: SellerBillingStatus): string {
  switch (status) {
    case "pending":
      return "납부 대기";
    case "paid":
      return "납부 완료";
    case "overdue":
      return "연체";
    default:
      return status;
  }
}

export function sellerBillingStatusTone(status: SellerBillingStatus): string {
  switch (status) {
    case "pending":
      return "bg-amber-50 text-amber-700";
    case "paid":
      return "bg-green-50 text-green-700";
    case "overdue":
      return "bg-[#F5F8F4] text-[#244C3F]";
    default:
      return "bg-gray-100 text-wadeal-muted";
  }
}
