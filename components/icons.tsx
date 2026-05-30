import {
  ArrowLeft,
  Bell,
  Grid3x3,
  Heart,
  Home,
  Search,
  ShoppingCart,
  User,
  type LucideProps,
} from "lucide-react";

type IconProps = LucideProps;

const stroke = 2;

export function SearchIcon({ className = "h-5 w-5", ...props }: IconProps) {
  return <Search aria-hidden className={className} strokeWidth={stroke} {...props} />;
}

export function HomeIcon({ className = "h-5 w-5", ...props }: IconProps) {
  return <Home aria-hidden className={className} strokeWidth={stroke} {...props} />;
}

export function GridIcon({ className = "h-5 w-5", ...props }: IconProps) {
  return <Grid3x3 aria-hidden className={className} strokeWidth={stroke} {...props} />;
}

export function HeartIcon({
  className = "h-5 w-5",
  filled = false,
  ...props
}: IconProps & { filled?: boolean }) {
  return (
    <Heart
      aria-hidden
      className={className}
      fill={filled ? "currentColor" : "none"}
      strokeWidth={stroke}
      {...props}
    />
  );
}

export function UserIcon({ className = "h-5 w-5", ...props }: IconProps) {
  return <User aria-hidden className={className} strokeWidth={stroke} {...props} />;
}

export function BellIcon({ className = "h-5 w-5", ...props }: IconProps) {
  return <Bell aria-hidden className={className} strokeWidth={stroke} {...props} />;
}

export function CartIcon({ className = "h-5 w-5", ...props }: IconProps) {
  return <ShoppingCart aria-hidden className={className} strokeWidth={stroke} {...props} />;
}

/** 하단 탭 — 카테고리 */
export function MenuIcon({ className = "h-5 w-5", ...props }: IconProps) {
  return <Grid3x3 aria-hidden className={className} strokeWidth={stroke} {...props} />;
}

export function ArrowLeftIcon({ className = "h-5 w-5", ...props }: IconProps) {
  return <ArrowLeft aria-hidden className={className} strokeWidth={stroke} {...props} />;
}
