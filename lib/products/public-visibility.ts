/** Supabase nested filter: products must be approved for public catalog queries. */
export const PUBLIC_PRODUCT_APPROVAL_STATUS = "approved" as const;

/** Apply alongside deal status = active and products.is_active = true. */
export function publicProductApprovalFilter(column = "products.approval_status"): {
  column: string;
  value: typeof PUBLIC_PRODUCT_APPROVAL_STATUS;
} {
  return { column, value: PUBLIC_PRODUCT_APPROVAL_STATUS };
}
