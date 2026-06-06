import {
  getSettlementStatusLabel,
  type SettlementStatus,
} from "@/lib/settlements/labels";

export type AdminSettlementListItem = {
  id: string;
  supplierId: string;
  supplierName: string;
  dealId: string;
  productId: string;
  productName: string;
  totalSalesAmount: number;
  commissionRate: number;
  commissionAmount: number;
  settlementAmount: number;
  status: SettlementStatus;
  settledAt: string | null;
  createdAt: string;
};

export type AdminSettlementDetail = AdminSettlementListItem & {
  updatedAt: string;
};

export type AdminSettlementStatusFilter = SettlementStatus | "all";

export const ADMIN_SETTLEMENT_STATUS_FILTER_OPTIONS: Array<{
  value: AdminSettlementStatusFilter;
  label: string;
}> = [
  { value: "all", label: "전체" },
  { value: "pending", label: getSettlementStatusLabel("pending") },
  { value: "confirmed", label: getSettlementStatusLabel("confirmed") },
  { value: "paid", label: getSettlementStatusLabel("paid") },
  { value: "cancelled", label: getSettlementStatusLabel("cancelled") },
];

export { getSettlementStatusLabel, settlementStatusTone } from "@/lib/settlements/labels";
