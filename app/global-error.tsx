"use client";

import { useEffect } from "react";

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
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#fff" }}>
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "16px", fontWeight: 800, color: "#111" }}>문제가 발생했어요</p>
          <p style={{ marginTop: "8px", fontSize: "14px", fontWeight: 600, color: "#666" }}>
            잠시 후 다시 시도해 주세요.
          </p>
          <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "8px", width: "100%", maxWidth: "320px" }}>
            <button
              onClick={reset}
              style={{
                padding: "12px 16px",
                borderRadius: "12px",
                border: "none",
                background: "#2E5E4E",
                color: "#fff",
                fontWeight: 800,
                cursor: "pointer",
              }}
              type="button"
            >
              다시 시도
            </button>
            <a
              href="/"
              style={{
                padding: "12px 16px",
                borderRadius: "12px",
                border: "1px solid #ddd",
                color: "#111",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              홈으로 가기
            </a>
            <a
              href="/support"
              style={{
                padding: "12px 16px",
                borderRadius: "12px",
                border: "1px solid #ddd",
                color: "#111",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              고객센터
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
