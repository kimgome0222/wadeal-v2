import { ui } from "@/lib/ui";

export default function ProductLoading() {
  return (
    <main className={`${ui.pageWrap} pb-[calc(5.5rem+env(safe-area-inset-bottom))] shadow-soft`}>
      <div className="aspect-square w-full animate-pulse bg-gray-100" />
      <div className="-mt-5 rounded-t-2xl bg-white px-4 pb-5 pt-5">
        <div className="h-6 w-20 animate-pulse rounded bg-gray-100" />
        <div className="mt-3 h-7 w-4/5 animate-pulse rounded bg-gray-100" />
        <div className="mt-4 h-28 animate-pulse rounded-xl bg-gray-100" />
        <div className="mt-4 h-24 animate-pulse rounded-xl bg-gray-100" />
      </div>
      <div className={`${ui.pageBody} space-y-4 pt-4`}>
        <div className="h-40 animate-pulse rounded-xl bg-gray-100" />
        <div className="h-56 animate-pulse rounded-xl bg-gray-100" />
        <div className="h-32 animate-pulse rounded-xl bg-gray-100" />
      </div>
      <div className={`${ui.stickyFooter} flex items-center gap-3`}>
        <div className="h-10 flex-1 animate-pulse rounded bg-gray-100" />
        <div className="h-12 w-36 animate-pulse rounded-lg bg-gray-100" />
      </div>
    </main>
  );
}
