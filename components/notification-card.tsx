import { EmptyState } from "@/components/empty-state";
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
  const interactive = Boolean(onNavigate && item.linkUrl);

  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2">
          {unread ?
            <span
              aria-hidden
              className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-wadeal-red"
            />
          : null}
          <p className="text-sm font-black text-wadeal-ink">{item.title}</p>
        </div>
        <span className="shrink-0 text-[11px] font-bold text-gray-400">{item.time}</span>
      </div>
      <p className="mt-2 text-[13px] font-bold leading-relaxed text-wadeal-muted">{item.body}</p>
    </>
  );

  if (interactive) {
    return (
      <button
        className="w-full rounded-xl border border-wadeal-line bg-white p-4 text-left active:bg-gray-50"
        onClick={() => onNavigate?.(item)}
        type="button"
      >
        {content}
      </button>
    );
  }

  return (
    <article className="rounded-xl border border-wadeal-line bg-white p-4">{content}</article>
  );
}

export function NotificationsEmptyState({ filter }: { filter?: "all" | "unread" }) {
  const isUnreadFilter = filter === "unread";

  return (
    <EmptyState
      actionHref="/"
      actionLabel="공동구매 둘러보기"
      description={
        isUnreadFilter ?
          "읽지 않은 알림이 없어요."
        : "공동구매 소식과 주문 알림이 여기에 표시돼요."
      }
      title={isUnreadFilter ? "모든 알림을 확인했어요." : "아직 받은 알림이 없어요."}
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
        className={`rounded-full px-3 py-1.5 text-xs font-black ${
          filter === "all" ?
            "bg-wadeal-ink text-white"
          : "border border-wadeal-line bg-white text-wadeal-muted"
        }`}
        onClick={() => onChange("all")}
        type="button"
      >
        전체
      </button>
      <button
        className={`rounded-full px-3 py-1.5 text-xs font-black ${
          filter === "unread" ?
            "bg-wadeal-ink text-white"
          : "border border-wadeal-line bg-white text-wadeal-muted"
        }`}
        onClick={() => onChange("unread")}
        type="button"
      >
        읽지 않음{unreadCount > 0 ? ` ${unreadCount}` : ""}
      </button>
    </div>
  );
}
