export const SELLER_SETTLEMENT_RECORD_STATUSES = [
  "pending_seller_confirm",
  "seller_confirmed",
  "confirmed",
  "payout_requested",
  "payout_rejected",
  "paid",
  "cancelled",
] as const;

export type SellerSettlementRecordStatus = (typeof SELLER_SETTLEMENT_RECORD_STATUSES)[number];

export const SELLER_BILLING_STATUSES = [
  "pending",
  "pending_deduction",
  "paid",
  "overdue",
  "cancelled",
] as const;

export type SellerBillingStatus = (typeof SELLER_BILLING_STATUSES)[number];

export const SELLER_BILLING_PAYMENT_MODES = ["immediate", "settlement_deduction"] as const;

export type SellerBillingPaymentMode = (typeof SELLER_BILLING_PAYMENT_MODES)[number];

export const SETTLEMENT_RECORD_ITEM_TYPES = [
  "sales",
  "platform_fee",
  "ad_fee",
  "coupon_burden",
  "other",
] as const;

export type SettlementRecordItemType = (typeof SETTLEMENT_RECORD_ITEM_TYPES)[number];

export type SellerSettlementRecordItem = {
  id: string;
  itemType: SettlementRecordItemType;
  label: string;
  amount: number;
  sortOrder: number;
};

export type SellerSettlementRecord = {
  id: string;
  sellerId: string;
  periodStart: string;
  periodEnd: string;
  grossSalesAmount: number;
  platformFeeAmount: number;
  adDeductionAmount: number;
  otherDeductionAmount: number;
  netPayoutAmount: number;
  status: SellerSettlementRecordStatus;
  sellerConfirmedAt: string | null;
  confirmedAt: string | null;
  paidAt: string | null;
  depositConfirmedAt: string | null;
  receiptReference: string | null;
  payoutBankName: string | null;
  payoutAccountNumber: string | null;
  payoutAccountHolder: string | null;
  payoutRequestedAt: string | null;
  payoutRejectReason: string | null;
  payoutRejectedAt: string | null;
  createdAt: string;
  items: SellerSettlementRecordItem[];
};

export type SellerBillingRecord = {
  id: string;
  sellerId: string;
  billingType: "ad_fee" | "extra_charge";
  amount: number;
  status: SellerBillingStatus;
  paymentMode: SellerBillingPaymentMode;
  description: string | null;
  dueDate: string | null;
  paidAt: string | null;
  settlementRecordId: string | null;
  createdAt: string;
};

const SETTLEMENT_STATUS_LABELS: Record<SellerSettlementRecordStatus, string> = {
  pending_seller_confirm: "확인 대기",
  seller_confirmed: "판매자 확인 완료",
  confirmed: "정산 확정",
  payout_requested: "출금요청 접수",
  payout_rejected: "출금요청 반려",
  paid: "입금 완료",
  cancelled: "취소",
};

const BILLING_STATUS_LABELS: Record<SellerBillingStatus, string> = {
  pending: "결제 대기",
  pending_deduction: "정산 차감 예정",
  paid: "결제 완료",
  overdue: "연체",
  cancelled: "취소",
};

export function getSellerSettlementRecordStatusLabel(status: SellerSettlementRecordStatus): string {
  return SETTLEMENT_STATUS_LABELS[status] ?? status;
}

export function getSellerBillingStatusLabel(status: SellerBillingStatus): string {
  return BILLING_STATUS_LABELS[status] ?? status;
}

export function sellerSettlementStatusTone(status: SellerSettlementRecordStatus): string {
  switch (status) {
    case "pending_seller_confirm":
      return "bg-amber-50 text-amber-700";
    case "seller_confirmed":
      return "bg-blue-50 text-blue-700";
    case "confirmed":
      return "bg-indigo-50 text-indigo-700";
    case "payout_requested":
      return "bg-orange-50 text-orange-700";
    case "payout_rejected":
      return "bg-red-50 text-wadeal-red";
    case "paid":
      return "bg-green-50 text-green-700";
    default:
      return "bg-gray-100 text-wadeal-muted";
  }
}

export function sellerBillingStatusTone(status: SellerBillingStatus): string {
  switch (status) {
    case "pending":
      return "bg-amber-50 text-amber-700";
    case "pending_deduction":
      return "bg-blue-50 text-blue-700";
    case "paid":
      return "bg-green-50 text-green-700";
    case "overdue":
      return "bg-red-50 text-wadeal-red";
    default:
      return "bg-gray-100 text-wadeal-muted";
  }
}

export function formatSettlementPeriod(start: string, end: string): string {
  return `${start} ~ ${end}`;
}

export function formatKrw(amount: number): string {
  return `${new Intl.NumberFormat("ko-KR").format(amount)}원`;
}
