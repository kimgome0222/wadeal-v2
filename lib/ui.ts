export const ui = {
  btnPrimary:
    "flex h-12 w-full items-center justify-center rounded-lg bg-wadeal-red text-[15px] font-black text-white active:opacity-90 disabled:cursor-not-allowed disabled:bg-gray-300",
  btnOutline:
    "flex h-11 items-center justify-center rounded-lg border border-wadeal-line bg-white text-sm font-black text-wadeal-ink active:bg-gray-50",
  btnKakao:
    "flex h-12 w-full items-center justify-center rounded-lg bg-wadeal-kakao text-[15px] font-black text-[#3c1e1e] active:opacity-90",
  panel: "rounded-xl border border-wadeal-line bg-white",
  sectionTitle: "text-[17px] font-black tracking-[-0.02em] text-wadeal-ink",
  pageWrap: "mx-auto min-h-screen max-w-[480px] bg-white shadow-soft",
} as const;

export function badgeTone(badge: string) {
  if (badge === "마감임박") return "bg-wadeal-red text-white";
  if (badge === "급상승") return "bg-violet-600 text-white";
  return "bg-gray-900 text-white";
}
