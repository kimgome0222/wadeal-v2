import type { DealStatus } from "@/lib/types";
import type { PriceTierEntry } from "@/lib/pricing/tiers";
import type { ProductApprovalStatus } from "@/lib/products/approval-status";
import type { ShippingType } from "@/lib/shipping/types";

export type AdminProductStatus = "draft" | "active" | "ended";

export type AdminProductListItem = {
  productId: string;
  dealId: string;
  name: string;
  slug: string;
  groupPrice: number;
  originalPrice: number;
  discountRate: number;
  currentParticipants: number;
  targetParticipants: number;
  endsAt: string;
  status: AdminProductStatus;
  approvalStatus: ProductApprovalStatus;
  rejectedReason: string | null;
  approvedAt: string | null;
  createdBy: string | null;
  imageUrl: string | null;
  stockQuantity: number | null;
  minOrderQuantity: number;
  maxOrderQuantity: number;
  perUserLimit: number | null;
  maxQuantity: number | null;
};

export type AdminProductDetail = AdminProductListItem & {
  detailImageUrls: string[];
  priceTiers: PriceTierEntry[];
  shippingFee: number;
  freeShippingThreshold: number | null;
  shippingType: ShippingType;
  isFreeShipping: boolean;
  remoteAreaExtraFee: number;
};

export type AdminProductFormInput = {
  name: string;
  slug: string;
  groupPrice: number;
  originalPrice: number;
  imageUrl: string;
  detailImageUrls: string[];
  targetParticipants: number;
  currentParticipants: number;
  endsAt: string;
  status: AdminProductStatus;
  priceTiers: PriceTierEntry[];
  submitIntent: "save_draft" | "submit_review";
  stockQuantity: number | null;
  minOrderQuantity: number;
  maxOrderQuantity: number;
  perUserLimit: number | null;
  maxQuantity: number | null;
  shippingFee: number;
  freeShippingThreshold: number | null;
  shippingType: ShippingType;
  isFreeShipping: boolean;
  remoteAreaExtraFee: number;
};

export function computeDiscountRate(originalPrice: number, groupPrice: number): number {
  if (!Number.isFinite(originalPrice) || originalPrice <= 0) {
    return 0;
  }

  return Math.round(((originalPrice - groupPrice) / originalPrice) * 100);
}

export function mapDealStatusToAdmin(status: DealStatus): AdminProductStatus {
  if (status === "closed" || status === "cancelled") {
    return "ended";
  }

  return status;
}

export function mapAdminStatusToDeal(status: AdminProductStatus): DealStatus {
  if (status === "ended") {
    return "closed";
  }

  return status;
}

export function formatDetailImageUrls(urls: string[]): string {
  return urls.join("\n");
}

export function formatEndsAtForInput(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function formatAdminProductDeadline(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function adminProductStatusLabel(status: AdminProductStatus): string {
  if (status === "draft") {
    return "임시저장";
  }

  if (status === "ended") {
    return "종료";
  }

  return "진행중";
}
