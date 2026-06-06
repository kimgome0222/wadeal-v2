"use client";

import { useEffect } from "react";

import { RouteErrorFallback } from "@/components/route-error-fallback";
import { CELLOH_ERRORS } from "@/lib/copy/ux-writing";

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
      description={CELLOH_ERRORS.networkDescription}
      reset={reset}
      title={CELLOH_ERRORS.productNotFoundTitle}
    />
  );
}
