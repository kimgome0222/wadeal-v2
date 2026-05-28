export const REVIEW_REPORT_REASONS = [
  "부적절한 내용",
  "광고/스팸",
  "욕설/비방",
  "기타",
] as const;

export type ReviewReportReason = (typeof REVIEW_REPORT_REASONS)[number];

export function isReviewReportReason(value: string): value is ReviewReportReason {
  return REVIEW_REPORT_REASONS.includes(value as ReviewReportReason);
}
