import type { Deal } from "@/lib/deals";
import { getProductImages } from "@/lib/product-images";

type ProductDetailVisualSectionProps = {
  deal: Deal;
};

export function ProductDetailVisualSection({ deal }: ProductDetailVisualSectionProps) {
  const { details } = getProductImages(deal);
  const detailImages =
    details.length > 0 ? details
    : deal.imageUrl ? [deal.imageUrl]
    : [];

  if (detailImages.length === 0 && !deal.description?.trim()) {
    return null;
  }

  return (
    <section
      aria-label="상품설명"
      className="scroll-mt-28 space-y-6 py-10"
      id="product-detail-visual"
    >
      <h2 className="text-[20px] font-bold text-[#111111]">상품설명</h2>

      {deal.description?.trim() ?
        <p className="whitespace-pre-line text-[14px] leading-[1.6] text-[#111111]">
          {deal.description.trim()}
        </p>
      : null}

      {detailImages.length > 0 ?
        <div className="w-full space-y-2 overflow-hidden">
          {detailImages.map((image, index) => (
            <div className="relative w-full overflow-hidden bg-[#F5F7F6]" key={`${image}-${index}`}>
              <img
                alt={`${deal.title} 상세 이미지 ${index + 1}`}
                className="h-auto w-full object-cover"
                decoding={index === 0 ? "sync" : "async"}
                fetchPriority={index === 0 ? "high" : "auto"}
                loading={index === 0 ? "eager" : "lazy"}
                src={image}
              />
            </div>
          ))}
        </div>
      : null}
    </section>
  );
}
