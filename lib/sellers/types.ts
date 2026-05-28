export type SellerStatus =
  | "pending_review"
  | "under_review"
  | "approved"
  | "rejected"
  | "suspended";

export type SellerRecord = {
  id: string;
  userId: string;
  companyName: string;
  businessNumber: string;
  representativeName: string | null;
  businessRegistrationUrl: string | null;
  rejectedReason: string | null;
  status: SellerStatus;
  bankName: string | null;
  accountNumber: string | null;
  accountHolder: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SellerApplicationInput = {
  companyName: string;
  businessNumber: string;
  representativeName: string;
  businessRegistrationUrl?: string | null;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
};

export type SellerBankAccountInput = {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
};

export type SellerProfileInput = {
  companyName: string;
  businessNumber: string;
  representativeName: string;
};

const STATUS_LABELS: Record<SellerStatus, string> = {
  pending_review: "승인 대기",
  under_review: "보완 심사중",
  approved: "승인 완료",
  rejected: "반려",
  suspended: "정지",
};

export function getSellerStatusLabel(status: SellerStatus): string {
  return STATUS_LABELS[status] ?? status;
}

export function isSellerStatus(value: string): value is SellerStatus {
  return value in STATUS_LABELS;
}

export function isSellerApproved(status: SellerStatus): boolean {
  return status === "approved";
}
