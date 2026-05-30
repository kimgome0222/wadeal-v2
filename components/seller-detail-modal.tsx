"use client";

import { useEffect } from "react";

import { SellerDetailContent } from "@/components/seller-detail-content";
import type { SellerDetailViewModel } from "@/lib/sellers/build-seller-detail-view";
import { SELLER_UI_COPY } from "@/lib/sellers/trust-copy";
import { motion } from "@/lib/ui";

type SellerDetailModalProps = {
  view: SellerDetailViewModel;
  open: boolean;
  onClose: () => void;
};

export function SellerDetailModal({ view, open, onClose }: SellerDetailModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className={motion.drawerBackdrop} onClick={onClose} role="presentation">
      <div
        className={`${motion.drawerPanel} max-h-[88vh] w-full max-w-[430px] overflow-y-auto px-5 py-6 text-left sm:max-w-[360px] sm:animate-celloh-modal-in sm:rounded-2xl`}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-labelledby="seller-detail-title"
        aria-modal="true"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold tracking-[0.1em] text-wadeal-red/80">
              {SELLER_UI_COPY.infoTitle}
            </p>
            <p className="mt-1 text-xs font-medium text-wadeal-muted">
              {SELLER_UI_COPY.detailHint}
            </p>
          </div>
          <button
            aria-label="닫기"
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-wadeal-line text-wadeal-muted transition-colors hover:bg-wadeal-surface"
            onClick={onClose}
            type="button"
          >
            ✕
          </button>
        </div>

        <SellerDetailContent onBeforeNavigate={onClose} variant="modal" view={view} />
      </div>
    </div>
  );
}
