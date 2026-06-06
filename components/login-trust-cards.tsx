const TRUST_ITEMS = [
  {
    title: "인증 판매자",
    description: "신뢰할 수 있는 판매자를 확인하세요.",
  },
  {
    title: "실제 리뷰",
    description: "구매 고객의 솔직한 후기를 볼 수 있어요.",
  },
  {
    title: "안전한 구매",
    description: "주문·배송·환불 안내를 투명하게 제공합니다.",
  },
] as const;

export function LoginTrustCards() {
  return (
    <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
      {TRUST_ITEMS.map((item) => (
        <div
          className="min-w-0 rounded-xl border border-wadeal-line bg-[#F8FAF8] px-3 py-3 text-left"
          key={item.title}
        >
          <span className="inline-flex max-w-full truncate rounded-full bg-[#F5F8F4] px-2 py-0.5 text-[10px] font-medium text-[#2E5E4E] ring-1 ring-[#DDE8E2]">
            {item.title}
          </span>
          <p className="mt-2 break-keep text-[11px] font-normal leading-relaxed text-wadeal-muted">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
}
