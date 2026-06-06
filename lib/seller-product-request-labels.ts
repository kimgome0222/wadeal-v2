export type SellerProductRequestStatus =
  | "pending"
  | "under_review"
  | "approved"
  | "rejected"
  | "changes_requested";

const STATUS_LABELS: Record<SellerProductRequestStatus, string> = {
  pending: "접수",
  under_review: "검수중",
  approved: "승인",
  rejected: "반려",
  changes_requested: "수정요청",
};

export function getSellerProductRequestStatusLabel(status: SellerProductRequestStatus): string {
  return STATUS_LABELS[status] ?? status;
}
