/**
 * celloh Design System — Phase 3 unified tokens.
 * Primary #2E5E4E · Accent #E28A3B · Border #DDE8E2 · Noto Sans KR
 */

export const ds = {
  /** Brand palette (Tailwind: wadeal-red = #2E5E4E, wadeal-coral = #E28A3B) */
  brand: {
    primary: "#2E5E4E",
    primaryDeep: "#244C3F",
    accent: "#E28A3B",
    border: "#DDE8E2",
    surface: "#FAFBFA",
    surfaceAlt: "#F5F8F4",
    ink: "#1F2A24",
    muted: "#6B7280",
  },

  /** Layout */
  page: {
    wrap: "mx-auto min-h-screen max-w-[480px] bg-white",
    gutter: "px-5",
    body: "px-5 py-6",
    sectionGap: "space-y-6",
    stackMd: "space-y-5",
    stackSm: "space-y-3",
  },

  /** Vertical rhythm */
  section: {
    home: "border-t border-[#DDE8E2]/60 bg-white pt-6 pb-3",
    homeFirst: "bg-white pt-2 pb-3",
    homeHero: "space-y-5 pb-2",
    detail: "space-y-5",
    head: "mb-3 flex items-end justify-between gap-4",
  },

  /** Typography — font-semibold titles, calm body, no font-black */
  type: {
    display: "text-[20px] font-semibold leading-tight tracking-[-0.02em] text-wadeal-ink",
    h1: "text-[17px] font-semibold leading-snug tracking-[-0.02em] text-wadeal-ink",
    h2: "text-[15px] font-semibold leading-snug tracking-[-0.01em] text-wadeal-ink",
    h3: "text-[13px] font-medium leading-snug text-wadeal-ink",
    productTitle: "text-[12px] font-medium leading-snug text-wadeal-ink",
    productTitleGrid: "line-clamp-2 min-h-[2.25rem] text-[12px] font-medium leading-[1.35] text-wadeal-ink",
    sellerName: "text-[11px] font-normal leading-snug text-wadeal-muted",
    body: "text-[13px] font-normal leading-relaxed text-wadeal-ink",
    bodySm: "text-[12px] font-normal leading-relaxed text-wadeal-muted",
    caption: "text-[11px] font-normal leading-snug text-wadeal-muted",
    meta: "text-[10px] font-normal leading-snug text-wadeal-muted",
    label: "text-[11px] font-medium text-wadeal-muted",
    link: "text-[12px] font-medium text-wadeal-muted transition-colors duration-200 hover:text-wadeal-ink",
    stat: "text-[14px] font-semibold tabular-nums text-wadeal-ink",
    statSm: "text-[12px] font-semibold tabular-nums text-wadeal-ink",
    statLabel: "text-[10px] font-normal text-wadeal-muted",
    price: "text-[13px] font-semibold tabular-nums text-wadeal-ink",
    priceSm: "text-[12px] font-medium tabular-nums text-wadeal-ink",
    priceRail: "text-[11px] font-semibold tabular-nums text-wadeal-ink",
    star: "text-wadeal-coral",
  },

  /** Surfaces — radius-xl, border #DDE8E2, subtle hover lift */
  card: {
    base: "overflow-hidden rounded-xl border border-[#DDE8E2] bg-white",
    flat: "overflow-hidden rounded-xl bg-white",
    padded: "rounded-xl border border-[#DDE8E2] bg-white p-4",
    review: "rounded-xl border border-[#DDE8E2] bg-[#FAFBFA] px-3.5 py-3",
    interactive:
      "overflow-hidden rounded-xl border border-[#DDE8E2] bg-white transition-all duration-200 ease-smooth hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(31,42,36,0.06)] active:translate-y-0 active:scale-[0.99]",
  },

  /** Buttons — h-12 primary · h-11 outline · h-9 sm · 200ms transition */
  btn: {
    base: "inline-flex cursor-pointer items-center justify-center rounded-xl font-medium transition-all duration-200 ease-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wadeal-red/25 focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60",
    primary:
      "inline-flex h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-wadeal-red px-4 text-[14px] font-semibold text-white transition-all duration-200 ease-smooth hover:bg-wadeal-red-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wadeal-red/25 focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-300",
    outline:
      "inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-xl border border-[#DDE8E2] bg-white px-4 text-[13px] font-medium text-wadeal-ink transition-all duration-200 ease-smooth hover:border-wadeal-red/30 hover:bg-wadeal-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wadeal-red/20 active:scale-[0.98]",
    outlineAccent:
      "inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-xl border border-wadeal-coral/30 bg-white px-4 text-[13px] font-medium text-wadeal-coral transition-all duration-200 ease-smooth hover:bg-wadeal-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wadeal-coral/20 active:scale-[0.98]",
    sm: "inline-flex h-9 cursor-pointer items-center justify-center rounded-lg px-3 text-[12px] font-medium transition-all duration-200 ease-smooth active:scale-[0.98]",
    smPrimary: "bg-wadeal-red text-white hover:bg-wadeal-red-deep",
    smOutline: "border border-[#DDE8E2] bg-white text-wadeal-ink hover:bg-wadeal-surface",
    ghost:
      "inline-flex h-10 cursor-pointer items-center justify-center rounded-lg px-3 text-[12px] font-medium text-wadeal-muted transition-colors duration-200 hover:bg-[#FAFBFA] hover:text-wadeal-ink",
    icon:
      "inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#DDE8E2] bg-white text-wadeal-ink transition-all duration-200 ease-smooth hover:border-wadeal-red/30 hover:bg-wadeal-surface active:scale-[0.96]",
  },

  /** Badges — accent sparingly for 인기/할인 */
  badge: {
    base: "inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium leading-none",
    trust:
      "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium leading-none",
    muted: "border-[#DDE8E2] bg-[#F8FAF8] text-wadeal-muted",
    accent: "border-wadeal-coral/25 bg-wadeal-cream text-wadeal-coral",
    warm: "border-wadeal-coral/25 bg-wadeal-cream text-wadeal-coral",
    verified: "border-wadeal-red/25 bg-wadeal-red/8 text-wadeal-red",
    popular: "bg-wadeal-coral text-white",
    soldOut: "bg-gray-600 text-white",
  },

  /** Product card */
  productCard: {
    rail: "home-rail-deal-card group relative flex h-full w-full flex-col",
    grid: "deal-card group relative flex h-full flex-col",
    imageRail: "home-rail-deal-card__image",
    imageGrid: "deal-card__image",
    bodyRail: "home-rail-deal-card__body",
    bodyGrid: "deal-card__body",
    title: "line-clamp-2 text-[12px] font-medium leading-snug text-wadeal-ink",
    titleGrid: "line-clamp-2 min-h-[2.25rem] text-[12px] font-medium leading-[1.35] text-wadeal-ink",
  },

  /** Carousel */
  carousel: {
    wrap: "relative -mx-1 px-7 sm:-mx-2 sm:px-9",
    track: "celloh-product-carousel-track",
    item: "celloh-product-carousel-item",
    btn: "celloh-carousel-btn",
  },

  /** Skeleton loading */
  skeleton: {
    base: "animate-pulse rounded-xl bg-gradient-to-r from-gray-100 via-[#FAFBFA] to-gray-100",
    card: "overflow-hidden rounded-xl border border-[#DDE8E2] bg-white",
    line: "h-3 rounded bg-gray-100",
    avatar: "rounded-full bg-gray-100",
  },

  /** Seller trust */
  seller: {
    panel: "rounded-xl border border-[#DDE8E2] bg-white p-4",
    name: "text-[13px] font-semibold text-wadeal-ink",
    metrics: "grid grid-cols-4 gap-1.5",
    metricCell: "rounded-lg border border-[#DDE8E2]/80 bg-[#FAFBFA] px-2 py-2 text-center",
  },

  /** Chrome */
  chrome: {
    header: "border-b border-[#DDE8E2]/80 bg-white",
    searchInput:
      "flex h-11 min-h-[44px] w-full items-center gap-2 rounded-full border border-wadeal-line bg-[#F5F8F4] px-4 text-gray-500 transition-colors focus-within:border-wadeal-red/40 focus-within:bg-white focus-within:ring-2 focus-within:ring-wadeal-red/10",
    subHeader: "flex h-12 items-center gap-1 border-b border-[#DDE8E2]/80 bg-white px-3",
    footer: "border-t border-[#DDE8E2]/60 bg-white px-5 py-10",
    bottomNav:
      "fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[480px] border-t border-wadeal-line bg-white pt-1.5 pb-[max(env(safe-area-inset-bottom),8px)]",
  },

  /** Sort / filter chips */
  chip: {
    base: "h-8 shrink-0 cursor-pointer rounded-full px-3 text-[11px] font-medium transition-colors duration-200",
    active: "bg-wadeal-ink text-white",
    idle: "border border-[#DDE8E2] bg-white text-wadeal-muted hover:text-wadeal-ink",
  },
} as const;
