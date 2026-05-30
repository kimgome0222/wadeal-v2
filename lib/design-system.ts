/**
 * celloh Design System V1 — mobile-ui tokens (393px / 430px app shell)
 * Primary #2E5E4E · Accent #E28A3B · Border #E8ECEA · Text #111111
 */

export const ds = {
  /** Brand palette (Tailwind: wadeal-red = primary, wadeal-coral = accent) */
  brand: {
    primary: "#2E5E4E",
    primaryDeep: "#244C3F",
    accent: "#E28A3B",
    background: "#FFFFFF",
    surfaceSoft: "#F5F7F6",
    border: "#E8ECEA",
    text: "#111111",
    textMuted: "#666666",
    tabInactive: "#999999",
  },

  /** Layout — 430px app shell, 24px gutter */
  page: {
    wrap: "mx-auto min-h-screen w-full max-w-[430px] overflow-x-hidden bg-white",
    gutter: "px-6",
    body: "px-6 py-7",
    /** Sticky chrome 아래 탭 루트 본문 — top 24px */
    appBody: "px-6 pt-6 pb-4",
    /** 주요 섹션 간격 40px */
    appSectionGap: "space-y-10",
    /** 대형 섹션 간격 56px */
    appSectionGapLg: "space-y-14",
    sectionGap: "space-y-7",
    stackMd: "space-y-5",
    stackSm: "space-y-3",
  },

  spacing: {
    contentTop: "pt-6",
    sectionGap: "space-y-10",
    sectionGapLg: "space-y-14",
    sectionHead: "mb-4",
    chipRow: "gap-2.5",
    chipRowPy: "py-1",
    cardTop: "mt-4",
    railHeadToList: "mt-4",
    productGrid: "grid grid-cols-2 gap-x-4 gap-y-6 items-start min-w-0",
    bottomNav: "pb-[max(calc(env(safe-area-inset-bottom)+120px),120px)]",
    searchSection: "space-y-3.5",
  },

  section: {
    home: "border-t border-[#E8ECEA]/80 bg-white pt-10 pb-5",
    homeFirst: "bg-white pt-2 pb-3",
    homeHero: "space-y-4 pb-2",
    detail: "space-y-6",
    head: "mb-4 flex items-start justify-between gap-4",
  },

  /** Typography — V1 scale */
  type: {
    hero: "text-[28px] font-bold leading-[1.3] tracking-[-0.02em] text-wadeal-ink",
    display: "text-[20px] font-bold leading-tight tracking-[-0.02em] text-wadeal-ink",
    h1: "text-[24px] font-bold leading-[1.35] tracking-[-0.02em] text-wadeal-ink",
    h2: "text-[20px] font-bold leading-snug tracking-[-0.01em] text-wadeal-ink",
    h3: "text-[18px] font-semibold leading-snug text-wadeal-ink",
    productTitle: "line-clamp-2 text-[15px] font-semibold leading-[1.4] text-wadeal-ink",
    productTitleGrid:
      "line-clamp-2 min-h-[2.5rem] text-[15px] font-semibold leading-[1.4] text-wadeal-ink",
    sellerName: "text-[12px] font-medium leading-snug text-wadeal-muted",
    body: "text-[14px] font-normal leading-relaxed text-wadeal-ink",
    bodySm: "text-[14px] font-normal leading-relaxed text-wadeal-muted",
    caption: "text-[14px] font-normal leading-snug text-wadeal-muted",
    meta: "text-[12px] font-normal leading-snug text-wadeal-muted",
    label: "text-[14px] font-medium text-wadeal-ink",
    link: "text-[14px] font-medium text-wadeal-muted transition-colors duration-200 hover:text-wadeal-ink",
    stat: "text-[14px] font-semibold tabular-nums text-wadeal-ink",
    statSm: "text-[12px] font-semibold tabular-nums text-wadeal-ink",
    statLabel: "text-[11px] font-normal text-wadeal-muted",
    price: "text-[18px] font-semibold tabular-nums text-wadeal-ink",
    priceLg: "text-[22px] font-semibold tabular-nums text-wadeal-ink",
    priceSm: "text-[18px] font-semibold tabular-nums text-wadeal-ink",
    priceRail: "text-[18px] font-semibold tabular-nums text-wadeal-ink",
    discount: "text-[11px] font-medium tabular-nums text-wadeal-coral",
    star: "text-wadeal-muted",
    emptyTitle: "text-[20px] font-bold leading-snug text-wadeal-ink",
    tabLabel: "text-[11px] font-medium leading-none",
  },

  radius: {
    hero: "rounded-[24px]",
    card: "rounded-[20px]",
    productImage: "rounded-[18px]",
    button: "rounded-2xl",
    chip: "rounded-xl",
  },

  /** Surfaces */
  card: {
    base: "overflow-hidden rounded-[20px] border border-[#E8ECEA] bg-white",
    flat: "overflow-hidden rounded-[20px] bg-white",
    padded: "rounded-[20px] border border-[#E8ECEA] bg-white p-3 shadow-sm",
    review: "rounded-[20px] border border-[#E8ECEA] bg-[#F5F7F6] px-3 py-3",
    interactive:
      "overflow-hidden rounded-[20px] border border-[#E8ECEA] bg-white transition-all duration-200 ease-smooth hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(17,17,17,0.06)] active:translate-y-0 active:scale-[0.97]",
  },

  /** Buttons — Primary 56px / Secondary 52~56px */
  btn: {
    base: "inline-flex cursor-pointer items-center justify-center rounded-2xl font-semibold transition-all duration-200 ease-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wadeal-red/25 focus-visible:ring-offset-2 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60",
    primary:
      "inline-flex h-14 w-full cursor-pointer items-center justify-center rounded-2xl bg-wadeal-red px-4 text-[16px] font-semibold text-white transition-all duration-200 ease-smooth hover:bg-wadeal-red-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wadeal-red/25 focus-visible:ring-offset-2 active:scale-[0.97] disabled:cursor-not-allowed disabled:bg-gray-300",
    outline:
      "inline-flex h-[52px] w-full cursor-pointer items-center justify-center rounded-2xl border border-[#E8ECEA] bg-white px-4 text-[16px] font-semibold text-wadeal-ink transition-all duration-200 ease-smooth hover:border-wadeal-red/30 hover:bg-[#F5F7F6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wadeal-red/20 active:scale-[0.97]",
    outlineAccent:
      "inline-flex h-[52px] w-full cursor-pointer items-center justify-center rounded-2xl border border-wadeal-coral/30 bg-white px-4 text-[15px] font-semibold text-wadeal-coral transition-all duration-200 ease-smooth hover:bg-wadeal-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wadeal-coral/20 active:scale-[0.97]",
    sm: "inline-flex h-9 cursor-pointer items-center justify-center rounded-xl px-3 text-[12px] font-semibold transition-all duration-200 ease-smooth active:scale-[0.97]",
    smPrimary: "bg-wadeal-red text-white hover:bg-wadeal-red-deep",
    smOutline: "border border-[#E8ECEA] bg-white text-wadeal-ink hover:bg-[#F5F7F6]",
    ghost:
      "inline-flex h-10 cursor-pointer items-center justify-center rounded-xl px-3 text-[12px] font-medium text-wadeal-muted transition-colors duration-200 hover:bg-[#F5F7F6] hover:text-wadeal-ink",
    icon:
      "inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#E8ECEA] bg-white text-wadeal-ink transition-all duration-200 ease-smooth hover:border-wadeal-red/30 hover:bg-[#F5F7F6] active:scale-[0.96]",
  },

  badge: {
    base: "inline-flex items-center rounded-xl px-1.5 py-0.5 text-[10px] font-medium leading-none",
    trust:
      "inline-flex h-[21px] items-center rounded-full px-2 text-[10px] font-medium leading-none",
    muted: "border-[#E8ECEA] bg-[#F5F7F6] text-wadeal-muted",
    accent: "border-wadeal-coral/25 bg-wadeal-cream text-wadeal-coral",
    warm: "border-wadeal-coral/25 bg-wadeal-cream text-wadeal-coral",
    verified: "border-0 bg-[#F5F7F6] text-[#2E5E4E]",
    popular: "bg-wadeal-coral text-white",
    soldOut: "bg-gray-600 text-white",
  },

  productCard: {
    rail: "home-rail-deal-card group relative flex h-full w-full min-w-0 flex-col overflow-visible",
    grid: "deal-card group relative flex min-w-0 w-full flex-col overflow-visible",
    imageRail: "product-card__image",
    imageGrid: "product-card__image",
    bodyRail: "product-card__body",
    bodyGrid: "product-card__body",
    title: "line-clamp-2 text-[15px] font-semibold leading-[1.45] text-[#111111]",
    titleGrid: "line-clamp-2 min-h-[2.75rem] text-[15px] font-semibold leading-[1.45] text-[#111111]",
  },

  carousel: {
    wrap: "relative -mx-1 px-6",
    track: "celloh-product-carousel-track",
    item: "celloh-product-carousel-item",
    btn: "celloh-carousel-btn",
  },

  skeleton: {
    base: "animate-pulse rounded-xl bg-gradient-to-r from-gray-100 via-[#F5F7F6] to-gray-100",
    card: "overflow-hidden rounded-[20px] border border-[#E8ECEA] bg-white",
    line: "h-3 rounded bg-gray-100",
    avatar: "rounded-full bg-gray-100",
  },

  seller: {
    panel: "rounded-[20px] border border-[#E8ECEA] bg-white p-3",
    name: "text-[15px] font-semibold text-wadeal-ink",
    metrics: "grid grid-cols-4 gap-1.5",
    metricCell: "rounded-lg border border-[#E8ECEA]/80 bg-[#F5F7F6] px-2 py-2 text-center",
  },

  chrome: {
    header:
      "flex h-14 min-h-[56px] items-center justify-between gap-2 border-b border-[#E8ECEA] bg-white px-6",
    searchInput:
      "flex h-[48px] min-h-[48px] w-full items-center gap-2.5 rounded-full border border-[#E8ECEA] bg-white px-4 text-gray-500 transition-colors focus-within:border-[#2E5E4E] focus-within:ring-2 focus-within:ring-[#2E5E4E]/10",
    categoryBar:
      "relative z-10 h-11 border-b border-[#E8ECEA] bg-white",
    subHeader:
      "flex h-14 min-h-[56px] items-center gap-1 border-b border-[#E8ECEA] bg-white px-6",
    footer: "border-t border-[#E8ECEA]/80 bg-white px-6 pt-7 pb-9",
    bottomNav:
      "fixed inset-x-0 bottom-0 z-[60] mx-auto w-full max-w-[430px] border-t border-[#E8ECEA] bg-white pt-1 pb-[max(env(safe-area-inset-bottom),12px)] shadow-[0_-2px_12px_rgba(17,17,17,0.04)]",
  },

  chip: {
    base: "inline-flex h-9 shrink-0 cursor-pointer items-center rounded-xl px-3.5 text-[14px] font-semibold transition-all duration-200 active:scale-[0.97]",
    active: "border border-[#2E5E4E] bg-[#2E5E4E] text-white",
    idle: "border border-[#E8ECEA] bg-white text-wadeal-ink hover:border-[#2E5E4E]/40",
  },

  empty: {
    wrap: "flex flex-col items-center px-6 py-14 text-center",
    icon: "mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#F5F7F6] text-[#2E5E4E]",
    title: "text-[20px] font-bold leading-snug text-wadeal-ink",
    description: "mt-3 max-w-[300px] text-[14px] font-normal leading-relaxed text-wadeal-muted",
    action: "mt-8",
  },
} as const;
