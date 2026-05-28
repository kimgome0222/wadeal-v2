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
  const [readIds, setReadIds] = useState<Set<string>>(() => new Set());
  const [, startTransition] = useTransition();

  const notifications = useMemo(() => {
    return initialNotifications.map((item) =>
      readIds.has(item.id) ? { ...item, readAt: item.readAt ?? new Date().toISOString() } : item,
    );
  }, [initialNotifications, readIds]);

  const visibleNotifications = useMemo(() => {
    if (filter === "unread") {
      return notifications.filter((item) => !item.readAt);
    }
    return notifications;
  }, [filter, notifications]);

  function markReadLocally(notificationId: string) {
    setReadIds((current) => {
      const next = new Set(current);
      next.add(notificationId);
      return next;
    });
    setUnreadCount((count) => Math.max(0, count - 1));
  }

  function handleNavigate(item: NotificationCardItem) {
    startTransition(async () => {
      if (!item.readAt) {
        const result = await markNotificationAsReadAction(item.id);
        if (result.success) {
          markReadLocally(item.id);
        }
      }

      if (item.linkUrl) {
        router.push(item.linkUrl);
      } else {
        router.refresh();
      }
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
