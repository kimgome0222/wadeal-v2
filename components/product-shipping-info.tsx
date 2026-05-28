const shippingSections = [
  {
    title: "배송 안내",
    icon: (
      <svg aria-hidden className="h-4 w-4" fill="none" viewBox="0 0 16 16">
        <path
          d="M1.5 4h8l2 2.5H14a1 1 0 011 1v4.5a1.5 1.5 0 01-1.5 1.5H12a2 2 0 01-4 0H6a2 2 0 01-4 0H1.5A1.5 1.5 0 010 11V5a1 1 0 011-1z"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="1.2"
        />
        <path d="M9.5 4V2.5h3L14.5 6" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
    body: "공동구매 마감 후 2~3일 내 출고됩니다. 제주·도서 산간 지역은 추가 배송비가 발생할 수 있어요.",
    bullets: ["마감 후 순차 출고", "택배 배송 (CJ/롯데 등)", "배송 조회는 마이페이지에서 확인"],
  },
  {
    title: "교환/환불 안내",
    icon: (
      <svg aria-hidden className="h-4 w-4" fill="none" viewBox="0 0 16 16">
        <path
          d="M3 4.5h10M3 8h7M3 11.5h10"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.2"
        />
        <circle cx="12.5" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
    body: "상품 수령 후 7일 이내 미개봉 상태에서 교환·환불이 가능합니다. 공동구매 특성상 마감 후 단순 변심 환불은 제한될 수 있어요.",
    bullets: ["수령 후 7일 이내 신청", "미개봉·미사용 상품에 한함", "공동구매 마감 전 참여 취소 가능"],
  },
] as const;

export function ProductShippingInfo() {
  return (
    <section className="space-y-3">
      {shippingSections.map((section) => (
        <article
          className="overflow-hidden rounded-xl border border-wadeal-line bg-white"
          key={section.title}
        >
          <div className="flex items-center gap-2 border-b border-wadeal-line px-4 py-3.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-wadeal-surface text-wadeal-ink">
              {section.icon}
            </span>
            <h2 className="text-sm font-black text-wadeal-ink">{section.title}</h2>
          </div>
          <div className="space-y-3 px-4 py-4">
            <p className="text-xs font-bold leading-relaxed text-wadeal-muted">{section.body}</p>
            <ul className="space-y-1.5">
              {section.bullets.map((bullet) => (
                <li
                  className="flex items-start gap-2 text-[11px] font-bold text-wadeal-ink"
                  key={bullet}
                >
                  <span aria-hidden className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-wadeal-red" />
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        </article>
      ))}
    </section>
  );
}
