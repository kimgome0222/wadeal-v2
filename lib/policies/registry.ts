import {
  GROUPBUY_POLICY,
  MARKETING_POLICY,
  MEMBERSHIP_POLICY,
  PAYMENT_POLICY,
  PRIVACY_POLICY,
  REFERRAL_POLICY,
  REFUND_POLICY,
  REVIEW_POLICY,
  SELLER_POLICY,
  SHIPPING_POLICY,
  TERMS_POLICY,
  YOUTH_POLICY,
  type PolicyDocument,
} from "@/lib/policies/content";

export const POLICY_SLUGS = [
  "privacy",
  "terms",
  "commerce",
  "refund",
  "shipping",
  "payment",
  "marketing",
  "referral",
  "seller",
  "youth",
  "membership",
  "review",
] as const;

export type PolicySlug = (typeof POLICY_SLUGS)[number];

const COMMERCE_POLICY: PolicyDocument = {
  ...GROUPBUY_POLICY,
  slug: "commerce",
  title: "전자상거래 안내",
  subtitle: "celloh 주문·가격·거래기록 운영 원칙 (초안)",
};

export const POLICIES_BY_SLUG: Record<PolicySlug, PolicyDocument> = {
  privacy: { ...PRIVACY_POLICY, slug: "privacy" },
  terms: { ...TERMS_POLICY, slug: "terms" },
  commerce: COMMERCE_POLICY,
  refund: { ...REFUND_POLICY, slug: "refund" },
  shipping: SHIPPING_POLICY,
  payment: PAYMENT_POLICY,
  marketing: { ...MARKETING_POLICY, slug: "marketing" },
  referral: REFERRAL_POLICY,
  seller: SELLER_POLICY,
  youth: YOUTH_POLICY,
  membership: MEMBERSHIP_POLICY,
  review: REVIEW_POLICY,
};

export function getPolicyBySlug(slug: string): PolicyDocument | null {
  return POLICIES_BY_SLUG[slug as PolicySlug] ?? null;
}

export function isPolicySlug(slug: string): slug is PolicySlug {
  return slug in POLICIES_BY_SLUG;
}

export const POLICY_FOOTER_LINKS: { label: string; href: string }[] = [
  { label: "고객센터", href: "/support" },
  { label: "이용약관", href: "/policies/terms" },
  { label: "개인정보처리방침", href: "/policies/privacy" },
  { label: "전자상거래 안내", href: "/policies/commerce" },
  { label: "환불/교환", href: "/policies/refund" },
  { label: "배송 정책", href: "/policies/shipping" },
  { label: "결제 정책", href: "/policies/payment" },
  { label: "마케팅 수신", href: "/policies/marketing" },
  { label: "친구추천", href: "/policies/referral" },
  { label: "판매자 정책", href: "/policies/seller" },
  { label: "오픈소스", href: "/open-source" },
];

export const POLICY_SETTINGS_LINKS: { label: string; href: string }[] = [
  { label: "이용약관", href: "/policies/terms" },
  { label: "개인정보처리방침", href: "/policies/privacy" },
  { label: "전자상거래 안내", href: "/policies/commerce" },
  { label: "환불/교환 정책", href: "/policies/refund" },
  { label: "배송 정책", href: "/policies/shipping" },
  { label: "결제 정책", href: "/policies/payment" },
  { label: "마케팅 수신 정책", href: "/policies/marketing" },
  { label: "친구추천 정책", href: "/policies/referral" },
  { label: "판매자 정책", href: "/policies/seller" },
  { label: "청소년 보호", href: "/policies/youth" },
  { label: "멤버십 안내", href: "/policies/membership" },
];

/** Legacy paths → /policies/* */
export const LEGACY_POLICY_REDIRECTS: Record<string, PolicySlug> = {
  privacy: "privacy",
  terms: "terms",
  "commerce-policy": "commerce",
  "refund-policy": "refund",
  "marketing-terms": "marketing",
  "finance-terms": "payment",
};
