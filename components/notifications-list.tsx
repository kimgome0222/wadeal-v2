"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { markNotificationAsReadAction } from "@/app/actions/notifications";
import {
  NotificationCard,
  NotificationsEmptyState,
  type NotificationCardItem,
} from "@/components/notification-card";
import {
  matchNotificationTab,
  NotificationsAppTabs,
  type NotificationCategoryTab,
} from "@/components/notifications-app-tabs";

type NotificationsListProps = {
  initialNotifications: NotificationCardItem[];
  initialUnreadCount: number;
};

export function NotificationsList({
  initialNotifications,
  initialUnreadCount,
}: NotificationsListProps) {
  const router = useRouter();
  const [categoryTab, setCategoryTab] = useState<NotificationCategoryTab>("all");
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const [readIds, setReadIds] = useState<Set<string>>(() => new Set());
  const [, startTransition] = useTransition();

  const notifications = useMemo(() => {
    return initialNotifications.map((item) =>
      readIds.has(item.id) ? { ...item, readAt: item.readAt ?? new Date().toISOString() } : item,
    );
  }, [initialNotifications, readIds]);

  const visibleNotifications = useMemo(() => {
    return notifications.filter((item) => matchNotificationTab(item.type, categoryTab));
  }, [categoryTab, notifications]);

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
      <NotificationsAppTabs active={categoryTab} onChange={setCategoryTab} />
      {unreadCount > 0 ?
        <p className="text-[12px] font-medium text-wadeal-muted">
          읽지 않은 알림 {unreadCount}건
        </p>
      : null}
      {visibleNotifications.length > 0 ?
        visibleNotifications.map((item) => (
          <NotificationCard item={item} key={item.id} onNavigate={handleNavigate} />
        ))
      : <NotificationsEmptyState filter="all" />}
    </div>
  );
}
