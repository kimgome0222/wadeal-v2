import { ds } from "@/lib/design-system";

const transition = "transition-all duration-200 ease-smooth";
const hoverLift =
  "hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(31,42,36,0.06)] active:translate-y-0 active:scale-[0.98]";
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
  btnAccent: `inline-flex h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-wadeal-coral px-4 text-[14px] font-semibold text-white ${motion.hoverLift} hover:opacity-95 disabled:cursor-not-allowed disabled:bg-gray-300`,
  btnKakao: `inline-flex h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-wadeal-kakao px-4 text-[14px] font-semibold text-[#3c1e1e] ${transition} hover:shadow-[0_4px_16px_rgba(31,42,36,0.06)] active:scale-[0.98] disabled:cursor-not-allowed`,
  btnCompact: `${ds.btn.sm} ${ds.btn.smPrimary} ${btnHover}`,
  card: `${ds.card.padded} ${motion.cardEnter}`,
  cardInteractive: `${ds.card.interactive} ${motion.cardEnter}`,
  panel: ds.card.padded,
  panelClickable: `block cursor-pointer ${ds.card.padded} ${motion.hoverLift} active:bg-wadeal-surface`,
  sectionTitle: ds.type.h2,
  sectionTitleAccent: `${ds.type.h2} text-wadeal-ink`,
  sectionStack: ds.page.stackMd,
  contentGutter: ds.page.gutter,
  pageWrap: ds.page.wrap,
  pageBody: ds.page.body,
  input: `h-12 w-full rounded-xl border border-[#DDE8E2] bg-white px-3.5 text-[14px] font-normal text-wadeal-ink outline-none placeholder:text-gray-400 ${transition} focus:border-wadeal-red/40 focus:ring-2 focus:ring-wadeal-red/10`,
  label: `mb-1.5 block ${ds.type.label}`,
  listDivider: "divide-y divide-[#DDE8E2]/60",
  successBanner: `rounded-xl bg-green-50 px-4 py-3.5 text-center ${ds.type.bodySm} text-green-700`,
  errorBanner: `rounded-xl bg-[#FAFBFA] px-4 py-3.5 text-center ${ds.type.bodySm} text-wadeal-red`,
  stickyFooter:
    "fixed inset-x-0 bottom-0 z-30 mx-auto max-w-[430px] border-t border-[#DDE8E2] bg-white px-4 py-1.5 pb-[max(env(safe-area-inset-bottom),8px)] shadow-[0_-2px_12px_rgba(31,42,36,0.06)]",
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
    return `${ds.badge.base} border border-[#DDE8E2] bg-[#F8FAF8] text-wadeal-muted`;
  }
  if (badge.includes("혜택") || badge.includes("공구") || badge.includes("공동")) {
    return `${ds.badge.base} ${ds.badge.muted}`;
  }
  return `${ds.badge.base} ${ds.badge.muted}`;
}
