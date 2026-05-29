const TRUST_ITEMS = [
  {
    title: "인증 판매자",
    description: "신뢰할 수 있는 판매자를 확인하세요.",
    accent: "bg-wadeal-red/10 text-wadeal-red",
  },
  {
    title: "실제 리뷰",
    description: "구매 고객의 솔직한 후기를 볼 수 있어요.",
    accent: "bg-wadeal-coral/10 text-wadeal-coral",
  },
  {
    title: "안전한 구매",
    description: "주문·배송·환불 안내를 투명하게 제공합니다.",
    accent: "bg-wadeal-surface text-wadeal-ink ring-1 ring-wadeal-line",
  },
  {
    title: "빠른 고객지원",
    description: "문의·주문·배송 안내를 빠르게 받아보세요.",
    accent: "bg-wadeal-surface text-wadeal-red ring-1 ring-wadeal-line",
  },
] as const;

export function LoginTrustCards() {
  return (
    <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
      {TRUST_ITEMS.map((item) => (
        <div
          className="min-w-0 rounded-xl border border-wadeal-line bg-wadeal-surface/60 px-3 py-3 text-left"
          key={item.title}
        >
          <span
            className={`inline-flex max-w-full truncate rounded-full px-2 py-0.5 text-[10px] font-black ${item.accent}`}
          >
            {item.title}
          </span>
          <p className="mt-2 break-keep text-[11px] font-medium leading-relaxed text-wadeal-muted">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
}
