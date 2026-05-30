import { EmptyState } from "@/components/empty-state";
import { getNotificationIcon } from "@/lib/notifications/display";
import type { NotificationType } from "@/lib/notifications/types";

export type NotificationCardItem = {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  time: string;
  linkUrl?: string | null;
  readAt?: string | null;
};

type NotificationCardProps = {
  item: NotificationCardItem;
  onNavigate?: (item: NotificationCardItem) => void;
};

export function NotificationCard({ item, onNavigate }: NotificationCardProps) {
  const unread = !item.readAt;
  const interactive = Boolean(onNavigate);
  const icon = getNotificationIcon(item.type);

  const content = (
    <div className="flex min-h-[80px] items-center gap-3">
      {unread ?
        <span
          aria-hidden
          className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[#2E5E4E]"
        />
      : <span aria-hidden className="h-2 w-2 shrink-0" />}
      <span aria-hidden className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F5F7F6] text-[20px]">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate text-[15px] font-semibold text-[#111111]">{item.title}</p>
          <span className="shrink-0 text-[12px] text-[#999999]">{item.time}</span>
        </div>
        <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-[#666666]">
          {item.body}
        </p>
      </div>
    </div>
  );

  if (interactive) {
    return (
      <button
        className="w-full cursor-pointer rounded-[20px] border border-[#E8ECEA] bg-white px-4 py-3 text-left active:bg-[#FAFBFA]"
        onClick={() => onNavigate?.(item)}
        type="button"
      >
        {content}
      </button>
    );
  }

  return (
    <article className="rounded-[20px] border border-[#E8ECEA] bg-white px-4 py-3">
      {content}
    </article>
  );
}

export function NotificationsEmptyState() {
  return (
    <EmptyState
      description="주문, 혜택, 판매자 소식을 받아보세요."
      title="아직 받은 알림이 없어요"
    />
  );
}

export function NotificationFilterTabs({
  filter,
  onChange,
  unreadCount,
}: {
  filter: "all" | "unread";
  onChange: (filter: "all" | "unread") => void;
  unreadCount: number;
}) {
  return (
    <div className="flex gap-2">
      <button
        className={`h-11 rounded-2xl px-4 text-[14px] font-semibold ${
          filter === "all" ?
            "bg-[#2E5E4E] text-white"
          : "border border-[#E8ECEA] bg-white text-[#666666]"
        }`}
        onClick={() => onChange("all")}
        type="button"
      >
        전체
      </button>
      <button
        className={`h-11 rounded-2xl px-4 text-[14px] font-semibold ${
          filter === "unread" ?
            "bg-[#2E5E4E] text-white"
          : "border border-[#E8ECEA] bg-white text-[#666666]"
        }`}
        onClick={() => onChange("unread")}
        type="button"
      >
        읽지 않음{unreadCount > 0 ? ` ${unreadCount}` : ""}
      </button>
    </div>
  );
}
