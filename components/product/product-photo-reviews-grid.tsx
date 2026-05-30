import Image from "next/image";

type ProductPhotoReviewsGridProps = {
  images: string[];
  productTitle: string;
};

export function ProductPhotoReviewsGrid({
  images,
  productTitle,
}: ProductPhotoReviewsGridProps) {
  if (images.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-[16px] font-semibold text-[#111111]">포토후기</h3>
      <div className="grid grid-cols-4 gap-1.5">
        {images.map((url, index) => (
          <div
            className="relative aspect-square overflow-hidden rounded-lg bg-[#F5F7F6]"
            key={`${url}-${index}`}
          >
            <Image
              alt={`${productTitle} 포토후기 ${index + 1}`}
              className="object-cover"
              fill
              sizes="(max-width: 430px) 22vw, 96px"
              src={url}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
