import type { ButtonHTMLAttributes, ReactNode } from "react";

type KakaoButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function KakaoButton({ children, className = "", ...props }: KakaoButtonProps) {
  return (
    <button className={`btn-kakao ${className}`} type="button" {...props}>
      {children}
    </button>
  );
}
