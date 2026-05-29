type SellerProfileAvatarProps = {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClass = {
  sm: "h-8 w-8 text-xs",
  md: "h-11 w-11 text-sm",
  lg: "h-14 w-14 text-base",
} as const;

export function SellerProfileAvatar({
  name,
  size = "md",
  className = "",
}: SellerProfileAvatarProps) {
  return (
    <span
      aria-hidden
      className={`flex shrink-0 items-center justify-center rounded-full bg-wadeal-red font-black text-white ${sizeClass[size]} ${className}`.trim()}
    >
      {name.slice(0, 1)}
    </span>
  );
}
