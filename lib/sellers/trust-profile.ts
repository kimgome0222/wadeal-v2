/**
 * @deprecated Use `@/lib/sellers/seller-trust-profile` — audit wrapper는 하위 호환용.
 * TODO: audit UI 전용 모듈로 분리 후 제거 검토.
 */
export {
  buildSellerTrustProfile,
  type SellerTrustFieldSource,
  type SellerTrustProfile,
} from "./seller-trust-profile";

export type { SellerTrustFieldStatus } from "./trust-data-audit";
export { SELLER_TRUST_FIELD_AUDIT } from "./trust-data-audit";
