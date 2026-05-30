"use client";

import type { NotificationType } from "@/lib/notifications/types";

export type NotificationCategoryTab =
  | "all"
  | "order"
  | "wishlist"
  | "seller"
  | "restock"
  | "benefit"
  | "review"
  | "support";

const TABS: { id: NotificationCategoryTab; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "order", label: "주문배송" },
  { id: "wishlist", label: "찜" },
  { id: "seller", label: "판매자소식" },
  { id: "restock", label: "재입고" },
  { id: "benefit", label: "혜택" },
  { id: "review", label: "리뷰" },
  { id: "support", label: "고객센터" },
];

const TYPE_MAP: Partial<Record<NotificationCategoryTab, NotificationType[]>> = {
  order: [
    "order_confirmed",
    "payment_ready",
    "payment_paid",
    "payment_failed",
    "payment_deposit_completed",
    "shipping_started",
    "shipping_delivered",
    "refund_updated",
  ],
  wishlist: ["deal_deadline_soon", "price_tier_reached", "next_tier_soon"],
  seller: ["seller_notice_published"],
  restock: [],
  benefit: ["deal_deadline_soon", "price_tier_reached", "next_tier_soon"],
  review: ["review_available", "new_review"],
  support: ["support_reply", "support_resolved"],
};

export function matchNotificationTab(
  type: NotificationType,
  tab: NotificationCategoryTab,
): boolean {
  if (tab === "all") {
    return true;
  }
  const allowed = TYPE_MAP[tab];
  if (!allowed) {
    return false;
  }
  return allowed.includes(type);
}

type NotificationsAppTabsProps = {
  active: NotificationCategoryTab;
  onChange: (tab: NotificationCategoryTab) => void;
};

export function NotificationsAppTabs({ active, onChange }: NotificationsAppTabsProps) {
  return (
    <div
      className="no-scrollbar flex gap-1 overflow-x-auto border-b border-[#DDE8E2] pb-px"
      role="tablist"
    >
      {TABS.map((tab) => (
        <button
          aria-selected={active === tab.id}
          className={`shrink-0 cursor-pointer border-b-2 px-3 py-2.5 text-[12px] font-medium transition-colors ${
            active === tab.id ?
              "border-[#2E5E4E] text-[#2E5E4E]"
            : "border-transparent text-wadeal-muted hover:text-wadeal-ink"
          }`}
          key={tab.id}
          onClick={() => onChange(tab.id)}
          role="tab"
          type="button"
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export { TABS as NOTIFICATION_APP_TABS };
