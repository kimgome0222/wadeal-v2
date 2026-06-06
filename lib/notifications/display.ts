import type { NotificationType } from "@/lib/notifications/types";

const ICON_BY_PREFIX: { match: string; icon: string }[] = [
  { match: "shipping", icon: "📦" },
  { match: "payment", icon: "💳" },
  { match: "order", icon: "📋" },
  { match: "review", icon: "⭐" },
  { match: "support", icon: "💬" },
  { match: "refund", icon: "↩️" },
  { match: "deal", icon: "🎁" },
  { match: "price", icon: "🏷️" },
  { match: "next_tier", icon: "📈" },
  { match: "seller", icon: "🏪" },
];

export function getNotificationIcon(type: NotificationType): string {
  const matched = ICON_BY_PREFIX.find((item) => type.includes(item.match));
  return matched?.icon ?? "🔔";
}
