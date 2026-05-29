"use client";

import { useState, useTransition, type ReactNode } from "react";

type ProductDetailTabId = "detail" | "shipping" | "reviews";

type ProductDetailTabsProps = {
  detailContent: ReactNode;
  shippingContent: ReactNode;
  reviewsContent: ReactNode;
  reviewCount?: number;
};

const tabs: { id: ProductDetailTabId; label: string }[] = [
  { id: "detail", label: "상품설명" },
  { id: "shipping", label: "배송·교환·환불" },
  { id: "reviews", label: "리뷰" },
];

export function ProductDetailTabs({
  detailContent,
  shippingContent,
  reviewsContent,
  reviewCount = 0,
}: ProductDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<ProductDetailTabId>("detail");

  return (
    <div className="space-y-0">
      <div className="sticky top-0 z-10 border-b border-wadeal-line bg-white">
        <div className="flex">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            const label =
              tab.id === "reviews" && reviewCount > 0 ?
                `${tab.label} ${reviewCount}`
              : tab.label;

            return (
              <button
                className={`relative flex-1 cursor-pointer py-3 text-center text-xs font-bold transition-colors ${
                  active ? "text-wadeal-red" : "text-wadeal-muted"
                }`}
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                type="button"
              >
                {label}
                {active ?
                  <span className="absolute inset-x-4 bottom-0 h-0.5 rounded-full bg-wadeal-red" />
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
      </div>
    </div>
  );
}
