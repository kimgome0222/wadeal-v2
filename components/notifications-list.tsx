"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import { markNotificationAsReadAction } from "@/app/actions/notifications";
import {
  NotificationCard,
  NotificationFilterTabs,
  NotificationsEmptyState,
  type NotificationCardItem,
} from "@/components/notification-card";

type NotificationsListProps = {
  initialNotifications: NotificationCardItem[];
  initialUnreadCount: number;
};

export function NotificationsList({
  initialNotifications,
  initialUnreadCount,
}: NotificationsListProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const [, startTransition] = useTransition();

  const visibleNotifications = useMemo(() => {
    if (filter === "unread") {
      return initialNotifications.filter((item) => !item.readAt);
    }
    return initialNotifications;
  }, [filter, initialNotifications]);

  function handleNavigate(item: NotificationCardItem) {
    if (!item.linkUrl) {
      return;
    }

    startTransition(async () => {
      if (!item.readAt) {
        const result = await markNotificationAsReadAction(item.id);
        if (result.success) {
          setUnreadCount((count) => Math.max(0, count - 1));
        }
      }
      router.push(item.linkUrl!);
    });
  }

  return (
    <div className="space-y-3">
      <NotificationFilterTabs
        filter={filter}
        onChange={setFilter}
        unreadCount={unreadCount}
      />
      {visibleNotifications.length > 0 ?
        visibleNotifications.map((item) => (
          <NotificationCard item={item} key={item.id} onNavigate={handleNavigate} />
        ))
      : <NotificationsEmptyState filter={filter} />}
    </div>
  );
}
