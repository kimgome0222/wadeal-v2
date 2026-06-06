"use client";

import { useEffect } from "react";

import { RouteErrorFallback } from "@/components/route-error-fallback";

type AdminErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AdminError({ error, reset }: AdminErrorProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("[admin/error]", error);
    }
  }, [error]);

  return (
    <RouteErrorFallback
      description="관리자 화면을 불러오지 못했어요. 다시 시도하거나 대시보드로 이동해 주세요."
      reset={reset}
      title="관리자 페이지 오류"
    />
  );
}
