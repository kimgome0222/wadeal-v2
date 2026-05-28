export const PRODUCT_REVIEW_CHECK_KEYS = [
  "prohibited_products_cleared",
  "category_requirements_met",
  "required_documents_verified",
  "exaggerated_claims_checked",
  "price_stock_shipping_verified",
] as const;

export type ProductReviewCheckKey = (typeof PRODUCT_REVIEW_CHECK_KEYS)[number];

export type ProductReviewCheckDefinition = {
  key: ProductReviewCheckKey;
  label: string;
  requiredForApproval: boolean;
};

export const PRODUCT_REVIEW_CHECKLIST: ProductReviewCheckDefinition[] = [
  {
    key: "prohibited_products_cleared",
    label: "금지 상품 여부 확인",
    requiredForApproval: true,
  },
  {
    key: "category_requirements_met",
    label: "카테고리별 필수 확인사항",
    requiredForApproval: true,
  },
  {
    key: "required_documents_verified",
    label: "필요 인증/서류 확인",
    requiredForApproval: true,
  },
  {
    key: "exaggerated_claims_checked",
    label: "과장·허위 광고 문구 확인",
    requiredForApproval: true,
  },
  {
    key: "price_stock_shipping_verified",
    label: "가격·재고·배송 가능 여부 확인",
    requiredForApproval: true,
  },
];

export function isProductReviewCheckKey(value: string): value is ProductReviewCheckKey {
  return (PRODUCT_REVIEW_CHECK_KEYS as readonly string[]).includes(value);
}

export function getRequiredProductReviewCheckKeys(): ProductReviewCheckKey[] {
  return PRODUCT_REVIEW_CHECKLIST.filter((item) => item.requiredForApproval).map(
    (item) => item.key,
  );
}
