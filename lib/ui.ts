const transition = "transition-all duration-[250ms] ease-smooth";
const hoverLift =
  "hover:-translate-y-0.5 hover:shadow-lift active:translate-y-0 active:scale-[0.98]";
const btnHover = "hover:scale-[1.02] hover:shadow-card-hover active:scale-[0.98]";

export const motion = {
  transition,
  hoverLift: `${transition} ${hoverLift}`,
  btnHover: `${transition} ${btnHover}`,
  tab: "transition-all duration-[250ms] ease-smooth",
  tabPill: "celloh-tab-pill",
  tabIndicator: "celloh-tab-indicator",
  tabPanel: "celloh-tab-panel",
  modalBackdrop: "celloh-modal-backdrop",
  modalPanel: "celloh-modal-panel",
  drawerBackdrop: "celloh-drawer-backdrop",
  drawerPanel: "celloh-drawer-panel",
  sheetBackdrop: "celloh-sheet-backdrop",
  sheetPanel: "celloh-sheet-panel",
  dropdown: "celloh-dropdown",
  cardEnter: "animate-celloh-fade-in",
  sectionEnter: "celloh-section-enter",
  bannerEnter: "celloh-banner-block",
} as const;

export const ui = {
  btnPrimary: `flex h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-wadeal-red text-[15px] font-bold text-white shadow-sm ${motion.hoverLift} ${motion.btnHover} hover:bg-wadeal-red-deep disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none disabled:hover:translate-y-0 disabled:hover:scale-100`,
  btnOutline: `flex h-11 w-full cursor-pointer items-center justify-center rounded-xl border border-wadeal-red bg-white text-sm font-semibold text-wadeal-red ${motion.hoverLift} ${motion.btnHover} hover:bg-wadeal-surface`,
  btnAccent: `flex h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-wadeal-coral text-[15px] font-bold text-white shadow-sm ${motion.hoverLift} ${motion.btnHover} hover:opacity-95 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none disabled:hover:scale-100`,
  btnKakao: `flex h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-wadeal-kakao text-[15px] font-bold text-[#3c1e1e] ${transition} hover:shadow-card-hover active:scale-[0.98] active:opacity-90 disabled:cursor-not-allowed`,
  btnCompact: `celloh-btn flex cursor-pointer items-center justify-center rounded-lg bg-wadeal-red font-bold text-white shadow-sm hover:bg-wadeal-red-deep`,
  card: `rounded-2xl border border-wadeal-line bg-white shadow-card ${motion.cardEnter}`,
  cardInteractive: `group rounded-2xl border border-wadeal-line bg-white shadow-card ${motion.hoverLift}`,
  panel: `rounded-2xl border border-wadeal-line bg-white p-4 shadow-card`,
  panelClickable: `block cursor-pointer rounded-2xl border border-wadeal-line bg-white p-4 shadow-card ${motion.hoverLift} active:bg-wadeal-surface`,
  sectionTitle: "text-[15px] font-bold tracking-[-0.02em] text-wadeal-ink",
  sectionTitleAccent:
    "text-[15px] font-bold tracking-[-0.02em] text-wadeal-red",
  /** 섹션 간격 — 카드/레일 통일 */
  sectionStack: "space-y-4",
  pageWrap: "mx-auto min-h-screen max-w-[480px] bg-white",
  pageBody: "px-4 py-4",
  input: `h-11 w-full rounded-xl border border-wadeal-line bg-white px-3 text-sm font-medium text-wadeal-ink outline-none placeholder:font-normal placeholder:text-gray-400 ${transition} focus:border-wadeal-red focus:ring-2 focus:ring-wadeal-red/10`,
  label: "mb-1.5 block text-xs font-semibold text-wadeal-muted",
  listDivider: "divide-y divide-wadeal-line",
  successBanner:
    "rounded-xl bg-green-50 px-4 py-3.5 text-center text-sm font-semibold text-green-700",
  errorBanner:
    "rounded-xl bg-[#F5F8F4] px-4 py-3.5 text-center text-sm font-semibold text-[#2E5E4E]",
  stickyFooter:
    "fixed inset-x-0 bottom-0 z-20 mx-auto max-w-[480px] border-t border-wadeal-line bg-white/95 px-4 py-3 pb-[max(env(safe-area-inset-bottom),12px)] backdrop-blur-sm transition-shadow duration-[250ms]",
  tabPill: (active: boolean) =>
    `shrink-0 rounded-full px-3 py-1.5 text-xs font-black ${motion.tabPill} ${
      active ?
        "bg-wadeal-red text-white shadow-sm"
      : "border border-wadeal-line bg-white text-wadeal-muted hover:border-wadeal-red/30"
    }`,
  tabPillDark: (active: boolean) =>
    `rounded-full px-3 py-1.5 text-xs font-black ${motion.tabPill} ${
      active ?
        "bg-wadeal-ink text-white shadow-sm"
      : "border border-wadeal-line bg-white text-wadeal-muted hover:border-wadeal-ink/20"
    }`,
} as const;

export function badgeTone(badge: string) {
  if (badge === "혜택 달성" || badge === "최대 혜택" || badge === "최저가 달성") {
    return "bg-wadeal-coral text-white transition-all duration-200 ease-smooth";
  }
  if (badge === "품절") {
    return "bg-gray-500 text-white";
  }
  if (badge === "인기" || badge === "인기 상품" || badge === "오늘 추천" || badge === "급상승") {
    return "bg-wadeal-coral text-white transition-all duration-200 ease-smooth";
  }
  if (badge === "신규") {
    return "bg-wadeal-surface text-wadeal-red ring-1 ring-wadeal-line transition-all duration-200 ease-smooth";
  }
  if (badge === "판매 중" || badge === "셀러 상품") {
    return "bg-wadeal-red text-white transition-all duration-200 ease-smooth";
  }
  return "bg-gray-100 text-gray-600 transition-all duration-200 ease-smooth";
}
