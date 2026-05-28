export const ui = {
  btnPrimary:
    "flex h-12 w-full cursor-pointer items-center justify-center rounded-lg bg-wadeal-red text-[15px] font-bold text-white active:opacity-90 disabled:cursor-not-allowed disabled:bg-gray-300",
  btnOutline:
    "flex h-11 w-full cursor-pointer items-center justify-center rounded-lg border border-wadeal-line bg-white text-sm font-semibold text-wadeal-ink active:bg-gray-50",
  btnKakao:
    "flex h-12 w-full cursor-pointer items-center justify-center rounded-lg bg-wadeal-kakao text-[15px] font-bold text-[#3c1e1e] active:opacity-90",
  panel: "rounded-xl border border-wadeal-line bg-white p-4",
  panelClickable:
    "block cursor-pointer rounded-xl border border-wadeal-line bg-white p-4 active:bg-gray-50",
  sectionTitle: "text-[15px] font-bold tracking-[-0.02em] text-wadeal-ink",
  pageWrap: "mx-auto min-h-screen max-w-[480px] bg-white",
  pageBody: "px-4 py-4",
  input:
    "h-11 w-full rounded-lg border border-wadeal-line px-3 text-sm font-medium text-wadeal-ink outline-none placeholder:font-normal placeholder:text-gray-400 focus:border-wadeal-red",
  label: "mb-1.5 block text-xs font-semibold text-wadeal-muted",
  listDivider: "divide-y divide-wadeal-line",
  successBanner:
    "rounded-xl bg-green-50 px-4 py-3.5 text-center text-sm font-semibold text-green-700",
  stickyFooter:
    "fixed inset-x-0 bottom-0 z-20 mx-auto max-w-[480px] border-t border-wadeal-line bg-white px-4 py-3 pb-[max(env(safe-area-inset-bottom),12px)]",
} as const;

export function badgeTone(badge: string) {
  if (badge === "공동구매 성공") {
    return "bg-green-600 text-white";
  }
  if (badge === "품절") {
    return "bg-gray-500 text-white";
  }
  if (badge === "마감임박" || badge === "오늘 마감") {
    return "bg-wadeal-red text-white";
  }
  if (badge === "공동구매 진행중" || badge === "공동구매") {
    return "bg-gray-100 text-gray-700";
  }
  if (badge === "급상승" || badge === "인기") {
    return "bg-violet-600 text-white";
  }
  return "bg-gray-800 text-white";
}
