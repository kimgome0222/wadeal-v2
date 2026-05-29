"use client";

import { useState, useTransition, type ReactNode } from "react";

import { motion } from "@/lib/ui";

type ProductDetailTabId = "detail" | "shipping" | "reviews" | "qna";

type ProductDetailTabsProps = {
  detailContent: ReactNode;
  shippingContent: ReactNode;
  reviewsContent: ReactNode;
  qnaContent: ReactNode;
  reviewCount?: number;
  qnaCount?: number;
};

const tabs: { id: ProductDetailTabId; label: string }[] = [
  { id: "detail", label: "상품설명" },
  { id: "shipping", label: "배송·교환·환불" },
  { id: "reviews", label: "리뷰" },
  { id: "qna", label: "Q&A" },
];

export function ProductDetailTabs({
  detailContent,
  shippingContent,
  reviewsContent,
  qnaContent,
  reviewCount = 0,
  qnaCount = 0,
}: ProductDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<ProductDetailTabId>("detail");
  const [, startTransition] = useTransition();

  const activeContent =
    activeTab === "detail" ? detailContent
    : activeTab === "shipping" ? shippingContent
    : activeTab === "reviews" ? reviewsContent
    : qnaContent;

  return (
    <div className="space-y-0">
      <div className="sticky top-0 z-10 border-b border-wadeal-line bg-white">
        <div className="flex">
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
                className={`celloh-tab flex-1 cursor-pointer py-3 text-center text-xs font-bold ${
                  active ? "text-wadeal-red" : "text-wadeal-muted"
                }`}
                key={tab.id}
                onClick={() => startTransition(() => setActiveTab(tab.id))}
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

      <div className={`${motion.tabPanel} pt-4`} key={activeTab}>
        {activeContent}
      </div>
    </div>
  );
}
