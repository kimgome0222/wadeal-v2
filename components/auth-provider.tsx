"use client";

import { useEffect } from "react";

import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      return;
    }

    void supabase.auth.getSession();
  }, []);

  return children;
}
