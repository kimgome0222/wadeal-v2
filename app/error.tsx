"use client";

import { useEffect } from "react";

import { RouteErrorFallback } from "@/components/route-error-fallback";

type RootErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function RootError({ error, reset }: RootErrorProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("[app/error]", error);
    }
  }, [error]);

  return <RouteErrorFallback reset={reset} />;
}
