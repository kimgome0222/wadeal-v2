import Image from "next/image";

type SellerProfileCoverProps = {
  imageUrl: string | null;
  sellerName: string;
};

export function SellerProfileCover({ imageUrl, sellerName }: SellerProfileCoverProps) {
  if (!imageUrl) {
    return (
      <div
        aria-label={`${sellerName} 커버`}
        className="flex h-[220px] w-full items-center justify-center bg-[#F5F7F6]"
        role="img"
      >
        <p className="text-[18px] font-semibold text-[#666666]">{sellerName}</p>
      </div>
    );
  }

  return (
    <div className="relative h-[220px] w-full overflow-hidden bg-[#F5F7F6]">
      <Image
        alt={`${sellerName} 커버`}
        className="object-cover"
        fill
        priority
        sizes="(max-width: 430px) 430px, 430px"
        src={imageUrl}
      />
    </div>
  );
}
