export const PRODUCT_APPROVAL_STATUSES = [
  "draft",
  "pending_review",
  "approved",
  "rejected",
] as const;

export type ProductApprovalStatus = (typeof PRODUCT_APPROVAL_STATUSES)[number];

export type ProductApprovalFilter = ProductApprovalStatus | "all";

export const PRODUCT_APPROVAL_FILTER_OPTIONS: {
  value: ProductApprovalFilter;
  label: string;
}[] = [
  { value: "all", label: "전체" },
  { value: "draft", label: "임시저장" },
  { value: "pending_review", label: "검수 대기" },
  { value: "approved", label: "승인됨" },
  { value: "rejected", label: "반려됨" },
];

export type ProductSubmitIntent = "save_draft" | "submit_review";

export function isProductApprovalStatus(
  value: string | null | undefined,
): value is ProductApprovalStatus {
  return value != null && (PRODUCT_APPROVAL_STATUSES as readonly string[]).includes(value);
}

export function getProductApprovalStatusLabel(status: ProductApprovalStatus): string {
  switch (status) {
    case "draft":
      return "임시저장";
    case "pending_review":
      return "검수 대기";
    case "approved":
      return "승인됨";
    case "rejected":
      return "반려됨";
    default:
      return status;
  }
}

export function resolveApprovalStatusFromIntent(
  intent: ProductSubmitIntent,
): ProductApprovalStatus {
  return intent === "submit_review" ? "pending_review" : "draft";
}

export function approvalStatusTone(status: ProductApprovalStatus): string {
  switch (status) {
    case "approved":
      return "bg-green-50 text-green-700";
    case "pending_review":
      return "bg-blue-50 text-blue-700";
    case "rejected":
      return "bg-red-50 text-wadeal-red";
    default:
      return "bg-amber-50 text-amber-700";
  }
}

export function isPubliclyVisibleProduct(input: {
  isActive: boolean;
  approvalStatus: ProductApprovalStatus;
  dealStatus: string;
}): boolean {
  return (
    input.isActive &&
    input.approvalStatus === "approved" &&
    input.dealStatus === "active"
  );
}
