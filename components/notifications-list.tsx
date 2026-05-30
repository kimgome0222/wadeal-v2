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
  const [deletedIds, setDeletedIds] = useState<Set<string>>(() => new Set());
  const [editMode, setEditMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [, startTransition] = useTransition();

  const notifications = useMemo(() => {
    return initialNotifications
      .filter((item) => !deletedIds.has(item.id))
      .map((item) =>
        readIds.has(item.id) ?
          { ...item, readAt: item.readAt ?? new Date().toISOString() }
        : item,
      );
  }, [deletedIds, initialNotifications, readIds]);

  const visibleNotifications = useMemo(() => {
    return notifications.filter((item) => matchNotificationTab(item.type, categoryTab));
  }, [categoryTab, notifications]);

  const allVisibleSelected =
    visibleNotifications.length > 0 &&
    visibleNotifications.every((item) => selectedIds.has(item.id));

  function markReadLocally(notificationId: string) {
    setReadIds((current) => {
      const next = new Set(current);
      next.add(notificationId);
      return next;
    });
  }

  function toggleSelected(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function toggleSelectAll() {
    if (allVisibleSelected) {
      setSelectedIds(new Set());
      return;
    }
    setSelectedIds(new Set(visibleNotifications.map((item) => item.id)));
  }

  function handleMarkSelectedRead() {
    for (const id of selectedIds) {
      markReadLocally(id);
      startTransition(async () => {
        await markNotificationAsReadAction(id);
      });
    }
    setSelectedIds(new Set());
  }

  function handleDeleteSelected() {
    setDeletedIds((prev) => {
      const next = new Set(prev);
      for (const id of selectedIds) {
        next.add(id);
      }
      return next;
    });
    setSelectedIds(new Set());
    setEditMode(false);
  }

  function handleNavigate(item: NotificationCardItem) {
    if (editMode) {
      toggleSelected(item.id);
      return;
    }

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
        <div className="mb-2 flex items-center justify-end">
          <button
            className="cursor-pointer text-[14px] font-semibold text-[#2E5E4E]"
            onClick={() => {
              setEditMode((value) => !value);
              setSelectedIds(new Set());
            }}
            type="button"
          >
            {editMode ? "완료" : "편집"}
          </button>
        </div>
        <NotificationsAppTabs active={categoryTab} onChange={setCategoryTab} />
      </div>

      {editMode ?
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[#E8ECEA] bg-[#F5F7F6] px-4 py-3 text-[13px]">
          <button
            className="font-semibold text-[#111111]"
            onClick={toggleSelectAll}
            type="button"
          >
            {allVisibleSelected ? "전체 해제" : "전체선택"}
          </button>
          <span className="text-[#666666]">{selectedIds.size}개 선택</span>
          <button
            className="ml-auto font-semibold text-[#2E5E4E] disabled:opacity-40"
            disabled={selectedIds.size === 0}
            onClick={handleMarkSelectedRead}
            type="button"
          >
            읽음처리
          </button>
          <button
            className="font-semibold text-[#E28A3B] disabled:opacity-40"
            disabled={selectedIds.size === 0}
            onClick={handleDeleteSelected}
            type="button"
          >
            삭제
          </button>
        </div>
      : null}

      {visibleNotifications.length > 0 ?
        <div className="space-y-2.5">
          {visibleNotifications.map((item) => (
            <div className="flex items-start gap-2" key={item.id}>
              {editMode ?
                <input
                  checked={selectedIds.has(item.id)}
                  className="mt-6 h-4 w-4 shrink-0 accent-[#2E5E4E]"
                  onChange={() => toggleSelected(item.id)}
                  type="checkbox"
                />
              : null}
              <div className="min-w-0 flex-1">
                <NotificationCard item={item} onNavigate={handleNavigate} />
              </div>
            </div>
          ))}
        </div>
      : <NotificationsEmptyState />}
    </div>
  );
}
