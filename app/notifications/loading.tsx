import { ui } from "@/lib/ui";

export default function NotificationsLoading() {
  return (
    <div className={`${ui.pageBody} space-y-3`}>
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          className="h-24 animate-pulse rounded-xl border border-wadeal-line bg-white"
          key={`notification-skeleton-${index}`}
        />
      ))}
    </div>
  );
}
