import { ui } from "@/lib/ui";

export default function CheckoutLoading() {
  return (
    <div className={`${ui.pageWrap} min-h-screen pb-36 shadow-soft`}>
      <div className="h-11 animate-pulse border-b border-wadeal-line bg-gray-50" />
      <div className={`${ui.pageBody} space-y-3 pt-4`}>
        <div className="h-36 animate-pulse rounded-xl bg-gray-100" />
        <div className="h-48 animate-pulse rounded-xl bg-gray-100" />
        <div className="h-32 animate-pulse rounded-xl bg-gray-100" />
        <div className="h-28 animate-pulse rounded-xl bg-gray-100" />
      </div>
      <div className={`${ui.stickyFooter}`}>
        <div className="h-12 animate-pulse rounded-lg bg-gray-100" />
      </div>
    </div>
  );
}
