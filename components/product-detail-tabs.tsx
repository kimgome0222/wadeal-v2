"use client";

import { useEffect, useState, useTransition, type ReactNode } from "react";

import { ds } from "@/lib/design-system";
import { motion } from "@/lib/ui";

type ProductDetailTabId = "detail" | "shipping" | "reviews" | "qna";

type ProductDetailTabsProps = {
  detailContent: ReactNode;
  shippingContent: ReactNode;
  reviewsContent: ReactNode;
  qnaContent: ReactNode;
  reviewCount?: number;
  qnaCount?: number;
  initialTab?: ProductDetailTabId;
};

const tabs: { id: ProductDetailTabId; label: string }[] = [
  { id: "detail", label: "상품설명" },
  { id: "shipping", label: "배송·교환·환불" },
  { id: "reviews", label: "리뷰" },
  { id: "qna", label: "Q&A" },
];

const TAB_PANEL_ID = "product-detail-tabpanel";

function tabButtonId(tabId: ProductDetailTabId) {
  return `product-detail-tab-${tabId}`;
}

const HASH_TAB_TARGETS: Record<string, ProductDetailTabId> = {
  "#product-reviews": "reviews",
  "#product-qna": "qna",
};

function scrollToTabAnchor(tab: ProductDetailTabId) {
  const anchorId = tab === "reviews" ? "product-reviews" : tab === "qna" ? "product-qna" : null;
  if (!anchorId) {
    return;
  }

  requestAnimationFrame(() => {
    document.getElementById(anchorId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

export function ProductDetailTabs({
  detailContent,
  shippingContent,
  reviewsContent,
  qnaContent,
  reviewCount = 0,
  qnaCount = 0,
  initialTab,
}: ProductDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<ProductDetailTabId>(() => initialTab ?? "detail");
  const [, startTransition] = useTransition();

  useEffect(() => {
    const hashTab = HASH_TAB_TARGETS[window.location.hash];
    if (!hashTab) {
      return;
    }

    setActiveTab(hashTab);
    scrollToTabAnchor(hashTab);
  }, []);

  const activeContent =
    activeTab === "detail" ? detailContent
    : activeTab === "shipping" ? shippingContent
    : activeTab === "reviews" ? reviewsContent
    : qnaContent;

  return (
    <div className="space-y-0">
      <div className="sticky top-12 z-10 border-b border-[#DDE8E2] bg-white">
        <div aria-label="상품 정보" className="flex" role="tablist">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            let label = tab.label;
            if (tab.id === "reviews" && reviewCount > 0) {
              label = `${tab.label} ${reviewCount}`;
            }
            if (tab.id === "qna" && qnaCount > 0) {
              label = `${tab.label} ${qnaCount}`;
            }

            return (
              <button
                aria-controls={TAB_PANEL_ID}
                aria-selected={active}
                className={`celloh-tab relative flex-1 cursor-pointer py-3 text-center text-[11px] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-wadeal-red/20 ${
                  active ? "text-wadeal-ink" : "text-wadeal-muted"
                }`}
                id={tabButtonId(tab.id)}
                key={tab.id}
                onClick={() => startTransition(() => setActiveTab(tab.id))}
                role="tab"
                type="button"
              >
                {label}
                {active ?
                  <span className={motion.tabIndicator} />
                : null}
              </button>
            );
          })}
        </div>
      </div>

      <div
        aria-labelledby={tabButtonId(activeTab)}
        className={`${motion.tabPanel} pt-4`}
        id={TAB_PANEL_ID}
        key={activeTab}
        role="tabpanel"
      >
        {activeContent}
      </div>
    </div>
  );
}
