"use client";

import Link from "next/link";
import { useEffect } from "react";

import { CartPreviewContent } from "@/components/cart/cart-preview-content";
import { useAddToCartSheet } from "@/lib/cart/add-to-cart-sheet-context";
import { useCartPreviewSheet } from "@/lib/cart/cart-preview-sheet-context";
import type { Deal } from "@/lib/deals";

/** B마트식 “마지막으로 둘러보기” bottom sheet — z-100 */
export function CartPreviewBottomSheet() {
  const { previewOpen, closePreview } = useCartPreviewSheet();
  const { catalog } = useAddToCartSheet();

  useEffect(() => {
    if (!previewOpen) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closePreview();
      }
    }

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [closePreview, previewOpen]);

  if (!previewOpen) {
    return null;
  }

  const safeCatalog: Deal[] = catalog;

  return (
    <>
      <button
        aria-label="닫기"
        className="fixed inset-0 z-[100] bg-black/40"
        onClick={closePreview}
        type="button"
      />
      <div
        aria-labelledby="cart-preview-sheet-title"
        aria-modal="true"
        className="fixed inset-x-0 bottom-0 z-[101] mx-auto flex max-h-[92vh] max-w-[430px] flex-col overflow-hidden rounded-t-[20px] bg-white shadow-[0_-8px_24px_rgba(0,0,0,0.08)]"
        role="dialog"
      >
        <div className="shrink-0 border-b border-[#E8ECEA] px-5 pb-3 pt-3">
          <div aria-hidden className="mx-auto mb-3 h-1 w-10 rounded-full bg-[#E8ECEA]" />
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-[20px] font-bold text-[#111111]" id="cart-preview-sheet-title">
                마지막으로 둘러보기
              </h2>
              <p className="mt-1 text-[13px] text-[#666666]">
                자주 사는 상품과 함께 담기 좋은 상품을 모았어요.
              </p>
            </div>
            <button
              aria-label="닫기"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[22px] text-[#666666] active:bg-[#F5F7F6]"
              onClick={closePreview}
              type="button"
            >
              ×
            </button>
          </div>
          <Link
            className="mt-3 inline-flex text-[13px] font-semibold text-[#2E5E4E]"
            href="/join-cart"
            onClick={closePreview}
          >
            장바구니 보기
          </Link>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <CartPreviewContent catalog={safeCatalog} variant="sheet" />
        </div>
      </div>
    </>
  );
}
