import type { SupplierStatus } from "@/lib/settlements/labels";
import { getSupplierStatusLabel } from "@/lib/settlements/labels";

export type AdminSupplierListItem = {
  id: string;
  name: string;
  businessNumber: string | null;
  contactName: string | null;
  phone: string | null;
  email: string | null;
  status: SupplierStatus;
  commissionRate: number;
  productCount: number;
  createdAt: string;
};

export type AdminSupplierDetail = AdminSupplierListItem & {
  bankName: string | null;
  bankAccount: string | null;
  bankHolder: string | null;
  updatedAt: string;
};

export type AdminSupplierFormInput = {
  name: string;
  businessNumber: string;
  contactName: string;
  phone: string;
  email: string;
  bankName: string;
  bankAccount: string;
  bankHolder: string;
  status: SupplierStatus;
  commissionRate: number;
};

export { getSupplierStatusLabel };

export function formatCommissionRate(rate: number): string {
  if (!Number.isFinite(rate)) {
    return "0%";
  }

  return `${rate % 1 === 0 ? rate.toFixed(0) : rate.toFixed(2)}%`;
}
