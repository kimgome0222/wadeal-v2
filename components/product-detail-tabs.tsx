"use client";

import { useState, useTransition, type ReactNode } from "react";

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
                className={`relative flex-1 cursor-pointer py-3 text-center text-xs font-bold transition-colors ${
                  active ? "text-wadeal-red" : "text-wadeal-muted"
                }`}
                key={tab.id}
                onClick={() => startTransition(() => setActiveTab(tab.id))}
                type="button"
              >
                {label}
                {active ?
                  <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-wadeal-red" />
                : null}
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-4">
        {activeTab === "detail" ? detailContent : null}
        {activeTab === "shipping" ? shippingContent : null}
        {activeTab === "reviews" ? reviewsContent : null}
        {activeTab === "qna" ? qnaContent : null}
      </div>
    </div>
  );
}
