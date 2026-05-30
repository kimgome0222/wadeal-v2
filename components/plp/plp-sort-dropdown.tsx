"use client";

import { createPortal } from "react-dom";

import type { DealSortOption } from "@/lib/search/types";
import { PLP_SORT_OPTIONS } from "@/lib/search/plp-sort-options";

type PlpSortDropdownProps = {
  open: boolean;
  top: number;
  displaySort: DealSortOption;
  onClose: () => void;
  onSelect: (sort: DealSortOption) => void;
};

/** 정렬 dropdown — fixed layer z-80, 상품 grid 위 */
export function PlpSortDropdown({
  open,
  top,
  displaySort,
  onClose,
  onSelect,
}: PlpSortDropdownProps) {
  if (!open || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <>
      <button
        aria-label="정렬 닫기"
        className="fixed inset-0 z-[85] bg-transparent"
        onClick={onClose}
        type="button"
      />
      <div
        className="plp-sort-dropdown fixed left-6 right-6 z-[90] mx-auto max-w-[382px] overflow-hidden rounded-2xl border border-[#E8ECEA] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
        style={{ top: top + 4 }}
      >
        <div className="max-h-[280px] overflow-y-auto">
          {PLP_SORT_OPTIONS.map((option) => (
            <button
              className={`filter-item ${displaySort === option.value ? "active" : ""}`}
              key={option.value}
              onClick={() => {
                onSelect(option.value);
                onClose();
              }}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </>,
    document.body,
  );
}
