"use client";

import { useEffect } from "react";

import {
  PLP_QUICK_FILTER_CHIPS,
  type PlpQuickFilterKey,
} from "@/lib/search/plp-quick-filters";
import { PRICE_RANGE_PRESETS } from "@/lib/search/types";

type PlpFilterSheetProps = {
  open: boolean;
  activeQuickFilter: PlpQuickFilterKey;
  activeFilterCount: number;
  isPricePresetActive: (min?: number, max?: number) => boolean;
  onClose: () => void;
  onQuickFilter: (key: PlpQuickFilterKey) => void;
  onPricePreset: (min?: number, max?: number) => void;
  onReset: () => void;
};

/** PLP compact 필터 bottom sheet — max 50vh */
export function PlpFilterSheet({
  open,
  activeQuickFilter,
  activeFilterCount,
  isPricePresetActive,
  onClose,
  onQuickFilter,
  onPricePreset,
  onReset,
}: PlpFilterSheetProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <>
      <button
        aria-label="필터 닫기"
        className="fixed inset-0 z-[80] bg-black/40"
        onClick={onClose}
        type="button"
      />
      <div
        aria-label="상품 필터"
        className="plp-filter-sheet fixed inset-x-0 bottom-0 z-[90] mx-auto max-w-[430px] overflow-y-auto rounded-t-[20px] bg-white px-6 pb-[max(env(safe-area-inset-bottom),20px)] pt-5"
        role="dialog"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-[18px] font-bold text-[#111111]">필터</h2>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full text-[20px] text-[#666666] active:bg-[#F5F7F6]"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <p className="text-[13px] font-semibold text-[#666666]">빠른 필터</p>
            <div className="space-y-1">
              {PLP_QUICK_FILTER_CHIPS.map((chip) => {
                const active = activeQuickFilter === chip.key;
                return (
                  <button
                    className={`filter-item rounded-xl ${active ? "active" : ""}`}
                    key={chip.key}
                    onClick={() => {
                      onQuickFilter(chip.key);
                      onClose();
                    }}
                    type="button"
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[13px] font-semibold text-[#666666]">가격대</p>
            <div className="space-y-1">
              {PRICE_RANGE_PRESETS.map((preset) => {
                const active = isPricePresetActive(preset.min, preset.max);
                return (
                  <button
                    className={`filter-item rounded-xl ${active ? "active" : ""}`}
                    key={preset.label}
                    onClick={() => {
                      onPricePreset(preset.min, preset.max);
                      onClose();
                    }}
                    type="button"
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <button
            className="flex h-12 flex-1 items-center justify-center rounded-2xl border border-[#E8ECEA] bg-white text-[14px] font-semibold text-[#111111] active:bg-[#F5F7F6]"
            disabled={activeFilterCount === 0 && activeQuickFilter === "all"}
            onClick={() => {
              onReset();
              onClose();
            }}
            type="button"
          >
            초기화
          </button>
          <button
            className="flex h-12 flex-1 items-center justify-center rounded-2xl bg-[#2E5E4E] text-[14px] font-semibold text-white active:opacity-90"
            onClick={onClose}
            type="button"
          >
            적용하기
          </button>
        </div>
      </div>
    </>
  );
}
