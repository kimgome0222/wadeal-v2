export const SELLER_REVIEW_CHECK_KEYS = [
  "business_number_provided",
  "representative_name_provided",
  "settlement_account_provided",
  "business_registration_document",
  "category_confirmed",
  "prohibited_products_cleared",
  "shipping_capability_confirmed",
  "cs_capability_confirmed",
  "settlement_info_verified",
  "policy_agreement_confirmed",
] as const;

export type SellerReviewCheckKey = (typeof SELLER_REVIEW_CHECK_KEYS)[number];

export type SellerReviewCheckDefinition = {
  key: SellerReviewCheckKey;
  label: string;
  autoHint?: (seller: {
    businessNumber: string;
    representativeName: string | null;
    bankName: string | null;
    accountNumber: string | null;
    accountHolder: string | null;
    businessRegistrationUrl: string | null;
  }) => string | null;
};

export const SELLER_REVIEW_CHECKLIST: SellerReviewCheckDefinition[] = [
  {
    key: "business_number_provided",
    label: "사업자등록번호 입력 여부",
    autoHint: (s) =>
      s.businessNumber.trim().length >= 10 ? "입력됨" : "미입력 또는 형식 확인 필요",
  },
  {
    key: "representative_name_provided",
    label: "대표자명 입력 여부",
    autoHint: (s) => (s.representativeName?.trim() ? "입력됨" : "미입력"),
  },
  {
    key: "settlement_account_provided",
    label: "정산 계좌 입력 여부",
    autoHint: (s) =>
      s.bankName && s.accountNumber && s.accountHolder ? "입력됨" : "계좌 정보 확인 필요",
  },
  {
    key: "business_registration_document",
    label: "사업자등록증 첨부 여부",
    autoHint: (s) => (s.businessRegistrationUrl ? "첨부됨" : "미첨부"),
  },
  {
    key: "category_confirmed",
    label: "판매 카테고리 확인",
  },
  {
    key: "prohibited_products_cleared",
    label: "금지 상품 여부 확인",
  },
  {
    key: "shipping_capability_confirmed",
    label: "배송 가능 여부 확인",
  },
  {
    key: "cs_capability_confirmed",
    label: "C/S 응대 가능 여부 확인",
  },
  {
    key: "settlement_info_verified",
    label: "정산 정보 확인",
  },
  {
    key: "policy_agreement_confirmed",
    label: "정책 동의 여부 확인",
  },
];

export function isSellerReviewCheckKey(value: string): value is SellerReviewCheckKey {
  return (SELLER_REVIEW_CHECK_KEYS as readonly string[]).includes(value);
}
