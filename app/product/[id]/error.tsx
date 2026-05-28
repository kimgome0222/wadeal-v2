"use client";

import { useEffect } from "react";

import { RouteErrorFallback } from "@/components/route-error-fallback";

type ProductErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ProductError({ error, reset }: ProductErrorProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("[product/error]", error);
    }
  }, [error]);

  return (
    <RouteErrorFallback
      description="상품 정보를 불러오지 못했어요. 네트워크 연결을 확인한 뒤 다시 시도해 주세요."
      reset={reset}
      title="상품을 불러올 수 없어요"
    />
  );
}
