const TRUST_ITEMS = [
  {
    title: "인증 판매자",
    description: "검증된 판매자만 입점",
  },
  {
    title: "실제 구매 리뷰",
    description: "구매 고객의 솔직한 후기",
  },
  {
    title: "안전 결제",
    description: "주문·배송·환불 안내 투명",
  },
] as const;

export function HomeTrustStrip() {
  return (
    <section aria-label="celloh 신뢰 안내" className="pt-1">
      <div className="grid grid-cols-3 gap-3 rounded-xl bg-[#F8FAF8] px-4 py-4">
        {TRUST_ITEMS.map((item) => (
          <div className="min-w-0 text-center" key={item.title}>
            <p className="text-[11px] font-semibold text-wadeal-ink">{item.title}</p>
            <p className="mt-1 text-[10px] font-normal leading-snug text-wadeal-muted">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
