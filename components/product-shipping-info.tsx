import { ds } from "@/lib/design-system";

const shippingSections = [
  {
    id: "delivery",
    title: "배송 안내",
    bullets: ["주문 확인 후 2~3일 내 순차 출고", "택배 배송 (CJ/롯데 등)", "배송 조회는 마이페이지에서 확인"],
  },
  {
    id: "returns",
    title: "교환/환불 안내",
    bullets: ["수령 후 7일 이내 신청", "미개봉·미사용 상품에 한함", "배송 전 구매 취소 가능"],
  },
] as const;

type ProductShippingSectionProps = {
  section: (typeof shippingSections)[number];
};

function ProductShippingSection({ section }: ProductShippingSectionProps) {
  return (
    <article className="scroll-mt-28 rounded-xl border border-[#DDE8E2] bg-white p-4">
      <h2 className={`${ds.type.h2} font-semibold`}>{section.title}</h2>
      <ul className="mt-2.5 space-y-1.5">
        {section.bullets.map((bullet) => (
          <li className={`flex items-start gap-2 ${ds.type.caption}`} key={bullet}>
            <span aria-hidden className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-wadeal-muted" />
            {bullet}
          </li>
        ))}
      </ul>
    </article>
  );
}

export function ProductShippingDeliverySection() {
  return <ProductShippingSection section={shippingSections[0]} />;
}

export function ProductShippingReturnSection() {
  return <ProductShippingSection section={shippingSections[1]} />;
}

export function ProductShippingInfoBlock() {
  return (
    <div className="scroll-mt-28 space-y-3" id="product-shipping-info">
      <ProductShippingDeliverySection />
      <ProductShippingReturnSection />
    </div>
  );
}

/** @deprecated Use ProductShippingInfoBlock */
export function ProductShippingInfoSection() {
  return <ProductShippingInfoBlock />;
}
