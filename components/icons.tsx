import {
  ArrowLeft,
  Bell,
  BookOpen,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  CreditCard,
  Grid3x3,
  Heart,
  HelpCircle,
  Home,
  MapPin,
  MessageCircle,
  Minus,
  Package,
  Pencil,
  Plus,
  Search,
  Settings,
  ShoppingBag,
  ShoppingCart,
  SlidersHorizontal,
  Star,
  Ticket,
  Truck,
  User,
  type LucideProps,
} from "lucide-react";

type IconProps = LucideProps;

const stroke = 2;

export function PlusIcon({ className = "h-5 w-5", ...props }: IconProps) {
  return <Plus aria-hidden className={className} strokeWidth={stroke} {...props} />;
}

export function MinusIcon({ className = "h-5 w-5", ...props }: IconProps) {
  return <Minus aria-hidden className={className} strokeWidth={stroke} {...props} />;
}

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

export function ChevronDownIcon({ className = "h-5 w-5", ...props }: IconProps) {
  return <ChevronDown aria-hidden className={className} strokeWidth={stroke} {...props} />;
}

export function ChevronRightIcon({ className = "h-5 w-5", ...props }: IconProps) {
  return <ChevronRight aria-hidden className={className} strokeWidth={stroke} {...props} />;
}

export function SlidersHorizontalIcon({ className = "h-5 w-5", ...props }: IconProps) {
  return <SlidersHorizontal aria-hidden className={className} strokeWidth={stroke} {...props} />;
}

export function TruckIcon({ className = "h-5 w-5", ...props }: IconProps) {
  return <Truck aria-hidden className={className} strokeWidth={stroke} {...props} />;
}

export function TicketIcon({ className = "h-5 w-5", ...props }: IconProps) {
  return <Ticket aria-hidden className={className} strokeWidth={stroke} {...props} />;
}

export function CoinsIcon({ className = "h-5 w-5", ...props }: IconProps) {
  return <CircleDollarSign aria-hidden className={className} strokeWidth={stroke} {...props} />;
}

export function StarIcon({ className = "h-5 w-5", ...props }: IconProps) {
  return <Star aria-hidden className={className} strokeWidth={stroke} {...props} />;
}

export function MessageCircleIcon({ className = "h-5 w-5", ...props }: IconProps) {
  return <MessageCircle aria-hidden className={className} strokeWidth={stroke} {...props} />;
}

export function MapPinIcon({ className = "h-5 w-5", ...props }: IconProps) {
  return <MapPin aria-hidden className={className} strokeWidth={stroke} {...props} />;
}

export function CreditCardIcon({ className = "h-5 w-5", ...props }: IconProps) {
  return <CreditCard aria-hidden className={className} strokeWidth={stroke} {...props} />;
}

export function BookOpenIcon({ className = "h-5 w-5", ...props }: IconProps) {
  return <BookOpen aria-hidden className={className} strokeWidth={stroke} {...props} />;
}

export function SettingsIcon({ className = "h-5 w-5", ...props }: IconProps) {
  return <Settings aria-hidden className={className} strokeWidth={stroke} {...props} />;
}

export function HelpCircleIcon({ className = "h-5 w-5", ...props }: IconProps) {
  return <HelpCircle aria-hidden className={className} strokeWidth={stroke} {...props} />;
}

export function PackageIcon({ className = "h-5 w-5", ...props }: IconProps) {
  return <Package aria-hidden className={className} strokeWidth={stroke} {...props} />;
}

export function ShoppingBagIcon({ className = "h-5 w-5", ...props }: IconProps) {
  return <ShoppingBag aria-hidden className={className} strokeWidth={stroke} {...props} />;
}

export function PencilIcon({ className = "h-5 w-5", ...props }: IconProps) {
  return <Pencil aria-hidden className={className} strokeWidth={stroke} {...props} />;
}
