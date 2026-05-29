import type { SellerProfile } from "@/lib/sellers/types";

/**
 * 구매자-facing 판매자 프로필 경로.
 *
 * 경로 후보 (운영 단계):
 * - `/sellers/[id]` — 공개 판매자 프로필 (권장, 판매자센터 `/seller/*` 와 분리)
 * - `/seller/[id]` — 판매자센터와 충돌 위험 → 사용하지 않음
 *
 * 현재 UX (DB/API 변경 없음):
 * - `isSellerPublicProfileEnabled() === false` → SellerDetailModal
 * - true + `app/sellers/[id]/page.tsx` → SellerDetailContent variant="page"
 *
 * 공유 컴포넌트: SellerDetailContent, buildSellerDetailView, useSellerDetailInteraction
 */
export const SELLER_PUBLIC_PROFILE_BASE = "/sellers" as const;

/** 공개 판매자 프로필 (`/sellers/[id]`) */
export function isSellerPublicProfileEnabled(): boolean {
  return true;
}

export function getSellerPublicProfileHref(
  seller: Pick<SellerProfile, "id">,
): string {
  return `${SELLER_PUBLIC_PROFILE_BASE}/${encodeURIComponent(seller.id)}`;
}

/** 판매자 상세 클릭 시 이동할 href. 페이지 미구현이면 null → 모달 fallback. */
export function resolveSellerDetailHref(
  seller: Pick<SellerProfile, "id" | "name">,
): string | null {
  if (isSellerPublicProfileEnabled()) {
    return getSellerPublicProfileHref(seller);
  }
  return null;
}

/** 판매자명 검색 (상품 더 보기 등). 프로필 페이지와 별도. */
export function getSellerSearchHref(seller: Pick<SellerProfile, "name">): string {
  return `/search?q=${encodeURIComponent(seller.name)}`;
}
