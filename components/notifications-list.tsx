"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { markNotificationAsReadAction } from "@/app/actions/notifications";
import {
  matchNotificationTab,
  NotificationsAppTabs,
  type NotificationCategoryTab,
} from "@/components/notifications-app-tabs";
import {
  NotificationCard,
  NotificationsEmptyState,
  type NotificationCardItem,
} from "@/components/notification-card";

type NotificationsListProps = {
  initialNotifications: NotificationCardItem[];
  initialUnreadCount?: number;
};

export function NotificationsList({
  initialNotifications,
}: NotificationsListProps) {
  const router = useRouter();
  const [categoryTab, setCategoryTab] = useState<NotificationCategoryTab>("all");
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
    <div className="space-y-4 pb-[max(calc(env(safe-area-inset-bottom)+120px),120px)]">
      <div className="sticky top-[56px] z-30 -mx-6 bg-white px-6 pb-2 pt-1">
        <NotificationsAppTabs active={categoryTab} onChange={setCategoryTab} />
      </div>

      {visibleNotifications.length > 0 ?
        <div className="space-y-2.5">
          {visibleNotifications.map((item) => (
            <NotificationCard item={item} key={item.id} onNavigate={handleNavigate} />
          ))}
        </div>
      : <NotificationsEmptyState />}
    </div>
  );
}
