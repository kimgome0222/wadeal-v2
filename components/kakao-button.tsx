import type { ButtonHTMLAttributes, ReactNode } from "react";

type KakaoButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function KakaoButton({ children, className = "", ...props }: KakaoButtonProps) {
  return (
    <button
      className={`h-12 w-full rounded-md bg-wadeal-kakao text-base font-black text-[#3c1e1e] active:opacity-90 ${className}`}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}
