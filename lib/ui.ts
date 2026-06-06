import { ds } from "@/lib/design-system";

const transition = "transition-all duration-200 ease-smooth";
const hoverLift =
  "hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(17,17,17,0.06)] active:translate-y-0 active:scale-[0.98]";
const btnHover = "hover:scale-[1.01] active:scale-[0.98]";

export const motion = {
  transition,
  hoverLift: `${transition} ${hoverLift}`,
  btnHover: `${transition} ${btnHover}`,
  tab: transition,
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

export { ds };

export const ui = {
  btnPrimary: `${ds.btn.primary} ${motion.hoverLift}`,
  btnOutline: `${ds.btn.outline}`,
  btnSecondary: `${ds.btn.outline}`,
  btnAccent: `inline-flex h-14 w-full cursor-pointer items-center justify-center rounded-2xl bg-wadeal-coral px-4 text-[16px] font-semibold text-white ${motion.hoverLift} hover:opacity-95 disabled:cursor-not-allowed disabled:bg-gray-300`,
  btnKakao: `inline-flex h-[52px] w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#FEE500] px-4 text-[14px] font-semibold text-[#191919] ${transition} hover:brightness-[0.98] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60`,
  btnCompact: `${ds.btn.sm} ${ds.btn.smPrimary} ${btnHover}`,
  card: `${ds.card.padded} ${motion.cardEnter}`,
  cardInteractive: `${ds.card.interactive} ${motion.cardEnter}`,
  panel: ds.card.padded,
  panelClickable: `block cursor-pointer ${ds.card.padded} ${motion.hoverLift} active:bg-[#F5F7F6]`,
  sectionTitle: ds.type.h2,
  sectionTitleAccent: `${ds.type.h2} text-wadeal-ink`,
  sectionStack: ds.page.stackMd,
  contentGutter: ds.page.gutter,
  pageWrap: ds.page.wrap,
  pageBody: ds.page.body,
  appPageBody: ds.page.appBody,
  appSectionStack: ds.page.appSectionGap,
  afterChromeBody: "px-6 pt-6 pb-4",
  input: `h-12 w-full min-w-0 rounded-2xl border border-[#E8ECEA] bg-white px-3.5 text-[14px] font-normal text-wadeal-ink outline-none placeholder:text-gray-400 ${transition} focus:border-wadeal-red/40 focus:ring-2 focus:ring-wadeal-red/10`,
  formInput: `h-[52px] w-full min-w-0 rounded-2xl border border-[#E8ECEA] bg-white px-3.5 text-[14px] font-normal text-wadeal-ink outline-none placeholder:text-gray-400 ${transition} focus:border-wadeal-red/40 focus:ring-2 focus:ring-wadeal-red/10`,
  formBtnInline: `inline-flex h-[52px] w-[104px] shrink-0 cursor-pointer items-center justify-center rounded-2xl border border-[#E8ECEA] bg-white px-2 text-[13px] font-semibold text-wadeal-ink transition-all duration-200 active:scale-[0.98] hover:bg-[#F5F7F6] disabled:cursor-not-allowed disabled:opacity-50`,
  authBtn: `flex h-14 w-full cursor-pointer items-center justify-center rounded-2xl text-[16px] font-semibold transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50`,
  label: `mb-1.5 block ${ds.type.label}`,
  listDivider: "divide-y divide-[#E8ECEA]/80",
  successBanner: `rounded-2xl bg-green-50 px-4 py-3.5 text-center ${ds.type.bodySm} text-green-700`,
  errorBanner: `rounded-2xl bg-[#F5F7F6] px-4 py-3.5 text-center ${ds.type.bodySm} text-wadeal-red`,
  stickyFooter:
    "fixed inset-x-0 bottom-0 z-30 mx-auto max-w-[430px] border-t border-[#E8ECEA] bg-white px-6 py-1.5 pb-[max(env(safe-area-inset-bottom),8px)] shadow-[0_-2px_12px_rgba(17,17,17,0.04)]",
  tabPill: (active: boolean) =>
    `${ds.chip.base} ${motion.tabPill} ${active ? ds.chip.active : ds.chip.idle}`,
  tabPillDark: (active: boolean) =>
    `${ds.chip.base} ${motion.tabPill} ${
      active ? "bg-wadeal-ink text-white" : ds.chip.idle
    }`,
} as const;

/** 상품·홈 뱃지 톤 — accent는 인기/할인만 */
export function badgeTone(badge: string) {
  if (badge === "품절") {
    return `${ds.badge.base} ${ds.badge.soldOut}`;
  }
  if (badge === "인기" || badge === "인기 상품" || badge === "오늘 추천" || badge === "급상승") {
    return `${ds.badge.base} ${ds.badge.popular}`;
  }
  if (badge === "신규") {
    return `${ds.badge.base} ${ds.badge.muted}`;
  }
  if (badge === "판매 중" || badge === "셀러 상품") {
    return `${ds.badge.base} border border-[#E8ECEA] bg-[#F5F7F6] text-wadeal-muted`;
  }
  if (badge.includes("혜택") || badge.includes("공구") || badge.includes("공동")) {
    return `${ds.badge.base} ${ds.badge.muted}`;
  }
  return `${ds.badge.base} ${ds.badge.muted}`;
}
