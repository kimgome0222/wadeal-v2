"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const SPLASH_KEY = "wadeal-splash-shown";
const SPLASH_MS = 850;

export function AppSplash() {
  const [phase, setPhase] = useState<"hidden" | "show" | "exit">("hidden");

  useEffect(() => {
    if (sessionStorage.getItem(SPLASH_KEY)) {
      return;
    }

    sessionStorage.setItem(SPLASH_KEY, "1");
    setPhase("show");

    const exitTimer = window.setTimeout(() => {
      setPhase("exit");
    }, SPLASH_MS);

    const hideTimer = window.setTimeout(() => {
      setPhase("hidden");
    }, SPLASH_MS + 280);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  if (phase === "hidden") {
    return null;
  }

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-white ${
        phase === "exit" ? "animate-splash-out pointer-events-none" : ""
      }`}
    >
      <Image
        alt="Wadeal"
        className="h-7 w-auto"
        height={28}
        priority
        src="/wadeal-wordmark.svg"
        width={120}
      />
    </div>
  );
}
