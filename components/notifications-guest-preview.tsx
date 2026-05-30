"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { PencilIcon } from "@/components/icons";
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

const DEMO_NOTIFICATIONS: NotificationCardItem[] = [
  {
    id: "demo-order",
    type: "order_confirmed",
    title: "주문이 접수됐어요 (미리보기)",
    body: "로그인하면 실제 주문·배송 알림을 받을 수 있어요.",
    time: "방금",
    readAt: null,
  },
  {
    id: "demo-benefit",
    type: "price_tier_reached",
    title: "신규 회원 쿠폰 (미리보기)",
    body: "로그인 후 쿠폰함에서 확인해 주세요.",
    time: "1시간 전",
    readAt: null,
  },
  {
    id: "demo-seller",
    type: "seller_notice_published",
    title: "팔로우한 판매자 소식 (미리보기)",
    body: "좋은 판매자의 새 상품 소식을 받아보세요.",
    time: "어제",
    readAt: new Date().toISOString(),
  },
];

type NotificationsGuestPreviewProps = {
  loginHref?: string;
};

export function NotificationsGuestPreview({
  loginHref = "/login?next=%2Fnotifications",
}: NotificationsGuestPreviewProps) {
  const router = useRouter();
  const [categoryTab, setCategoryTab] = useState<NotificationCategoryTab>("all");
  const [readIds, setReadIds] = useState<Set<string>>(() => new Set());
  const [deletedIds, setDeletedIds] = useState<Set<string>>(() => new Set());
  const [editMode, setEditMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());

  const notifications = useMemo(() => {
    return DEMO_NOTIFICATIONS.filter((item) => !deletedIds.has(item.id)).map((item) =>
      readIds.has(item.id) ?
        { ...item, readAt: item.readAt ?? new Date().toISOString() }
      : item,
    );
  }, [deletedIds, readIds]);

  const visibleNotifications = useMemo(() => {
    return notifications.filter((item) => matchNotificationTab(item.type, categoryTab));
  }, [categoryTab, notifications]);

  const allVisibleSelected =
    visibleNotifications.length > 0 &&
    visibleNotifications.every((item) => selectedIds.has(item.id));

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
    setReadIds((prev) => {
      const next = new Set(prev);
      for (const id of selectedIds) {
        next.add(id);
      }
      return next;
    });
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

  return (
    <div className="space-y-4 pb-[max(calc(env(safe-area-inset-bottom)+120px),120px)]">
      <div className="rounded-[16px] border border-[#E8ECEA] bg-[#F5F7F6] px-4 py-3 text-[13px] leading-relaxed text-[#666666]">
        미리보기 알림이에요.{" "}
        <Link className="font-semibold text-[#2E5E4E] underline-offset-2 hover:underline" href={loginHref}>
          로그인
        </Link>
        하면 실제 주문·혜택 알림을 받을 수 있어요.
      </div>

      <div className="sticky top-[56px] z-30 -mx-6 bg-white px-6 pb-2 pt-1">
        <div className="mb-2 flex items-center justify-end">
          <button
            aria-label={editMode ? "편집 완료" : "알림 편집"}
            className="flex cursor-pointer items-center gap-1 text-[14px] font-semibold text-[#2E5E4E]"
            onClick={() => {
              setEditMode((value) => !value);
              setSelectedIds(new Set());
            }}
            type="button"
          >
            {!editMode ?
              <PencilIcon className="h-4 w-4" />
            : null}
            {editMode ? "완료" : "편집"}
          </button>
        </div>
        <NotificationsAppTabs active={categoryTab} onChange={setCategoryTab} />
      </div>

      {editMode ?
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[#E8ECEA] bg-[#F5F7F6] px-4 py-3 text-[13px]">
          <button className="font-semibold text-[#111111]" onClick={toggleSelectAll} type="button">
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
                <NotificationCard
                  item={item}
                  onNavigate={() => {
                    if (editMode) {
                      toggleSelected(item.id);
                      return;
                    }
                    router.push(loginHref);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      : <NotificationsEmptyState />}

      <Link
        className="flex min-h-[52px] items-center justify-center rounded-2xl border border-[#E8ECEA] bg-white text-[14px] font-semibold text-[#2E5E4E] active:bg-[#FAFBFA]"
        href={loginHref}
      >
        로그인하고 알림 받기
      </Link>
    </div>
  );
}
