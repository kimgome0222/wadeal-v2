"use client";

import { useEffect } from "react";

import { RouteErrorFallback } from "@/components/route-error-fallback";

type SellerErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function SellerError({ error, reset }: SellerErrorProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("[seller/error]", error);
    }
  }, [error]);

  return (
    <RouteErrorFallback
      description="판매자 센터를 불러오지 못했어요. 다시 시도하거나 홈으로 이동해 주세요."
      reset={reset}
      title="판매자 센터 오류"
    />
  );
}
