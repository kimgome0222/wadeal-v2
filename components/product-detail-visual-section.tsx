import type { Deal } from "@/lib/deals";
import { getProductImages } from "@/lib/product-images";

type ProductDetailVisualSectionProps = {
  deal: Deal;
};

/** 상단 갤러리와 동일 3:4 — 모바일·웹(480px) 모두 프레임 크기 통일 */
const DETAIL_IMAGE_ASPECT = "aspect-[3/4]";

export function ProductDetailVisualSection({ deal }: ProductDetailVisualSectionProps) {
  const { details } = getProductImages(deal);
  const detailImages =
    details.length > 0 ? details
    : deal.imageUrl ? [deal.imageUrl]
    : [];

  if (detailImages.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="상품 상세 이미지"
      className="scroll-mt-28 bg-white"
      id="product-detail-visual"
    >
      <div className="-mx-5 space-y-0.5 overflow-hidden bg-[#F8FAF8]">
        {detailImages.map((image, index) => (
          <div
            className={`celloh-detail-image-frame relative w-full ${DETAIL_IMAGE_ASPECT} overflow-hidden bg-[#F8FAF8]`}
            key={`${image}-${index}`}
          >
            <img
              alt={`${deal.title} 상세 이미지 ${index + 1}`}
              className="h-full w-full object-cover object-center"
              decoding={index === 0 ? "sync" : "async"}
              fetchPriority={index === 0 ? "high" : "auto"}
              loading={index === 0 ? "eager" : "lazy"}
              src={image}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
