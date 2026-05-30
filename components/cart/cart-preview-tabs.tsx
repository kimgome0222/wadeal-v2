"use client";

import { CART_PREVIEW_TABS, type CartPreviewTabId } from "@/lib/mock/cart-preview-products";

type CartPreviewTabsProps = {
  activeTab: CartPreviewTabId;
  onTabChange: (tabId: CartPreviewTabId) => void;
  className?: string;
};

/** cart-preview 탭 chip row */
export function CartPreviewTabs({
  activeTab,
  onTabChange,
  className = "",
}: CartPreviewTabsProps) {
  return (
    <div
      className={`no-scrollbar flex gap-2 overflow-x-auto px-6 ${className}`.trim()}
    >
      {CART_PREVIEW_TABS.map((tab) => (
        <button
          aria-pressed={activeTab === tab.id}
          className={`h-9 shrink-0 cursor-pointer rounded-[18px] px-3.5 text-[13px] font-semibold transition-colors duration-[80ms] ${
            activeTab === tab.id ?
              "bg-[#2E5E4E] text-white"
            : "bg-[#F5F7F6] text-[#666666]"
          }`}
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          type="button"
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
