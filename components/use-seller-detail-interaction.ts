"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState, type MouseEvent } from "react";

import type { ReviewSummary } from "@/lib/data/reviews";
import type { Deal } from "@/lib/deals";
import {
  buildSellerDetailView,
  type SellerDetailViewModel,
} from "@/lib/sellers/build-seller-detail-view";
import { resolveSellerDetailHref } from "@/lib/sellers/routes";

type UseSellerDetailInteractionOptions = {
  deal: Deal;
  reviewSummary?: Pick<ReviewSummary, "totalCount" | "averageRating"> | null;
};

export type SellerDetailInteraction = {
  view: SellerDetailViewModel;
  profileHref: string | null;
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  openDetail: (event?: MouseEvent) => void;
  closeDetail: () => void;
};

/**
 * 판매자 클릭 UX 단일 진입점.
 * - 프로필 페이지 off → 모달
 * - `isSellerPublicProfileEnabled()` on → `/sellers/[id]` 이동
 */
export function useSellerDetailInteraction({
  deal,
  reviewSummary,
}: UseSellerDetailInteractionOptions): SellerDetailInteraction {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  const view = useMemo(
    () => buildSellerDetailView(deal, reviewSummary),
    [deal, reviewSummary],
  );

  const profileHref = resolveSellerDetailHref(view.metrics.seller);

  const openDetail = useCallback(
    (event?: MouseEvent) => {
      event?.preventDefault();
      event?.stopPropagation();

      if (profileHref) {
        router.push(profileHref);
        return;
      }

      setModalOpen(true);
    },
    [profileHref, router],
  );

  const closeDetail = useCallback(() => {
    setModalOpen(false);
  }, []);

  return {
    view,
    profileHref,
    modalOpen,
    setModalOpen,
    openDetail,
    closeDetail,
  };
}
