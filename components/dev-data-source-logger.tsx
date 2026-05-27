"use client";

import { useEffect } from "react";

import type { WadealDataSource } from "@/lib/data/source";

type DevDataSourceLoggerProps = {
  source: WadealDataSource;
};

export function DevDataSourceLogger({ source }: DevDataSourceLoggerProps) {
  useEffect(() => {
    const label = source === "supabase" ? "Supabase" : "mock fallback";
    console.log(`Wadeal data source: ${label}`);
  }, [source]);

  return null;
}
