"use client";

import { useEffect } from "react";

import type { cellohDataSource } from "@/lib/data/source";

type DevDataSourceLoggerProps = {
  source: cellohDataSource;
};

export function DevDataSourceLogger({ source }: DevDataSourceLoggerProps) {
  useEffect(() => {
    const label = source === "supabase" ? "Supabase" : "unconfigured";
    console.log(`celloh data source: ${label}`);
  }, [source]);

  return null;
}
