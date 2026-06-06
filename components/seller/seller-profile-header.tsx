import { SellerProfileAvatar } from "@/components/seller-profile-avatar";

type SellerProfileHeaderProps = {
  name: string;
  tagline: string;
  regionLabel?: string | null;
};

export function SellerProfileHeader({
  name,
  tagline,
  regionLabel,
}: SellerProfileHeaderProps) {
  return (
    <header className="-mt-8 space-y-2 px-6">
      <SellerProfileAvatar
        className="h-[72px] w-[72px] border-4 border-white text-[22px]"
        name={name}
        size="lg"
      />
      <div className="space-y-1 pt-1">
        <h1 className="text-[22px] font-bold leading-snug text-[#111111]">{name}</h1>
        <p className="text-[14px] leading-relaxed text-[#666666]">{tagline}</p>
        {regionLabel ?
          <p className="text-[12px] text-[#666666]">{regionLabel}</p>
        : null}
      </div>
    </header>
  );
}
