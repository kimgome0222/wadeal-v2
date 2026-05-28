"use client";

import { useEffect } from "react";

import { RouteErrorFallback } from "@/components/route-error-fallback";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("[global-error]", error);
    }
  }, [error]);

  return (
    <html lang="ko">
      <body>
        <RouteErrorFallback reset={reset} />
      </body>
    </html>
  );
}
